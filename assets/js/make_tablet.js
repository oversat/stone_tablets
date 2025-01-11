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
    const global_active_account = await MetaMask_check();
    if (!global_active_account) {
        return; // Exit if MetaMask check failed
    }

    try {
        const web3 = new Web3(window.ethereum); // Ensure web3 is initialized
        const tabletFactoryAddress = global_factory; // Use global_factory here
        const tabletFactoryInstance = get_tablet_factory_instance(tabletFactoryAddress, web3); // Pass web3 instance
        const desiredTabletName = document.getElementById("desired_tablet_name").value;

        // Validate input
        if (!desiredTabletName) {
            alert("Please enter a valid tablet name.");
            return;
        }

        // Calculate tip if checked
        let tip = 0;
        if (document.getElementById("tip").checked) {
            const tipValue = parseFloat(document.getElementById("tip_value").value);
            if (isNaN(tipValue) || tipValue <= 0) {
                alert("Invalid tip value.");
                return;
            }
            tip = web3.utils.toWei(tipValue.toString(), 'ether'); // Convert to Wei
        }

        // Send transaction to create tablet
        const txCreateTablet = await tabletFactoryInstance.methods.create_tablet(
            desiredTabletName
        ).send({
            from: global_active_account,
            value: tip
        });

        // Show pending status
        document.getElementById("new_tablet_address").innerHTML = "Pending tablet creation...";
        document.getElementById("new_tablet_address").className = "pending";

        console.log(`Create tablet transaction sent. Hash: ${txCreateTablet.transactionHash}`);

        // Set interval to check for tablet creation
        const tabletListener = setInterval(async () => {
            const isCreated = await tablet_is_created(txCreateTablet.transactionHash, web3); // Pass web3 instance
            if (isCreated) {
                clearInterval(tabletListener);
            }
        }, 10000);

    } catch (error) {
        console.error("Error creating tablet:", error);

        // Optional: Display error to the user
        alert("Failed to create tablet. Please check the console for more details.");
    }
}
