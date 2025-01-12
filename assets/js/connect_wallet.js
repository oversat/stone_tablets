function initializeWallet() {
    document.getElementById("connectButton").addEventListener("click", async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                if (window.userAccount) {
                    // Disconnect wallet
                    window.userAccount = null;
                    window.tabletFactoryContract = null;
                    document.getElementById("walletAddress").innerText = "Wallet not connected";
                    document.getElementById("connectButton").innerText = "Connect Wallet";
                    document.getElementById("connectButton").classList.remove("is-warning");
                    document.getElementById("connectButton").classList.add("is-blue");
                    return;
                }

                // Request account access
                await ethereum.request({ method: "eth_requestAccounts" });

                // Initialize Web3
                web3 = new Web3(window.ethereum);

                // Get connected account
                const accounts = await web3.eth.getAccounts();
                window.userAccount = accounts[0];

                // Initialize contract instance first
                window.tabletFactoryContract = window.get_tablet_factory_instance();
                console.log("Contract initialized:", {
                    contract: window.tabletFactoryContract,
                    methods: window.tabletFactoryContract?.methods,
                    userAccount: window.userAccount
                });

                // Display connected account
                document.getElementById("walletAddress").innerText = `Connected Wallet: ${window.userAccount}`;
                document.getElementById("connectButton").innerText = "Disconnect Wallet";
                document.getElementById("connectButton").classList.remove("is-blue");
                document.getElementById("connectButton").classList.add("is-warning");

                // Initialize the tablet selectors
                console.log("Setting up tablet selectors...");
                window.setupTabletSelector('tabletRecordsSelector', 'tablet');
                window.setupTabletSelector('transferTabletSelector', 'settings_tablet');
                window.setupTabletSelector('transferOwnershipSelector', 'transfer_tablet');
                console.log("Tablet selectors set up");
                
                // Populate the dropdowns with user's tablets
                console.log("Starting dropdown population...");
                window.populate_tablet_dropdowns();
                console.log("Dropdown population initiated");

            } catch (error) {
                console.error("Error connecting to MetaMask", error);
            }
        } else {
            alert("MetaMask is not installed. Please install MetaMask and try again.");
        }
    });
}

window.initializeWallet = initializeWallet; 