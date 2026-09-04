const invoke = window.__TAURI__ ? window.__TAURI__.core.invoke : null;

const displayUsername = document.getElementById('display-username');
const displayNameContainer = document.getElementById('display-name-container');
const displayName = document.getElementById('display-name');
const switchProfileBtn = document.getElementById('switch-profile-btn');
const workspaceWelcome = document.getElementById('workspace-welcome');

const subjectPythonBtn = document.getElementById('subject-python');
const subjectSqlBtn = document.getElementById('subject-sql');
const enterJourneyBtn = document.getElementById('enter-journey-btn');

const motivationText = document.getElementById('motivation-text');
const motivationAuthor = document.getElementById('motivation-author');

// Data-Ready Daily Motivation Quotes Collection
const MOTIVATION_QUOTES = [
  { text: '"The best way to learn is to build something."', author: '— ADHICODE' },
  { text: '"Small progress every single day adds up to big results."', author: '— ADHICODE' },
  { text: '"Consistency is the secret code of master developers."', author: '— ADHICODE' },
  { text: '"Write code, debug errors, celebrate solutions."', author: '— ADHICODE' }
];

function loadDailyMotivation() {
  if (!motivationText || !motivationAuthor) return;
  // Pick quote based on today's date index
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const selectedQuote = MOTIVATION_QUOTES[dayOfYear % MOTIVATION_QUOTES.length];
  
  motivationText.textContent = selectedQuote.text;
  motivationAuthor.textContent = selectedQuote.author;
}

let currentSubject = localStorage.getItem('adhicode_subject') || 'python';

function setSelectedSubject(subject) {
  currentSubject = subject;
  localStorage.setItem('adhicode_subject', subject);

  if (subjectPythonBtn && subjectSqlBtn) {
    if (subject === 'python') {
      subjectPythonBtn.classList.add('active');
      subjectSqlBtn.classList.remove('active');
    } else {
      subjectSqlBtn.classList.add('active');
      subjectPythonBtn.classList.remove('active');
    }
  }

  const subjectName = subject === 'sql' ? 'SQL' : 'Python';
  if (workspaceWelcome) {
    workspaceWelcome.textContent = `Pick a subject and continue your ${subjectName} learning journey.`;
  }

  if (enterJourneyBtn) {
    enterJourneyBtn.href = `journey.html?subject=${subject}`;
  }
}

// Subject Click Event Listeners
subjectPythonBtn?.addEventListener('click', () => setSelectedSubject('python'));
subjectSqlBtn?.addEventListener('click', () => setSelectedSubject('sql'));

async function loadActiveProfile() {
  if (!invoke) {
    if (displayUsername) displayUsername.textContent = 'Demo User';
    return;
  }

  try {
    const active = await invoke('get_active_profile');
    if (!active) {
      window.location.href = 'index.html';
      return;
    }

    if (displayUsername) {
      displayUsername.textContent = active.username;
    }

    if (active.name && active.name.trim() !== '') {
      if (displayName) displayName.textContent = active.name;
      if (displayNameContainer) displayNameContainer.style.display = 'inline';
    } else {
      if (displayNameContainer) displayNameContainer.style.display = 'none';
    }
  } catch (err) {
    console.error('Failed to load active profile:', err);
    window.location.href = 'index.html';
  }
}

switchProfileBtn?.addEventListener('click', async () => {
  if (invoke) {
    try {
      await invoke('logout_profile');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }
  window.location.href = 'index.html';
});

// Initialize workspace state
loadDailyMotivation();
setSelectedSubject(currentSubject);
loadActiveProfile();