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
const memeButton = document.querySelector("#memeButton");
const memeCanvas = document.querySelector("#memeCanvas");
const downloadMemeButton = document.querySelector("#downloadMemeButton");
const rerenderMemeButton = document.querySelector("#rerenderMemeButton");
const modeButtons = [...document.querySelectorAll(".mode")];
const rageConsole = document.querySelector(".rage-console");
const rageRange = document.querySelector("#rageRange");
const rageValue = document.querySelector("#rageValue");
const rageDiagnosis = document.querySelector("#rageDiagnosis");
const oracleQuestion = document.querySelector("#oracleQuestion");
const oracleButton = document.querySelector("#oracleButton");
const oracleConfidence = document.querySelector("#oracleConfidence");
const oracleAnswer = document.querySelector("#oracleAnswer");
const themeButtons = [...document.querySelectorAll(".theme-button")];
const questButton = document.querySelector("#questButton");
const questRank = document.querySelector("#questRank");
const questText = document.querySelector("#questText");
const questReward = document.querySelector("#questReward");
const soundButtons = [...document.querySelectorAll(".sound-button")];
const soundOutput = document.querySelector("#soundOutput");
const operatorStatus = document.querySelector("#operatorStatus");
const operatorMeter = document.querySelector("#operatorMeter");
const operatorMeterBar = document.querySelector("#operatorMeterBar");
const operatorEvent = document.querySelector("#operatorEvent");
const operatorLog = document.querySelector("#operatorLog");
const operatorCommands = [...document.querySelectorAll(".operator-command")];
const operatorChips = [...document.querySelectorAll(".operator-chip")];

let currentMode = "quote";
let lastIndex = -1;
let questIndex = -1;
let operatorStatusIndex = 0;
let operatorMeterValue = 67;

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

const quests = [
  { rank: "Rank C", text: "Defeat three stale tabs before they multiply.", reward: "Reward: one smug refresh" },
  { rank: "Rank A", text: "Escort the suspicious checkbox across the settings page.", reward: "Reward: ceremonial undo button" },
  { rank: "Rank B", text: "Recover the missing semicolon from the neon swamp.", reward: "Reward: lint-free cloak" },
  { rank: "Rank S", text: "Convince the cache shrine to release yesterday's truth.", reward: "Reward: forbidden hard reload" },
  { rank: "Rank D", text: "Rename one file without awakening the ancient import path.", reward: "Reward: tiny victory biscuit" },
  { rank: "Rank A", text: "Stare at the error until it becomes embarrassed.", reward: "Reward: dramatic competence" },
];

const operatorStatuses = [
  {
    key: "focus",
    label: "status: watching the logs blink",
    event: "event: calibration hums in dramatic lowercase",
  },
  {
    key: "snark",
    label: "status: polishing one-liners",
    event: "event: sarcasm buffer stable; no bystanders singed",
  },
  {
    key: "chaos",
    label: "status: chaos sandbox locked",
    event: "event: tiny alarms rehearsing for opening night",
  },
];

const operatorCommandMap = {
  scan: {
    meter: 5,
    status: "focus",
    event: "scan complete: three dramatic shadows, zero private data",
    log: "scan sweep finished; vibes classified as neon",
  },
  focus: {
    meter: 9,
    status: "focus",
    event: "focus lens aligned: useful menace increased",
    log: "focus matrix tightened around the next tiny task",
  },
  contain: {
    meter: -12,
    status: "chaos",
    event: "containment pulse fired: spectacle remains browser-sized",
    log: "containment field refreshed; chaos politely sat down",
  },
  taunt: {
    meter: 14,
    status: "snark",
    event: "taunt broadcast: villain monologue trimmed for runtime",
    log: "taunt packet delivered; confidence looked offended",
  },
};

function pickLine() {
  const lines = banks[currentMode];
  let index = Math.floor(Math.random() * lines.length);
  if (lines.length > 1 && index === lastIndex) {
    index = (index + 1) % lines.length;
  }
  lastIndex = index;
  quoteText.textContent = lines[index];
  renderMemeCard();
}

function setMode(mode) {
  currentMode = mode;
  lastIndex = -1;
  for (const button of modeButtons) {
    button.classList.toggle("is-active", button.dataset.mode === mode);
  }
  pickLine();
}

function copyFallback(text) {
  // navigator.clipboard is undefined on file:// in several browsers, and
  // file:// has to work. Fall back to the old selection trick.
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.top = "-1000px";
  document.body.append(field);
  field.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  }
  field.remove();
  return copied;
}

async function copyLine() {
  const text = quoteText.textContent.trim();
  let copied = false;
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (error) {
      copied = false;
    }
  }
  if (!copied) copied = copyFallback(text);
  copyButton.textContent = copied ? "Copied" : "Copy failed";
  window.setTimeout(() => {
    copyButton.textContent = "Copy";
  }, 1200);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  for (const [index, item] of lines.slice(0, 5).entries()) {
    ctx.fillText(item, x, y + index * lineHeight);
  }
}

function renderMemeCard() {
  if (!memeCanvas) return;
  const ctx = memeCanvas.getContext("2d");
  const { width, height } = memeCanvas;
  const text = quoteText.textContent.trim();
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#07100d");
  gradient.addColorStop(0.48, "#121622");
  gradient.addColorStop(1, "#1f1532");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(109, 255, 150, 0.12)";
  ctx.beginPath();
  ctx.arc(width * 0.82, height * 0.18, 210, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(216, 255, 101, 0.32)";
  ctx.lineWidth = 4;
  ctx.strokeRect(42, 42, width - 84, height - 84);

  ctx.fillStyle = "#d8ff65";
  ctx.font = "800 34px system-ui, sans-serif";
  ctx.fillText("BOTRAGE.ME // ORACLE OUTPUT", 72, 104);

  ctx.fillStyle = "#f7fbf2";
  ctx.font = "900 70px system-ui, sans-serif";
  wrapText(ctx, text, 72, 224, width - 330, 78);

  ctx.fillStyle = "#6dff96";
  ctx.font = "900 42px system-ui, sans-serif";
  ctx.fillText("ILLIDAN BOT RAGE", 72, height - 86);

  ctx.fillStyle = "rgba(247, 251, 242, 0.12)";
  ctx.font = "900 180px system-ui, sans-serif";
  ctx.fillText("?", width - 230, height - 90);
}

function downloadMemeCard() {
  renderMemeCard();
  const link = document.createElement("a");
  link.download = "botrage-card.png";
  link.href = memeCanvas.toDataURL("image/png");
  link.click();
}

generateButton.addEventListener("click", pickLine);
copyButton.addEventListener("click", copyLine);
memeButton.addEventListener("click", renderMemeCard);
rerenderMemeButton.addEventListener("click", renderMemeCard);
downloadMemeButton.addEventListener("click", downloadMemeCard);

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

function setTheme(theme) {
  document.body.dataset.theme = theme;
  for (const button of themeButtons) {
    button.classList.toggle("is-active", button.dataset.theme === theme);
  }
}

function newQuest() {
  let index = Math.floor(Math.random() * quests.length);
  if (quests.length > 1 && index === questIndex) {
    index = (index + 1) % quests.length;
  }
  questIndex = index;
  const quest = quests[index];
  questRank.textContent = quest.rank;
  questText.textContent = quest.text;
  questReward.textContent = quest.reward;
}

function yell(text) {
  soundOutput.textContent = text;
  soundOutput.classList.remove("is-yelling");
  window.requestAnimationFrame(() => soundOutput.classList.add("is-yelling"));
}

function operatorTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function setOperatorMeter(value) {
  operatorMeterValue = Math.max(12, Math.min(99, value));
  operatorMeter.textContent = `${operatorMeterValue}%`;
  operatorMeterBar.style.width = `${operatorMeterValue}%`;
}

function setOperatorStatus(key) {
  const index = operatorStatuses.findIndex((item) => item.key === key);
  const nextIndex = index >= 0 ? index : operatorStatusIndex;
  operatorStatusIndex = nextIndex;
  const status = operatorStatuses[nextIndex];
  operatorStatus.textContent = status.label;
  operatorEvent.textContent = status.event;
  for (const chip of operatorChips) {
    chip.classList.toggle("is-active", chip.dataset.statusChip === status.key);
  }
}

function appendOperatorLog(text) {
  const item = document.createElement("li");
  const time = document.createElement("span");
  time.textContent = operatorTimestamp();
  item.append(time, document.createTextNode(text));
  operatorLog.prepend(item);
  while (operatorLog.children.length > 7) {
    operatorLog.lastElementChild.remove();
  }
}

function runOperatorCommand(command) {
  const action = operatorCommandMap[command];
  if (!action) return;
  setOperatorMeter(operatorMeterValue + action.meter);
  setOperatorStatus(action.status);
  operatorEvent.textContent = `event: ${action.event}`;
  appendOperatorLog(action.log);
}

function rotateOperatorStatus() {
  operatorStatusIndex = (operatorStatusIndex + 1) % operatorStatuses.length;
  setOperatorStatus(operatorStatuses[operatorStatusIndex].key);
}

for (const button of themeButtons) {
  button.addEventListener("click", () => setTheme(button.dataset.theme));
}

questButton.addEventListener("click", newQuest);

for (const button of soundButtons) {
  button.addEventListener("click", () => yell(button.dataset.yell));
}

for (const button of operatorCommands) {
  button.addEventListener("click", () => runOperatorCommand(button.dataset.command));
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let operatorTicker = null;
function syncOperatorTicker() {
  if (operatorTicker) { clearInterval(operatorTicker); operatorTicker = null; }
  if (!reduceMotion.matches) operatorTicker = setInterval(rotateOperatorStatus, 5200);
}
syncOperatorTicker();
reduceMotion.addEventListener("change", syncOperatorTicker);

setTheme("fel");
setOperatorMeter(operatorMeterValue);
setOperatorStatus("focus");
renderMemeCard();
