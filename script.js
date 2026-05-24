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

let currentMode = "quote";
let lastIndex = -1;

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
