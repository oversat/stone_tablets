function show_records() {
    if (!window.userAccount) {
        alert("Please connect your wallet first.");
        return;
    }

    // Get the tablet address from either the dropdown or input field
    const selectedTablet = document.getElementById("tabletRecordsSelector").value;
    const manualTablet = document.getElementById("tablet").value;
    const tablet_address = selectedTablet || manualTablet;

    console.log("Show records attempt:", {
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

    // Clear previous records
    document.getElementById("my_records").innerHTML = "";

    // Get tablet length
    tablet_instance.methods.tablet_length().call()
        .then(length => {
            if (length == 0) {
                document.getElementById("my_records").innerHTML = `
                    <div class="records-table-container">
                        <table class="records-table">
                            <tr class="header-row">
                                <th colspan="2">Contract Address: ${tablet_address}</th>
                            </tr>
                            <tr>
                                <td colspan="2">No records found for this tablet.</td>
                            </tr>
                        </table>
                    </div>`;
                return;
            }

            // Create table structure
            let tableHTML = `
                <div class="records-table-container">
                    <table class="records-table">
                        <tr class="header-row">
                            <th colspan="2">Contract Address: ${tablet_address}</th>
                        </tr>
                        <tr class="subheader-row">
                            <th width="80px">Record #</th>
                            <th>Content</th>
                        </tr>
            `;

            // Fetch each record
            let fetchedRecords = 0;
            for (let i = 0; i < length; i++) {
                tablet_instance.methods.records(i).call()
                    .then(record => {
                        // Remove everything before // in the record
                        const cleanedRecord = record.split('//').slice(-1)[0].trim();
                        
                        tableHTML += `
                            <tr>
                                <td class="record-number">#${i + 1}</td>
                                <td class="record-content">${cleanedRecord}</td>
                            </tr>
                        `;
                        fetchedRecords++;
                        
                        // Update table when all records are fetched
                        if (fetchedRecords === parseInt(length)) {
                            tableHTML += '</table></div>';
                            document.getElementById("my_records").innerHTML = tableHTML;
                        }
                    })
                    .catch(error => {
                        console.error(`Error fetching record ${i}:`, error);
                        tableHTML += `
                            <tr>
                                <td colspan="2" class="error-text">Error fetching record #${i + 1}: ${error.message}</td>
                            </tr>
                        `;
                    });
            }
        })
        .catch(error => {
            console.error("Error getting tablet length:", error);
            document.getElementById("my_records").innerHTML = `
                <div class="nes-text is-error">
                    Error fetching records: ${error.message}
                </div>`;
        });
}

window.show_records = show_records;