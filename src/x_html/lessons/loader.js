// ============================================================
// DYNAMIC SYLLABUS ROUTER & JSON DATA LOADER (loader.js)
// ============================================================

import {
  MALAYALAM_UI,
  MALAYALAM_MODULE_NAMES,
  MALAYALAM_LESSON_DATA,
  MALAYALAM_OVERVIEWS,
  MALAYALAM_CONCEPTS
} from './malayalam_translations.js';

// 1 = Intro (1.html), 2 = Code/Debug (2.html), 3 = General Info (3.html), 4 = MCQ (4.html)
export const sylPy = [
  [1, 4, 3, 4],                         // Lesson 1: What is a PC (0.1 Intro -> 0.1 Quiz -> 0.2 Info -> 0.2 Quiz)
  [1, 4, 3, 2, 4, 3, 4],                // Lesson 2: Programming (1.1 Editor -> 1.1 Quiz -> 1.2 print() Info -> 1.2 Code -> 1.2 Quiz -> 1.3 Running Code -> 1.3 Quiz)
  [1, 4, 3, 2, 2, 1, 2, 4, 2, 4],       // Lesson 3: Basic Math & Strings (3.1 Math->Quiz->Mult/Div->Code->AlgoCode, 3.2 StringInfo->Code->Quiz->AlgoCode->FinalQuiz)
  [1, 4, 2, 1, 4, 2, 1, 4, 2, 4],       // Lesson 4: Variables (2.1 Info->Quiz->Code, 2.2 Info->Quiz->Code, 2.3 Info->Quiz->Code->FinalQuiz)
  [1, 2, 4],                            // Lesson 5: Lists
  [1, 2, 4],                            // Lesson 6: Conditions
  [1, 2, 4]                             // Lesson 7: For Loop
];

export const LANGUAGES = [
  { code: 'en', name: 'English (US)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' }
];

let currentLang = (typeof window !== 'undefined' && localStorage.getItem('learner_preferred_lang')) || 'en';

export function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const lsn = parseInt(params.get('lsn') || '1', 10);
  const sub = parseInt(params.get('sub') || '1', 10);
  const spcl = params.get('spcl') || '1';
  const ref_from = params.get('ref_from') || null;
  return { lsn, sub, spcl, ref_from };
}

export function initReferenceReturnBanner() {
  const { ref_from, spcl } = getQueryParams();
  const existingBanner = document.getElementById('ref-return-banner');
  if (existingBanner) existingBanner.remove();

  if (!ref_from) return;

  const parts = ref_from.split('_');
  const fromSpcl = parts[0] || spcl;
  const fromLsn = parts[1] || '1';
  const fromSub = parts[2] || '1';

  const isMl = currentLang === 'ml';
  const tagText = isMl ? 'റഫറൻസ് മോഡ്' : 'REFERENCE MODE';
  const descText = isMl ? 'മുൻ പാഠഭാഗം പരിശോധിക്കുന്നു' : 'Reviewing prior lesson';
  const returnBtnText = isMl 
    ? `← പാഠം ${fromLsn}.${fromSub} ലേക്ക് മടങ്ങുക ↩` 
    : `← Return to Lesson ${fromLsn}.${fromSub} ↩`;

  const banner = document.createElement('div');
  banner.id = 'ref-return-banner';
  banner.className = 'ref-return-banner';
  banner.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span class="ref-return-tag">${tagText}</span>
      <span class="ref-return-text">${descText}</span>
    </div>
    <button type="button" class="ref-return-btn" id="ref-return-btn">${returnBtnText}</button>
  `;

  document.body.appendChild(banner);

  const returnBtn = document.getElementById('ref-return-btn');
  if (returnBtn) {
    returnBtn.onclick = () => {
      const targetLsnIdx = Math.max(0, parseInt(fromLsn, 10) - 1);
      const targetSeq = sylPy[targetLsnIdx] || sylPy[0];
      const targetSubIdx = Math.max(1, Math.min(parseInt(fromSub, 10) || 1, targetSeq.length));
      const targetTypeId = targetSeq[targetSubIdx - 1] || 1;
      window.location.href = `${targetTypeId}.html?spcl=${fromSpcl}&lsn=${fromLsn}&sub=${targetSubIdx}`;
    };
  }
}

export function initLanguageDropup() {
  const container = document.getElementById('sidebar-lang-container');
  if (!container) return;

  const activeLangObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  container.innerHTML = `
    <div class="sidebar-lang-dropup">
      <div id="lang-dropup-menu" class="lang-dropup-menu">
        ${LANGUAGES.map(lang => `
          <button type="button" class="lang-option-item ${lang.code === currentLang ? 'active' : ''}" data-code="${lang.code}">
            <span>${lang.name}</span>
            ${lang.code === currentLang ? '<span>(Active)</span>' : ''}
          </button>
        `).join('')}
      </div>
      <button type="button" id="lang-dropup-btn" class="lang-dropup-btn">
        <span>Language: <span id="current-lang-text">${activeLangObj.name}</span></span>
        <span>^</span>
      </button>
    </div>
  `;

  const btn = document.getElementById('lang-dropup-btn');
  const menu = document.getElementById('lang-dropup-menu');

  if (btn && menu) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('open');
    });

    document.addEventListener('click', () => {
      menu.classList.remove('open');
    });

    menu.querySelectorAll('.lang-option-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = item.getAttribute('data-code');
        currentLang = code;
        localStorage.setItem('learner_preferred_lang', currentLang);
        menu.classList.remove('open');
        initLanguageDropup();
        initLessonPage().catch(err => console.error(err));
      });
    });
  }
}

function getInvoke() {
  if (typeof window !== 'undefined' && window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === 'function') {
    return window.__TAURI__.core.invoke;
  }
  if (typeof window !== 'undefined' && window.__TAURI_INTERNALS__ && typeof window.__TAURI_INTERNALS__.invoke === 'function') {
    return window.__TAURI_INTERNALS__.invoke;
  }
  return null;
}

async function safeInvoke(cmd, args = {}) {
  const inv = getInvoke();
  if (!inv) return null;
  try {
    return await inv(cmd, args);
  } catch (err) {
    console.warn(`[Tauri] Failed invoke for "${cmd}":`, err);
    return null;
  }
}

let currentProfile = null;
let currentProgress = {
  lesson_no: 1,
  sub_no: 1,
  spec_no: 1,
  completed_subtopics: [],
  max_visited_subs: {},
  lesson_mistakes: {},
  ai_breakdowns: {},
  quiz_states: {}
};

export async function loadUserData() {
  const inv = getInvoke();
  if (inv) {
    try {
      currentProfile = await inv('get_active_profile');
      const prog = await inv('get_user_progress', { userKey: null });
      if (prog) {
        currentProgress = {
          lesson_no: prog.lesson_no || 1,
          sub_no: prog.sub_no || 1,
          spec_no: prog.spec_no || 1,
          completed_subtopics: Array.isArray(prog.completed_subtopics) ? prog.completed_subtopics : [],
          max_visited_subs: (prog.max_visited_subs && typeof prog.max_visited_subs === 'object') ? prog.max_visited_subs : {},
          lesson_mistakes: (prog.lesson_mistakes && typeof prog.lesson_mistakes === 'object') ? prog.lesson_mistakes : {},
          ai_breakdowns: (prog.ai_breakdowns && typeof prog.ai_breakdowns === 'object') ? prog.ai_breakdowns : {},
          quiz_states: (prog.quiz_states && typeof prog.quiz_states === 'object') ? prog.quiz_states : {}
        };
      }
    } catch (err) {
      console.warn('Failed to load user progress from backend:', err);
    }
  } else {
    try {
      const raw = localStorage.getItem('adhicode_user_progress');
      if (raw) currentProgress = JSON.parse(raw);
      if (!currentProgress.ai_breakdowns) currentProgress.ai_breakdowns = {};
      if (!currentProgress.quiz_states) currentProgress.quiz_states = {};
    } catch (e) {}
  }
}

function persistLocalFallback() {
  if (!getInvoke()) {
    try {
      localStorage.setItem('adhicode_user_progress', JSON.stringify(currentProgress));
    } catch (e) {}
  }
}

export function getQuizState(spcl, lsn, sub) {
  const key = `${spcl}_${lsn}_${sub}`;
  if (currentProgress.quiz_states && currentProgress.quiz_states[key]) {
    return currentProgress.quiz_states[key];
  }
  try {
    const raw = localStorage.getItem(`adhicode_quiz_state_${key}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

export function saveQuizState(spcl, lsn, sub, state) {
  const key = `${spcl}_${lsn}_${sub}`;
  if (!currentProgress.quiz_states) {
    currentProgress.quiz_states = {};
  }
  currentProgress.quiz_states[key] = state;
  try {
    localStorage.setItem(`adhicode_quiz_state_${key}`, JSON.stringify(state));
  } catch (e) {}
  persistLocalFallback();
}

export function getCompletedQuizzes() {
  return currentProgress.completed_subtopics || [];
}

export function isQuizCompleted(spcl, lsn, sub) {
  const key = `${spcl}_${lsn}_${sub}`;
  return (currentProgress.completed_subtopics || []).includes(key);
}

export function markQuizCompleted(spcl, lsn, sub) {
  const key = `${spcl}_${lsn}_${sub}`;
  if (!currentProgress.completed_subtopics) {
    currentProgress.completed_subtopics = [];
  }
  if (!currentProgress.completed_subtopics.includes(key)) {
    currentProgress.completed_subtopics.push(key);
  }

  safeInvoke('record_subtopic_progress', {
    userKey: null,
    spcl: String(spcl),
    lsn: Number(lsn),
    sub: Number(sub),
    completed: true,
    maxSub: null
  });
  persistLocalFallback();
}

export function getMaxVisitedSub(spcl, lsn) {
  const key = `${spcl}_${lsn}`;
  return (currentProgress.max_visited_subs && currentProgress.max_visited_subs[key]) || 1;
}

export function setMaxVisitedSub(spcl, lsn, sub) {
  const key = `${spcl}_${lsn}`;
  if (!currentProgress.max_visited_subs) {
    currentProgress.max_visited_subs = {};
  }
  const currentMax = currentProgress.max_visited_subs[key] || 1;
  const newMax = Math.max(currentMax, Number(sub) || 1);
  currentProgress.max_visited_subs[key] = newMax;

  safeInvoke('record_subtopic_progress', {
    userKey: null,
    spcl: String(spcl),
    lsn: Number(lsn),
    sub: Number(sub),
    completed: false,
    maxSub: newMax
  });
  persistLocalFallback();
}

export function getRecordedMistakes(spcl, lsn) {
  const key = `${spcl}_${lsn}`;
  if (currentProgress.lesson_mistakes && currentProgress.lesson_mistakes[key]) {
    return currentProgress.lesson_mistakes[key];
  }
  return [];
}

export function recordMistake(mistakeData) {
  const { spcl, lsn, sub } = mistakeData;
  const key = `${spcl}_${lsn}`;
  if (!currentProgress.lesson_mistakes) {
    currentProgress.lesson_mistakes = {};
  }
  if (!currentProgress.lesson_mistakes[key]) {
    currentProgress.lesson_mistakes[key] = [];
  }
  const list = currentProgress.lesson_mistakes[key];
  const isDuplicate = list.some(m =>
    m.question === mistakeData.question &&
    m.lsn === mistakeData.lsn &&
    m.sub === mistakeData.sub
  );
  if (!isDuplicate) {
    list.push({
      ...mistakeData,
      timestamp: new Date().toISOString()
    });

    safeInvoke('save_lesson_mistakes', {
      userKey: null,
      spcl: String(spcl),
      lsn: Number(lsn),
      mistakes: list
    });
    persistLocalFallback();
  }
}

export function setRecordedMistakes(spcl, lsn, mistakes) {
  const key = `${spcl}_${lsn}`;
  if (!currentProgress.lesson_mistakes) {
    currentProgress.lesson_mistakes = {};
  }
  currentProgress.lesson_mistakes[key] = mistakes;

  safeInvoke('save_lesson_mistakes', {
    userKey: null,
    spcl: String(spcl),
    lsn: Number(lsn),
    mistakes: mistakes
  });
  persistLocalFallback();
}

export function clearRecordedMistakes(spcl, lsn) {
  const key = `${spcl}_${lsn}`;
  if (currentProgress.lesson_mistakes) {
    delete currentProgress.lesson_mistakes[key];
  }

  safeInvoke('clear_lesson_mistakes', {
    userKey: null,
    spcl: String(spcl),
    lsn: Number(lsn)
  });
  persistLocalFallback();
}

export function getSavedAiBreakdown(spcl, lsn, roundNum) {
  const key = `${spcl}_${lsn}_round_${roundNum}`;
  if (currentProgress.ai_breakdowns && currentProgress.ai_breakdowns[key]) {
    return currentProgress.ai_breakdowns[key];
  }
  return null;
}

export function saveAiBreakdown(spcl, lsn, roundNum, mistakes) {
  const key = `${spcl}_${lsn}_round_${roundNum}`;
  if (!currentProgress.ai_breakdowns) {
    currentProgress.ai_breakdowns = {};
  }
  const breakdownData = {
    spcl: String(spcl),
    lsn: Number(lsn),
    roundNum: Number(roundNum),
    mistakes: Array.isArray(mistakes) ? JSON.parse(JSON.stringify(mistakes)) : [],
    savedAt: new Date().toISOString()
  };
  currentProgress.ai_breakdowns[key] = breakdownData;

  safeInvoke('save_ai_breakdown', {
    userKey: null,
    breakdownKey: key,
    breakdown: breakdownData
  });
  persistLocalFallback();
  return breakdownData;
}

export function getAdaptiveSequence() {
  const { lsn, spcl, sub } = getQueryParams();
  const lessonIdx = Math.max(0, lsn - 1);
  const baseSequence = [...(sylPy[lessonIdx] || sylPy[0])];
  const mistakes = getRecordedMistakes(spcl, lsn);

  // Check highest saved breakdown round for this lesson
  let maxSavedRound = 0;
  if (currentProgress.ai_breakdowns) {
    const prefix = `${spcl}_${lsn}_round_`;
    Object.keys(currentProgress.ai_breakdowns).forEach(k => {
      if (k.startsWith(prefix)) {
        const r = parseInt(k.replace(prefix, ''), 10);
        if (!isNaN(r) && r > maxSavedRound) maxSavedRound = r;
      }
    });
  }

  // If no mistakes are recorded AND no breakdowns are saved in memory, return baseSequence
  if (mistakes.length === 0 && maxSavedRound === 0) {
    return baseSequence;
  }

  // Calculate required remediation pairs based on maxVisited, current sub, and saved breakdowns
  const maxVisited = getMaxVisitedSub(spcl, lsn);
  const highestStep = Math.max(maxVisited, sub || 1);
  const adaptiveStepsFromVisited = Math.max(0, highestStep - baseSequence.length);
  const adaptiveStepsFromSaved = maxSavedRound * 2;
  const adaptiveSteps = Math.max(adaptiveStepsFromVisited, adaptiveStepsFromSaved, mistakes.length > 0 ? 2 : 0);
  const adaptivePairs = Math.max(1, Math.ceil(adaptiveSteps / 2));

  const extendedSequence = [...baseSequence];
  for (let i = 0; i < adaptivePairs; i++) {
    extendedSequence.push(3, 4); // [Type 3: AI Breakdown, Type 4: AI Quiz]
  }

  return extendedSequence;
}

export function analyzeMistakeConcepts(mistakes) {
  // Deduplicate raw mistakes by question text
  const uniqueMistakesMap = new Map();
  mistakes.forEach(m => {
    const key = (m.question || '').trim().toLowerCase();
    if (key && !uniqueMistakesMap.has(key)) {
      uniqueMistakesMap.set(key, m);
    }
  });
  const dedupedMistakes = Array.from(uniqueMistakesMap.values());

  const conceptGroups = {
    dumb_machine: {
      id: 'dumb_machine',
      badge: 'CONCEPT 01 • COMPUTERS VS HUMANS',
      color: '#fef08a',
      title: 'A Computer Is Completely Static & Literal',
      takeaway: 'Computers do <hlt>NOT</hlt> have human intuition, feelings, or common sense. A computer is a deterministic machine that strictly executes the exact operations given to it—never guessing unstated intentions.',
      sampleCode: "instruction = 'open door'\n# The computer follows the instruction exactly.\n# It does not invent or assume missing steps.",
      mistakes: [],
      reinforceQuestions: [
        {
          question: 'Unlike a human, how does a computer strictly operate when running a task?',
          code: "while program_running:\n    execute_literal_machine_instruction()",
          options: [
            {
              prefix: "A",
              text: "It executes static, literal instructions without human feelings or unstated common sense.",
              correct: true
            },
            {
              prefix: "B",
              text: "It uses human intuition to interpret what the programmer meant.",
              correct: false
            },
            {
              prefix: "C",
              text: "It invents missing steps automatically whenever code is incomplete.",
              correct: false
            },
            {
              prefix: "D",
              text: "It pauses to develop empathy before calculating numbers.",
              correct: false
            }
          ],
          explanation_correct: "A computer is a static machine that executes literal operations without human common sense.",
          explanation_incorrect: "Computers do not possess human intuition or feelings. They execute static, precise instructions."
        },
        {
          question: 'If an instruction omits an essential action (e.g., stopping before a wall), what will the computer do?',
          code: "# Instruction: move_forward_infinitely()\n# No stop command given",
          options: [
            {
              prefix: "A",
              text: "It continues executing the literal instruction because it lacks common sense or self-preservation instinct.",
              correct: true
            },
            {
              prefix: "B",
              text: "It uses human common sense to invent a stop command automatically.",
              correct: false
            },
            {
              prefix: "C",
              text: "It pauses to ask other computers for moral advice.",
              correct: false
            },
            {
              prefix: "D",
              text: "It guesses what the user intended and fixes the path.",
              correct: false
            }
          ],
          explanation_correct: "Computers cannot invent missing instructions or use common sense. They execute instructions literally.",
          explanation_incorrect: "Computers follow literal code without guessing or inventing unstated safety routines."
        }
      ],
      getQuestionForRound(roundNum) {
        const idx = (roundNum - 1) % this.reinforceQuestions.length;
        return this.reinforceQuestions[idx];
      }
    },
    explicit_steps: {
      id: 'explicit_steps',
      badge: 'CONCEPT 02 • EXPLICIT INSTRUCTIONS',
      color: '#a7f3d0',
      title: 'Instructions Must Be Explicit & Sequential',
      takeaway: 'Because computers cannot infer what you intended, every task must be broken down into <hlt>precise, unambiguous steps</hlt>. Vague instructions fail because the machine requires clear, orderly commands.',
      sampleCode: "# Explicit and unambiguous:\nopen_door()\nstep_forward()\nclose_door()",
      mistakes: [],
      reinforceQuestions: [
        {
          question: 'Why do computers require explicit instructions rather than vague guidance?',
          code: "# Vague: 'finish the task'\n# Explicit: step_1(); step_2(); step_3()",
          options: [
            {
              prefix: "A",
              text: "They cannot infer what a vague instruction is supposed to mean.",
              correct: true
            },
            {
              prefix: "B",
              text: "They can only execute one single instruction per day.",
              correct: false
            },
            {
              prefix: "C",
              text: "They refuse to run unless all code is written in capital letters.",
              correct: false
            },
            {
              prefix: "D",
              text: "They automatically delete vague code permanently.",
              correct: false
            }
          ],
          explanation_correct: "Computers require explicit steps because they cannot guess or infer unstated intentions.",
          explanation_incorrect: "Computers cannot automatically infer intent from vague instructions."
        },
        {
          question: 'Which of the following commands is properly formulated for an instruction-following machine?',
          code: "# Movement commands",
          options: [
            {
              prefix: "A",
              text: "robot.turn_degrees(90); robot.drive_meters(2)",
              correct: true
            },
            {
              prefix: "B",
              text: "robot.go_somewhere_nearby()",
              correct: false
            },
            {
              prefix: "C",
              text: "robot.do_what_looks_reasonable()",
              correct: false
            },
            {
              prefix: "D",
              text: "robot.figure_out_the_route_by_yourself()",
              correct: false
            }
          ],
          explanation_correct: "Explicit instructions provide exact numeric parameters and distinct actions.",
          explanation_incorrect: "Vague commands leave essential parameters unspecified."
        }
      ],
      getQuestionForRound(roundNum) {
        const idx = (roundNum - 1) % this.reinforceQuestions.length;
        return this.reinforceQuestions[idx];
      }
    },
    execution_power: {
      id: 'execution_power',
      badge: 'CONCEPT 03 • SPEED & EXECUTION',
      color: '#fed7aa',
      title: 'Simplicity + High Speed = Apparent Intelligence',
      takeaway: 'A computer achieves complex results not by being "clever", but by executing <hlt>millions of simple, precise operations per second</hlt>. Its computational power is rooted in speed and scale.',
      sampleCode: "for step in range(1_000_000):\n    perform_simple_step(step)\n# Speed creates the power of modern computing.",
      mistakes: [],
      reinforceQuestions: [
        {
          question: 'What gives a computer the ability to solve complex problems with simple instructions?',
          code: "for op in range(1000000):\n    simple_operation()",
          options: [
            {
              prefix: "A",
              text: "Executing immense numbers of simple operations at extreme speed.",
              correct: true
            },
            {
              prefix: "B",
              text: "Developing consciousness while repeating commands.",
              correct: false
            },
            {
              prefix: "C",
              text: "Skipping simple instructions when tasks get hard.",
              correct: false
            },
            {
              prefix: "D",
              text: "Converting electrical current into human thoughts.",
              correct: false
            }
          ],
          explanation_correct: "A computer's power comes from executing huge numbers of simple instructions at high speed.",
          explanation_incorrect: "Power comes from speed and scale of simple execution, not consciousness."
        },
        {
          question: 'How does a computer accomplish advanced tasks like rendering video games using basic circuitry?',
          code: "# 60 frames calculated per second",
          options: [
            {
              prefix: "A",
              text: "By repeating millions of basic arithmetic and memory steps in fractions of a second.",
              correct: true
            },
            {
              prefix: "B",
              text: "By using human imagination to visualize graphics.",
              correct: false
            },
            {
              prefix: "C",
              text: "By ignoring instructions and guessing pixels.",
              correct: false
            },
            {
              prefix: "D",
              text: "By executing only one master command throughout its lifespan.",
              correct: false
            }
          ],
          explanation_correct: "High-speed repetition of simple operations allows computers to perform sophisticated tasks.",
          explanation_incorrect: "Computers do not imagine; they calculate simple operations very rapidly."
        }
      ],
      getQuestionForRound(roundNum) {
        const idx = (roundNum - 1) % this.reinforceQuestions.length;
        return this.reinforceQuestions[idx];
      }
    },
    memory_state: {
      id: 'memory_state',
      badge: 'CONCEPT 04 • MEMORY & VARIABLES',
      color: '#93c5fd',
      title: 'Memory Keeps Track of Values While Running',
      takeaway: 'While code runs, the computer needs <hlt>memory</hlt> to store data and results. Variables are friendly names that refer to specific values held in active memory.',
      sampleCode: "score = 100\nname = 'Alex'\n# Variables label storage locations in memory.",
      mistakes: [],
      reinforceQuestions: [
        {
          question: 'What is the primary role of memory while a program is running?',
          code: "score = 100\n# Memory holds the value 100 referenced by score",
          options: [
            {
              prefix: "A",
              text: "To keep track of values and data the program is actively using.",
              correct: true
            },
            {
              prefix: "B",
              text: "To permanently rewrite the computer processor.",
              correct: false
            },
            {
              prefix: "C",
              text: "To automatically write missing code for the programmer.",
              correct: false
            },
            {
              prefix: "D",
              text: "To prevent all errors from ever happening.",
              correct: false
            }
          ],
          explanation_correct: "Memory stores the active data and variables a running program operates on.",
          explanation_incorrect: "Memory holds active variables and data during runtime."
        },
        {
          question: 'If a program executes score = 50 and later updates score = score + 25, what is stored in memory?',
          code: "score = 50\nscore = score + 25\n# What is in memory for score?",
          options: [
            {
              prefix: "A",
              text: "The updated value 75 referenced under the variable name score.",
              correct: true
            },
            {
              prefix: "B",
              text: "Both 50 and 75 simultaneously occupying the exact same slot.",
              correct: false
            },
            {
              prefix: "C",
              text: "Nothing, because memory deletes numbers after addition.",
              correct: false
            },
            {
              prefix: "D",
              text: "A random number selected by the monitor.",
              correct: false
            }
          ],
          explanation_correct: "Memory retains the latest value assigned to the variable during execution.",
          explanation_incorrect: "Variables reference the current, updated value in memory."
        }
      ],
      getQuestionForRound(roundNum) {
        const idx = (roundNum - 1) % this.reinforceQuestions.length;
        return this.reinforceQuestions[idx];
      }
    },
    debugging: {
      id: 'debugging',
      badge: 'CONCEPT 05 • DEBUGGING & INSPECTION',
      color: '#fca5a5',
      title: 'Debugging: Breakpoints & Stepping Over Guessing',
      takeaway: 'A bug is any mismatch between what was intended and what occurred. Instead of guessing, we use <hlt>breakpoints</hlt> to pause execution and <hlt>step line-by-line</hlt> to inspect live memory values.',
      sampleCode: "# Breakpoint pauses here:\nprice = 10\nquantity = 3\n# Step and inspect variables to verify state",
      mistakes: [],
      reinforceQuestions: [
        {
          question: 'What is the purpose of placing a breakpoint during debugging?',
          code: "score = 100\n# [Breakpoint placed on line 2]\ntotal = score + 50",
          options: [
            {
              prefix: "A",
              text: "To pause the program at a chosen line so you can inspect state in memory.",
              correct: true
            },
            {
              prefix: "B",
              text: "To permanently delete the selected line of code.",
              correct: false
            },
            {
              prefix: "C",
              text: "To make every instruction execute simultaneously.",
              correct: false
            },
            {
              prefix: "D",
              text: "To automatically convert bugs into correct code.",
              correct: false
            }
          ],
          explanation_correct: "A breakpoint pauses execution so you can inspect memory and observe state.",
          explanation_incorrect: "Breakpoints pause execution to allow investigation; they do not rewrite code."
        },
        {
          question: 'Why is stepping through code line-by-line with a debugger better than guessing bug locations?',
          code: "a = 5\nb = 10\nc = a + b\n# Step line-by-line",
          options: [
            {
              prefix: "A",
              text: "You can inspect the exact live values in memory at each step to see where logic fails.",
              correct: true
            },
            {
              prefix: "B",
              text: "The debugger automatically writes the program for you.",
              correct: false
            },
            {
              prefix: "C",
              text: "It deletes the program if an error is encountered.",
              correct: false
            },
            {
              prefix: "D",
              text: "It prevents variables from changing.",
              correct: false
            }
          ],
          explanation_correct: "Stepping enables line-by-line inspection of runtime values to locate logic errors precisely.",
          explanation_incorrect: "Stepping allows inspection of live memory state across execution steps."
        }
      ],
      getQuestionForRound(roundNum) {
        const idx = (roundNum - 1) % this.reinforceQuestions.length;
        return this.reinforceQuestions[idx];
      }
    }
  };

  // Classify each unique mistake into the most relevant concept group
  dedupedMistakes.forEach(m => {
    const q = (m.question || '').toLowerCase();
    const a = (m.student_answer || '').toLowerCase();
    const c = (m.correct_answer || '').toLowerCase();
    const t = `${q} ${a} ${c}`;

    if (t.includes('breakpoint') || t.includes('step') || t.includes('debugging') || t.includes('bug') || t.includes('inspect')) {
      conceptGroups.debugging.mistakes.push(m);
    } else if (t.includes('memory') || t.includes('variable') || t.includes('score') || t.includes('store') || t.includes('hard drive')) {
      conceptGroups.memory_state.mistakes.push(m);
    } else if (t.includes('vague') || t.includes('explicit') || t.includes('door') || t.includes('sequence') || t.includes('missing step') || t.includes('doorway')) {
      conceptGroups.explicit_steps.mistakes.push(m);
    } else if (t.includes('speed') || t.includes('scale') || t.includes('power') || t.includes('simple operation') || t.includes('million') || t.includes('press run')) {
      conceptGroups.execution_power.mistakes.push(m);
    } else {
      conceptGroups.dumb_machine.mistakes.push(m);
    }
  });

  return Object.values(conceptGroups).filter(g => g.mistakes.length > 0);
}

export function generateAdaptiveContent(sub, totalSteps) {
  const { lsn, spcl } = getQueryParams();
  const lessonIdx = Math.max(0, lsn - 1);
  const baseLen = (sylPy[lessonIdx] || sylPy[0]).length;

  if (sub <= baseLen) return null;

  const adaptiveOffset = sub - baseLen; // 1 = Breakdown R1, 2 = Quiz R1, 3 = Breakdown R2, 4 = Quiz R2...
  const roundNum = Math.floor((adaptiveOffset - 1) / 2) + 1;
  const isQuiz = (adaptiveOffset % 2 === 0);

  // 1. Retrieve stored breakdown snapshot for this specific roundNum from memory
  let saved = getSavedAiBreakdown(spcl, lsn, roundNum);
  let roundMistakes = (saved && Array.isArray(saved.mistakes) && saved.mistakes.length > 0) ? saved.mistakes : null;

  // 2. If not saved yet, check active mistakes and snapshot them for this round!
  if (!roundMistakes || roundMistakes.length === 0) {
    const currentMistakes = getRecordedMistakes(spcl, lsn);
    if (currentMistakes.length > 0) {
      saveAiBreakdown(spcl, lsn, roundNum, currentMistakes);
      roundMistakes = currentMistakes;
    }
  }

  // 3. Fallback: If still empty, check if round 1 or previous rounds had mistakes
  if (!roundMistakes || roundMistakes.length === 0) {
    for (let r = roundNum - 1; r >= 1; r--) {
      const prevSaved = getSavedAiBreakdown(spcl, lsn, r);
      if (prevSaved && Array.isArray(prevSaved.mistakes) && prevSaved.mistakes.length > 0) {
        roundMistakes = prevSaved.mistakes;
        break;
      }
    }
  }

  if (!roundMistakes || roundMistakes.length === 0) return null;

  const activeConcepts = analyzeMistakeConcepts(roundMistakes);
  if (activeConcepts.length === 0) return null;

  if (!isQuiz) {
    // Step 1: Breakdown View (3.html)
    const isMl = currentLang === 'ml';
    const conceptCardsHtml = activeConcepts.map(cg => {
      const mlConcept = isMl ? MALAYALAM_CONCEPTS[cg.id] : null;
      const badgeText = mlConcept ? mlConcept.badge : cg.badge;
      const titleText = mlConcept ? mlConcept.title : cg.title;
      const takeawayText = mlConcept ? mlConcept.takeaway : cg.takeaway;

      const qLabel = isMl ? MALAYALAM_OVERVIEWS.questionLabel : '• <strong>Question:</strong>';
      const earlierChoiceLabel = isMl ? MALAYALAM_OVERVIEWS.earlierChoiceLabel : 'Earlier Choice:';
      const correctPrincipleLabel = isMl ? MALAYALAM_OVERVIEWS.correctPrincipleLabel : 'Correct Principle:';
      const reviewHeader = isMl 
        ? MALAYALAM_OVERVIEWS.reviewPointsTitle(cg.mistakes.length)
        : `Triggered Review Points (${cg.mistakes.length} item${cg.mistakes.length > 1 ? 's' : ''}):`;

      const reviewedItems = cg.mistakes.map(m => `
        <div style="font-size: 13px; font-weight: 600; color: #111111; margin-bottom: 8px; line-height: 1.4;">
          ${qLabel} ${m.question}<br/>
          <span style="color: #b91c1c; font-weight: 700;">${earlierChoiceLabel}</span> "${m.student_answer || 'Incorrect Option'}" → 
          <span style="color: #15803d; font-weight: 700;">${correctPrincipleLabel}</span> ${m.explanation || 'Follow precise machine rules.'}
        </div>
      `).join('');

      return `
        <div style="background: ${cg.color}; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 22px; margin-bottom: 18px;">
          <span style="display: inline-block; background-color: #ffffff; color: #111111; border: 2px solid #111111; box-shadow: 2px 2px 0px #111111; padding: 2px 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;">
            ${badgeText}
          </span>
          <h2 style="font-family: 'Title', 'Body', sans-serif; font-size: 20px; font-weight: 900; color: #111111; margin: 0 0 10px 0; text-transform: uppercase;">
            ${titleText}
          </h2>
          <p style="font-size: 15px; font-weight: 600; color: #111111; margin: 0 0 12px 0; line-height: 1.5;">
            ${takeawayText}
          </p>

          <div style="background: #0d1117; border: 2px solid #111111; box-shadow: 3px 3px 0 #111111; padding: 10px 14px; font-family: 'Consolas', monospace; color: #f0f6fc; font-size: 13px; border-radius: 4px; margin-bottom: 12px; white-space: pre-wrap;">${cg.sampleCode}</div>

          <div style="background: rgba(255, 255, 255, 0.85); border: 2px solid #111111; border-radius: 4px; padding: 12px 14px;">
            <div style="font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; color: #374151; margin-bottom: 6px;">
              ${reviewHeader}
            </div>
            ${reviewedItems}
          </div>
        </div>
      `;
    }).join('');

    const overviewBadge = isMl ? MALAYALAM_OVERVIEWS.breakdownBadge(roundNum) : `AI Breakdown ${roundNum > 1 ? `• Round ${roundNum}` : ''}`;
    const overviewHeading = isMl ? MALAYALAM_OVERVIEWS.breakdownHeading : 'Mastering Your <hlt> Concepts</hlt>';
    const overviewIntro = isMl 
      ? MALAYALAM_OVERVIEWS.breakdownIntro(activeConcepts.length)
      : `We synthesized your latest quiz responses into ${activeConcepts.length} focused concept pillar${activeConcepts.length > 1 ? 's' : ''} to solidify your understanding.`;
    const footerPrompt = isMl 
      ? MALAYALAM_OVERVIEWS.breakdownFooter
      : 'Ready to test your understanding? Click <hlt>Next Page →</hlt> for your targeted reinforcement check!';

    return {
      topic: isMl ? 'AI പുനർപഠന വിശകലനം' : 'AI ADAPTIVE REINFORCEMENT',
      title: isMl ? `പ്രയാസമുള്ള ആശയങ്ങളുടെ വിശകലനം ${roundNum > 1 ? `(റൗണ്ട് ${roundNum})` : ''}` : `Personalized Review:  Concept Breakdown${roundNum > 1 ? ` (Round ${roundNum})` : ''}`,
      body: `
        <div style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
          <div style="text-align: center; margin-bottom: 4px; width: 100%;">
            <div style="display: inline-block; background-color: #2563EB; color: #FFFFFF; border: 3px solid #111111; box-shadow: 4px 4px 0px #111111; padding: 4px 14px; margin-bottom: 10px; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
              ${overviewBadge}
            </div>
            <h1 style="font-family: 'Title', 'Body', sans-serif; font-size: 28px; font-weight: 900; color: #111111; margin: 0 0 8px 0; text-transform: uppercase;">
              ${overviewHeading}
            </h1>
            <p style="font-size: 15px; font-weight: 600; color: #222222; margin: 0 auto; max-width: 620px;">
              ${overviewIntro}
            </p>
          </div>

          ${conceptCardsHtml}

          <div style="background-color: #c4b5fd; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 16px 20px; text-align: center;">
            <p style="font-size: 15px; font-weight: 900; color: #111111; margin: 0; text-transform: uppercase;">
              ${footerPrompt}
            </p>
          </div>
        </div>
      `
    };
  } else {
    // Step 2: Reinforcement Quiz View (4.html)
    const isMl = currentLang === 'ml';
    const generatedQuestions = activeConcepts.map((cg, qIdx) => {
      const mlConcept = isMl ? MALAYALAM_CONCEPTS[cg.id] : null;
      let qObj;
      if (mlConcept && Array.isArray(mlConcept.reinforceQuestions) && mlConcept.reinforceQuestions.length > 0) {
        const idx = (roundNum - 1) % mlConcept.reinforceQuestions.length;
        qObj = mlConcept.reinforceQuestions[idx];
      } else {
        qObj = cg.getQuestionForRound(roundNum);
      }

      const badgeText = isMl 
        ? MALAYALAM_OVERVIEWS.quizBadge(qIdx + 1, activeConcepts.length)
        : `AI REINFORCEMENT QUIZ • QUESTION ${qIdx + 1} OF ${activeConcepts.length}`;

      return {
        badge: badgeText,
        question: qObj.question,
        code: qObj.code,
        options: qObj.options,
        explanation_correct: qObj.explanation_correct,
        explanation_incorrect: qObj.explanation_incorrect
      };
    });

    return {
      topic: isMl ? MALAYALAM_OVERVIEWS.quizTopic : 'AI ADAPTIVE PRACTICE',
      title: isMl ? MALAYALAM_OVERVIEWS.quizTitle(roundNum) : `Targeted Reinforcement Quiz${roundNum > 1 ? ` (Round ${roundNum})` : ''}`,
      questions: generatedQuestions
    };
  }
}

export const ENGLISH_MODULE_NAMES = {
  1: [
    '0.1 • The Dumb Machine',
    '0.1 • Fundamentals Quiz',
    '0.2 • Running Code',
    '0.2 • Debugging Quiz'
  ],
  2: [
    '1.1 • About the Editor',
    '1.1 • Editor Controls Quiz',
    '1.2 • The print() Command',
    '1.2 • Interactive Coding',
    '1.2 • print() Mastery Quiz',
    '1.3 • Running Your Code',
    '1.3 • Execution Order Quiz'
  ],
  3: [
    '3.1 • Basic Math Operations',
    '3.1 • Math & Precedence Quiz',
    '3.1 • Multiplication & Division',
    '3.1 • Four Operators Coding',
    '3.1 • Algorithm: Midpoint Formula',
    '3.2 • Combining Text (Strings)',
    '3.2 • String Concatenation Code',
    '3.2 • String Concatenation Quiz',
    '3.2 • Algorithm: API URL Builder',
    '3.2 • Math & Strings Final Quiz'
  ],
  4: [
    '2.1 • What Is a Variable?',
    '2.1 • Variable Fundamentals Quiz',
    '2.1 • Creating Variables Code',
    '2.2 • Numbers & Text (Types)',
    '2.2 • Integers vs Strings Quiz',
    '2.2 • Types & Memory Code',
    '2.3 • Changing Variable Values',
    '2.3 • Reassignment Quiz',
    '2.3 • Updating Variables Code',
    '2.3 • Complete Variables Mastery'
  ]
};

export function initSidebarNavigation(currentType) {
  const { lsn, sub, spcl } = getQueryParams();
  const sequence = getAdaptiveSequence();
  const navContainer = document.getElementById('module-nav');
  const lessonIdx = Math.max(0, lsn - 1);
  const baseSequence = [...(sylPy[lessonIdx] || sylPy[0])];

  // Track max visited step
  setMaxVisitedSub(spcl, lsn, sub);
  // Only auto-mark completed for reading/info pages (Type 1 and Type 3)
  // Code exercises (Type 2) and Quizzes (Type 4) require verified completion!
  if (currentType !== 4 && currentType !== 2) {
    markQuizCompleted(spcl, lsn, sub);
  }
  const maxVisited = getMaxVisitedSub(spcl, lsn);

  if (navContainer) {
    navContainer.innerHTML = '';

    const baseModuleNames = currentLang === 'ml'
      ? (MALAYALAM_MODULE_NAMES && MALAYALAM_MODULE_NAMES[lsn] ? MALAYALAM_MODULE_NAMES[lsn] : (Array.isArray(MALAYALAM_MODULE_NAMES) ? MALAYALAM_MODULE_NAMES : []))
      : (ENGLISH_MODULE_NAMES[lsn] || [
          '0.1 • The Dumb Machine',
          '0.1 • Fundamentals Quiz',
          '0.2 • Running Code',
          '0.2 • Debugging Quiz'
        ]);

    sequence.forEach((typeId, index) => {
      const stepNum = index + 1;
      const isCurrent = stepNum === sub;
      let title = '';
      if (index < baseSequence.length) {
        title = baseModuleNames[index] || (currentLang === 'ml' ? `പാഠഭാഗം ${stepNum}` : `Module ${stepNum}`);
      } else {
        const adaptiveOffset = index - baseSequence.length;
        const roundNum = Math.floor(adaptiveOffset / 2) + 1;
        const isQuiz = adaptiveOffset % 2 === 1;
        if (currentLang === 'ml') {
          title = isQuiz 
            ? `AI പുനർപഠന ക്വിസ് ${roundNum > 1 ? `(റൗണ്ട് ${roundNum})` : ''}`.trim()
            : `AI വിശദീകരണം ${roundNum > 1 ? `(റൗണ്ട് ${roundNum})` : ''}`.trim();
        } else {
          title = isQuiz 
            ? `AI Reinforcement Quiz ${roundNum > 1 ? `(Round ${roundNum})` : ''}`.trim()
            : `AI Breakdown ${roundNum > 1 ? `(Round ${roundNum})` : ''}`.trim();
        }
      }

      const targetHtml = `${typeId}.html`;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `nav-item ${isCurrent ? 'active' : ''}`;
      btn.setAttribute('data-sec', stepNum);
      btn.id = `sidebar-nav-item-${stepNum}`;

      // User can visit any step if the lesson was completed previously, or up to max visited step
      const isCompletedLesson = Number(lsn) < Number(currentProgress.lesson_no);
      const isUnlocked = isCompletedLesson || (stepNum <= maxVisited);

      if (!isUnlocked) {
        btn.disabled = true;
        btn.title = 'Complete previous topics to unlock';
      }

      btn.innerHTML = `
        <span class="nav-num">0${stepNum}</span>
        <span class="nav-label">${title}</span>
      `;

      btn.addEventListener('click', () => {
        if (!btn.disabled) {
          window.location.href = `${targetHtml}?spcl=${spcl}&lsn=${lsn}&sub=${stepNum}`;
        }
      });

      navContainer.appendChild(btn);
    });
  }

  // Update Header Progress Bar
  const totalSteps = sequence.length;
  const percent = Math.round((sub / totalSteps) * 100);
  const headerProgressLabel = document.getElementById('header-progress-label');
  const headerProgressBar = document.getElementById('header-progress-bar');
  if (headerProgressLabel) {
    headerProgressLabel.textContent = currentLang === 'ml' ? `പുരോഗതി ${percent}%` : `Progress ${percent}%`;
  }
  if (headerProgressBar) headerProgressBar.style.width = `${percent}%`;

  // Update Footer Info
  const footerLessonInfo = document.getElementById('footer-lesson-info');
  if (footerLessonInfo) {
    footerLessonInfo.textContent = currentLang === 'ml' 
      ? `പാഠം ${lsn}.${sub}: പേജ് ${sub} / ${totalSteps}`
      : `Lesson ${lsn}.${sub}: Page ${sub} of ${totalSteps}`;
  }

  // Setup Next Page Button
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.onclick = async () => {
      const isDone = isQuizCompleted(spcl, lsn, sub);
      if ((currentType === 2 || currentType === 4) && !isDone) {
        return; // Block skipping uncompleted code or quiz
      }

      if (sub < sequence.length) {
        const nextSub = sub + 1;
        setMaxVisitedSub(spcl, lsn, nextSub);
        const nextType = sequence[nextSub - 1];
        window.location.href = `${nextType}.html?spcl=${spcl}&lsn=${lsn}&sub=${nextSub}`;
      } else {
        // Clear lesson mistakes upon mastering the entire adapted sequence and return to Journey
        clearRecordedMistakes(spcl, lsn);
        const nextLessonNo = Math.max(Number(currentProgress.lesson_no) || 1, Number(lsn) + 1);
        currentProgress.lesson_no = nextLessonNo;
        currentProgress.sub_no = 1;
        await safeInvoke('set_user_value', {
          userKey: null,
          lessonNo: nextLessonNo,
          subNo: 1,
          specNo: Number(spcl) || 1
        });
        window.location.href = '../journey.html';
      }
    };
  }

  // Setup Prev Page Button
  const prevBtn = document.querySelector('.nav-prev-btn');
  if (prevBtn) {
    prevBtn.onclick = () => {
      if (sub > 1) {
        const prevSub = sub - 1;
        const prevType = sequence[prevSub - 1];
        window.location.href = `${prevType}.html?spcl=${spcl}&lsn=${lsn}&sub=${prevSub}`;
      } else {
        window.location.href = '../journey.html';
      }
    };
  }

  initLanguageDropup();
  applyLanguageUI();
}

export function applyLanguageUI() {
  if (currentLang === 'ml') {
    const sidebarTitle = document.querySelector('.sidebar-title');
    if (sidebarTitle) sidebarTitle.textContent = MALAYALAM_UI.sidebarTitle;

    const twinBadge = document.querySelector('.twin-badge');
    if (twinBadge) twinBadge.textContent = MALAYALAM_UI.twinBadge;

    const backBtn = document.querySelector('.back-journey-btn');
    if (backBtn) backBtn.textContent = MALAYALAM_UI.backJourney;

    const exitBtn = document.querySelector('.exit-btn');
    if (exitBtn) exitBtn.textContent = MALAYALAM_UI.exitLesson;

    const prevBtn = document.querySelector('.nav-prev-btn');
    if (prevBtn) prevBtn.textContent = MALAYALAM_UI.prevPage;

    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.textContent = MALAYALAM_UI.nextPage;

    const btnRun = document.getElementById('btn-run');
    if (btnRun) btnRun.innerHTML = MALAYALAM_UI.run;

    const btnDebug = document.getElementById('btn-debug');
    if (btnDebug) btnDebug.innerHTML = MALAYALAM_UI.debug;

    const btnStep = document.getElementById('btn-step');
    if (btnStep) btnStep.innerHTML = MALAYALAM_UI.step;

    const btnContinue = document.getElementById('btn-continue');
    if (btnContinue) btnContinue.innerHTML = MALAYALAM_UI.continue;

    const btnReset = document.getElementById('btn-reset');
    if (btnReset) btnReset.innerHTML = MALAYALAM_UI.reset;

    const btnClear = document.getElementById('btn-clear-output');
    if (btnClear) btnClear.textContent = MALAYALAM_UI.clear;

    const taskBadge = document.querySelector('.task-badge');
    if (taskBadge) taskBadge.textContent = MALAYALAM_UI.taskBadge;

    const targetHeader = document.querySelector('.intended-output-header span');
    if (targetHeader) targetHeader.textContent = MALAYALAM_UI.targetOutputHeader;
  } else {
    const sidebarTitle = document.querySelector('.sidebar-title');
    if (sidebarTitle) sidebarTitle.textContent = 'LESSON MODULES';

    const twinBadge = document.querySelector('.twin-badge');
    if (twinBadge) twinBadge.textContent = 'LESSON TWIN';

    const backBtn = document.querySelector('.back-journey-btn');
    if (backBtn) backBtn.textContent = '← Learning Journey';

    const exitBtn = document.querySelector('.exit-btn');
    if (exitBtn) exitBtn.textContent = 'Exit Lesson';

    const prevBtn = document.querySelector('.nav-prev-btn');
    if (prevBtn) prevBtn.textContent = '← Previous Page';

    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.textContent = 'Next Page →';

    const btnRun = document.getElementById('btn-run');
    if (btnRun) btnRun.innerHTML = 'Run';

    const btnDebug = document.getElementById('btn-debug');
    if (btnDebug) btnDebug.innerHTML = 'Debug';

    const btnStep = document.getElementById('btn-step');
    if (btnStep) btnStep.innerHTML = 'Step';

    const btnContinue = document.getElementById('btn-continue');
    if (btnContinue) btnContinue.innerHTML = 'Continue';

    const btnReset = document.getElementById('btn-reset');
    if (btnReset) btnReset.innerHTML = 'Reset';

    const btnClear = document.getElementById('btn-clear-output');
    if (btnClear) btnClear.textContent = 'Clear';

    const taskBadge = document.querySelector('.task-badge');
    if (taskBadge) taskBadge.textContent = 'TASK OBJECTIVE';

    const targetHeader = document.querySelector('.intended-output-header span');
    if (targetHeader) targetHeader.textContent = 'TARGET OUTPUT';
  }
}

export async function fetchLessonJson() {
  const { lsn, sub, spcl } = getQueryParams();
  const sequence = getAdaptiveSequence();
  const adaptiveData = generateAdaptiveContent(sub, sequence.length);

  if (adaptiveData) {
    return adaptiveData;
  }

  const key = `${spcl}_${lsn}_${sub}`;
  if (currentLang === 'ml' && MALAYALAM_LESSON_DATA[key]) {
    return JSON.parse(JSON.stringify(MALAYALAM_LESSON_DATA[key]));
  }

  const filePath = `lesson_data/${spcl}_${lsn}_${sub}.json`;

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.warn(`Could not load ${filePath}, attempting fallback.`, err);
    return null;
  }
}

// Global page initialization
async function initLessonPage() {
  try {
    await loadUserData();
  } catch (err) {
    console.warn('loadUserData error:', err);
  }

  const currentPage = window.location.pathname.split('/').pop() || '1.html';
  const typeId = parseInt(currentPage.replace('.html', ''), 10) || 1;

  initSidebarNavigation(typeId);
  initReferenceReturnBanner();
  const data = await fetchLessonJson();

  if (data) {
    // Populate Topic Pill
    const topicName = document.getElementById('topic-name');
    if (topicName && data.topic) topicName.textContent = data.topic;

    // Type 1 & 3: Populate Content Body
    const content = document.getElementById('content');
    if (content && data.body) {
      content.innerHTML = data.body;
    }

    // Type 2: Populate Code Editor fields
    const taskTitle = document.getElementById('task-title');
    const taskDesc = document.getElementById('task-desc');
    const intendedOutput = document.getElementById('task-intended-output');
    if (taskTitle && data.title) taskTitle.textContent = data.title;
    if (taskDesc && data.description) taskDesc.innerHTML = data.description;
    if (intendedOutput && data.intended_output) intendedOutput.textContent = data.intended_output;

    const codeInput = document.getElementById('code-input');
    if (codeInput && data.starter_code) {
      codeInput.value = data.starter_code;
      codeInput.dispatchEvent(new Event('input'));
    }

    if (typeId === 2) {
      const { lsn, sub, spcl } = getQueryParams();
      const isDone = isQuizCompleted(spcl, lsn, sub);
      const nextBtn = document.getElementById('next-btn');
      if (!isDone && nextBtn) {
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
        nextBtn.style.backgroundColor = '#9CA3AF';
        nextBtn.style.color = '#4B5563';
        nextBtn.textContent = 'Run & Match Output to Continue';
        nextBtn.title = currentLang === 'ml' 
          ? 'കോഡ് പ്രവർത്തിപ്പിച്ച് ലക്ഷ്യമിട്ട ഫലം വരുമ്പോൾ ഇത് അൺലോക്കാകും' 
          : 'Run your code and match the target output to unlock';
      }
    }

    // Type 4: Populate & Setup Multi-Question MCQ
    if (currentPage.includes('4.html') || data.questions || data.question) {
      setupMultiQuestionQuiz(data);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initLessonPage().catch(e => console.error(e));
  });
} else {
  initLessonPage().catch(e => console.error(e));
}

function setupMultiQuestionQuiz(data) {
  const questionEl = document.querySelector('.mcq-question');
  const questions = (data && Array.isArray(data.questions))
    ? data.questions
    : (data && data.question ? [data] : []);

  if (questions.length === 0) {
    if (questionEl) {
      questionEl.textContent = 'Quiz data could not be loaded.';
    }
    return;
  }

  const { spcl, lsn, sub } = getQueryParams();
  const lessonIdx = Math.max(0, lsn - 1);
  const baseLen = (sylPy[lessonIdx] || sylPy[0]).length;
  const isAIQuiz = sub > baseLen && ((sub - baseLen) % 2 === 0);

  const dotsContainer = document.getElementById('question-dots');
  const badge = document.getElementById('mcq-badge');
  const codeBox = document.querySelector('.mcq-code-box');
  const codeEl = document.querySelector('.mcq-code-box pre code');
  const optionsGroup = document.getElementById('options-group');
  const feedbackBox = document.getElementById('quiz-feedback');
  const prevQBtn = document.getElementById('prev-question-btn');
  const nextQBtn = document.getElementById('next-question-btn');
  const nextBtn = document.getElementById('next-btn');

  const alreadyDone = isQuizCompleted(spcl, lsn, sub);

  // Load existing quiz state if present
  let quizState = getQuizState(spcl, lsn, sub);
  if (!quizState) {
    quizState = {
      completed: alreadyDone,
      currentQuestionIdx: 0,
      answers: {}
    };
  }
  if (alreadyDone) {
    quizState.completed = true;
  }

  const cleanExplanation = (text) => {
    if (!text) return '';
    return text
      .replace(/<strong[^>]*>.*?<\/strong>\s*(<br\s*\/?>)?/gi, '')
      .replace(/^([]|EXCELLENT!|Not quite!|SPOT ON!|\s)+/gi, '')
      .trim();
  };

  function normalizeQuestionOptions(q) {
    if (!q.options || !Array.isArray(q.options)) return [];
    return q.options.map((opt, optIdx) => {
      if (typeof opt === 'string') {
        const isCorrect = (q.correct_answer ? opt === q.correct_answer : optIdx === 0);
        return { text: opt, correct: isCorrect };
      } else if (opt && typeof opt === 'object') {
        return {
          text: opt.text || opt.label || String(opt),
          correct: opt.correct === true
        };
      }
      return { text: String(opt), correct: false };
    });
  }

  // If completed but answers were not tracked individually, pre-populate with default review data
  if (quizState.completed) {
    questions.forEach((q, i) => {
      if (!quizState.answers[i]) {
        const normOpts = normalizeQuestionOptions(q);
        const correctOpt = normOpts.find(o => o.correct) || normOpts[0];
        quizState.answers[i] = {
          questionIdx: i,
          shuffledOptions: normOpts,
          selectedOptionText: correctOpt ? correctOpt.text : '',
          isCorrect: true,
          explCorrect: cleanExplanation(q.explanation_correct) || q.explanation_correct || '',
          explIncorrect: cleanExplanation(q.explanation_incorrect) || q.explanation_incorrect || ''
        };
      }
    });
  }

  let currentQuestionIdx = quizState.currentQuestionIdx || 0;
  if (currentQuestionIdx >= questions.length) currentQuestionIdx = 0;

  const sessionMistakes = [];

  // Footer Next Page button state
  if (nextBtn) {
    if (quizState.completed || alreadyDone) {
      nextBtn.disabled = false;
      nextBtn.style.background = 'var(--neo-green)';
      nextBtn.style.color = 'var(--neo-black)';
      nextBtn.textContent = 'Next Page →';
    } else {
      nextBtn.disabled = true;
      nextBtn.style.background = '#9CA3AF';
      nextBtn.style.color = '#4B5563';
      nextBtn.textContent = 'Complete Quiz to Continue';
    }
  }

  // Render question indicator dots with click support for exploration
  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = questions.map((_, i) => {
      const ans = quizState.answers && quizState.answers[i];
      let statusClass = '';
      if (ans) {
        statusClass = ans.isCorrect ? 'completed-correct' : 'completed-incorrect';
      } else if (quizState.completed || alreadyDone) {
        statusClass = 'completed-correct';
      }
      const activeClass = (i === currentQuestionIdx) ? 'active' : '';
      return `<span class="q-dot ${activeClass} ${statusClass}" id="q-dot-${i}" title="Question ${i + 1}"></span>`;
    }).join('');

    questions.forEach((_, i) => {
      const dot = document.getElementById(`q-dot-${i}`);
      if (dot) {
        dot.onclick = () => {
          const ans = quizState.answers && quizState.answers[i];
          const answeredCount = Object.keys(quizState.answers || {}).length;
          if (quizState.completed || alreadyDone || ans || i <= answeredCount) {
            currentQuestionIdx = i;
            quizState.currentQuestionIdx = currentQuestionIdx;
            saveQuizState(spcl, lsn, sub, quizState);
            renderQuestion(currentQuestionIdx);
          }
        };
      }
    });
  }

  renderDots();

  function renderQuestion(idx) {
    const q = questions[idx];
    if (!q) return;

    currentQuestionIdx = idx;
    renderDots();

    // Update Badge & Header
    if (badge) {
      if (quizState.completed) {
        badge.textContent = `QUIZ REVIEW • QUESTION ${idx + 1} OF ${questions.length}`;
      } else {
        badge.textContent = q.badge || `QUESTION ${idx + 1} OF ${questions.length}`;
      }
    }

    // Update Question Text
    if (questionEl && q.question) {
      questionEl.textContent = q.question;
    }

    // Update Code Box
    if (codeBox && codeEl) {
      if (q.code && q.code.trim()) {
        codeBox.style.display = 'block';
        codeEl.textContent = q.code;
      } else {
        codeBox.style.display = 'none';
      }
    }

    // Clear Feedback & Action Buttons
    if (feedbackBox) {
      feedbackBox.style.display = 'none';
      feedbackBox.className = 'mcq-feedback-box';
      feedbackBox.innerHTML = '';
    }
    if (prevQBtn) {
      prevQBtn.style.display = (idx > 0) ? 'inline-flex' : 'none';
    }
    if (nextQBtn) {
      nextQBtn.style.display = 'none';
    }

    const defaultPrefixes = ['A', 'B', 'C', 'D', 'E', 'F'];
    const explCorrect = cleanExplanation(q.explanation_correct) || q.explanation_correct || '';
    const explIncorrect = cleanExplanation(q.explanation_incorrect) || q.explanation_incorrect || '';

    const existingAns = quizState.answers && quizState.answers[idx];

    // ============================================================
    // MODE 1: QUESTION ALREADY ANSWERED OR IN REVIEW MODE
    // ============================================================
    if (existingAns) {
      const optsToRender = existingAns.shuffledOptions && existingAns.shuffledOptions.length > 0
        ? existingAns.shuffledOptions
        : normalizeQuestionOptions(q);

      if (optionsGroup) {
        optionsGroup.innerHTML = optsToRender.map((opt, optIdx) => {
          const prefix = defaultPrefixes[optIdx] || String.fromCharCode(65 + optIdx);
          const isSelected = (opt.text === existingAns.selectedOptionText);
          let extraClass = 'review-mode';
          if (isSelected) {
            extraClass += existingAns.isCorrect ? ' selected-correct' : ' selected-incorrect';
          } else if (opt.correct) {
            extraClass += ' correct-highlight';
          }

          return `
            <button type="button" class="mcq-option-btn ${extraClass}" data-correct="${opt.correct}" data-text="${opt.text}">
              <span class="mcq-opt-prefix">${prefix}</span>
              <span>${opt.text}</span>
            </button>
          `;
        }).join('');

        // Allow clicking options to explore why each option was right/wrong
        const optionBtns = optionsGroup.querySelectorAll('.mcq-option-btn');
        optionBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const isBtnCorrect = btn.getAttribute('data-correct') === 'true';
            const btnText = btn.getAttribute('data-text');
            if (feedbackBox) {
              feedbackBox.style.display = 'block';
              if (isBtnCorrect) {
                feedbackBox.className = 'mcq-feedback-box correct';
                feedbackBox.innerHTML = `
                  <div style="font-weight: 900; margin-bottom: 4px;">CORRECT OPTION: "${btnText}"</div>
                  <div>${explCorrect}</div>
                `;
              } else {
                feedbackBox.className = 'mcq-feedback-box incorrect';
                feedbackBox.innerHTML = `
                  <div style="font-weight: 900; margin-bottom: 4px;">INCORRECT OPTION: "${btnText}"</div>
                  ${explIncorrect ? `<div style="margin-bottom: 6px;">${explIncorrect}</div>` : ''}
                  ${explCorrect ? `
                    <div style="background: rgba(255, 255, 255, 0.2); padding: 8px 12px; border: 2px solid var(--neo-black); border-radius: 4px; margin-top: 6px;">
                      <div style="font-weight: 800; margin-bottom: 4px;">Correct Answer Explanation:</div>
                      <div>${explCorrect}</div>
                    </div>
                  ` : ''}
                `;
              }
            }
          });
        });
      }

      // Display default feedback for this answered question
      if (feedbackBox) {
        feedbackBox.style.display = 'block';
        if (existingAns.isCorrect) {
          feedbackBox.className = 'mcq-feedback-box correct';
          feedbackBox.innerHTML = `
            <div style="font-weight: 900; margin-bottom: 4px;">YOUR ANSWER: CORRECT</div>
            <div>${explCorrect}</div>
          `;
        } else {
          feedbackBox.className = 'mcq-feedback-box incorrect';
          feedbackBox.innerHTML = `
            <div style="font-weight: 900; margin-bottom: 4px;">YOUR ANSWER: WRONG</div>
            ${explIncorrect ? `<div style="margin-bottom: 6px;">${explIncorrect}</div>` : ''}
            ${explCorrect ? `
              <div style="background: rgba(255, 255, 255, 0.2); padding: 8px 12px; border: 2px solid var(--neo-black); border-radius: 4px; margin-top: 6px;">
                <div style="font-weight: 800; margin-bottom: 4px;">Correct Answer Explanation:</div>
                <div>${explCorrect}</div>
              </div>
            ` : ''}
          `;
        }
      }

      if (idx < questions.length - 1 && nextQBtn) {
        nextQBtn.style.display = 'inline-flex';
        nextQBtn.textContent = 'Next Question →';
      }
      return;
    }

    // ============================================================
    // MODE 2: ACTIVE UNANSWERED QUESTION
    // ============================================================
    const normalizedOptions = normalizeQuestionOptions(q);
    const shuffledOptions = [...normalizedOptions];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }

    if (optionsGroup) {
      optionsGroup.innerHTML = shuffledOptions.map((opt, optIdx) => {
        const prefix = defaultPrefixes[optIdx] || String.fromCharCode(65 + optIdx);
        return `
          <button type="button" class="mcq-option-btn" data-correct="${opt.correct}">
            <span class="mcq-opt-prefix">${prefix}</span>
            <span>${opt.text}</span>
          </button>
        `;
      }).join('');

      const optionBtns = optionsGroup.querySelectorAll('.mcq-option-btn');
      optionBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
          const isCorrect = btn.getAttribute('data-correct') === 'true';
          const chosenText = btn.querySelector('span:last-child')?.textContent || '';
          const correctBtn = Array.from(optionBtns).find(b => b.getAttribute('data-correct') === 'true');
          const correctText = correctBtn ? (correctBtn.querySelector('span:last-child')?.textContent || '') : '';

          // Lock buttons
          optionBtns.forEach(b => {
            b.disabled = true;
            b.style.cursor = 'default';
          });

          // Save answer in state
          quizState.answers[idx] = {
            questionIdx: idx,
            shuffledOptions,
            selectedOptionText: chosenText,
            isCorrect,
            explCorrect,
            explIncorrect
          };
          saveQuizState(spcl, lsn, sub, quizState);

          renderDots();

          if (isCorrect) {
            btn.classList.add('selected-correct');
            if (feedbackBox) {
              feedbackBox.style.display = 'block';
              feedbackBox.className = 'mcq-feedback-box correct';
              feedbackBox.innerHTML = `
                <div style="font-weight: 900; margin-bottom: 4px;">CORRECT</div>
                <div>${explCorrect}</div>
              `;
            }
          } else {
            btn.classList.add('selected-incorrect');
            if (correctBtn) {
              correctBtn.classList.add('correct-highlight');
            }

            const mistakeItem = {
              spcl,
              lsn,
              sub,
              topic: data.topic || 'Python Fundamentals',
              title: data.title || `Lesson ${lsn}.${sub}`,
              question: q.question,
              code: q.code || '',
              student_answer: chosenText,
              correct_answer: correctText,
              explanation: explCorrect
            };
            sessionMistakes.push(mistakeItem);
            recordMistake(mistakeItem);

            if (feedbackBox) {
              feedbackBox.style.display = 'block';
              feedbackBox.className = 'mcq-feedback-box incorrect';
              feedbackBox.innerHTML = `
                <div style="font-weight: 900; margin-bottom: 4px;">WRONG</div>
                ${explIncorrect ? `<div style="margin-bottom: 6px;">${explIncorrect}</div>` : ''}
                ${explCorrect ? `
                  <div style="background: rgba(255, 255, 255, 0.2); padding: 8px 12px; border: 2px solid var(--neo-black); border-radius: 4px; margin-top: 6px;">
                    <div style="font-weight: 800; margin-bottom: 4px;">Correct Answer Explanation:</div>
                    <div>${explCorrect}</div>
                  </div>
                ` : ''}
              `;
            }
          }

          if (idx < questions.length - 1) {
            if (nextQBtn) {
              nextQBtn.style.display = 'inline-flex';
              nextQBtn.textContent = `Next Question (${idx + 2}/${questions.length}) →`;
            }
          } else {
            // Completed all questions in the quiz!
            quizState.completed = true;
            saveQuizState(spcl, lsn, sub, quizState);

            if (isAIQuiz) {
              const currentRound = Math.floor((sub - baseLen) / 2);
              const nextRound = currentRound + 1;
              if (sessionMistakes.length > 0) {
                saveAiBreakdown(spcl, lsn, nextRound, sessionMistakes);
                setRecordedMistakes(spcl, lsn, sessionMistakes);
                markQuizCompleted(spcl, lsn, sub);
                setMaxVisitedSub(spcl, lsn, sub + 1);

                if (feedbackBox) {
                  feedbackBox.innerHTML += `
                    <div style="margin-top: 12px; padding: 12px 14px; background: #fef08a; border: 2px solid var(--neo-black); border-radius: 4px; font-weight: 800; color: #111111;">
                      You missed ${sessionMistakes.length} question${sessionMistakes.length > 1 ? 's' : ''}. An updated AI breakdown has been generated for these topics. Click <strong>Review Breakdown →</strong> to continue.
                    </div>
                  `;
                }
                if (nextBtn) {
                  nextBtn.disabled = false;
                  nextBtn.style.background = 'var(--neo-yellow)';
                  nextBtn.style.color = 'var(--neo-black)';
                  nextBtn.textContent = 'Review Breakdown →';
                  nextBtn.onclick = () => {
                    window.location.href = `3.html?spcl=${spcl}&lsn=${lsn}&sub=${sub + 1}`;
                  };
                }
              } else {
                clearRecordedMistakes(spcl, lsn);
                markQuizCompleted(spcl, lsn, sub);
                setMaxVisitedSub(spcl, lsn, sub + 1);

                const nextLessonNo = Math.max(Number(currentProgress.lesson_no) || 1, Number(lsn) + 1);
                currentProgress.lesson_no = nextLessonNo;
                currentProgress.sub_no = 1;
                await safeInvoke('set_user_value', {
                  userKey: null,
                  lessonNo: nextLessonNo,
                  subNo: 1,
                  specNo: Number(spcl) || 1
                });

                if (feedbackBox) {
                  feedbackBox.innerHTML += `
                    <div style="margin-top: 12px; padding: 12px 14px; background: #86efac; border: 2px solid var(--neo-black); border-radius: 4px; font-weight: 900; color: #111111;">
                      Perfect score! You have mastered all concepts for this lesson!
                    </div>
                  `;
                }
                if (nextBtn) {
                  nextBtn.disabled = false;
                  nextBtn.style.background = 'var(--neo-green)';
                  nextBtn.style.color = 'var(--neo-black)';
                  nextBtn.textContent = 'Finish Lesson →';
                  nextBtn.onclick = () => {
                    window.location.href = '../journey.html';
                  };
                }
              }
            } else {
              markQuizCompleted(spcl, lsn, sub);
              const currentMistakes = getRecordedMistakes(spcl, lsn);
              const isLastBaseStep = (sub === baseLen);

              if (isLastBaseStep && currentMistakes.length === 0) {
                setMaxVisitedSub(spcl, lsn, sub + 1);
                const nextLessonNo = Math.max(Number(currentProgress.lesson_no) || 1, Number(lsn) + 1);
                currentProgress.lesson_no = nextLessonNo;
                currentProgress.sub_no = 1;
                await safeInvoke('set_user_value', {
                  userKey: null,
                  lessonNo: nextLessonNo,
                  subNo: 1,
                  specNo: Number(spcl) || 1
                });

                if (feedbackBox) {
                  feedbackBox.innerHTML += '<div style="margin-top: 10px; font-weight: 900; color: #111111;">Lesson completed with 100% accuracy! Click Next Topic below to continue.</div>';
                }
                if (nextBtn) {
                  nextBtn.disabled = false;
                  nextBtn.style.background = 'var(--neo-green)';
                  nextBtn.style.color = 'var(--neo-black)';
                  nextBtn.textContent = 'Next Topic →';
                  nextBtn.onclick = () => {
                    window.location.href = '../journey.html';
                  };
                }
              } else if (isLastBaseStep && currentMistakes.length > 0) {
                saveAiBreakdown(spcl, lsn, 1, currentMistakes);
                setMaxVisitedSub(spcl, lsn, sub + 1);
                if (feedbackBox) {
                  feedbackBox.innerHTML += `
                    <div style="margin-top: 12px; padding: 12px 14px; background: #fef08a; border: 2px solid var(--neo-black); border-radius: 4px; font-weight: 800; color: #111111;">
                      You had ${currentMistakes.length} question${currentMistakes.length > 1 ? 's' : ''}. An AI breakdown has been prepared to help you master them. Click <strong>Review Breakdown →</strong> to continue.
                    </div>
                  `;
                }
                if (nextBtn) {
                  nextBtn.disabled = false;
                  nextBtn.style.background = 'var(--neo-yellow)';
                  nextBtn.style.color = 'var(--neo-black)';
                  nextBtn.textContent = 'Review Breakdown →';
                  nextBtn.onclick = () => {
                    window.location.href = `3.html?spcl=${spcl}&lsn=${lsn}&sub=${sub + 1}`;
                  };
                }
              } else {
                setMaxVisitedSub(spcl, lsn, sub + 1);
                if (feedbackBox) {
                  feedbackBox.innerHTML += '<div style="margin-top: 10px; font-weight: 900;">Quiz finished! Click Next Page below to continue.</div>';
                }
                if (nextBtn) {
                  nextBtn.disabled = false;
                  nextBtn.style.background = 'var(--neo-green)';
                  nextBtn.style.color = 'var(--neo-black)';
                  nextBtn.textContent = 'Next Page →';
                  nextBtn.onclick = () => {
                    const seq = getAdaptiveSequence();
                    const nextSub = sub + 1;
                    const nextType = seq[nextSub - 1];
                    window.location.href = `${nextType}.html?spcl=${spcl}&lsn=${lsn}&sub=${nextSub}`;
                  };
                }
              }
            }
          }
        });
      });
    }
  }

  // Previous Question Button handler
  if (prevQBtn) {
    prevQBtn.onclick = () => {
      if (currentQuestionIdx > 0) {
        currentQuestionIdx--;
        quizState.currentQuestionIdx = currentQuestionIdx;
        saveQuizState(spcl, lsn, sub, quizState);
        renderQuestion(currentQuestionIdx);
      }
    };
  }

  // Next Question Button handler
  if (nextQBtn) {
    nextQBtn.onclick = () => {
      if (currentQuestionIdx < questions.length - 1) {
        currentQuestionIdx++;
        quizState.currentQuestionIdx = currentQuestionIdx;
        saveQuizState(spcl, lsn, sub, quizState);
        renderQuestion(currentQuestionIdx);
      }
    };
  }

  // Initial question render
  renderQuestion(currentQuestionIdx);
}