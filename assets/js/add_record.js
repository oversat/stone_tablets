function add_record() {
    if (!window.userAccount) {
        alert("Please connect your wallet first.");
        return;
    }

    // Get the tablet address from either the dropdown or input field
    const selectedTablet = document.getElementById("tabletRecordsSelector").value;
    const manualTablet = document.getElementById("tablet").value;
    const tablet_address = selectedTablet || manualTablet;

    console.log("Add record attempt:", {
        selectedTablet,
        manualTablet,
        finalAddress: tablet_address
    });

    if (!tablet_address) {
        alert("Please select a tablet or enter a tablet address");
        return;
    }

    if (Number(2048 - (new Blob([document.getElementById("record_to_add").value])).size) >= 0) {
        const tablet_instance = window.get_tablet_instance(tablet_address);
        if (!tablet_instance) {
            console.error("Failed to get tablet instance for address:", tablet_address);
            return;
        }

        let record_data = "Tablet: " + tablet_address + " // " + document.getElementById("record_to_add").value;
        tablet_instance.methods.add_record(record_data)
            .send({ from: window.userAccount })
            .on('transactionHash', function(hash) {
                document.getElementById("add_record_result").innerHTML = "pending record add";
                document.getElementById("add_record_result").className = "pending";
                console.log("Add record tx: " + hash);
            })
            .on('receipt', function(receipt) {
                if (receipt.status) {
                    document.getElementById("add_record_result").innerHTML = "record has been added!";
                    document.getElementById("add_record_result").className = "";
                } else {
                    document.getElementById("add_record_result").innerHTML = 
                        "transaction: <a href='https://" + window.userAccount + ".etherscan.io/tx/" + 
                        receipt.transactionHash + "' target='_blank'>" +
                        receipt.transactionHash + "</a> failed!";
                    document.getElementById("add_record_result").className = "tx_error";
                }
            })
            .on('error', function(error) {
                console.error("Add record error:", error);
                document.getElementById("add_record_result").innerHTML = "Error: " + error.message;
                document.getElementById("add_record_result").className = "tx_error";
            });
    } else {
        alert("Record is too large! Maximum size is 2048 bytes.");
        return false;
    }
}

window.add_record = add_record;