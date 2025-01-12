function get_owner() {
    if (!window.userAccount) {
        alert("Please connect your wallet first.");
        return;
    }

    // Get the tablet address from either the dropdown or input field
    const selectedTablet = document.getElementById("transferTabletSelector").value;
    const manualTablet = document.getElementById("settings_tablet").value;
    const tablet_address = selectedTablet || manualTablet;

    console.log("Get owner attempt:", {
        selectedTablet,
        manualTablet,
        finalAddress: tablet_address
    });

    if (!tablet_address) {
        alert("Please select a tablet or enter a tablet address");
        return;
    }

    const tablet_instance = window.get_tablet_instance(tablet_address);
    if (!tablet_instance) {
        console.error("Failed to get tablet instance for address:", tablet_address);
        return;
    }

    tablet_instance.methods.tablet_owner().call()
        .then(owner => {
            document.getElementById("tablet_owner").innerHTML = owner;
        })
        .catch(error => {
            console.error("Error getting owner:", error);
            document.getElementById("tablet_owner").innerHTML = "Error: " + error.message;
        });
}

window.get_owner = get_owner;