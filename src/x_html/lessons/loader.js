async function loadTextFile(filePath) {
  const container = document.getElementById('content');
  if (!container) return;

  try {
    const response = await fetch(filePath);
    let rawText = '';
    if (response.ok) {
      rawText = await response.text();
    }

    if (rawText && rawText.trim().length > 10 && !rawText.includes('asdasd')) {
      container.innerHTML = rawText;
    } else {
      // Default rich structured lesson content
      renderDefaultLessonContent(container);
    }
  } catch (err) {
    console.warn("Could not fetch text file, displaying formatted lesson content:", err);
    renderDefaultLessonContent(container);
  }
}

function renderDefaultLessonContent(container) {
  container.innerHTML = `
    <article class="lesson-article">
      <h1>01. WHAT ARE VARIABLES?</h1>
      <p>A <strong>variable</strong> is a named reference stored in computer memory that holds data values. You can think of a variable as a labeled container or memory box where you can put numbers, text, or complex objects to retrieve and manipulate later in your code.</p>
      
      <h2>Declaring & Assigning Variables</h2>
      <p>In modern programming languages, you create a variable by declaring its identifier and assigning a value using the assignment operator (<code>=</code>).</p>
      
      <div class="lesson-code-block">
        <span class="token-keyword">let</span> score = <span class="token-number">100</span>;<br/>
        <span class="token-keyword">let</span> userName = <span class="token-string">"Avinash"</span>;<br/>
        <span class="token-keyword">const</span> isCompleted = <span class="token-keyword">true</span>;<br/><br/>
        console.<span class="token-builtin">log</span>(userName + <span class="token-string">" scored: "</span> + score);
      </div>

      <h2>Key Variable Concepts</h2>
      <p>1. <strong>Identifier Naming:</strong> Variable names must start with a letter or underscore and are case-sensitive.<br/>
      2. <strong>Reassignment:</strong> Variables created with <code>let</code> can be reassigned to new values during program execution.<br/>
      3. <strong>Immutability:</strong> Constants created with <code>const</code> cannot be reassigned once set.</p>
    </article>
  `;
}

function initQuizHandler() {
  const options = document.querySelectorAll('.option-btn');
  const feedback = document.getElementById('quiz-feedback');
  if (!options.length) return;

  options.forEach(btn => {
    btn.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('correct', 'incorrect'));

      const val = btn.getAttribute('data-val');
      if (val === '15') {
        btn.classList.add('correct');
        if (feedback) {
          feedback.textContent = '✨ Correct! (10 + 5 = 15). Great job!';
          feedback.className = 'quiz-feedback success';
          feedback.style.display = 'block';
        }
      } else {
        btn.classList.add('incorrect');
        if (feedback) {
          feedback.textContent = '❌ Incorrect. 10 + 5 equals 15. Try again!';
          feedback.className = 'quiz-feedback error';
          feedback.style.display = 'block';
        }
      }
    });
  });
}

function initSidebarNav() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

const params = new URLSearchParams(window.location.search);
const special = params.get('spcl') || 1;
const lesson = params.get('lsn') || 1;
const subset = params.get('sub') || 1;

const stData = `lesson_data/${special}_${lesson}_${subset}.txt`;

document.addEventListener('DOMContentLoaded', () => {
  loadTextFile(stData);
  initQuizHandler();
  initSidebarNav();

  const nextButton = document.getElementById('next-btn');
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      // Go to lesson 2 (Debugger workspace)
      window.location.href = `2.html?spcl=${special}&lsn=2&sub=1`;
    });
  }
});