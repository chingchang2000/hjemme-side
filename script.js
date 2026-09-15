const STORAGE_KEY = "fire-dages-weekend-stemme-v2";

const buttons = [...document.querySelectorAll(".vote")];
const message = document.querySelector("#vote-message");
const yesCount = document.querySelector("#yes-count");
const noCount = document.querySelector("#no-count");

function readElection() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !["yes", "no"].includes(saved.vote)) return { vote: null, yes: 0, no: 0 };
    return {
      vote: saved.vote,
      yes: Number(saved.yes) || 0,
      no: Number(saved.no) || 0,
    };
  } catch {
    return { vote: null, yes: 0, no: 0 };
  }
}

function renderElection(election) {
  yesCount.textContent = String(election.yes);
  noCount.textContent = String(election.no);

  if (!election.vote) return;

  buttons.forEach((button) => {
    button.disabled = true;
    button.classList.toggle("selected", button.dataset.vote === election.vote);
  });
  message.textContent = election.vote === "yes"
    ? "Din JA-stemme er gemt. Den bliver stående, også når siden genindlæses. Grundloven følger forhåbentlig efter."
    : "Din NEJ-stemme er gemt. Den bliver stående, også når siden genindlæses. En bekymret croissant er orienteret.";
}

function confetti() {
  const colors = ["#e30613", "#ffd43b", "#5bc0eb", "#ffffff"];
  for (let i = 0; i < 70; i += 1) {
    const piece = document.createElement("i");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    document.querySelector("#confetti").appendChild(piece);
    setTimeout(() => piece.remove(), 3000);
  }
}

buttons.forEach((button) => button.addEventListener("click", () => {
  const election = readElection();
  if (election.vote) return;

  const vote = button.dataset.vote;
  const updated = {
    vote,
    yes: vote === "yes" ? 1 : 0,
    no: vote === "no" ? 1 : 0,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  renderElection(updated);
  if (vote === "yes") confetti();
}));

renderElection(readElection());

const slider = document.querySelector("#monday");
slider.addEventListener("input", () => {
  document.querySelector("#monday-value").textContent = `${slider.value}/10`;
  document.querySelector("#hours").textContent = String(520 - Number(slider.value) * 52);
});
