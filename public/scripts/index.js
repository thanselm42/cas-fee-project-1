const themeButton = document.getElementById("theme-toggle-button");

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("debug-theme");
});
