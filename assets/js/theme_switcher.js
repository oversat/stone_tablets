function initializeThemeSwitcher() {
    const modeSwitch = document.getElementById("modeSwitch");
    const modeLabel = document.getElementById("modeLabel");

    // Set initial state
    if (document.body.classList.contains('is-light')) {
        modeSwitch.checked = true;
        modeLabel.textContent = 'Light Mode';
    } else {
        modeSwitch.checked = false;
        modeLabel.textContent = 'Dark Mode';
    }

    modeSwitch.addEventListener("change", () => {
        document.body.classList.toggle("is-dark");
        document.body.classList.toggle("is-light");
        
        // Update label text
        if (document.body.classList.contains('is-light')) {
            modeLabel.textContent = 'Light Mode';
        } else {
            modeLabel.textContent = 'Dark Mode';
        }
    });
}

window.initializeThemeSwitcher = initializeThemeSwitcher; 