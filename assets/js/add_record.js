function add_record() {
    if (!window.userAccount) {
        showNotification("Please connect your wallet first.", "error");
        return;
    }

    // Get the tablet address from the dropdown
    const tablet_address = document.getElementById("addRecordSelector").value;

    if (!tablet_address) {
        showNotification("Please select a tablet to add a record to", "error");
        return;
    }

    const record_content = document.getElementById("record_to_add").value;
    if (!record_content) {
        showNotification("Please enter some content for the record", "error");
        return;
    }

    if (Number(2048 - (new Blob([record_content])).size) >= 0) {
        const tablet_instance = window.get_tablet_instance(tablet_address);
        if (!tablet_instance) {
            console.error("Failed to get tablet instance for address:", tablet_address);
            showNotification("Failed to get tablet instance", "error");
            return;
        }

        let record_data = "Tablet: " + tablet_address + " // " + record_content;
        tablet_instance.methods.add_record(record_data)
            .send({ from: window.userAccount })
            .on('transactionHash', function(hash) {
                showNotification("Adding record...", "info");
                console.log("Add record tx: " + hash);
            })
            .on('receipt', function(receipt) {
                if (receipt.status) {
                    showNotification("Record has been added!", "success");
                    document.getElementById("record_to_add").value = "";
                    document.getElementById("addRecordSelector").value = "";
                    window.show_records();
                } else {
                    showNotification("Transaction failed!", "error");
                }
            })
            .on('error', function(error) {
                console.error("Add record error:", error);
                showNotification("Error: " + error.message, "error");
            });
    } else {
        showNotification("Record is too large! Maximum size is 2048 bytes.", "error");
        return false;
    }
}

window.add_record = add_record;