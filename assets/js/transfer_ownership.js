// Import dependencies
// const get_tablet_instance = window.get_tablet_instance;

function confirm_transfer() {
    const transferButton = document.getElementById("transferButton");
    transferButton.value = "Are you really sure?!";
    transferButton.onclick = transfer_ownership;
    transferButton.classList.add("is-shaking");
    showNotification("Please confirm you want to transfer ownership", "info");
    setTimeout(() => {
        transferButton.classList.remove("is-shaking");
    }, 1000);
}

function transfer_ownership() {
    if (typeof window.ethereum === "undefined") {
        showNotification("MetaMask is not installed. Please install MetaMask and try again.", "error");
        return;
    }

    // Get the tablet address from either the dropdown or input field
    const selectedTablet = document.getElementById("transferOwnershipSelector").value;
    const manualTablet = document.getElementById("transfer_tablet").value;
    const tablet_address = selectedTablet || manualTablet;

    console.log("Transfer attempt:", {
        selectedTablet,
        manualTablet,
        finalAddress: tablet_address
    });
    
    // Validate input
    if (!tablet_address) {
        showNotification("Please select a tablet or enter a tablet address", "error");
        return;
    }
    
    const new_owner_address = document.getElementById("transfer_ownership_address").value;
    if (!new_owner_address) {
        showNotification("Please enter the new owner's address", "error");
        return;
    }

    console.log("Transferring ownership:", {
        tablet: tablet_address,
        newOwner: new_owner_address
    });

    // Get tablet instance using the window-scoped function
    const tablet_instance = window.get_tablet_instance(tablet_address);
    if (!tablet_instance) {
        console.error("Failed to get tablet instance for address:", tablet_address);
        showNotification("Failed to get tablet instance", "error");
        return;
    }

    console.log("Got tablet instance:", tablet_instance);
    
    // Reset the transfer button
    const transferButton = document.getElementById("transferButton");
    transferButton.value = "transfer";
    transferButton.onclick = confirm_transfer;
    
    tablet_instance.methods.change_owner(new_owner_address)
        .send({ from: window.userAccount })
        .on('transactionHash', function(hash) {
            showNotification("Transferring ownership...", "info");
            console.log("transfer_ownership tx: " + hash);
        })
        .on('receipt', function(receipt) {
            if (receipt.status) {
                showNotification("Ownership has been transferred!", "success");
                // Clear the form
                document.getElementById("transfer_ownership_address").value = "";
            } else {
                showNotification("Transfer failed!", "error");
            }
        })
        .on('error', function(error) {
            console.error("Transfer error:", error);
            showNotification("Error: " + error.message, "error");
            
            // Reset the button on error
            transferButton.value = "transfer";
            transferButton.onclick = confirm_transfer;
        });
}

// Export the functions to make them globally available
window.transfer_ownership = transfer_ownership;
window.confirm_transfer = confirm_transfer;