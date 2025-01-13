function get_owner() {
    if (!window.userAccount) {
        showNotification("Please connect your wallet first.", "error");
        return;
    }

    // Get the tablet address from either the dropdown or input field
    const selectedTablet = document.getElementById("transferTabletSelector").value;
    const manualTablet = document.getElementById("settings_tablet").value;
    const tablet_address = selectedTablet || manualTablet;

    if (!tablet_address) {
        showNotification("Please select a tablet or enter a tablet address", "error");
        return;
    }

    const tablet_instance = window.get_tablet_instance(tablet_address);
    if (!tablet_instance) {
        console.error("Failed to get tablet instance for address:", tablet_address);
        showNotification("Failed to get tablet instance", "error");
        return;
    }

    // Show loading notification
    showNotification("Fetching owner...", "info");

    tablet_instance.methods.tablet_owner().call()
        .then(owner => {
            document.getElementById("tablet_owner").innerHTML = owner;
            showNotification("Owner found!", "success");
        })
        .catch(error => {
            console.error("Error getting owner:", error);
            showNotification("Error: " + error.message, "error");
            document.getElementById("tablet_owner").innerHTML = "";
        });
}

window.get_owner = get_owner;