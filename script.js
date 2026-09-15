const STORAGE_KEY = "fire-dages-weekend-stemme-v3";
const API_URL = "https://mantledb.sh/v2/hjemme-side-chingchang2000-4dw/votes";
const INCREMENT_URL = "https://mantledb.sh/v2/increment/hjemme-side-chingchang2000-4dw/votes";

const buttons = [...document.querySelectorAll(".vote")];
const message = document.querySelector("#vote-message");
const yesCount = document.querySelector("#yes-count");
const noCount = document.querySelector("#no-count");

function savedVote() {
  const vote = localStorage.getItem(STORAGE_KEY);
  return ["yes", "no"].includes(vote) ? vote : null;
}

function lockVoting(vote) {
  buttons.forEach((button) => {
    button.disabled = true;
    button.classList.toggle("selected", button.dataset.vote === vote);
  });
}

function unlockVoting() {
  buttons.forEach((button) => { button.disabled = false; });
}

function renderCounts(counts) {
  yesCount.textContent = String(Number(counts.yes) || 0);
  noCount.textContent = String(Number(counts.no) || 0);
}

async function fetchCounts() {
  const response = await fetch(API_URL, { cache: "no-store" });
  if (!response.ok) throw new Error("Kunne ikke hente stemmer");
  const counts = await response.json();
  renderCounts(counts);
  return counts;
}

function showSavedMessage(vote) {
  message.textContent = vote === "yes"
    ? "Din JA-stemme er gemt i den fælles tæller. Hele Danmark kan nu se den — mor bliver stolt."
    : "Din NEJ-stemme er gemt i den fælles tæller. Hele Danmark kan se den. Croissanten er knust.";
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

async function submitVote(vote) {
  if (savedVote()) return;
  lockVoting(null);
  message.textContent = "Din stemme flyver af sted til den fælles urne…";

  try {
    const response = await fetch(INCREMENT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: vote, by: 1 }),
    });
    if (!response.ok) throw new Error("Stemmen blev afvist");

    localStorage.setItem(STORAGE_KEY, vote);
    lockVoting(vote);
    showSavedMessage(vote);
    await fetchCounts();
    if (vote === "yes") confetti();
  } catch {
    unlockVoting();
    message.textContent = "Stemmesedlen faldt ud af internettet. Prøv igen om et øjeblik.";
  }
}

buttons.forEach((button) => button.addEventListener("click", () => submitVote(button.dataset.vote)));

const existingVote = savedVote();
if (existingVote) {
  lockVoting(existingVote);
  showSavedMessage(existingVote);
}

fetchCounts().catch(() => {
  message.textContent = "Den fælles stemmetæller holder kaffepause. Prøv at genindlæse siden om lidt.";
  if (!existingVote) unlockVoting();
});

setInterval(() => fetchCounts().catch(() => {}), 15000);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) fetchCounts().catch(() => {});
});

const slider = document.querySelector("#monday");
slider.addEventListener("input", () => {
  document.querySelector("#monday-value").textContent = `${slider.value}/10`;
  document.querySelector("#hours").textContent = String(520 - Number(slider.value) * 52);
});
