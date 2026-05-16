/* Frontend-Logik – kein Framework, nur vanilla JS */

const healthEl   = document.getElementById('health-status');
const taskList   = document.getElementById('task-list');
const taskForm   = document.getElementById('task-form');
const searchBtn  = document.getElementById('search-btn');
const resetBtn   = document.getElementById('reset-btn');
const searchInput = document.getElementById('search-input');

// ── Health-Status anzeigen ─────────────────────────────────────────────────

async function ladeHealth() {
  try {
    const res  = await fetch('/api/health');
    const data = await res.json();
    healthEl.textContent = `Status: ${data.status}`;
    healthEl.className   = data.status === 'healthy' ? 'healthy' : 'unhealthy';
  } catch {
    healthEl.textContent = 'Server nicht erreichbar';
    healthEl.className   = 'unhealthy';
  }
}

// ── Tasks laden und anzeigen ───────────────────────────────────────────────

async function ladeTasks(url = '/api/tasks') {
  taskList.innerHTML = '<li class="loading">Lade Tasks…</li>';
  try {
    const res   = await fetch(url);
    const tasks = await res.json();

    if (tasks.length === 0) {
      taskList.innerHTML = '<li class="empty">Keine Tasks vorhanden.</li>';
      return;
    }

    taskList.innerHTML = tasks.map(task => `
      <li class="task-item" data-id="${task.id}">
        <div class="task-info">
          <strong>${escapeHTML(task.title)}</strong>
          <span>${escapeHTML(task.description || '')}</span>
          <div class="task-meta">
            Erstellt: ${new Date(task.created_at).toLocaleString('de-CH')}
          </div>
        </div>
        <button class="delete-btn" onclick="loescheTask(${task.id})">Löschen</button>
      </li>
    `).join('');
  } catch {
    taskList.innerHTML = '<li class="empty">Fehler beim Laden der Tasks.</li>';
  }
}

// ── Task erstellen ─────────────────────────────────────────────────────────

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title       = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();

  if (!title) return;

  await fetch('/api/tasks', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ title, description }),
  });

  taskForm.reset();
  ladeTasks();
});

// ── Task löschen ───────────────────────────────────────────────────────────

async function loescheTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  ladeTasks();
}

// ── Suche ─────────────────────────────────────────────────────────────────

searchBtn.addEventListener('click', () => {
  const q = searchInput.value.trim();
  if (!q) return;
  ladeTasks(`/api/search?query=${encodeURIComponent(q)}`);
});

resetBtn.addEventListener('click', () => {
  searchInput.value = '';
  ladeTasks();
});

// ── XSS-Schutz: HTML-Sonderzeichen escapen ────────────────────────────────

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Beim Laden der Seite ───────────────────────────────────────────────────

ladeHealth();
ladeTasks();
