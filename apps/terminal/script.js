const output = document.getElementById("terminal-output");
const form = document.getElementById("terminal-form");
const input = document.getElementById("terminal-input");
const closeBtn = document.querySelector(".close-btn");

const commands = {
  help: [
    "Available commands:",
    "  help       show this command list",
    "  clear      clear the terminal",
    "  date       show the current date and time",
    "  echo       repeat a message",
    "  ls         list PixelOS files",
    "  pwd        show the current folder",
    "  whoami     show the current user",
    "  neofetch   show PixelOS system information"
  ],
  ls: ["apps  assets  index.html  script.js  style.css"],
  pwd: ["/home/guest"],
  whoami: ["guest"],
  neofetch: [
    "        .----.       guest@pixelOS",
    "       / .-.  \\      ----------------",
    "      | |   | |      OS: PixelOS",
    "       \\ '-' /       Theme: Kawaii Pixel",
    "        '---'        Shell: pixelsh",
    "                     Apps: Music, Search, Notes, Files"
  ]
};

function writeLine(text, className = "") {
  const line = document.createElement("p");
  line.className = className;
  line.textContent = text;
  output.appendChild(line);
}

function runCommand(rawCommand) {
  const value = rawCommand.trim();
  if (!value) return;

  writeLine(`guest@pixelOS:~$ ${value}`, "command-line");
  const [name, ...args] = value.split(/\s+/);

  if (name === "clear") {
    output.replaceChildren();
    return;
  }

  if (name === "date") {
    writeLine(new Date().toString());
    return;
  }

  if (name === "echo") {
    writeLine(args.join(" "));
    return;
  }

  if (commands[name]) {
    commands[name].forEach((line) => writeLine(line));
    return;
  }

  writeLine(`${name}: command not found. Type "help" for available commands.`, "error");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  runCommand(input.value);
  input.value = "";
  output.scrollTop = output.scrollHeight;
});

closeBtn.addEventListener("click", () => {
  window.parent.postMessage({ appName: "terminal", action: "close" }, window.location.origin);
  window.close();
});

input.focus();
