// Dados iniciais das aulas
const lessonsData = [
  { id: 1, title: "Melhorando nossa missão", steps: "12 / 12", duration: "13min", completed: false },
  { id: 2, title: "Gerando afirmações aleatórias", steps: "12 / 12", duration: "26min", completed: false },
  { id: 3, title: "Divisão eficiente de código", steps: "8 / 8", duration: "10min", completed: false },
  { id: 4, title: "Botão de jogar novamente", steps: "7 / 7", duration: "8min", completed: false },
  { id: 5, title: "Corrigindo problemas", steps: "8 / 8", duration: "10min", completed: false },
  { id: 6, title: "Missão com nomes aleatórios", steps: "8 / 8", duration: "11min", completed: false },
  { id: 7, title: "Fluxograma", steps: "7 / 7", duration: "11min", completed: false },
  { id: 8, title: "Construindo a tela inicial", steps: "7 / 7", duration: "11min", completed: false },
  { id: 9, title: "Apresentando o projeto", steps: "1 / 1", duration: "4min", completed: false }
];

let currentFilter = 'all';
let currentSearch = '';
let activeLessonId = null;

// Elementos HTML
const html = document.documentElement;
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');

const videoModal = document.getElementById('videoModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const toggleCompleteModalBtn = document.getElementById('toggleCompleteModalBtn');
const modalBtnText = document.getElementById('modalBtnText');

// --- ALTERNÂNCIA DE TEMA ---
function applyTheme(theme) {
  if (theme === 'light') {
    html.classList.remove('dark');
    html.classList.add('light');
    themeIcon.className = 'fa-solid fa-sun text-yellow-500';
    themeText.innerText = 'Modo Claro';
  } else {
    html.classList.remove('light');
    html.classList.add('dark');
    themeIcon.className = 'fa-solid fa-moon text-yellow-400';
    themeText.innerText = 'Modo Escuro';
  }
  localStorage.setItem('theme', theme);
}

// Alternar clique
themeToggleBtn.addEventListener('click', () => {
  const isDark = html.classList.contains('dark');
  applyTheme(isDark ? 'light' : 'dark');
});

// Carregar Tema Salvo
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

// --- RENDERIZAÇÃO E FILTROS ---
function updateStats() {
  const completedCount = lessonsData.filter(l => l.completed).length;
  const total = lessonsData.length;
  const percent = Math.round((completedCount / total) * 100);

  document.getElementById('completedLessons').innerText = `${completedCount} / ${total}`;
  document.getElementById('progressPercent').innerText = `${percent}%`;
  document.getElementById('progressBar').style.width = `${percent}%`;
}

function renderLessons() {
  const container = document.getElementById('lessonsList');
  container.innerHTML = '';

  const filtered = lessonsData.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(currentSearch.toLowerCase());
    const matchesFilter = 
      currentFilter === 'all' ? true :
      currentFilter === 'completed' ? lesson.completed :
      !lesson.completed;
    return matchesSearch && matchesFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="col-span-full text-center py-12 subtext">Nenhuma aula encontrada.</div>`;
    return;
  }

  filtered.forEach(lesson => {
    const card = document.createElement('div');
    card.className = `card-bg p-5 rounded-2xl border flex flex-col justify-between transition duration-200 ${lesson.completed ? 'opacity-90' : ''}`;

    card.innerHTML = `
      <div>
        <div class="flex items-start justify-between gap-2 mb-3">
          <h3 class="font-semibold text-lg leading-snug flex items-center gap-2">
            ${lesson.completed ? '<i class="fa-solid fa-circle-check text-brand-500"></i>' : ''}
            <span>${lesson.title}</span>
          </h3>
          <span class="text-xs px-2.5 py-1 rounded-full border subtext whitespace-nowrap">
            <i class="fa-regular fa-clock mr-1"></i>${lesson.duration}
          </span>
        </div>
        <div class="flex items-center gap-2 text-sm subtext mb-6">
          <i class="fa-solid fa-layer-group text-xs"></i>
          <span>Etapas: ${lesson.steps}</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="openModal(${lesson.id})" class="flex-1 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm flex items-center justify-center gap-2 transition active:scale-[0.98]">
          <i class="fa-solid fa-play text-xs"></i>
          <span>Ver aula</span>
        </button>
        <button onclick="toggleComplete(${lesson.id})" class="p-2.5 rounded-xl border subtext hover:text-brand-500 transition" title="Alternar conclusão">
          <i class="fa-solid ${lesson.completed ? 'fa-circle-check text-brand-500' : 'fa-circle'}"></i>
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  updateStats();
}

// Alternar status da aula
function toggleComplete(id) {
  const lesson = lessonsData.find(l => l.id === id);
  if (lesson) {
    lesson.completed = !lesson.completed;
    renderLessons();
    if (activeLessonId === id) updateModalBtnState(lesson);
  }
}

// --- MODAL ---
function openModal(id) {
  activeLessonId = id;
  const lesson = lessonsData.find(l => l.id === id);
  if (!lesson) return;

  document.getElementById('modalTitle').innerText = lesson.title;
  document.getElementById('modalInfo').innerText = `Duração: ${lesson.duration} • Exercícios: ${lesson.steps}`;
  
  updateModalBtnState(lesson);
  videoModal.classList.remove('hidden');
}

function updateModalBtnState(lesson) {
  if (lesson.completed) {
    modalBtnText.innerText = 'Marcar como Pendente';
    toggleCompleteModalBtn.classList.replace('bg-brand-600', 'bg-gray-600');
    toggleCompleteModalBtn.classList.replace('hover:bg-brand-500', 'hover:bg-gray-500');
  } else {
    modalBtnText.innerText = 'Marcar como Concluída';
    toggleCompleteModalBtn.classList.replace('bg-gray-600', 'bg-brand-600');
    toggleCompleteModalBtn.classList.replace('hover:bg-gray-500', 'hover:bg-brand-500');
  }
}

function closeModal() {
  videoModal.classList.add('hidden');
  activeLessonId = null;
}

closeModalBtn.addEventListener('click', closeModal);
videoModal.addEventListener('click', (e) => {
  if (e.target === videoModal) closeModal();
});

toggleCompleteModalBtn.addEventListener('click', () => {
  if (activeLessonId !== null) {
    toggleComplete(activeLessonId);
  }
});

// --- EVENTOS DE PESQUISA E FILTRO ---
searchInput.addEventListener('input', (e) => {
  currentSearch = e.target.value;
  renderLessons();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active-filter'));
    btn.classList.add('active-filter');
    currentFilter = btn.getAttribute('data-filter');
    renderLessons();
  });
});

// Inicialização
document.addEventListener('DOMContentLoaded', renderLessons);