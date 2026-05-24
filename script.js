const banks = {
  quote: [
    "You are not prepared, but your snack drawer shows promising initiative.",
    "The darkness called. I declined and sent it a calendar link.",
    "Betrayal is temporary. Good cable management is eternal.",
    "I have sacrificed everything. Mostly sleep. Some dignity. Several browser tabs.",
    "The hunt begins after coffee. Do not test the ritual order.",
    "Destiny is just a backlog item wearing expensive eyeliner.",
  ],
  meme: [
    "Top text: YOU ARE NOT PREPARED. Bottom text: neither was production.",
    "When the deploy works first try: suspicious. deeply suspicious.",
    "Me: I will keep this simple. Also me: adds a glowing rage interface.",
    "That feeling when the bug was actually your own previous fix wearing a fake mustache.",
    "POV: the tiny demon in your terminal says the logs have opinions.",
    "Nobody: Absolutely nobody: Illidan: what if this button had lore?",
  ],
  prophecy: [
    "Before sunset, a forgotten tab shall reveal the answer and judge you silently.",
    "A green light will blink. You will pretend this was always the plan.",
    "The next error message will be rude, specific, and technically correct.",
    "Beware the innocent checkbox. It hungers for side effects.",
    "A tiny victory approaches, wearing the suspicious costume of a one-line change.",
    "The ancient build will pass, but only after demanding tribute in cache clears.",
  ],
};

const quoteText = document.querySelector("#quoteText");
const generateButton = document.querySelector("#generateButton");
const copyButton = document.querySelector("#copyButton");
const modeButtons = [...document.querySelectorAll(".mode")];
const rageConsole = document.querySelector(".rage-console");
const rageRange = document.querySelector("#rageRange");
const rageValue = document.querySelector("#rageValue");
const rageDiagnosis = document.querySelector("#rageDiagnosis");
const oracleQuestion = document.querySelector("#oracleQuestion");
const oracleButton = document.querySelector("#oracleButton");
const oracleConfidence = document.querySelector("#oracleConfidence");
const oracleAnswer = document.querySelector("#oracleAnswer");

let currentMode = "quote";
let lastIndex = -1;

const rageLevels = [
  { max: 18, text: "Dormant. The mask is mostly decorative. Suspiciously responsible." },
  { max: 38, text: "Low simmer. One eyebrow raised. Two tabs judged." },
  { max: 62, text: "Drama contained. Sparks decorative. Snacks still recoverable." },
  { max: 84, text: "Critical sass pressure. The room now has theme music." },
  { max: 101, text: "Maximum spectacle. Someone has absolutely touched the forbidden lever." },
];

const oracleAnswers = [
  "Yes, but only if you can explain it to your future self without sweating.",
  "No. The vibes are wearing a fake mustache.",
  "The mask says proceed. The tiny warning light says make a backup first.",
  "Ask again after coffee. The prophecy engine is not emotionally available.",
  "Technically yes. Spiritually, that button owes you an apology.",
  "Probably. But if it explodes, call it a controlled illumination event.",
  "Absolutely not, unless the goal is educational regret.",
  "The answer is hidden in the logs, where all tiny tragedies go to become text.",
];

function pickLine() {
  const lines = banks[currentMode];
  let index = Math.floor(Math.random() * lines.length);
  if (lines.length > 1 && index === lastIndex) {
    index = (index + 1) % lines.length;
  }
  lastIndex = index;
  quoteText.textContent = lines[index];
}

function setMode(mode) {
  currentMode = mode;
  lastIndex = -1;
  for (const button of modeButtons) {
    button.classList.toggle("is-active", button.dataset.mode === mode);
  }
  pickLine();
}

async function copyLine() {
  const text = quoteText.textContent.trim();
  if (!navigator.clipboard) return;
  await navigator.clipboard.writeText(text);
  copyButton.textContent = "Copied";
  window.setTimeout(() => {
    copyButton.textContent = "Copy";
  }, 1200);
}

generateButton.addEventListener("click", pickLine);
copyButton.addEventListener("click", copyLine);

for (const button of modeButtons) {
  button.addEventListener("click", () => setMode(button.dataset.mode));
}

function updateRage(value) {
  const numeric = Number(value);
  const level = rageLevels.find((item) => numeric < item.max) ?? rageLevels.at(-1);
  rageValue.textContent = `${numeric}%`;
  rageDiagnosis.textContent = level.text;
  rageConsole.style.setProperty("--rage-alpha", String(Math.min(numeric / 300, 0.34)));
  rageConsole.dataset.rage = String(numeric);
}

function oracleSeed(text) {
  let seed = 0;
  for (const char of text) {
    seed = (seed * 31 + char.charCodeAt(0)) % 9973;
  }
  return seed + Number(rageRange.value);
}

function askOracle() {
  const question = oracleQuestion.value.trim() || "Should I press the suspicious button?";
  const seed = oracleSeed(question);
  const answer = oracleAnswers[seed % oracleAnswers.length];
  const confidence = 42 + (seed % 57);
  oracleAnswer.textContent = answer;
  oracleConfidence.textContent = `confidence: ${confidence}%`;
}

rageRange.addEventListener("input", () => updateRage(rageRange.value));
oracleButton.addEventListener("click", askOracle);
oracleQuestion.addEventListener("keydown", (event) => {
  if (event.key === "Enter") askOracle();
});

updateRage(rageRange.value);
