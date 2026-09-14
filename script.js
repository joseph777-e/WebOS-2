const PixelOS = {};

// da time
PixelOS.clock = (function () {
    function update(timeEl) {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        hours = String(hours).padStart(2, "0");
        timeEl.innerHTML = `${ampm}${hours}:${minutes}`;
    }

    function init() {
        const timeEl = document.getElementById("time");
        const clockEl = document.getElementById("clock");
        if (!timeEl || !clockEl) return;

        update(timeEl);
        let lastMinute = new Date().getMinutes();

        setInterval(() => {
            update(timeEl);
            const currentMinute = new Date().getMinutes();
            if (currentMinute !== lastMinute) {
                lastMinute = currentMinute;
                clockEl.classList.add("bounce");
                setTimeout(() => clockEl.classList.remove("bounce"), 400);
            }
        }, 1000);
    }

    return { init };
})();

// system statue
PixelOS.system = (function () {
    function batteryIcon(percentage, charging) {
        if (charging) return "⚡";
        if (percentage > 75) return "🔋";
        if (percentage > 40) return "🔋";
        return "🪫";
    }

    async function initBattery() {
        const textEl = document.getElementById("battery-text");
        const iconEl = document.getElementById("battery-icon");
        const statusEl = document.getElementById("battery-status");
        if (!textEl || !iconEl || !statusEl) return;

        if (!navigator.getBattery) {
            textEl.textContent = "N/A";
            return;
        }

        try {
            const battery = await navigator.getBattery();
            function render() {
                const percentage = Math.round(battery.level * 100);
                textEl.textContent = percentage + "%";
                iconEl.textContent = batteryIcon(percentage, battery.charging);
                statusEl.classList.toggle("charging", battery.charging);
            }
            render();
            battery.addEventListener("levelchange", render);
            battery.addEventListener("chargingchange", render);
        } catch (err) {
            textEl.textContent = "N/A";
        }
    }

    function initNetwork() {
        const textEl = document.getElementById("network-text");
        const iconEl = document.getElementById("network-icon");
        if (!textEl || !iconEl) return;

        function render() {
            const online = navigator.onLine;
            textEl.textContent = online ? "Connected" : "Offline";
            iconEl.textContent = online ? "📡" : "❌";
        }
        render();
        window.addEventListener("online", render);
        window.addEventListener("offline", render);
    }

    function init() {
        initBattery();
        initNetwork();
    }

    return { init };
})();

// dragabillity
PixelOS.draggable = (function () {
    function makeDraggable(element, handle = element) {
        let startX = 0, startY = 0, startTop = 0, startLeft = 0, dragging = false;
        element.style.touchAction = "none";
        handle.addEventListener("pointerdown", onPointerDown);

        function onPointerDown(e) {
            if (e.button !== undefined && e.button !== 0) return;
            dragging = true;
            startX = e.clientX;
            startY = e.clientY;

            const rect = element.getBoundingClientRect();
            const parentRect = element.offsetParent
                ? element.offsetParent.getBoundingClientRect()
                : { top: 0, left: 0 };

            element.style.position = "absolute";
            element.style.transform = "none";
            startTop = rect.top - parentRect.top;
            startLeft = rect.left - parentRect.left;
            element.style.top = startTop + "px";
            element.style.left = startLeft + "px";
            element.classList.add("dragging");

            element.setPointerCapture(e.pointerId);
            element.addEventListener("pointermove", onPointerMove);
            element.addEventListener("pointerup", onPointerUp);
            element.addEventListener("pointercancel", onPointerUp);
        }

        function onPointerMove(e) {
            if (!dragging) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            let newTop = startTop + deltaY;
            let newLeft = startLeft + deltaX;

            const parent = element.offsetParent || document.body;
            const parentRect = parent.getBoundingClientRect();
            const taskbarHeight = 65;

            const maxLeft = parentRect.width - element.offsetWidth;
            const maxTop = parentRect.height - element.offsetHeight - taskbarHeight;

            newTop = Math.max(0, Math.min(newTop, maxTop));
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));

            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
        }

        function onPointerUp(e) {
            dragging = false;
            element.classList.remove("dragging");
            element.releasePointerCapture(e.pointerId);
            element.removeEventListener("pointermove", onPointerMove);
            element.removeEventListener("pointerup", onPointerUp);
            element.removeEventListener("pointercancel", onPointerUp);
        }
    }

    function init() {
        const calendar = document.getElementById("calendar");
        if (calendar) {
            calendar.style.position = "absolute";
            calendar.style.top = "30px";
            calendar.style.left = "250px";
            makeDraggable(calendar);
        }

        const clock = document.getElementById("clock");
        if (clock) makeDraggable(clock);
       
    }

    return { init, makeDraggable };
})();

/* the search bar code */
PixelOS.search = (function () {
    function run(input) {
        const query = input.value.trim();
        if (!query) {
            input.classList.remove("shake");
            void input.offsetWidth;
            input.classList.add("shake");
            input.focus();
            return;
        }
        const url = "https://duckduckgo.com/?q=" + encodeURIComponent(query);
        window.open(url, "_blank", "noopener,noreferrer");
        input.value = "";
    }

    function init() {
        const input = document.getElementById("search-input");
        const btn = document.getElementById("search-btn");
        if (!input || !btn) return;
        btn.addEventListener("click", () => run(input));
        input.addEventListener("keypress", (e) => { if (e.key === "Enter") run(input); });
        input.addEventListener("animationend", () => input.classList.remove("shake"));
    }

    return { init };
})();

// the "about" button
PixelOS.aboutModal = (function () {
    function init() {
        const openBtn = document.getElementById("about-btn");
        const overlay = document.getElementById("about-overlay");
        
        const closeBtn = document.getElementById("about-close");
        if (!openBtn || !overlay || !closeBtn) return;

        function open() { overlay.classList.add("open"); }
        function close() { overlay.classList.remove("open"); }

        openBtn.addEventListener("click", open);
        closeBtn.addEventListener("click", close);
        
        overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
        document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    }
    return { init };
})();

// calendar days
PixelOS.calendar = (function () {
    function init() {
        const titleEl = document.getElementById("calendar-title");
        const gridEl = document.getElementById("calendar-grid");
        if (!titleEl || !gridEl) return;

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const today = now.getDate();

        const monthNames = ["January","February","March","April","May","June",
                             "July","August","September","October","November","December"];
        titleEl.textContent = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let html = "";
        ["Su","Mo","Tu","We","Th","Fr","Sa"].forEach(d => {
            html += `<div class="day-label">${d}</div>`;
        });
        for (let i = 0; i < firstDay; i++) html += `<div class="day-cell"></div>`;
        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = d === today ? " today" : "";
            html += `<div class="day-cell${isToday}">${d}</div>`;
        }
        gridEl.innerHTML = html;
    }
    return { init };
})();

// INIT
document.addEventListener("DOMContentLoaded", () => {
    PixelOS.clock.init();
    PixelOS.system.init();
    PixelOS.draggable.init();
    PixelOS.search.init();
    PixelOS.aboutModal.init();
    PixelOS.calendar.init();

    PixelOS.settings.init();
    PixelOS.apps.init();
});

PixelOS.settings = (function () {
    const storageKey = "pixelos-settings";
    const defaults = { theme: "light", wallpaper: "original", accent: "pink", reducedMotion: false };

    function read() {
        try {
            return { ...defaults, ...(JSON.parse(localStorage.getItem(storageKey)) || {}) };
        } catch {
            return { ...defaults };
        }
    }

    function apply(settings) {
        const desktop = document.getElementById("desktop");
        if (!desktop) return;

        const root = document.documentElement;
        const accentColors = {
            pink: ["#FF8FB1", "#C9377B"],
            blue: ["#80C7E8", "#3D83B5"],
            green: ["#8BCF9C", "#39805A"],
            lavender: ["#B99BE8", "#7650A8"],
            orange: ["#F4A261", "#C65D24"],
            mint: ["#70C9B0", "#368C74"]
        };
        const wallpaperStyles = {
            original: {
                image: 'url("assets/wallpaper/wallpaper.jpg")',
                color: "#FFD1EC"
            },
            pink: {
                image: "linear-gradient(135deg, #FFD1EC 0%, #FF8FB1 100%)",
                color: "#FFD1EC"
            },
            cream: {
                image: "linear-gradient(135deg, #FFF7D6 0%, #FFF3B0 100%)",
                color: "#FFF7D6"
            },
            plum: {
                image: "linear-gradient(135deg, #3D2A3D 0%, #2E1F2E 100%)",
                color: "#2E1F2E"
            }
        };

        const [accent, deepAccent] = accentColors[settings.accent] || accentColors.pink;
        const wallpaper = wallpaperStyles[settings.wallpaper] || {
            image: `url("assets/wallpaper/${encodeURIComponent(settings.wallpaper.replace("file-", ""))}")`,
            color: "#FFD1EC"
        };
        root.style.setProperty("--pink-mid", accent);
        root.style.setProperty("--pink-deep", deepAccent);
        desktop.style.backgroundImage = wallpaper.image;
        desktop.style.backgroundColor = wallpaper.color;
        desktop.style.backgroundSize = "contain";
        desktop.style.backgroundPosition = "center center";
        desktop.style.backgroundRepeat = "no-repeat";
        document.body.dataset.theme = settings.theme;
        document.body.classList.toggle("reduced-motion", Boolean(settings.reducedMotion));
    }

    function init() {
        apply(read());
    }

    function reset() {
        localStorage.setItem(storageKey, JSON.stringify(defaults));
        apply(defaults);
    }

    function update(setting, value) {
        const settings = read();
        settings[setting] = value;
        localStorage.setItem(storageKey, JSON.stringify(settings));
        apply(settings);
    }

    return { init, reset, update };
})();

PixelOS.apps = (function () {
    const appLabels = {
        files: "Files",
        search: "Browser",
        notes: "Notes",
        music: "Music",
        terminal: "Terminal",
        settings: "Settings"
    };

    function init() {
        const windowsEl = document.getElementById("app-windows");
        if (!windowsEl) return;

        const openWindows = new Map();
        const appIcons = document.querySelectorAll(".app-icon[data-app]");

        function setAppActive(appName, active) {
            const icon = document.querySelector(`.app-icon[data-app="${appName}"]`);
            if (icon) icon.classList.toggle("is-open", active);
        }

        function focusWindow(appWindow) {
            appWindow.classList.add("is-focused");
            appWindow.style.zIndex = String(Date.now());
            openWindows.forEach((win, name) => {
                if (win !== appWindow) win.classList.remove("is-focused");
            });
        }

        function closeApp(appName) {
            const appWindow = openWindows.get(appName);
            if (!appWindow) return;
            appWindow.remove();
            openWindows.delete(appName);
            setAppActive(appName, false);
        }

        function openApp(appName) {
            const existing = openWindows.get(appName);
            if (existing) {
                existing.classList.remove("is-minimized");
                focusWindow(existing);
                return;
            }

            const appWindow = document.createElement("section");
            appWindow.className = `os-app-window os-app-${appName}`;
            appWindow.dataset.app = appName;
            appWindow.style.zIndex = String(Date.now());

            const dragHandle = document.createElement("div");
            dragHandle.className = "os-window-drag-handle";
            dragHandle.setAttribute("aria-label", `Drag ${appLabels[appName] || appName} window`);
            appWindow.appendChild(dragHandle);

            const closeButton = document.createElement("button");
            closeButton.className = "os-window-close";
            closeButton.type = "button";
            closeButton.setAttribute("aria-label", `Close ${appLabels[appName] || appName}`);
            closeButton.textContent = "×";
            closeButton.addEventListener("click", (event) => {
                event.stopPropagation();
                closeApp(appName);
            });
            appWindow.appendChild(closeButton);

            const frame = document.createElement("iframe");
            frame.src = `apps/${appName}/index.html`;
            frame.title = `${appLabels[appName] || appName} application`;
            appWindow.appendChild(frame);
            windowsEl.appendChild(appWindow);
            openWindows.set(appName, appWindow);
            setAppActive(appName, true);
            focusWindow(appWindow);
            PixelOS.draggable.makeDraggable(appWindow, dragHandle);

            appWindow.addEventListener("pointerdown", () => focusWindow(appWindow));
        }

        window.addEventListener("message", (event) => {
            if (!event.data || typeof event.data !== "object") return;
            const { appName, action } = event.data;
            if (!appName) return;

            if (action === "close" && openWindows.has(appName)) {
                closeApp(appName);
                return;
            }
            if (action === "setting-change") PixelOS.settings.update(event.data.setting, event.data.value);
            if (action === "reset-settings") PixelOS.settings.reset();
        });

        appIcons.forEach((icon) => {
            icon.addEventListener("click", () => openApp(icon.dataset.app));
        });

        document.addEventListener("keydown", (event) => {
            if (event.key !== "Escape") return;
            let topWindow = null;
            let topZ = -1;
            openWindows.forEach((win) => {
                const z = Number(win.style.zIndex) || 0;
                if (z >= topZ) {
                    topZ = z;
                    topWindow = win;
                }
            });
            if (topWindow) closeApp(topWindow.dataset.app);
        });
    }

    return { init };
})();