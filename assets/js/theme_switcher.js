function initializeThemeSwitcher() {
    document.getElementById("modeSwitch").addEventListener("change", () => {
        document.body.classList.toggle("is-dark");
        document.body.classList.toggle("is-light");
    });
}

window.initializeThemeSwitcher = initializeThemeSwitcher; 