function show_tablets() {
    MetaMask_check();
    
    // Clear previous content
    document.getElementById("my_tablets").innerHTML = "";
    
    // Verify wallet connection
    if (!window.userAccount) {
        document.getElementById("my_tablets").innerHTML = `
            <div class="nes-text is-error">
                Please connect your wallet first!
            </div>`;
        return;
    }

    // Show loading indicator
    document.getElementById("my_tablets").innerHTML = `
        <div class="loading-message">
            Loading your tablets...
        </div>
    `;

    var creator_address = window.userAccount;
    var tablet_factory_instance = window.tabletFactoryContract;

    if (!tablet_factory_instance) {
        console.error("Contract not initialized");
        document.getElementById("my_tablets").innerHTML = `
            <div class="nes-text is-error">
                Please connect your wallet first!
            </div>`;
        return;
    }

    console.log("Contract instance:", tablet_factory_instance);
    
    tablet_factory_instance.methods.creator_tablets_count(creator_address).call()
    .then(tablets_count => {
        console.log("tablets_count " + tablets_count);
        
        if (tablets_count == 0) {
            document.getElementById("my_tablets").innerHTML = `
                <div class="nes-text is-warning">
                    No tablets found. Create your first tablet above!
                </div>`;
            return;
        }

        // Initialize table HTML
        let my_tablets_table_html = `
            <table id="tablets_table" class="nes-table is-bordered is-centered">
                <tr>
                    <th class="row-ID table-header">№</th>
                    <th class="row-name table-header">Name</th>
                    <th class="row-address table-header">Address</th>
                </tr>`;

        var retrieved_tables_count = 0;
        for (let t = 0; t < tablets_count; t++) {
            (function (t) {
                console.log("Fetching tablet", t);
                tablet_factory_instance.methods.tablets(creator_address, t).call()
                .then(tablet => {
                    console.log("Tablet data:", tablet);
                    var new_tablet_html = `
                    <tr>
                        <td class="row-1">${t + 1}</td>
                        <td class="row-2">${web3.utils.hexToAscii(tablet.tablet_name)}</td>
                        <td class="row-2">
                            <a href="https://etherscan.io/address/${tablet.tablet_address}" 
                               class="contract-link" 
                               target="_blank" 
                               rel="noopener noreferrer">${tablet.tablet_address}</a>
                        </td>
                    </tr>`;
                    my_tablets_table_html += new_tablet_html;
                    document.getElementById("my_tablets").innerHTML = my_tablets_table_html + "</table>";
                    retrieved_tables_count++;
                    
                    if (retrieved_tables_count == tablets_count) {
                        console.log("All tablets retrieved, sorting table");
                        sort_table(document.getElementById("tablets_table"));
                    }
                })
                .catch(error => {
                    console.error(`Error fetching tablet ${t}:`, error);
                });
            })(t);
        }
    })
    .catch(error => {
        console.error("Error getting tablets count:", error);
        document.getElementById("my_tablets").innerHTML = `
            <div class="nes-text is-error">
                Error fetching tablets: ${error.message}
            </div>`;
    });
}

// Export the function
window.show_tablets = show_tablets;

// Update wherever you display addresses
async function displayTabletInfo(tablet) {
    const ownerDisplay = await formatAddress(tablet.owner);
    const creatorDisplay = await formatAddress(tablet.creator);
    
    return `
        <tr>
            <td>${tablet.name}</td>
            <td>${ownerDisplay}</td>
            <td>${creatorDisplay}</td>
            <td>${tablet.address}</td>
        </tr>
    `;
}