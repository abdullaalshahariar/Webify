// Sample data for questions
const questions = [
  {
    id: 1,
    title:
      "Flexbox alignment issue: Child element not centering horizontally inside container.",
    excerpt:
      "I'm using Flexbox for my layout, but I can't get my (.heading) to center horizontally within the parent div (.container). I've tried justify-content: center; on the container, but it's not working. The heading is still stuck on the left.",
    tags: ["Flexbox", "Alignment", "CSS"],
    votes: 10,
    answers: 2,
    views: 310,
    author: "Jakaria",
    askedAgo: "3 min ago",
    createdAt: Date.now() - 3 * 60 * 1000,
  },
  {
    id: 2,
    title:
      "Flexbox alignment issue: Child element not centering horizontally inside container.",
    excerpt:
      "I'm using Flexbox for my layout, but I can't get my (.heading) to center horizontally within the parent div (.container). I've tried justify-content: center; on the container, but it's not working. The heading is still stuck on the left.",
    tags: ["Flexbox", "Alignment"],
    votes: 25,
    answers: 0,
    views: 860,
    author: "Jakaria",
    askedAgo: "18 min ago",
    createdAt: Date.now() - 18 * 60 * 1000,
  },
  {
    id: 3,
    title:
      "Flexbox alignment issue: Child element not centering horizontally inside container.",
    excerpt:
      "I'm using Flexbox for my layout, but I can't get my (.heading) to center horizontally within the parent div (.container). I've tried justify-content: center; on the container, but it's not working. The heading is still stuck on the left.",
    tags: ["Flexbox", "CSS"],
    votes: 7,
    answers: 1,
    views: 210,
    author: "Jakaria",
    askedAgo: "1 hr ago",
    createdAt: Date.now() - 60 * 60 * 1000,
  },
  {
    id: 4,
    title:
      "Flexbox alignment issue: Child element not centering horizontally inside container.",
    excerpt:
      "I'm using Flexbox for my layout, but I can't get my (.heading) to center horizontally within the parent div (.container). I've tried justify-content: center; on the container, but it's not working. The heading is still stuck on the left.",
    tags: ["Alignment"],
    votes: 11,
    answers: 3,
    views: 540,
    author: "Jakaria",
    askedAgo: "Yesterday",
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
  },
];

const state = {
  tab: "newest",
  tag: "",
  sort: "newest",
  query: "",
};

const countEl = document.getElementById("questionCount");
const listEl = document.getElementById("questionList");

function formatNumber(n) {
  return Intl.NumberFormat().format(n);
}

function questionCard(q) {
  const tags = q.tags
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");
  return `
    <article class="question-card">
      <div class="stats">
        <div class="stat"><div class="value">${formatNumber(q.votes)}</div><div class="label">votes</div></div>
        <div class="stat"><div class="value">${formatNumber(q.answers)}</div><div class="label">answers</div></div>
        <div class="stat"><div class="value">${formatNumber(q.views)}</div><div class="label">views</div></div>
      </div>
      <div class="content">
        <a href="#" class="title">${q.title}</a>
        <p class="excerpt">${q.excerpt}</p>
        <div class="tags">${tags}</div>
        <div class="actions-row">
          <i class="fa-regular fa-thumbs-up"></i> Vote
          <i class="fa-regular fa-eye"></i> Following
          <i class="fa-regular fa-thumbs-down"></i> Dislike
          <i class="fa-regular fa-comment" data-action="answer" data-id="${q.id}"></i> Answer
        </div>
      </div>
      <div class="user">
        <div class="avatar">J</div>
        <div>
          <div class="name">${q.author}</div>
          <div class="time">asked ${q.askedAgo}</div>
        </div>
      </div>
    </article>
  `;
}

function applyFilters(data) {
  let rows = [...data];

  // Search query
  if (state.query) {
    const q = state.query.toLowerCase();
    rows = rows.filter(
      (r) => r.title.toLowerCase().includes(q) || r.excerpt.toLowerCase().includes(q)
    );
  }

  // Tab filters
  if (state.tab === "unanswered") rows = rows.filter((r) => r.answers === 0);
  if (state.tab === "lastyear") {
    const yearMs = 365 * 24 * 60 * 60 * 1000;
    rows = rows.filter((r) => Date.now() - r.createdAt > yearMs);
  }
  if (state.tag) rows = rows.filter((r) => r.tags.includes(state.tag));

  // Sort
  switch (state.sort) {
    case "votes":
      rows.sort((a, b) => b.votes - a.votes);
      break;
    case "views":
      rows.sort((a, b) => b.views - a.views);
      break;
    default:
      rows.sort((a, b) => b.createdAt - a.createdAt);
  }

  return rows;
}

function render() {
  const rows = applyFilters(questions);
  countEl.textContent = formatNumber(rows.length);
  listEl.innerHTML = rows.map(questionCard).join("");
}

// Event wiring
const tabs = document.querySelectorAll(".tab");

tabs.forEach((btn) =>
  btn.addEventListener("click", () => {
    tabs.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.tab = btn.dataset.tab;
    render();
  })
);

const filterToggle = document.getElementById("filterToggle");
const filterPanel = document.getElementById("filterPanel");
filterToggle.addEventListener("click", () => {
  const isHidden = filterPanel.hasAttribute("hidden");
  if (isHidden) filterPanel.removeAttribute("hidden");
  else filterPanel.setAttribute("hidden", "");
});

document.getElementById("tagSelect").addEventListener("change", (e) => {
  state.tag = e.target.value;
  render();
});

document.getElementById("sortSelect").addEventListener("change", (e) => {
  state.sort = e.target.value;
  render();
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  state.query = e.target.value;
  render();
});

// Ask Question
const askBtn = document.getElementById("askBtn");
askBtn.addEventListener("click", () => {
  window.location.href = "../auth/login.html";
});

// Answer Modal wiring
const answerModal = document.getElementById("answerModal");
const answerTitleEl = document.getElementById("answerQuestionTitle");
const answerInputEl = document.getElementById("answerInput");
const submitAnswerBtn = document.getElementById("submitAnswer");

let activeQuestionId = null;

function openAnswerModal(question) {
  activeQuestionId = question.id;
  answerTitleEl.textContent = question.title;
  answerInputEl.value = "";
  answerModal.removeAttribute("hidden");
}

function closeAnswerModal() {
  answerModal.setAttribute("hidden", "");
  activeQuestionId = null;
}

listEl.addEventListener("click", (e) => {
  const target = e.target.closest('[data-action="answer"]');
  if (!target) return;
  const id = Number(target.dataset.id);
  const q = questions.find((x) => x.id === id);
  if (q) openAnswerModal(q);
});

answerModal.addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-close")) closeAnswerModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !answerModal.hasAttribute("hidden")) closeAnswerModal();
});

submitAnswerBtn.addEventListener("click", () => {
  const text = answerInputEl.value.trim();
  if (!activeQuestionId || !text) return;
  const idx = questions.findIndex((x) => x.id === activeQuestionId);
  if (idx > -1) {
    questions[idx].answers += 1;
    render();
    closeAnswerModal();
  }
});

// Initial render
render();
