import { markQuizCompleted, setMaxVisitedSub, fetchLessonJson } from '../x_html/lessons/loader.js';

function getInvoke() {
  if (typeof window !== 'undefined' && window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === 'function') {
    return window.__TAURI__.core.invoke;
  }
  if (typeof window !== 'undefined' && window.__TAURI_INTERNALS__ && typeof window.__TAURI_INTERNALS__.invoke === 'function') {
    return window.__TAURI_INTERNALS__.invoke;
  }
  return null;
}
const invoke = getInvoke();

// DOM Elements
const codeInput = document.getElementById('code-input');
const highlightLayer = document.getElementById('highlight-layer');
const highlightContent = document.getElementById('highlight-content');
const gutter = document.getElementById('gutter');
const lineHighlights = document.getElementById('line-highlights');
const varsTableBody = document.getElementById('vars-tbody');
const emptyVarsMsg = document.getElementById('empty-vars-msg');
const terminalBox = document.getElementById('terminal-box');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');

// Toolbar Buttons
const btnRun = document.getElementById('btn-run');
const btnDebug = document.getElementById('btn-debug');
const btnStep = document.getElementById('btn-step');
const btnContinue = document.getElementById('btn-continue');
const btnReset = document.getElementById('btn-reset');
const btnClearOutput = document.getElementById('btn-clear-output');

// Debugger State
let breakpoints = new Set();
let debugSteps = [];
let currentStepIdx = -1;
let isDebugging = false;

// Multi-Challenge State
let activeChallenges = [];
let currentChallengeIdx = 0;
let maxUnlockedStageIdx = 0;
let completedStages = new Set();
let stageCodeCache = {};
let lessonData = null;

// Starter Python code for Lesson 2
const STARTER_CODE = `# Write your code here\n`;


// ============================================================
// SYNTAX HIGHLIGHTING ENGINE
// ============================================================

const PYTHON_KEYWORDS = new Set([
  'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue',
  'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from',
  'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not',
  'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'
]);

const PYTHON_BUILTINS = new Set([
  'abs', 'all', 'any', 'bin', 'bool', 'bytearray', 'bytes', 'callable',
  'chr', 'classmethod', 'compile', 'complex', 'delattr', 'dict', 'dir',
  'divmod', 'enumerate', 'eval', 'exec', 'filter', 'float', 'format',
  'frozenset', 'getattr', 'globals', 'hasattr', 'hash', 'help', 'hex',
  'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len',
  'list', 'locals', 'map', 'max', 'memoryview', 'min', 'next', 'object',
  'oct', 'open', 'ord', 'pow', 'print', 'property', 'range', 'repr',
  'reversed', 'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod',
  'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip'
]);

const PYTHON_CONSTANTS = new Set(['True', 'False', 'None']);

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function highlightPython(code) {
  const tokenRegex = /(#.*$)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b([0-9]+\.?[0-9]*(?:[eE][+-]?[0-9]+)?|0[xX][0-9a-fA-F]+|0[bB][01]+)\b|\b([a-zA-Z_][a-zA-Z0-9_]*)\b|([+\-*/%=<>!&|^~:]+)/gm;

  let result = '';
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(code.slice(lastIndex, match.index));
    }

    const [fullMatch, comment, string, number, identifier, operator] = match;

    if (comment) {
      result += `<span class="token-comment">${escapeHtml(comment)}</span>`;
    } else if (string) {
      result += `<span class="token-string">${escapeHtml(string)}</span>`;
    } else if (number) {
      result += `<span class="token-number">${escapeHtml(number)}</span>`;
    } else if (identifier) {
      if (PYTHON_KEYWORDS.has(identifier)) {
        result += `<span class="token-keyword">${escapeHtml(identifier)}</span>`;
      } else if (PYTHON_CONSTANTS.has(identifier)) {
        result += `<span class="token-boolean">${escapeHtml(identifier)}</span>`;
      } else if (PYTHON_BUILTINS.has(identifier)) {
        result += `<span class="token-builtin">${escapeHtml(identifier)}</span>`;
      } else {
        result += escapeHtml(identifier);
      }
    } else if (operator) {
      result += `<span class="token-operator">${escapeHtml(operator)}</span>`;
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < code.length) {
    result += escapeHtml(code.slice(lastIndex));
  }

  return result;
}

function updateHighlighting() {
  if (!codeInput || !highlightContent) return;
  highlightContent.innerHTML = highlightPython(codeInput.value) + '\n';
}

// ============================================================
// AUTO BRACKET COMPLETION & INDENTATION ENGINE
// ============================================================

const PAIRS = {
  '(': ')',
  '[': ']',
  '{': '}',
  '"': '"',
  "'": "'"
};
const CLOSING = new Set([')', ']', '}', '"', "'"]);

function getLockedData() {
  const currentChallenge = (activeChallenges && activeChallenges.length > 0) ? activeChallenges[currentChallengeIdx] : null;
  const prefix = (currentChallenge && currentChallenge.locked_prefix) || (lessonData && lessonData.locked_prefix) || '';
  const suffix = (currentChallenge && currentChallenge.locked_suffix) || (lessonData && lessonData.locked_suffix) || '';
  return { prefix, suffix };
}

function handleEditorKeyDown(e) {
  const start = codeInput.selectionStart;
  const end = codeInput.selectionEnd;
  const val = codeInput.value;
  const hasSelection = start !== end;
  const selectedText = val.substring(start, end);
  const { prefix, suffix } = getLockedData();

  // Guard locked prefix & suffix regions
  if (prefix && val.startsWith(prefix)) {
    if (e.key === 'Backspace' && start <= prefix.length && !hasSelection) {
      e.preventDefault();
      return;
    }
    if (start < prefix.length && !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      codeInput.setSelectionRange(prefix.length, prefix.length);
      return;
    }
  }

  if (suffix && val.endsWith(suffix)) {
    const suffixStart = val.length - suffix.length;
    if (e.key === 'Delete' && end >= suffixStart && !hasSelection) {
      e.preventDefault();
      return;
    }
    if (end > suffixStart && !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      codeInput.setSelectionRange(suffixStart, suffixStart);
      return;
    }
  }

  // 1. Tab Key: Insert 4 spaces
  if (e.key === 'Tab') {
    e.preventDefault();
    if (!hasSelection) {
      document.execCommand('insertText', false, '    ');
    } else {
      document.execCommand('insertText', false, '    ' + selectedText);
    }
    updateGutter();
    updateHighlighting();
    return;
  }

  // 2. Auto-close opening brackets & quotes
  if (PAIRS[e.key]) {
    const openChar = e.key;
    const closeChar = PAIRS[openChar];

    if (hasSelection) {
      e.preventDefault();
      const wrapped = openChar + selectedText + closeChar;
      document.execCommand('insertText', false, wrapped);
      codeInput.setSelectionRange(start + 1, end + 1);
      updateGutter();
      updateHighlighting();
      return;
    } else {
      // If typing quote and current char is the identical quote, step over
      if ((openChar === '"' || openChar === "'") && val[start] === openChar) {
        e.preventDefault();
        codeInput.setSelectionRange(start + 1, start + 1);
        return;
      }
      e.preventDefault();
      document.execCommand('insertText', false, openChar + closeChar);
      codeInput.setSelectionRange(start + 1, start + 1);
      updateGutter();
      updateHighlighting();
      return;
    }
  }

  // 3. Skip over closing brackets
  if (CLOSING.has(e.key) && !hasSelection) {
    if (val[start] === e.key) {
      e.preventDefault();
      codeInput.setSelectionRange(start + 1, start + 1);
      return;
    }
  }

  // 4. Backspace pair deletion (e.g. (|) -> deletes both)
  if (e.key === 'Backspace' && !hasSelection && start > 0) {
    const prevChar = val[start - 1];
    const nextChar = val[start];
    if (PAIRS[prevChar] && PAIRS[prevChar] === nextChar) {
      e.preventDefault();
      codeInput.value = val.substring(0, start - 1) + val.substring(start + 1);
      codeInput.setSelectionRange(start - 1, start - 1);
      updateGutter();
      updateHighlighting();
      return;
    }
  }

  // 5. Enter key auto-indentation & colon block expansion
  if (e.key === 'Enter') {
    e.preventDefault();
    const lineStart = val.lastIndexOf('\n', start - 1) + 1;
    const currentLine = val.substring(lineStart, start);
    const matchIndent = currentLine.match(/^\s*/);
    const indent = matchIndent ? matchIndent[0] : '';

    const charBefore = val[start - 1];
    const charAfter = val[start];

    // Splitting between matching braces e.g. {|} or (|)
    if (PAIRS[charBefore] && PAIRS[charBefore] === charAfter) {
      const extraIndent = indent + '    ';
      const insertStr = '\n' + extraIndent + '\n' + indent;
      document.execCommand('insertText', false, insertStr);
      codeInput.setSelectionRange(start + 1 + extraIndent.length, start + 1 + extraIndent.length);
    } else if (currentLine.trimEnd().endsWith(':')) {
      // Auto-indent after colon in Python
      const newIndent = indent + '    ';
      document.execCommand('insertText', false, '\n' + newIndent);
    } else {
      document.execCommand('insertText', false, '\n' + indent);
    }
    updateGutter();
    updateHighlighting();
    return;
  }
}

function initEditor() {
  if (codeInput) {
    if (!codeInput.value || codeInput.value.trim() === '') {
      codeInput.value = STARTER_CODE;
    }
    updateGutter();
    updateHighlighting();
    codeInput.addEventListener('input', () => {
      const { prefix, suffix } = getLockedData();
      if (prefix && !codeInput.value.startsWith(prefix)) {
        codeInput.value = prefix + codeInput.value.replace(/^#\s*--- SYSTEM SETUP[\s\S]*?YOUR FORMULA \(EDIT BELOW\) ---\n?/i, '');
      }
      if (suffix && !codeInput.value.endsWith(suffix)) {
        codeInput.value = codeInput.value.replace(/\n?#\s*--- VERIFICATION[\s\S]*$/i, '') + suffix;
      }
      updateGutter();
      updateHighlighting();
    });
    codeInput.addEventListener('keydown', handleEditorKeyDown);
    codeInput.addEventListener('scroll', syncScroll);
  }
}

function syncScroll() {
  if (!codeInput) return;
  if (gutter) gutter.scrollTop = codeInput.scrollTop;
  if (lineHighlights) lineHighlights.scrollTop = codeInput.scrollTop;
  if (highlightLayer) {
    highlightLayer.scrollTop = codeInput.scrollTop;
    highlightLayer.scrollLeft = codeInput.scrollLeft;
  }
}

function updateGutter() {
  if (!codeInput || !gutter || !lineHighlights) return;
  const lines = codeInput.value.split('\n');
  const lineCount = lines.length;

  gutter.innerHTML = '';
  lineHighlights.innerHTML = '';

  for (let i = 1; i <= lineCount; i++) {
    // Gutter item (Line number + Breakpoint dot)
    const lineElem = document.createElement('div');
    lineElem.className = 'gutter-line';
    lineElem.setAttribute('data-line', i);

    const bpDot = document.createElement('span');
    bpDot.className = `bp-dot ${breakpoints.has(i) ? 'active' : ''}`;
    bpDot.title = `Toggle Breakpoint on line ${i}`;

    const numSpan = document.createElement('span');
    numSpan.textContent = i;

    lineElem.appendChild(bpDot);
    lineElem.appendChild(numSpan);

    lineElem.addEventListener('click', () => toggleBreakpoint(i, bpDot));
    gutter.appendChild(lineElem);

    // Highlight row
    const highlightRow = document.createElement('div');
    highlightRow.className = 'highlight-row';
    highlightRow.id = `highlight-line-${i}`;
    lineHighlights.appendChild(highlightRow);
  }
}

function toggleBreakpoint(lineNum, bpDotElement) {
  if (breakpoints.has(lineNum)) {
    breakpoints.delete(lineNum);
    bpDotElement.classList.remove('active');
    appendTerminal(`[Breakpoint Removed] Line ${lineNum}`, 'term-line-info');
  } else {
    breakpoints.add(lineNum);
    bpDotElement.classList.add('active');
    appendTerminal(`[Breakpoint Added] Line ${lineNum}`, 'term-line-info');
  }
}

function setStatus(text, stateClass = '') {
  if (statusText) statusText.textContent = text;
  if (statusDot) {
    statusDot.className = `status-dot ${stateClass}`;
  }
}

function appendTerminal(text, className = 'term-line-out') {
  if (!terminalBox) return;
  const div = document.createElement('div');
  div.className = className;
  div.textContent = text;
  terminalBox.appendChild(div);
  terminalBox.scrollTop = terminalBox.scrollHeight;
}

function clearTerminal() {
  if (terminalBox) terminalBox.innerHTML = '';
}

function clearLineHighlights() {
  const highlighted = document.querySelectorAll('.highlight-row.active-line');
  highlighted.forEach(el => el.classList.remove('active-line'));
}

function highlightLine(lineNum) {
  clearLineHighlights();
  if (lineNum <= 0) return;
  const row = document.getElementById(`highlight-line-${lineNum}`);
  if (row) {
    row.classList.add('active-line');
    const lineHeight = 22;
    const targetScroll = (lineNum - 3) * lineHeight;
    if (codeInput && (codeInput.scrollTop > targetScroll || codeInput.scrollTop + 300 < targetScroll)) {
      codeInput.scrollTop = Math.max(0, targetScroll);
      syncScroll();
    }
  }
}

function renderVariables(localsMap) {
  if (!varsTableBody || !emptyVarsMsg) return;
  varsTableBody.innerHTML = '';

  const keys = Object.keys(localsMap || {});
  if (keys.length === 0) {
    emptyVarsMsg.style.display = 'block';
    return;
  }

  emptyVarsMsg.style.display = 'none';

  keys.forEach(key => {
    const info = localsMap[key];
    const tr = document.createElement('tr');

    const tdName = document.createElement('td');
    tdName.className = 'var-name';
    tdName.textContent = key;

    const tdType = document.createElement('td');
    tdType.className = 'var-type';
    tdType.textContent = info.type || typeof info;

    const tdVal = document.createElement('td');
    tdVal.className = 'var-val';
    tdVal.textContent = info.val !== undefined ? info.val : String(info);

    tr.appendChild(tdName);
    tr.appendChild(tdType);
    tr.appendChild(tdVal);
    varsTableBody.appendChild(tr);
  });
}

// ============================================================
// OUTPUT VERIFICATION & NEXT PAGE UNLOCK
// ============================================================

const urlParams = new URLSearchParams(window.location.search);
const special = urlParams.get('spcl') || '1';
const lesson = urlParams.get('lsn') || '2';
const subset = urlParams.get('sub');

const nextBtn = document.getElementById('next-btn');

function normalizeOutput(text) {
  return (text || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

function updateChallengeUI() {
  if (!activeChallenges || activeChallenges.length === 0) return;
  const c = activeChallenges[currentChallengeIdx];
  if (!c) return;

  const taskTitle = document.getElementById('task-title');
  const taskDesc = document.getElementById('task-desc');
  const intendedOutputEl = document.getElementById('task-intended-output');

  if (taskTitle) taskTitle.textContent = c.title || `Stage ${currentChallengeIdx + 1}`;
  if (taskDesc) taskDesc.innerHTML = c.description || '';
  if (intendedOutputEl) intendedOutputEl.textContent = c.intended_output || '';

  if (codeInput) {
    if (stageCodeCache[currentChallengeIdx] !== undefined) {
      codeInput.value = stageCodeCache[currentChallengeIdx];
    } else if (c.starter_code !== undefined) {
      codeInput.value = c.starter_code;
    }
    updateGutter();
    updateHighlighting();
  }

  renderChallengeStepper();
}

function renderChallengeStepper() {
  if (!activeChallenges || activeChallenges.length <= 1) return;
  const taskInfo = document.querySelector('.task-info');
  if (!taskInfo) return;

  let stepperEl = document.getElementById('challenge-stepper');
  if (!stepperEl) {
    stepperEl = document.createElement('div');
    stepperEl.id = 'challenge-stepper';
    stepperEl.style.display = 'flex';
    stepperEl.style.gap = '8px';
    stepperEl.style.marginBottom = '10px';
    stepperEl.style.flexWrap = 'wrap';
    taskInfo.insertBefore(stepperEl, taskInfo.querySelector('.task-badge') || taskInfo.firstChild);
  }

  stepperEl.innerHTML = activeChallenges.map((c, i) => {
    const isCurrent = i === currentChallengeIdx;
    const isDone = completedStages.has(i);
    const isUnlocked = isDone || i <= maxUnlockedStageIdx;

    const bg = isCurrent ? '#fef08a' : (isDone ? '#86efac' : (isUnlocked ? '#e5e7eb' : '#f3f4f6'));
    const color = isUnlocked ? '#111111' : '#6b7280';
    const border = '2px solid #111111';
    const icon = isDone ? '[DONE] ' : (isCurrent ? '[ACTIVE] ' : '');
    const cursor = isUnlocked ? 'pointer' : 'not-allowed';
    const opacity = isUnlocked ? '1' : '0.6';

    return `
      <button type="button" class="stage-pill-btn" data-stage-idx="${i}" ${!isUnlocked ? 'disabled' : ''} style="background: ${bg}; color: ${color}; border: ${border}; box-shadow: 2px 2px 0px #111111; padding: 4px 10px; font-weight: 900; font-size: 11px; text-transform: uppercase; border-radius: 4px; cursor: ${cursor}; opacity: ${opacity}; font-family: inherit;">
        ${icon}STAGE ${i + 1}
      </button>
    `;
  }).join('');

  stepperEl.querySelectorAll('.stage-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-stage-idx'), 10);
      if (!isNaN(idx) && idx < activeChallenges.length && (completedStages.has(idx) || idx <= maxUnlockedStageIdx)) {
        if (codeInput) {
          stageCodeCache[currentChallengeIdx] = codeInput.value;
        }
        currentChallengeIdx = idx;
        updateChallengeUI();
      }
    });
  });
}

async function verifyOutput(actualOutput) {
  let expectedRaw = null;
  let currentChallenge = null;

  if (activeChallenges && activeChallenges.length > 0) {
    currentChallenge = activeChallenges[currentChallengeIdx];
    expectedRaw = currentChallenge.intended_output;
  } else {
    const intendedOutputEl = document.getElementById('task-intended-output');
    expectedRaw = (intendedOutputEl && intendedOutputEl.textContent.trim() !== '') ? intendedOutputEl.textContent : null;
  }

  if (!expectedRaw) {
    const candidateFiles = [
      `lesson_data/${special}_${lesson}_${subset}_op.txt`,
    ];
    for (const filePath of candidateFiles) {
      try {
        const response = await fetch(filePath);
        if (response.ok) {
          expectedRaw = await response.text();
          break;
        }
      } catch (e) {
        // Try next candidate
      }
    }
  }

  const code = codeInput ? codeInput.value : '';

  // Universal check for quoted number in print (e.g., print("15") instead of print(15))
  const quotedNumMatch = code.match(/print\s*\(\s*["'](\d+)["']\s*\)/);
  if (quotedNumMatch) {
    const num = quotedNumMatch[1];
    appendTerminal(`\n[AI Feedback]: AI Detection: You passed '${num}' as a text string with quotation marks ("${num}"). To print an integer number, write print(${num}) without quotes!`, 'term-line-err');
    return false;
  }

  // Inbuilt AI AST check if challenge specifies ai_check
  const aiCheckType = (currentChallenge && currentChallenge.ai_check) || (lessonData && lessonData.ai_check) || null;
  if (aiCheckType) {
    let astCheckPassed = true;
    let astMessage = '';

    if (invoke) {
      try {
        const astRes = await invoke('verify_python_ast', {
          code,
          checkType: aiCheckType
        });
        if (astRes && astRes.check_passed === false) {
          astCheckPassed = false;
          astMessage = astRes.message;
        } else if (astRes && astRes.message) {
          astMessage = astRes.message;
        }
      } catch (e) {
        console.warn('AST verification error:', e);
      }
    } else {
      if (aiCheckType === 'int_not_str_5' || aiCheckType === 'int_5') {
        if (/print\s*\(\s*["']5["']\s*\)/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: You used quotation marks around '5' or \"5\". In Python, quotes create text (strings). To print an integer number, write print(5) without quotes!";
        } else if (!/print\s*\(\s*5\s*\)/.test(code)) {
          astCheckPassed = false;
          astMessage = "Did not find print(5). Make sure to write print(5) without quotes.";
        } else {
          astMessage = "AI Verification: Confirmed 5 is printed as an integer (int), not a string!";
        }
      } else if (aiCheckType === 'create_name_age_vars' || aiCheckType === 'variables_name_age') {
        const hasNameVar = /name\s*=/.test(code);
        const hasAgeVar = /age\s*=/.test(code);
        const hasPrintName = /print\s*\(\s*name\s*\)/.test(code);
        const hasPrintAge = /print\s*\(\s*age\s*\)/.test(code);
        if (!hasNameVar) {
          astCheckPassed = false;
          astMessage = "AI Detection: Variable 'name' was not assigned. Create it like: name = \"Alice\"";
        } else if (!hasAgeVar) {
          astCheckPassed = false;
          astMessage = "AI Detection: Variable 'age' was not assigned. Create it like: age = 25";
        } else if (/print\s*\(\s*["']name["']\s*\)/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: You put quotation marks around 'name' in print(). Write print(name) without quotes to print the variable's value!";
        } else if (/print\s*\(\s*["']age["']\s*\)/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: You put quotation marks around 'age' in print(). Write print(age) without quotes to print the variable's value!";
        } else if (!hasPrintName || !hasPrintAge) {
          astCheckPassed = false;
          astMessage = "AI Detection: Make sure to print both variables: print(name) and print(age).";
        } else {
          astMessage = "AI Verification: Confirmed variables 'name' and 'age' are created and printed correctly!";
        }
      } else if (aiCheckType === 'score_int_player_str' || aiCheckType === 'variables_score_player') {
        const hasScoreInt = /score\s*=\s*\d+/.test(code);
        const hasScoreStr = /score\s*=\s*["']\d+["']/.test(code);
        const hasPlayer = /player\s*=\s*["'][^"']+["']/.test(code);
        const hasPrintScore = /print\s*\(\s*score\s*\)/.test(code);
        const hasPrintPlayer = /print\s*\(\s*player\s*\)/.test(code);
        if (hasScoreStr) {
          astCheckPassed = false;
          astMessage = "AI Detection: 'score' was assigned with quotes as text. For integer numbers, write score = 100 without quotes!";
        } else if (!hasScoreInt) {
          astCheckPassed = false;
          astMessage = "AI Detection: Variable 'score' was not assigned as a number: score = 100";
        } else if (!hasPlayer) {
          astCheckPassed = false;
          astMessage = "AI Detection: Variable 'player' was not assigned as text: player = \"John\"";
        } else if (/print\s*\(\s*["']score["']\s*\)/.test(code) || /print\s*\(\s*["']player["']\s*\)/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: You put quotation marks around the variable name in print(). Write print(score) and print(player) without quotes!";
        } else if (!hasPrintScore || !hasPrintPlayer) {
          astCheckPassed = false;
          astMessage = "AI Detection: Make sure to print both variables: print(score) and print(player).";
        } else {
          astMessage = "AI Verification: Confirmed integer 'score' and string 'player' are created and printed correctly!";
        }
      } else if (aiCheckType === 'score_reassign_0_50' || aiCheckType === 'variable_reassign') {
        const hasScore0 = /score\s*=\s*0/.test(code);
        const hasScore50 = /score\s*=\s*50/.test(code);
        const printCount = (code.match(/print\s*\(\s*score\s*\)/g) || []).length;
        if (/print\s*\(\s*0\s*\)/.test(code) || /print\s*\(\s*50\s*\)/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: You wrote print(0) or print(50) directly. The goal is to update a variable! Create score = 0, print(score), update score = 50, and print(score) again.";
        } else if (!hasScore0) {
          astCheckPassed = false;
          astMessage = "AI Detection: Start by creating score = 0.";
        } else if (!hasScore50) {
          astCheckPassed = false;
          astMessage = "AI Detection: Update the variable to 50: score = 50.";
        } else if (printCount < 2) {
          astCheckPassed = false;
          astMessage = "AI Detection: Print the score after setting it to 0, and print(score) again after updating it to 50.";
        } else {
          astMessage = "AI Verification: Confirmed variable 'score' is created, printed, updated to 50, and printed again!";
        }
      } else if (aiCheckType === 'math_four_operators' || aiCheckType === 'four_math_ops') {
        const hasAdd = /\+/.test(code);
        const hasSub = /-/.test(code);
        const hasMult = /\*/.test(code);
        const hasDiv = /\//.test(code);
        const hasBracketCombo = /\([^)]*[\+\-][^)]*\)\s*\*|\*\s*\([^)]*[\+\-][^)]*\)/.test(code);

        if (!hasAdd || !hasSub || !hasMult || !hasDiv) {
          const missing = [];
          if (!hasAdd) missing.push('+');
          if (!hasSub) missing.push('-');
          if (!hasMult) missing.push('*');
          if (!hasDiv) missing.push('/');
          astCheckPassed = false;
          astMessage = `AI Detection: Missing arithmetic operator(s): ${missing.join(', ')}. Practice addition (+), subtraction (-), multiplication (*), and division (/)!`;
        } else if (!hasBracketCombo) {
          astCheckPassed = false;
          astMessage = "AI Detection: Remember to compute the combined expression with brackets: (a + b) * 2.";
        } else {
          astMessage = "AI Verification: Confirmed all 4 math operators (+, -, *, /) and bracketed combo expression are calculated and printed correctly!";
        }
      } else if (aiCheckType === 'min_max_normalization_formula' || aiCheckType === 'normalization_formula' || aiCheckType === 'min_max_formula') {
        if (/normalized\s*=\s*50(?:\.0)?\b/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: You wrote the literal number 50.0 instead of using the formula. In real algorithms, 'val', 'min_val', and 'max_val' change dynamically! Write: normalized = (val - min_val) / (max_val - min_val) * 100.";
        } else if (!/normalized\s*=/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Variable 'normalized' was not assigned. Write: normalized = (val - min_val) / (max_val - min_val) * 100.";
        } else if (!/val/.test(code) || !/min_val/.test(code) || !/max_val/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Make sure to use all three variables: val, min_val, and max_val.";
        } else if (/val\s*-\s*min_val\s*\//.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Operator Precedence Alert (BODMAS)! Division (/) executes before subtraction (-). You must wrap the numerator in brackets: (val - min_val).";
        } else if (/\/\s*max_val\s*-\s*min_val/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Operator Precedence Alert (BODMAS)! Wrap the denominator in brackets: (max_val - min_val) so it subtracts before dividing.";
        } else if (!/\(\s*val\s*-\s*min_val\s*\)/.test(code) || !/\(\s*max_val\s*-\s*min_val\s*\)/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Use brackets around both the numerator and denominator: normalized = (val - min_val) / (max_val - min_val) * 100.";
        } else {
          astMessage = "AI Verification: Confirmed Min-Max Normalization formula with correct BODMAS bracket precedence!";
        }
      } else if (aiCheckType === 'euclidean_distance_formula' || aiCheckType === 'distance_formula') {
        astMessage = "AI Verification: Distance formula verified.";
      } else if (aiCheckType === 'binary_search_midpoint_formula' || aiCheckType === 'midpoint_formula') {
        if (/midpoint\s*=\s*30(?:\.0)?\b/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: You wrote the literal number 30 instead of using the formula. In real algorithms, 'low' and 'high' change dynamically! Write: midpoint = (low + high) / 2.";
        } else if (/midpoint\s*=\s*low\s*\+\s*high\s*\/\s*2/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Operator Precedence Alert! Division (/) executes before addition (+), calculating 10 + (50 / 2) = 35.0 instead of 30.0. Use brackets: midpoint = (low + high) / 2.";
        } else if (!/midpoint\s*=\s*\(\s*(?:low\s*\+\s*high|high\s*\+\s*low)\s*\)\s*\/\/?\s*2/.test(code) && !/midpoint\s*=\s*low\s*\+\s*\(\s*(?:high\s*-\s*low)\s*\)\s*\/\/?\s*2/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Calculate the midpoint between low and high using: midpoint = (low + high) / 2.";
        } else {
          astMessage = "AI Verification: Confirmed Binary Search midpoint formula (low + high) / 2 with correct bracket precedence!";
        }
      } else if (aiCheckType === 'string_concat_greeting' || aiCheckType === 'concat_first_last') {
        if (/full_name\s*=\s*["']Alan Turing["']/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: You wrote the literal text \"Alan Turing\" directly. Combine the variables: full_name = first_name + \" \" + last_name.";
        } else if (!/full_name\s*=/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Variable 'full_name' was not assigned. Create it like: full_name = first_name + \" \" + last_name.";
        } else if (!/first_name/.test(code) || !/last_name/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Make sure to concatenate the variables first_name and last_name.";
        } else if (!/first_name\s*\+\s*["']\s+["']\s*\+\s*last_name/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Missing space between words! When joining strings with +, Python does not insert spaces automatically. Write: full_name = first_name + \" \" + last_name.";
        } else {
          astMessage = "AI Verification: Confirmed string concatenation with space separator!";
        }
      } else if (aiCheckType === 'api_url_builder_algorithm' || aiCheckType === 'url_builder') {
        if (/url\s*=\s*["']https:\/\/api\.learner\.dev\/search\?q=python["']/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: You wrote the literal URL string directly. In real web engines, parameters are dynamic! Use string concatenation: url = protocol + \"://\" + domain + \"/\" + endpoint + \"?q=\" + query.";
        } else if (!/url\s*=/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Variable 'url' was not assigned. Construct it using string concatenation with the parameter variables.";
        } else {
          const hasProto = /protocol/.test(code);
          const hasDomain = /domain/.test(code);
          const hasEndpoint = /endpoint/.test(code);
          const hasQuery = /query/.test(code);
          if (!hasProto || !hasDomain || !hasEndpoint || !hasQuery) {
            astCheckPassed = false;
            astMessage = "AI Detection: Missing required variable(s) in URL assembly. Ensure protocol, domain, endpoint, and query are concatenated.";
          } else {
            astMessage = "AI Verification: Confirmed dynamic API URL assembly using string concatenation!";
          }
        }
      } else if (aiCheckType === 'if_two_stages' || aiCheckType === 'if_statement_check' || aiCheckType === 'firewall_packet_rule' || aiCheckType === 'firewall_rule') {
        if (!/\bif\b/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Missing 'if' statement! Write an if condition (e.g. if speed > 60: or if port == 80:).";
        } else {
          astMessage = "AI Verification: Confirmed 'if' branch statement structure!";
        }
      } else if (aiCheckType === 'if_else_two_stages' || aiCheckType === 'if_else_check' || aiCheckType === 'ecommerce_shipping_calculator' || aiCheckType === 'shipping_calc') {
        if (!/\bif\b/.test(code) || !/\belse\b/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Missing 'if / else' structure! Provide both an 'if' branch and an alternative 'else:' branch.";
        } else {
          astMessage = "AI Verification: Confirmed two-path if/else control flow!";
        }
      } else if (aiCheckType === 'for_loop_four_stages' || aiCheckType === 'for_loop_check' || aiCheckType === 'sensor_accumulator_algorithm' || aiCheckType === 'sensor_loop') {
        if (!/\bfor\b/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Missing 'for' loop! Use a 'for' loop (e.g. for i in range(4): or for item in list:).";
        } else {
          astMessage = "AI Verification: Confirmed for-loop sequence iteration!";
        }
      } else if (aiCheckType === 'while_loop_two_stages' || aiCheckType === 'while_loop_check' || aiCheckType === 'exponential_backoff_algorithm' || aiCheckType === 'backoff_loop') {
        if (!/\bwhile\b/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Missing 'while' loop! Implement execution inside a 'while' loop.";
        } else {
          astMessage = "AI Verification: Confirmed while-loop condition control!";
        }
      } else if (aiCheckType === 'function_three_stages' || aiCheckType === 'function_check' || aiCheckType === 'currency_converter_function' || aiCheckType === 'converter_func' || aiCheckType === 'format_badge_function' || aiCheckType === 'default_param_func') {
        if (!/\bdef\b/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Missing function definition! Define reusable logic using 'def function_name(...):'.";
        } else if ((aiCheckType.includes('three') || aiCheckType.includes('converter')) && !/\breturn\b/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Missing 'return' statement inside function! Return the calculated result.";
        } else {
          astMessage = "AI Verification: Confirmed reusable function definition!";
        }
      } else if (aiCheckType === 'list_four_stages' || aiCheckType === 'list_ops_check' || aiCheckType === 'fifo_queue_algorithm' || aiCheckType === 'fifo_queue' || aiCheckType === 'find_max_algorithm' || aiCheckType === 'max_algo') {
        if (!/\[[^\]]*\]/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Missing list syntax! Declare and operate on Python lists using square brackets [].";
        } else {
          astMessage = "AI Verification: Confirmed list data structure operations!";
        }
      } else if (aiCheckType === 'dict_three_stages' || aiCheckType === 'dict_ops_check' || aiCheckType === 'word_frequency_algorithm' || aiCheckType === 'word_freq' || aiCheckType === 'role_permission_algorithm' || aiCheckType === 'role_acl') {
        if (!/\{[^\}]*\}/.test(code) && !/dict\s*\(/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Missing dictionary syntax! Create key-value mappings using curly braces {key: value}.";
        } else {
          astMessage = "AI Verification: Confirmed dictionary data structure operations!";
        }
      } else if (aiCheckType === 'capstone_leaderboard_filter') {
        if (!/\b(for|while)\b/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Capstone verification failed. Iterate through the dataset using a 'for' or 'while' loop.";
        } else if (!/\bif\b/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Capstone verification failed. Filter leaderboard scores using an 'if' statement inside the loop.";
        } else {
          astMessage = "AI Verification: Confirmed capstone leaderboard filter logic (loop + condition)!";
        }
      } else if (aiCheckType === 'capstone_banking_ledger') {
        if (!/=\s*/.test(code) || !/[\+\-]/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Capstone verification failed. Calculate transaction balances using variables and math (+ / -).";
        } else {
          astMessage = "AI Verification: Confirmed capstone banking ledger algorithm!";
        }
      } else if (aiCheckType === 'capstone_cipher_encryptor') {
        if (!/\b(for|while|def)\b/.test(code) && !/[\+\-\*]/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Capstone verification failed. Implement the cipher transformation using loops, functions, or char code math.";
        } else {
          astMessage = "AI Verification: Confirmed capstone cipher encryption algorithm!";
        }
      } else if (aiCheckType === 'capstone_inventory_auditor') {
        if (!/\[|\{/.test(code) || !/\b(for|while)\b/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Capstone verification failed. Store inventory in a list/dict and audit items using a loop.";
        } else {
          astMessage = "AI Verification: Confirmed capstone inventory auditing algorithm!";
        }
      } else if (aiCheckType === 'capstone_grade_analytics') {
        if (!/\b(def|for|while)\b/.test(code) && !/sum|len/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Capstone verification failed. Calculate grade analytics using functions, loops, or aggregated lists.";
        } else {
          astMessage = "AI Verification: Confirmed capstone grade analytics algorithm!";
        }
      } else if (aiCheckType === 'grand_coding_challenge_25') {
        if (!/=\s*/.test(code) && !/\b(if|for|while|def)\b/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Grand Challenge verification failed. Write required Python variables, loops, or conditionals instead of hardcoding.";
        } else {
          astMessage = "AI Verification: Confirmed Grand Challenge programming logic!";
        }
      } else if (aiCheckType === 'print_hellow') {
        if (!/print\s*\(\s*["']Hellow["']\s*\)/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Write print(\"Hellow\") to display the output.";
        } else {
          astMessage = "AI Verification: Confirmed print(\"Hellow\") statement!";
        }
      } else if (aiCheckType === 'print_python_seq') {
        if (!/print\s*\(\s*["']P Y T H O N["']\s*\)/.test(code)) {
          astCheckPassed = false;
          astMessage = "AI Detection: Write print(\"P Y T H O N\") to display the sequence.";
        } else {
          astMessage = "AI Verification: Confirmed character sequence print() statement!";
        }
      }

    if (!astCheckPassed) {
      appendTerminal(`\n[AI Feedback]: ${astMessage}`, 'term-line-err');
      return false;
    } else if (astMessage) {
      appendTerminal(`\n[AI Verification]: ${astMessage}`, 'term-line-info');
    }
  }

  const cleanActual = normalizeOutput(actualOutput);
  const cleanExpected = normalizeOutput(expectedRaw);

  if (cleanActual === cleanExpected) {
    if (activeChallenges && activeChallenges.length > 0) {
      completedStages.add(currentChallengeIdx);
      maxUnlockedStageIdx = Math.max(maxUnlockedStageIdx, currentChallengeIdx + 1);

      if (codeInput) {
        stageCodeCache[currentChallengeIdx] = codeInput.value;
      }

      appendTerminal(`\nSTAGE ${currentChallengeIdx + 1} COMPLETE: Output matched!`, 'term-line-info');

      // Check if there are remaining incomplete stages
      if (completedStages.size < activeChallenges.length) {
        let nextIncomplete = -1;
        for (let idx = 0; idx < activeChallenges.length; idx++) {
          if (!completedStages.has(idx)) {
            nextIncomplete = idx;
            break;
          }
        }
        if (nextIncomplete !== -1) {
          currentChallengeIdx = nextIncomplete;
          appendTerminal(`\nADVANCING TO STAGE ${currentChallengeIdx + 1}...`, 'term-line-info');
          updateChallengeUI();
          return true;
        }
      }
    }

    renderChallengeStepper();
    appendTerminal('\nSUCCESS: All stages completed with 100% accuracy!', 'term-line-info');
    if (typeof markQuizCompleted === 'function') {
      markQuizCompleted(special, lesson, subset);
    }
    if (typeof setMaxVisitedSub === 'function') {
      setMaxVisitedSub(special, lesson, Number(subset) + 1);
    }

    const nextStepNum = Number(subset) + 1;
    const nextSidebarBtn = document.getElementById(`sidebar-nav-item-${nextStepNum}`);
    if (nextSidebarBtn) {
      nextSidebarBtn.disabled = false;
      nextSidebarBtn.removeAttribute('title');
    }

    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.disabled = false;
      nextBtn.style.opacity = '1';
      nextBtn.style.cursor = 'pointer';
      nextBtn.style.backgroundColor = '#22c55e';
      nextBtn.textContent = 'Next Page →';
      nextBtn.title = 'Proceed to next topic';
    }
    return true;
  } else {
    appendTerminal('\nOutput does not match expected result. Keep experimenting!', 'term-line-err');
    return false;
  }
}


// ============================================================
// RUN DIRECTLY
// ============================================================
async function runCode() {
  if (!invoke) {
    const demoOutput = 'Purchased: 3x Quantum Battery\nTotal Bill: $126.50\nStep 1: bonus = 5\nStep 2: bonus = 10\nStep 3: bonus = 15';
    appendTerminal('[Demo Mode] Simulated output:\n' + demoOutput, 'term-line-out');
    await verifyOutput(demoOutput);
    return;
  }

  resetDebugger();
  setStatus('Running...', 'running');
  appendTerminal(`\n>>> python -u script.py`, 'term-prompt');

  try {
    const code = codeInput.value;
    const result = await invoke('run_python', { code });

    if (result.stdout && result.stdout.trim() !== '') {
      appendTerminal(result.stdout, 'term-line-out');
    }
    if (result.stderr && result.stderr.trim() !== '') {
      appendTerminal(result.stderr, 'term-line-err');
    }

    if (result.success) {
      setStatus('Completed', 'running');
      appendTerminal(`[Process exited with code ${result.exit_code ?? 0}]`, 'term-line-info');
      await verifyOutput(result.stdout);
    } else {
      setStatus('Error', 'error');
      appendTerminal(`[Process failed with exit code ${result.exit_code ?? 1}]`, 'term-line-err');
    }
  } catch (err) {
    setStatus('Execution Error', 'error');
    appendTerminal(`[Error]: ${String(err)}`, 'term-line-err');
  }
}

// ============================================================
// START DEBUGGING TRACE
// ============================================================
async function startDebugSession() {
  if (!invoke) {
    appendTerminal('[Demo Mode] Debugger requires Tauri desktop runtime.', 'term-line-err');
    return;
  }

  resetDebugger();
  setStatus('Initializing Debugger...', 'debugging');
  appendTerminal(`\n>>> [debugpy trace active]`, 'term-prompt');

  try {
    const code = codeInput.value;
    const result = await invoke('debug_python', { code });

    if (!result.success && (!result.steps || result.steps.length === 0)) {
      setStatus('Syntax / Load Error', 'error');
      appendTerminal(result.error || result.total_stdout, 'term-line-err');
      return;
    }

    debugSteps = result.steps || [];
    if (debugSteps.length === 0) {
      setStatus('No steps executed', '');
      appendTerminal('[No executable lines found]', 'term-line-info');
      return;
    }

    isDebugging = true;
    currentStepIdx = 0;
    btnStep.disabled = false;
    btnContinue.disabled = false;

    applyStep(currentStepIdx);
  } catch (err) {
    setStatus('Debug Error', 'error');
    appendTerminal(`[Debugger Error]: ${String(err)}`, 'term-line-err');
  }
}

function applyStep(index) {
  if (index < 0 || index >= debugSteps.length) {
    finishDebugging();
    return;
  }

  const step = debugSteps[index];
  highlightLine(step.line);
  renderVariables(step.locals);

  if (step.stdout) {
    clearTerminal();
    appendTerminal(`>>> [debugging: step ${index + 1}/${debugSteps.length}]`, 'term-prompt');
    appendTerminal(step.stdout, 'term-line-out');
  }

  if (step.error) {
    setStatus(`Exception at line ${step.line}`, 'error');
    appendTerminal(`\n[Exception]: ${step.error}`, 'term-line-err');
  } else if (breakpoints.has(step.line) && index > 0) {
    setStatus(`Paused at Breakpoint (Line ${step.line})`, 'paused');
  } else {
    setStatus(`Debugging (Line ${step.line})`, 'debugging');
  }
}

function stepForward() {
  if (!isDebugging || debugSteps.length === 0) {
    startDebugSession();
    return;
  }

  currentStepIdx++;
  if (currentStepIdx >= debugSteps.length) {
    finishDebugging();
  } else {
    applyStep(currentStepIdx);
  }
}

function continueExecution() {
  if (!isDebugging || debugSteps.length === 0) {
    startDebugSession();
    return;
  }

  let nextIdx = currentStepIdx + 1;
  while (nextIdx < debugSteps.length) {
    const step = debugSteps[nextIdx];
    if (breakpoints.has(step.line) || nextIdx === debugSteps.length - 1 || step.error) {
      break;
    }
    nextIdx++;
  }

  currentStepIdx = nextIdx;
  applyStep(currentStepIdx);
}

async function finishDebugging() {
  clearLineHighlights();
  setStatus('Debug Session Finished', 'running');
  appendTerminal('\n[Execution Finished]', 'term-line-info');
  btnStep.disabled = true;
  btnContinue.disabled = true;
  isDebugging = false;

  const finalStdout = debugSteps.length > 0 ? debugSteps[debugSteps.length - 1].stdout : '';
  if (finalStdout) {
    await verifyOutput(finalStdout);
  }
}

function resetDebugger() {
  isDebugging = false;
  debugSteps = [];
  currentStepIdx = -1;
  clearLineHighlights();
  renderVariables({});
  setStatus('Ready', '');
  if (btnStep) btnStep.disabled = false;
  if (btnContinue) btnContinue.disabled = false;
}

// Event Listeners
btnRun?.addEventListener('click', runCode);
btnDebug?.addEventListener('click', startDebugSession);
btnStep?.addEventListener('click', stepForward);
btnContinue?.addEventListener('click', continueExecution);
btnReset?.addEventListener('click', () => {
  resetDebugger();
  clearTerminal();
  appendTerminal('Output cleared. Debugger reset.', 'term-line-info');
});
btnClearOutput?.addEventListener('click', clearTerminal);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  initEditor();
  renderVariables({});
  setStatus('Ready', '');

  try {
    const data = await fetchLessonJson();
    lessonData = data;
    if (data && data.challenges && Array.isArray(data.challenges) && data.challenges.length > 0) {
      activeChallenges = data.challenges;
      currentChallengeIdx = 0;
      updateChallengeUI();
    }
  } catch (err) {
    console.warn('Failed to load challenges into editor:', err);
  }
});

