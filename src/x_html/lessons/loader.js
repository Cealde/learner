// ============================================================
// DYNAMIC SYLLABUS ROUTER & JSON DATA LOADER (loader.js)
// ============================================================

// 1 = Intro (1.html), 2 = Code/Debug (2.html), 3 = General Info (3.html), 4 = MCQ (4.html)
export const sylPy = [
  [1, 4, 2, 3, 4], // Lesson 1 Sequence (0.1 Intro -> 0.1 Quiz -> 0.2 Code Task -> 0.3 Running Code -> 0.3 Debugging Quiz)
  [2, 3, 4],       // Lesson 2 Sequence
  [1, 2, 3, 4],    // Lesson 3 Sequence
  [1, 2, 4]        // Lesson 4 Sequence
];

export const LANGUAGES = [
  { code: 'en', name: 'English (US)', flag: '🇺🇸' },
  { code: 'es', name: 'Español (ES)', flag: '🇪🇸' },
  { code: 'ja', name: '日本語 (JA)', flag: '🇯🇵' }
];

let currentLang = 'en';

export function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const lsn = parseInt(params.get('lsn') || '1', 10);
  const sub = parseInt(params.get('sub') || '1', 10);
  const spcl = params.get('spcl') || '1';
  return { lsn, sub, spcl };
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
            <span>${lang.flag} ${lang.name}</span>
            ${lang.code === currentLang ? '<span>✓</span>' : ''}
          </button>
        `).join('')}
      </div>
      <button type="button" id="lang-dropup-btn" class="lang-dropup-btn">
        <span>🌐 <span id="current-lang-text">${activeLangObj.name}</span></span>
        <span>▴</span>
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
        menu.classList.remove('open');
        initLanguageDropup();
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
  lesson_mistakes: {}
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
          lesson_mistakes: (prog.lesson_mistakes && typeof prog.lesson_mistakes === 'object') ? prog.lesson_mistakes : {}
        };
      }
    } catch (err) {
      console.warn('Failed to load user progress from backend:', err);
    }
  } else {
    try {
      const raw = localStorage.getItem('adhicode_user_progress');
      if (raw) currentProgress = JSON.parse(raw);
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

export function getAdaptiveSequence() {
  const { lsn, spcl, sub } = getQueryParams();
  const lessonIdx = Math.max(0, lsn - 1);
  const baseSequence = [...(sylPy[lessonIdx] || sylPy[0])];
  const mistakes = getRecordedMistakes(spcl, lsn);

  // If no mistakes are recorded, ONLY return the standard base lesson modules (Left bar won't show breakdown/quiz)
  if (mistakes.length === 0) {
    return baseSequence;
  }

  // If mistakes exist, calculate how many adaptive remediation pairs are needed
  const maxVisited = getMaxVisitedSub(spcl, lsn);
  const highestStep = Math.max(maxVisited, sub || 1);
  const adaptiveSteps = Math.max(2, highestStep - baseSequence.length);
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
          code: "score = 100\n# [Breakpoint placed here]\nprint(score)",
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
          code: "for item in cart:\n    total += item.price\n# Step line-by-line",
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
  const mistakes = getRecordedMistakes(spcl, lsn);

  if (sub <= baseLen) return null;
  if (mistakes.length === 0) return null;

  const adaptiveOffset = sub - baseLen; // 1 = Breakdown R1, 2 = Quiz R1, 3 = Breakdown R2, 4 = Quiz R2...
  const roundNum = Math.floor((adaptiveOffset - 1) / 2) + 1;
  const isQuiz = (adaptiveOffset % 2 === 0);

  const activeConcepts = analyzeMistakeConcepts(mistakes);
  if (activeConcepts.length === 0) return null;

  if (!isQuiz) {
    // Step 1: Breakdown View (3.html)
    const conceptCardsHtml = activeConcepts.map(cg => {
      const reviewedItems = cg.mistakes.map(m => `
        <div style="font-size: 13px; font-weight: 600; color: #111111; margin-bottom: 8px; line-height: 1.4;">
          • <strong>Question:</strong> ${m.question}<br/>
          <span style="color: #b91c1c; font-weight: 700;">Earlier Choice:</span> "${m.student_answer || 'Incorrect Option'}" → 
          <span style="color: #15803d; font-weight: 700;">Correct Principle:</span> ${m.explanation || 'Follow precise machine rules.'}
        </div>
      `).join('');

      return `
        <div style="background: ${cg.color}; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 22px; margin-bottom: 18px;">
          <span style="display: inline-block; background-color: #ffffff; color: #111111; border: 2px solid #111111; box-shadow: 2px 2px 0px #111111; padding: 2px 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;">
            ${cg.badge}
          </span>
          <h2 style="font-family: 'Title', 'Body', sans-serif; font-size: 20px; font-weight: 900; color: #111111; margin: 0 0 10px 0; text-transform: uppercase;">
            ${cg.title}
          </h2>
          <p style="font-size: 15px; font-weight: 600; color: #111111; margin: 0 0 12px 0; line-height: 1.5;">
            ${cg.takeaway}
          </p>

          <div style="background: #0d1117; border: 2px solid #111111; box-shadow: 3px 3px 0 #111111; padding: 10px 14px; font-family: 'Consolas', monospace; color: #f0f6fc; font-size: 13px; border-radius: 4px; margin-bottom: 12px; white-space: pre-wrap;">${cg.sampleCode}</div>

          <div style="background: rgba(255, 255, 255, 0.85); border: 2px solid #111111; border-radius: 4px; padding: 12px 14px;">
            <div style="font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; color: #374151; margin-bottom: 6px;">
              📝 Triggered Review Points (${cg.mistakes.length} item${cg.mistakes.length > 1 ? 's' : ''}):
            </div>
            ${reviewedItems}
          </div>
        </div>
      `;
    }).join('');

    return {
      topic: 'AI ADAPTIVE REINFORCEMENT',
      title: `Personalized Review: Tricky Concept Breakdown${roundNum > 1 ? ` (Round ${roundNum})` : ''}`,
      body: `
        <div style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
          <div style="text-align: center; margin-bottom: 4px; width: 100%;">
            <div style="display: inline-block; background-color: #2563EB; color: #FFFFFF; border: 3px solid #111111; box-shadow: 4px 4px 0px #111111; padding: 4px 14px; margin-bottom: 10px; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
              🧠 AI Breakdown ${roundNum > 1 ? `• Round ${roundNum}` : ''}
            </div>
            <h1 style="font-family: 'Title', 'Body', sans-serif; font-size: 28px; font-weight: 900; color: #111111; margin: 0 0 8px 0; text-transform: uppercase;">
              Mastering Your <hlt>Tricky Concepts</hlt>
            </h1>
            <p style="font-size: 15px; font-weight: 600; color: #222222; margin: 0 auto; max-width: 620px;">
              We synthesized your latest quiz responses into ${activeConcepts.length} focused concept pillar${activeConcepts.length > 1 ? 's' : ''} to solidify your understanding.
            </p>
          </div>

          ${conceptCardsHtml}

          <div style="background-color: #c4b5fd; border: 3px solid #111111; box-shadow: 6px 6px 0px #111111; border-radius: 4px; padding: 16px 20px; text-align: center;">
            <p style="font-size: 15px; font-weight: 900; color: #111111; margin: 0; text-transform: uppercase;">
              Ready to test your understanding? Click <hlt>Next Page →</hlt> for your targeted reinforcement check!
            </p>
          </div>
        </div>
      `
    };
  } else {
    // Step 2: Reinforcement Quiz View (4.html)
    const generatedQuestions = activeConcepts.map((cg, qIdx) => {
      const qObj = cg.getQuestionForRound(roundNum);
      return {
        badge: `AI REINFORCEMENT QUIZ • QUESTION ${qIdx + 1} OF ${activeConcepts.length}`,
        question: qObj.question,
        code: qObj.code,
        options: qObj.options,
        explanation_correct: qObj.explanation_correct,
        explanation_incorrect: qObj.explanation_incorrect
      };
    });

    return {
      topic: 'AI ADAPTIVE PRACTICE',
      title: `Targeted Reinforcement Quiz${roundNum > 1 ? ` (Round ${roundNum})` : ''}`,
      questions: generatedQuestions
    };
  }
}

export function initSidebarNavigation(currentType) {
  const { lsn, sub, spcl } = getQueryParams();
  const sequence = getAdaptiveSequence();
  const navContainer = document.getElementById('module-nav');
  const lessonIdx = Math.max(0, lsn - 1);
  const baseSequence = [...(sylPy[lessonIdx] || sylPy[0])];

  // Track max visited step
  setMaxVisitedSub(spcl, lsn, sub);
  if (currentType !== 4 && currentType !== 2) {
    markQuizCompleted(spcl, lsn, sub);
  }
  const maxVisited = getMaxVisitedSub(spcl, lsn);

  if (navContainer) {
    navContainer.innerHTML = '';

    const baseModuleNames = [
      '0.1 • The Dumb Machine',
      '0.1 • Fundamentals Quiz',
      '0.2 • Python Coding Task',
      '0.3 • Running Code',
      '0.3 • Debugging Quiz'
    ];

    sequence.forEach((typeId, index) => {
      const stepNum = index + 1;
      const isCurrent = stepNum === sub;
      let title = '';
      if (index < baseSequence.length) {
        title = baseModuleNames[index] || `Module ${stepNum}`;
      } else {
        const adaptiveOffset = index - baseSequence.length;
        const roundNum = Math.floor(adaptiveOffset / 2) + 1;
        const isQuiz = adaptiveOffset % 2 === 1;
        title = isQuiz 
          ? `AI Reinforcement Quiz ${roundNum > 1 ? `(Round ${roundNum})` : ''}`.trim()
          : `AI Breakdown ${roundNum > 1 ? `(Round ${roundNum})` : ''}`.trim();
      }

      const targetHtml = `${typeId}.html`;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `nav-item ${isCurrent ? 'active' : ''}`;
      btn.setAttribute('data-sec', stepNum);
      btn.id = `sidebar-nav-item-${stepNum}`;

      // User can visit any step up to their max unlocked / visited step
      const isUnlocked = stepNum <= maxVisited;

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
  if (headerProgressLabel) headerProgressLabel.textContent = `Progress ${percent}%`;
  if (headerProgressBar) headerProgressBar.style.width = `${percent}%`;

  // Update Footer Info
  const footerLessonInfo = document.getElementById('footer-lesson-info');
  if (footerLessonInfo) {
    footerLessonInfo.textContent = `Lesson ${lsn}.${sub}: Page ${sub} of ${totalSteps}`;
  }

  // Setup Next Page Button
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.onclick = async () => {
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
}

export async function fetchLessonJson() {
  const { lsn, sub, spcl } = getQueryParams();
  const sequence = getAdaptiveSequence();
  const adaptiveData = generateAdaptiveContent(sub, sequence.length);

  if (adaptiveData) {
    return adaptiveData;
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
        nextBtn.title = 'Run your code and match the target output to unlock';
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

  let currentQuestionIdx = 0;
  const sessionMistakes = [];
  const dotsContainer = document.getElementById('question-dots');
  const badge = document.getElementById('mcq-badge');
  const codeBox = document.querySelector('.mcq-code-box');
  const codeEl = document.querySelector('.mcq-code-box pre code');
  const optionsGroup = document.getElementById('options-group');
  const feedbackBox = document.getElementById('quiz-feedback');
  const nextQBtn = document.getElementById('next-question-btn');
  const nextBtn = document.getElementById('next-btn');
  const { spcl, lsn, sub } = getQueryParams();
  const lessonIdx = Math.max(0, lsn - 1);
  const baseLen = (sylPy[lessonIdx] || sylPy[0]).length;
  const isAIQuiz = sub > baseLen && ((sub - baseLen) % 2 === 0);

  const alreadyDone = isQuizCompleted(spcl, lsn, sub);

  // If already done previously, allow Next Page immediately; otherwise lock until completed
  if (nextBtn) {
    if (alreadyDone) {
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

  // Render question indicator dots
  if (dotsContainer) {
    dotsContainer.innerHTML = questions.map((_, i) => `
      <span class="q-dot ${i === 0 ? 'active' : ''} ${alreadyDone ? 'completed' : ''}" id="q-dot-${i}"></span>
    `).join('');
  }

  function renderQuestion(idx) {
    const q = questions[idx];
    if (!q) return;

    // Update Dots
    questions.forEach((_, i) => {
      const dot = document.getElementById(`q-dot-${i}`);
      if (dot) {
        dot.classList.remove('active');
        if (i === idx) dot.classList.add('active');
      }
    });

    // Update Badge & Header
    if (badge) {
      badge.textContent = q.badge || `QUESTION ${idx + 1} OF ${questions.length}`;
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

    // Clear Feedback & Next Question Button
    if (feedbackBox) {
      feedbackBox.style.display = 'none';
      feedbackBox.className = 'mcq-feedback-box';
      feedbackBox.innerHTML = '';
    }
    if (nextQBtn) {
      nextQBtn.style.display = 'none';
    }

    // Render Options (with randomized position)
    if (optionsGroup && q.options && Array.isArray(q.options)) {
      // Fisher-Yates shuffle on a cloned copy of options
      const shuffledOptions = [...q.options];
      for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
      }

      const defaultPrefixes = ['A', 'B', 'C', 'D', 'E', 'F'];

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

          // Lock all option buttons immediately so user cannot retry
          optionBtns.forEach(b => {
            b.disabled = true;
            b.style.cursor = 'default';
          });

          const currentDot = document.getElementById(`q-dot-${idx}`);
          if (currentDot) {
            currentDot.classList.add('completed');
            if (!isCorrect) {
              currentDot.style.background = 'var(--neo-red)';
            }
          }

          // Find the correct option button to highlight it
          const correctBtn = Array.from(optionBtns).find(b => b.getAttribute('data-correct') === 'true');

          // Clean up explanation text (strip out legacy emoji badges / fluff if present in JSON)
          const cleanExplanation = (text) => {
            if (!text) return '';
            return text
              .replace(/<strong[^>]*>.*?<\/strong>\s*(<br\s*\/?>)?/gi, '')
              .replace(/^([✅❌🎯💡]|EXCELLENT!|Not quite!|SPOT ON!|\s)+/gi, '')
              .trim();
          };

          const explCorrect = cleanExplanation(q.explanation_correct) || q.explanation_correct || '';
          const explIncorrect = cleanExplanation(q.explanation_incorrect) || q.explanation_incorrect || '';

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
              correctBtn.classList.add('selected-correct');
            }

            // Record mistake into local learner intelligence log and track for this session
            const chosenText = btn.querySelector('span:last-child')?.textContent || '';
            const correctText = correctBtn ? (correctBtn.querySelector('span:last-child')?.textContent || '') : '';
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

          // In both cases, enable progression to the next question or next page
          if (idx < questions.length - 1) {
            if (nextQBtn) {
              nextQBtn.style.display = 'inline-flex';
              nextQBtn.textContent = `Next Question (${idx + 2}/${questions.length}) ➔`;
            }
          } else {
            // Completed all questions in the quiz!
            if (isAIQuiz) {
              if (sessionMistakes.length > 0) {
                // Made mistakes in this AI quiz round! Update mistake log for next round and advance
                setRecordedMistakes(spcl, lsn, sessionMistakes);
                markQuizCompleted(spcl, lsn, sub);
                setMaxVisitedSub(spcl, lsn, sub + 1);

                if (feedbackBox) {
                  feedbackBox.innerHTML += `
                    <div style="margin-top: 12px; padding: 12px 14px; background: #fef08a; border: 2px solid var(--neo-black); border-radius: 4px; font-weight: 800; color: #111111;">
                      ⚠️ You missed ${sessionMistakes.length} question${sessionMistakes.length > 1 ? 's' : ''}. An updated AI breakdown has been generated for these topics. Click <strong>Review Breakdown →</strong> to continue.
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
                // 100% correct! Complete mastery achieved
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
                      🎉 Perfect score! You have mastered all tricky concepts for this lesson!
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
              // Base lesson quiz (e.g., sub=2 or sub=4)
              markQuizCompleted(spcl, lsn, sub);
              const currentMistakes = getRecordedMistakes(spcl, lsn);
              const isLastBaseStep = (sub === baseLen);

              if (isLastBaseStep && currentMistakes.length === 0) {
                // User completed entire base lesson without any mistakes! Move on to next topic
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
                  feedbackBox.innerHTML += '<div style="margin-top: 10px; font-weight: 900; color: #111111;">🎉 Lesson completed with 100% accuracy! Click Next Topic below to continue.</div>';
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
                // User made mistakes during the lesson -> unlock AI breakdown
                setMaxVisitedSub(spcl, lsn, sub + 1);
                if (feedbackBox) {
                  feedbackBox.innerHTML += `
                    <div style="margin-top: 12px; padding: 12px 14px; background: #fef08a; border: 2px solid var(--neo-black); border-radius: 4px; font-weight: 800; color: #111111;">
                      ⚠️ You had ${currentMistakes.length} tricky question${currentMistakes.length > 1 ? 's' : ''}. An AI breakdown has been prepared to help you master them. Click <strong>Review Breakdown →</strong> to continue.
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
                // Intermediate base quiz (e.g. sub=2)
                setMaxVisitedSub(spcl, lsn, sub + 1);
                if (feedbackBox) {
                  feedbackBox.innerHTML += '<div style="margin-top: 10px; font-weight: 900;">🎉 Quiz finished! Click Next Page below to continue.</div>';
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

  // Next Question Button handler
  if (nextQBtn) {
    nextQBtn.onclick = () => {
      if (currentQuestionIdx < questions.length - 1) {
        currentQuestionIdx++;
        renderQuestion(currentQuestionIdx);
      }
    };
  }

  // Initial question render
  renderQuestion(currentQuestionIdx);
}