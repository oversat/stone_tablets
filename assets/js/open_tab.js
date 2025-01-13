function initializeTabs() {
    // Hide all tabs except the first one
    const tabs = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = 'none';
    }
    // Show the first tab
    document.getElementById('createTablet').style.display = 'block';
}

function openTab(tabId) {
    // Hide all tabs
    const tabs = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = 'none';
    }
    
    // Show the selected tab
    document.getElementById(tabId).style.display = 'block';
    
    // Update active button state
    const buttons = document.querySelectorAll('.tab-navigation .nes-btn');
    buttons.forEach(button => {
        button.classList.remove('is-primary');
        if (button.getAttribute('onclick').includes(tabId)) {
            button.classList.add('is-primary');
        }
    });
    
    // Close mobile menu after selection
    if (window.innerWidth <= 768) {
        document.querySelector('.nav-buttons').classList.remove('show');
    }
}

function toggleMenu() {
    const navButtons = document.querySelector('.nav-buttons');
    navButtons.classList.toggle('show');
}

window.openTab = openTab;
window.toggleMenu = toggleMenu;
window.initializeTabs = initializeTabs;