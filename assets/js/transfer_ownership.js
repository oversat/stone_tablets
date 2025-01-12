// Import dependencies
// const get_tablet_instance = window.get_tablet_instance;

function confirm_transfer() {
    const transferButton = document.getElementById("transferButton");
    transferButton.value = "Are you really sure?!";
    transferButton.onclick = transfer_ownership;
    transferButton.classList.add("is-shaking");
    setTimeout(() => {
        transferButton.classList.remove("is-shaking");
    }, 1000);
}

function transfer_ownership() {
    if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed. Please install MetaMask and try again.");
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
        alert("Please select a tablet or enter a tablet address");
        return;
    }
    
    const new_owner_address = document.getElementById("transfer_ownership_address").value;
    if (!new_owner_address) {
        alert("Please enter the new owner's address");
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
            document.getElementById("transfer_ownership_result").innerHTML = "transferring";
            document.getElementById("transfer_ownership_result").className = "pending";
            console.log("transfer_ownership tx: " + hash);
        })
        .on('receipt', function(receipt) {
            if (receipt.status) {
                document.getElementById("transfer_ownership_result").innerHTML = "ownership has been transferred!";
                document.getElementById("transfer_ownership_result").className = "";
            } else {
                document.getElementById("transfer_ownership_result").innerHTML = 
                    "transaction: <a href='https://" + window.userAccount + ".etherscan.io/tx/" + 
                    receipt.transactionHash + "' target='_blank'>" +
                    receipt.transactionHash + "</a> failed!";
                document.getElementById("transfer_ownership_result").className = "tx_error";
            }
        })
        .on('error', function(error) {
            console.error("Transfer error:", error);
            document.getElementById("transfer_ownership_result").innerHTML = "Error: " + error.message;
            document.getElementById("transfer_ownership_result").className = "tx_error";
            
            // Reset the button on error
            transferButton.value = "transfer";
            transferButton.onclick = confirm_transfer;
        });
}

// Export the functions to make them globally available
window.transfer_ownership = transfer_ownership;
window.confirm_transfer = confirm_transfer;