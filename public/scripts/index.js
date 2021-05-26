const constThemes = [
    {className: ""},
    {className: "dark-theme"},
    {className: "neon-theme"},
    {className: "psycho-theme"},
    {className: "debug-theme"},
];
let currentTheme = constThemes[0];

function themeChangeEventHandler(event) {
    const newTheme = constThemes[event.target.selectedIndex];
    if (currentTheme.className.length > 0) {
        document.body.classList.toggle(currentTheme.className);
    }
    if (newTheme.className.length > 0) {
        document.body.classList.toggle(newTheme.className);
    }
    currentTheme = newTheme;
}

function attachGlobalEventListeners() {
    const themeChangeButton = document.querySelector(".theme-changer");
    themeChangeButton.addEventListener("change", themeChangeEventHandler);
}

/* *********************
 Attach Event-Listeners
 */
attachGlobalEventListeners();
