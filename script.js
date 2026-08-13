// ======================================================
// PARTE 1: TIMER (ciclo de estudo/descanso)
// ======================================================

// Pega a referência de cada elemento do HTML pelo seu "id",
// para poder ler e alterar esses elementos depois
const studyInput = document.getElementById('studyInput');
const restInput = document.getElementById('restInput');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const timeDisplay = document.getElementById('timeDisplay');
const phaseLabel = document.getElementById('phaseLabel');
const cycleCountEl = document.getElementById('cycleCount');

// ---- Variáveis de estado: a "memória" do timer ----
let phase = 'study';        // fase atual: 'study' (estudo) ou 'rest' (descanso)
let remainingSeconds = Number(studyInput.value) * 60;  // segundos restantes na fase atual
let running = false;        // true = timer contando, false = parado/pausado
let intervalId = null;      // guarda a referência do setInterval, para poder cancelá-lo
let cyclesCompleted = 0;    // quantos ciclos de estudo já foram completados

// Converte um total de segundos em texto "MM:SS"
function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0'); // minutos, com zero à esquerda
  const s = Math.floor(sec % 60).toString().padStart(2, '0'); // segundos restantes, com zero à esquerda
  return m + ':' + s;
}

// Atualiza o número exibido na tela com o tempo restante
function updateDisplay() {
  timeDisplay.textContent = formatTime(remainingSeconds);
}

// Atualiza o texto "Hora de estudar" / "Hora de descansar" conforme a fase
function applyPhaseStyles() {
  phaseLabel.textContent = phase === 'study' ? 'Hora de estudar' : 'Hora de descansar';
}

// Troca de fase (estudo <-> descanso) e reinicia a contagem para a nova fase
function setPhase(newPhase) {
  phase = newPhase;
  // escolhe quantos minutos usar, dependendo da fase nova
  const minutes = phase === 'study' ? Number(studyInput.value) : Number(restInput.value);
  remainingSeconds = minutes * 60;
  applyPhaseStyles();
  updateDisplay();
}

// Executada a cada 1 segundo enquanto o timer está rodando
function tick() {
  remainingSeconds--;

  // Quando o tempo acaba...
  if (remainingSeconds <= 0) {
    // só conta um "ciclo" quando termina uma fase de ESTUDO (não a de descanso)
    if (phase === 'study') {
      cyclesCompleted++;
      cycleCountEl.textContent = 'Ciclos concluídos: ' + cyclesCompleted;
    }
    // alterna para a outra fase automaticamente
    setPhase(phase === 'study' ? 'rest' : 'study');
    return; // sai da função, pois setPhase já atualizou a tela
  }

  updateDisplay();
}

// Inicia (ou retoma) a contagem
function start() {
  if (running) return; // evita criar dois intervalos ao clicar duas vezes
  running = true;
  startPauseBtn.textContent = 'Pausar';
  // trava os campos de minutos enquanto o timer roda, evitando mudanças no meio da contagem
  studyInput.disabled = true;
  restInput.disabled = true;
  // chama a função tick() a cada 1000ms (1 segundo)
  intervalId = setInterval(tick, 1000);
}

// Pausa a contagem sem resetar o tempo restante
function pause() {
  running = false;
  startPauseBtn.textContent = 'Continuar';
  clearInterval(intervalId); // cancela o setInterval criado em start()
}

// Para tudo e volta ao estado inicial (fase de estudo, ciclos zerados)
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

// O mesmo botão alterna entre Iniciar e Pausar, dependendo do estado atual
startPauseBtn.addEventListener('click', () => {
  running ? pause() : start();
});

resetBtn.addEventListener('click', reset);

// Se o usuário mudar os minutos enquanto o timer está PARADO,
// atualiza o tempo restante imediatamente (só se for a fase correspondente)
studyInput.addEventListener('change', () => {
  if (!running && phase === 'study') setPhase('study');
});
restInput.addEventListener('change', () => {
  if (!running && phase === 'rest') setPhase('rest');
});

// Mostra o tempo inicial (25:00) assim que a página carrega
updateDisplay();


// ======================================================
// PARTE 2: TAREFAS (lista de estudo)
// ======================================================

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const taskSummary = document.getElementById('taskSummary');
const clearDoneBtn = document.getElementById('clearDoneBtn');

// Array que guarda todas as tarefas em memória.
// Cada tarefa é um objeto: { id, text, done }
let tasks = [];
let nextId = 1; // contador usado para dar um id único a cada tarefa nova

// Redesenha a lista inteira na tela, a partir do array "tasks".
// É chamada toda vez que algo muda (adicionar, marcar, remover).
function renderTasks() {
  taskList.innerHTML = ''; // limpa a lista atual antes de recriar

  // mostra a mensagem de "lista vazia" só se não houver tarefas
  emptyState.style.display = tasks.length === 0 ? 'block' : 'none';

  tasks.forEach(task => {
    // cria o <li> da tarefa
    const li = document.createElement('li');
    li.className = 'task-item' + (task.done ? ' done' : ''); // aplica risco no texto se concluída

    // checkbox para marcar como concluída
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked; // atualiza o dado
      renderTasks();                // redesenha para aplicar o estilo "concluída"
    });

    // texto da tarefa
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    // botão de remover (✕)
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.type = 'button'; // impede que ele funcione como "enviar formulário"
    removeBtn.textContent = '✕';
    removeBtn.addEventListener('click', () => {
      // remove a tarefa filtrando ela para fora do array (mantém todas as outras)
      tasks = tasks.filter(t => t.id !== task.id);
      renderTasks();
    });

    // junta checkbox + texto + botão dentro do <li>, e o <li> dentro da lista
    li.append(checkbox, span, removeBtn);
    taskList.appendChild(li);
  });

  // atualiza o contador "X de Y concluídas"
  const doneCount = tasks.filter(t => t.done).length;
  taskSummary.textContent = doneCount + ' de ' + tasks.length + ' concluídas';
}

// Quando o formulário é enviado (clique no botão ou Enter no campo)
taskForm.addEventListener('submit', (e) => {
  e.preventDefault(); // impede o comportamento padrão do <form> de recarregar a página

  const text = taskInput.value.trim(); // remove espaços em branco extras
  if (!text) return; // ignora se o campo estiver vazio

  tasks.push({ id: nextId++, text, done: false }); // adiciona a nova tarefa ao array
  taskInput.value = ''; // limpa o campo de texto
  renderTasks();
  taskInput.focus(); // devolve o foco ao campo, para digitar a próxima tarefa direto
});

// Remove de uma vez todas as tarefas já concluídas
clearDoneBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done); // mantém só as que NÃO estão concluídas
  renderTasks();
});

// Renderiza a lista (vazia) assim que a página carrega
renderTasks();
