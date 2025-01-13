// Ensure Web3 is imported or defined
if (typeof Web3 === 'undefined') {
    var Web3 = require('web3');
}

const global_factory = "0x7262d059d92a15bef4fd2071ad4f9c066d050bfc";

async function MetaMask_check() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            return accounts[0]; // Return the active account
        } catch (error) {
            console.error("MetaMask connection error:", error);
            return null;
        }
    } else {
        alert("MetaMask is not installed. Please install it to use this feature.");
        return null;
    }
}

async function make_tablet() {
    if (!window.userAccount) {
        showNotification("Please connect your wallet first.", "error");
        return;
    }

    const desiredTabletName = document.getElementById("desired_tablet_name").value;
    
    // Validate input
    if (!desiredTabletName) {
        showNotification("Please enter a valid tablet name.", "error");
        return;
    }

    // Calculate tip
    let tipValue = 0;
    tipValue = parseFloat(document.getElementById("tip_value").value) || 0;
    if (isNaN(tipValue) || tipValue < 0) {
        showNotification("Tip amount must be a valid number >= 0", "error");
        return;
    }

    try {
        // Convert tablet name to bytes32
        const tabletNameBytes32 = web3.utils.fromAscii(desiredTabletName);
        // Convert ETH to Wei
        const tipInWei = web3.utils.toWei(tipValue.toString(), 'ether');

        // Show pending notification
        showNotification("Creating tablet...", "info");

        // Create tablet
        window.tabletFactoryContract.methods.create_tablet(tabletNameBytes32)
            .send({ 
                from: window.userAccount,
                value: tipInWei
            })
            .on('transactionHash', function(hash) {
                console.log("Transaction hash:", hash);
                showNotification("Transaction pending...", "info");
            })
            .on('receipt', function(receipt) {
                console.log("Receipt:", receipt);
                if (receipt.status) {
                    showNotification(`Tablet created successfully!\nAddress: ${receipt.events.new_tablet_created.returnValues.tablet_address}`, "success");
                    
                    // Clear form
                    document.getElementById("desired_tablet_name").value = "";
                    document.getElementById("tip_value").value = "0";
                    
                    // Refresh dropdowns
                    window.populate_tablet_dropdowns();
                } else {
                    showNotification("Transaction failed!", "error");
                }
            })
            .on('error', function(error) {
                console.error("Error creating tablet:", error);
                showNotification("Error: " + error.message, "error");
            });

    } catch (error) {
        console.error("Error creating tablet:", error);
        showNotification("Error: " + error.message, "error");
    }
}

window.make_tablet = make_tablet;
