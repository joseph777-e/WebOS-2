const SETTINGS_KEY = "pixelos-settings";
const defaults = { theme: "light", wallpaper: "original", accent: "pink", reducedMotion: false };
const closeBtn = document.querySelector(".close-btn");
const motionToggle = document.getElementById("motion-toggle");
const status = document.getElementById("save-status");
const fallbackWallpapers = [
  { name: "Pixel art", value: "original", file: "../../assets/wallpaper/wallpaper.jpg" },
  { name: "Wallpaper 2", value: "file-wallpaper2", file: "../../assets/wallpaper/wallpaper2.png" },
  { name: "Wallpaper 3", value: "file-wallpaper3", file: "../../assets/wallpaper/wallpaper3.jpg" },
  { name: "Wallpaper 4", value: "file-wallpaper4", file: "../../assets/wallpaper/wallpaper4.jpg" },
  { name: "Wallpaper 5", value: "file-wallpaper5", file: "../../assets/wallpaper/wallpaper5.jpg" }
];

async function getWallpaperFiles() {
  try {
    const response = await fetch("../../assets/wallpaper/");
    if (!response.ok) throw new Error("Wallpaper folder could not be read.");
    const html = await response.text();
    const documentFragment = new DOMParser().parseFromString(html, "text/html");
    const discovered = [...documentFragment.querySelectorAll("a[href]")]
      .map((link) => decodeURIComponent(link.getAttribute("href")))
      .filter((name) => /\.(png|jpe?g|webp|gif)$/i.test(name))
      .map((name) => ({
        name: name.replace(/\.[^.]+$/, ""),
        value: `file-${name}`,
        file: `../../assets/wallpaper/${encodeURIComponent(name)}`
      }));
    return discovered.length ? discovered : fallbackWallpapers;
  } catch {
    return fallbackWallpapers;
  }
}

async function renderWallpaperChoices() {
  const wallpaperFiles = await getWallpaperFiles();
  const grid = document.getElementById("wallpaper-grid");
  grid.innerHTML = wallpaperFiles.map((wallpaper) => `
    <button class="wallpaper-btn" data-setting="wallpaper" data-value="${wallpaper.value}"
      style="background-image: url('${wallpaper.file}')" aria-label="${wallpaper.name}">
      ${wallpaper.name}
    </button>
  `).join("");
  grid.querySelectorAll("[data-setting='wallpaper']").forEach((button) => {
    button.addEventListener("click", () => applySetting("wallpaper", button.dataset.value));
  });
  render(getSettings());
}

function getSettings() {
  try {
    return { ...defaults, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}) };
  } catch {
    return { ...defaults };
  }
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function applySetting(name, value) {
  const settings = getSettings();
  settings[name] = value;
  saveSettings(settings);
  window.parent.postMessage({ appName: "settings", action: "setting-change", setting: name, value }, window.location.origin);
  status.textContent = "Saved ✓";
  setTimeout(() => { status.textContent = "Settings save automatically."; }, 1200);
  render(settings);
}

function render(settings) {
  document.querySelectorAll("[data-setting]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.value === settings[button.dataset.setting]);
  });
  motionToggle.checked = settings.reducedMotion;
}

document.querySelectorAll("[data-setting]").forEach((button) => {
  if (button.dataset.setting === "wallpaper") return;
  button.addEventListener("click", () => applySetting(button.dataset.setting, button.dataset.value));
});

motionToggle.addEventListener("change", () => applySetting("reducedMotion", motionToggle.checked));

document.getElementById("reset-btn").addEventListener("click", () => {
  saveSettings(defaults);
  window.parent.postMessage({ appName: "settings", action: "reset-settings" }, window.location.origin);
  render(defaults);
  status.textContent = "Settings reset ✓";
});

closeBtn.addEventListener("click", () => {
  window.parent.postMessage({ appName: "settings", action: "close" }, window.location.origin);
  window.close();
});

renderWallpaperChoices();
