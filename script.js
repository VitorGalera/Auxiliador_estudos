let timer = null;
let isRunning = false;
let isStudy = true;
let seconds = 0;

const timerElement = document.getElementById("timer");
const modeElement = document.getElementById("mode");

function updateDisplay() {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    timerElement.textContent =
        `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function nextPhase() {
    const study = Number(document.getElementById("studyTime").value);
    const rest = Number(document.getElementById("breakTime").value);

    if (isStudy) {
        isStudy = false;
        modeElement.textContent = "Modo: Descanso";
        seconds = rest * 60;
        alert("Hora do descanso!");
    } else {
        isStudy = true;
        modeElement.textContent = "Modo: Estudo";
        seconds = study * 60;
        alert("Hora de estudar!");
    }

    updateDisplay();
}

function startTimer() {
    if (isRunning) return;

    if (seconds <= 0) {
        const study = Number(document.getElementById("studyTime").value);
        seconds = study * 60;
        updateDisplay();
    }

    isRunning = true;

    timer = setInterval(() => {
        seconds--;

        if (seconds < 0) {
            nextPhase();
            return;
        }

        updateDisplay();
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isStudy = true;

    const study = Number(document.getElementById("studyTime").value);

    modeElement.textContent = "Modo: Estudo";
    seconds = study * 60;
    updateDisplay();
}

// ==========================================
// GERENCIADOR DE MATÉRIAS CORRIGIDO
// ==========================================
function updateCounter() {
    const total = document.querySelectorAll("#todoList li").length;
    const completed = document.querySelectorAll("#todoList li.completed").length;
    document.getElementById("counter").textContent = `Estudadas: ${completed} / ${total}`;
}

function addTodo() {
    const input = document.getElementById("todoInput");
    const taskText = input.value.trim();
    
    if (taskText === "") return;

    const ul = document.getElementById("todoList");
    const li = document.createElement("li");
    
    // Configura a estrutura interna
    li.innerHTML = `
        <span class="subject-text">${taskText}</span>
        <button class="delete-btn">✕</button>
    `;

    // Evento de clique no item inteiro para marcar como estudado
    li.addEventListener("click", function(e) {
        // Se o clique foi no botão de deletar, não faz nada aqui
        if (e.target.classList.contains("delete-btn")) return;
        
        this.classList.toggle("completed");
        updateCounter();
    });

    // Evento de clique específico no botão de deletar
    li.querySelector(".delete-btn").addEventListener("click", function(e) {
        e.stopPropagation(); // Impede o clique de subir para o 'li'
        li.remove();
        updateCounter();
    });

    ul.appendChild(li);
    input.value = ""; 
    updateCounter();
}

// Inicializa o cronômetro
resetTimer();
