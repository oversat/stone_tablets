function initializeTabs() {
    // Hide all tabs initially except factory
    document.getElementById('tablet_tab').style.display = 'none';
    document.getElementById('settings_tab').style.display = 'none';
    document.getElementById('factory_tab').style.display = 'block';
}

function open_tab(tab) {
    var i, tabcontent;//, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    // tablinks = document.getElementsByClassName("tablinks");
    // for (i = 0; i < tablinks.length; i++) {
    //     tablinks[i].className = tablinks[i].className.replace(" active", "");
    // }
    document.getElementById(tab).style.display = "inline";
    //evt.currentTarget.className += " active";
}

window.open_tab = open_tab;
window.initializeTabs = initializeTabs;