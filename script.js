// ---------- TIMER ----------
const studyInput = document.getElementById('studyInput');
const restInput = document.getElementById('restInput');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const timeDisplay = document.getElementById('timeDisplay');
const phaseLabel = document.getElementById('phaseLabel');
const cycleCountEl = document.getElementById('cycleCount');

let phase = 'study'; // 'study' ou 'rest'
let remainingSeconds = Number(studyInput.value) * 60;
let running = false;
let intervalId = null;
let cyclesCompleted = 0;

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return m + ':' + s;
}

function updateDisplay() {
  timeDisplay.textContent = formatTime(remainingSeconds);
}

function applyPhaseStyles() {
  phaseLabel.textContent = phase === 'study' ? 'Hora de estudar' : 'Hora de descansar';
}

function setPhase(newPhase) {
  phase = newPhase;
  const minutes = phase === 'study' ? Number(studyInput.value) : Number(restInput.value);
  remainingSeconds = minutes * 60;
  applyPhaseStyles();
  updateDisplay();
}

function tick() {
  remainingSeconds--;
  if (remainingSeconds <= 0) {
    if (phase === 'study') {
      cyclesCompleted++;
      cycleCountEl.textContent = 'Ciclos concluídos: ' + cyclesCompleted;
    }
    setPhase(phase === 'study' ? 'rest' : 'study');
    return;
  }
  updateDisplay();
}

function start() {
  if (running) return;
  running = true;
  startPauseBtn.textContent = 'Pausar';
  studyInput.disabled = true;
  restInput.disabled = true;
  intervalId = setInterval(tick, 1000);
}

function pause() {
  running = false;
  startPauseBtn.textContent = 'Continuar';
  clearInterval(intervalId);
}

function reset() {
  running = false;
  clearInterval(intervalId);
  startPauseBtn.textContent = 'Iniciar';
  studyInput.disabled = false;
  restInput.disabled = false;
  cyclesCompleted = 0;
  cycleCountEl.textContent = 'Ciclos concluídos: 0';
  setPhase('study');
}

startPauseBtn.addEventListener('click', () => {
  running ? pause() : start();
});

resetBtn.addEventListener('click', reset);

studyInput.addEventListener('change', () => {
  if (!running && phase === 'study') setPhase('study');
});
restInput.addEventListener('change', () => {
  if (!running && phase === 'rest') setPhase('rest');
});

updateDisplay();

// ---------- TAREFAS ----------
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const taskSummary = document.getElementById('taskSummary');
const clearDoneBtn = document.getElementById('clearDoneBtn');

let tasks = []; // { id, text, done }
let nextId = 1;

function renderTasks() {
  taskList.innerHTML = '';
  emptyState.style.display = tasks.length === 0 ? 'block' : 'none';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.done ? ' done' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked;
      renderTasks();
    });

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.type = 'button';
    removeBtn.textContent = '✕';
    removeBtn.addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      renderTasks();
    });

    li.append(checkbox, span, removeBtn);
    taskList.appendChild(li);
  });

  const doneCount = tasks.filter(t => t.done).length;
  taskSummary.textContent = doneCount + ' de ' + tasks.length + ' concluídas';
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ id: nextId++, text, done: false });
  taskInput.value = '';
  renderTasks();
  taskInput.focus();
});

clearDoneBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done);
  renderTasks();
});

renderTasks();
