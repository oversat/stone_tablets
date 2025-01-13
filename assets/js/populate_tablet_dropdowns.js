function populate_tablet_dropdowns() {
    console.log("Starting populate_tablet_dropdowns...");
    
    // Check wallet and contract
    console.log("Current state:", {
        userAccount: window.userAccount,
        tabletFactoryContract: window.tabletFactoryContract,
        hasContract: !!window.tabletFactoryContract,
        hasMethods: !!(window.tabletFactoryContract?.methods),
    });

    if (!window.userAccount) {
        console.error("No user account found");
        return;
    }
    if (!window.tabletFactoryContract) {
        console.error("No tablet factory contract instance found");
        console.error("Contract state:", {
            exists: !!window.tabletFactoryContract,
            type: typeof window.tabletFactoryContract,
            methods: window.tabletFactoryContract?.methods
        });
        return;
    }
    console.log("User account:", window.userAccount);
    console.log("Factory contract:", window.tabletFactoryContract);

    // Get dropdown containers
    const recordsDropdownContainer = document.getElementById('records-dropdown-container');
    const transferDropdownContainer = document.getElementById('transfer-dropdown-container');
    const transferOwnershipDropdownContainer = document.getElementById('transfer-ownership-dropdown-container');
    const addRecordDropdownContainer = document.getElementById('add-record-dropdown-container');
    
    if (!recordsDropdownContainer || !transferDropdownContainer || !transferOwnershipDropdownContainer || !addRecordDropdownContainer) {
        console.error("Dropdown containers not found:", {
            records: !!recordsDropdownContainer,
            transfer: !!transferDropdownContainer,
            transferOwnership: !!transferOwnershipDropdownContainer,
            addRecord: !!addRecordDropdownContainer
        });
        return;
    }

    // Clear existing dropdowns
    console.log("Clearing existing dropdowns...");
    recordsDropdownContainer.innerHTML = `
        <select id="tabletRecordsSelector" class="tablet-selector nes-select">
            <option value="">Select a tablet...</option>
        </select>
    `;
    transferDropdownContainer.innerHTML = `
        <select id="transferTabletSelector" class="tablet-selector nes-select">
            <option value="">Select a tablet...</option>
        </select>
    `;
    transferOwnershipDropdownContainer.innerHTML = `
        <select id="transferOwnershipSelector" class="tablet-selector nes-select">
            <option value="">Select a tablet...</option>
        </select>
    `;
    addRecordDropdownContainer.innerHTML = `
        <select id="addRecordSelector" class="tablet-selector nes-select">
            <option value="">Select a tablet...</option>
        </select>
    `;

    const creator_address = window.userAccount;
    const tablet_factory_instance = window.tabletFactoryContract;

    console.log("Checking contract methods...", tablet_factory_instance.methods);

    // Verify the contract method exists
    if (!tablet_factory_instance.methods.creator_tablets_count) {
        console.error("creator_tablets_count method not found on contract");
        return;
    }

    console.log("Fetching tablets count for address:", creator_address);
    tablet_factory_instance.methods.creator_tablets_count(creator_address).call()
        .then(tablets_count => {
            console.log("Retrieved tablets count:", tablets_count);
            
            if (tablets_count == 0) {
                console.log("No tablets found for user");
                const noTabletsOption = '<option value="">No tablets found</option>';
                document.getElementById('tabletRecordsSelector').innerHTML = noTabletsOption;
                document.getElementById('transferTabletSelector').innerHTML = noTabletsOption;
                return;
            }

            let retrieved_tablets_count = 0;
            console.log(`Starting to fetch ${tablets_count} tablets...`);

            for (let t = 0; t < tablets_count; t++) {
                (function(t) {
                    console.log(`Fetching tablet ${t}...`);
                    tablet_factory_instance.methods.tablets(creator_address, t).call()
                        .then(tablet => {
                            console.log(`Tablet ${t} data:`, tablet);
                            const tabletName = web3.utils.hexToAscii(tablet.tablet_name).replace(/\u0000/g, '');
                            console.log(`Tablet ${t} name:`, tabletName);
                            
                            const option = `<option value="${tablet.tablet_address}">${tabletName} (${tablet.tablet_address})</option>`;
                            
                            // Verify dropdowns exist before updating
                            const recordsDropdown = document.getElementById('tabletRecordsSelector');
                            const transferDropdown = document.getElementById('transferTabletSelector');
                            
                            if (!recordsDropdown || !transferDropdown) {
                                console.error("Dropdowns not found during update:", {
                                    records: !!recordsDropdown,
                                    transfer: !!transferDropdown
                                });
                                return;
                            }

                            recordsDropdown.insertAdjacentHTML('beforeend', option);
                            transferDropdown.insertAdjacentHTML('beforeend', option);
                            document.getElementById('transferOwnershipSelector')?.insertAdjacentHTML('beforeend', option);
                            document.getElementById('addRecordSelector')?.insertAdjacentHTML('beforeend', option);

                            retrieved_tablets_count++;
                            console.log(`Retrieved ${retrieved_tablets_count} of ${tablets_count} tablets`);

                            if (retrieved_tablets_count === parseInt(tablets_count)) {
                                console.log("All tablets retrieved, sorting dropdowns...");
                                ['tabletRecordsSelector', 'transferTabletSelector'].forEach(dropdownId => {
                                    const dropdown = document.getElementById(dropdownId);
                                    if (!dropdown) {
                                        console.error(`Dropdown ${dropdownId} not found during sorting`);
                                        return;
                                    }
                                    const options = Array.from(dropdown.options).slice(1);
                                    options.sort((a, b) => a.text.localeCompare(b.text));
                                    dropdown.innerHTML = '<option value="">Select a tablet...</option>';
                                    options.forEach(option => dropdown.add(option));
                                });
                                console.log("Dropdowns sorted and updated");
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
            console.error("Error details:", {
                message: error.message,
                stack: error.stack,
                contract: tablet_factory_instance,
                userAccount: creator_address
            });
            const errorOption = '<option value="">Error loading tablets</option>';
            document.getElementById('tabletRecordsSelector').innerHTML = errorOption;
            document.getElementById('transferTabletSelector').innerHTML = errorOption;
        });
}

// Handle dropdown and input field interaction
function setupTabletSelector(dropdownId, inputId) {
    const dropdown = document.getElementById(dropdownId);
    const input = document.getElementById(inputId);

    if (!dropdown || !input) {
        console.error(`Could not find elements: dropdown=${dropdownId}, input=${inputId}`);
        return;
    }

    // Update input when dropdown changes
    dropdown.addEventListener('change', (event) => {
        console.log(`Dropdown ${dropdownId} changed to:`, event.target.value);
        // Set the input value to the selected tablet address
        input.value = event.target.value;
        // Trigger change event to update any dependent UI
        input.dispatchEvent(new Event('change'));
        
        // Clear the dropdown selection if input is manually cleared
        if (!input.value) {
            dropdown.value = '';
        }
    });

    // Handle manual input
    input.addEventListener('input', (event) => {
        console.log(`Input ${inputId} changed to:`, event.target.value);
        // If text is entered manually, clear and disable the dropdown
        if (event.target.value) {
            dropdown.disabled = true;
            dropdown.value = '';
        } else {
            // If input is cleared, enable the dropdown and restore its value
            dropdown.disabled = false;
            // Re-populate dropdown if needed
            window.populate_tablet_dropdowns();
        }
    });

    // Initial check - if input has text, disable dropdown
    if (input.value) {
        dropdown.disabled = true;
        dropdown.value = '';
    }
}

// Export the functions
window.populate_tablet_dropdowns = populate_tablet_dropdowns;
window.setupTabletSelector = setupTabletSelector;

// Update dropdowns when account changes
if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', () => {
        populate_tablet_dropdowns();
    });
} 