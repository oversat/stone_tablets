// Ensure Web3 is imported or defined
if (typeof Web3 === 'undefined') {
    var Web3 = require('web3');
}

async function MetaMask_check() {
    try {
        // Check if MetaMask is installed
        if (typeof window.ethereum === "undefined") {
            document.getElementById("MetaMask_warning").innerHTML = `
                <p><strong>&nbsp;Warning</strong> Install MetaMask Chrome/Firefox addon and connect to your account.</p>
            `;
            return null;
        }

        // Request account access
        await ethereum.request({ method: 'eth_requestAccounts' });

        // Initialize Web3
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();

        if (accounts.length === 0) {
            throw new Error("No accounts found. Please connect to MetaMask.");
        }

        // Set global variables
        global_active_account = accounts[0];
        const networkId = await web3.eth.net.getId();

        // Handle different networks
        let networkMessage = "";
        switch (networkId) {
            case 1:
                console.log("This is mainnet.");
                global_active_network = "mainnet";
                global_factory = "0x1cf47e78bf9c5e0403facf7b9b261be3998deb8f";
                networkMessage = "Mainnet active";
                break;
            case 3:
                console.log("This is the ropsten test network.");
                global_active_network = "ropsten";
                global_factory = "0x7262d059d92a15bef4fd2071ad4f9c066d050bfc";
                networkMessage = "Ropsten testnet active";
                break;
            case 4:
                console.log("This is the rinkeby test network.");
                global_active_network = "rinkeby";
                networkMessage = "Rinkeby testnet active";
                break;
            case 42:
                console.log("This is the kovan test network.");
                global_active_network = "kovan";
                networkMessage = "Kovan testnet active";
                break;
            default:
                console.log("This is an unknown network.");
                global_active_network = "unknown";
                networkMessage = "Unknown network";
        }

        // Update UI
        document.getElementById("active_net").innerHTML = networkMessage;
        document.getElementById("tablet_factory").value = global_factory || "";

        return global_active_account;

    } catch (error) {
        console.error("MetaMask check failed:", error);

        // Display error to user
        document.getElementById("MetaMask_warning").innerHTML = `
            <p><strong>Error:</strong> ${error.message}</p>
        `;
        return null;
    }
}
