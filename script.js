const STORAGE_KEY = "fire-dages-weekend-stemme-v1";
const BASE = { yes: 8742, no: 1258 };

const buttons = [...document.querySelectorAll(".vote")];
const results = document.querySelector(".results");
const message = document.querySelector("#vote-message");

function showResult(vote) {
  const totals = { ...BASE };
  if (vote === "yes" || vote === "no") totals[vote] += 1;
  const sum = totals.yes + totals.no;
  const yes = Math.round((totals.yes / sum) * 100);
  const no = 100 - yes;
  document.querySelector("#yes-percent").textContent = `${yes}%`;
  document.querySelector("#no-percent").textContent = `${no}%`;
  document.querySelector("#yes-bar").style.width = `${yes}%`;
  document.querySelector("#no-bar").style.width = `${no}%`;
  results.hidden = false;
  buttons.forEach((button) => {
    button.disabled = true;
    if (button.dataset.vote === vote) button.classList.add("selected");
  });
  message.textContent = vote === "yes"
    ? "Din stemme er gemt. Grundloven er ikke opdateret endnu, men stemningen er fremragende."
    : "Din stemme er gemt. En bekymret croissant vil kontakte dig inden for 3–5 hverdage.";
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
  if (localStorage.getItem(STORAGE_KEY)) return;
  const vote = button.dataset.vote;
  localStorage.setItem(STORAGE_KEY, vote);
  showResult(vote);
  if (vote === "yes") confetti();
}));

const existingVote = localStorage.getItem(STORAGE_KEY);
if (existingVote) showResult(existingVote);

const slider = document.querySelector("#monday");
slider.addEventListener("input", () => {
  document.querySelector("#monday-value").textContent = `${slider.value}/10`;
  document.querySelector("#hours").textContent = String(520 - Number(slider.value) * 52);
});
