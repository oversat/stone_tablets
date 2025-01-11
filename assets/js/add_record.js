function add_record() {
    MetaMask_check();
    if (Number(2048 - (new Blob([document.getElementById("record_to_add").value])).size) >= 0) {
        var tablet_address = document.getElementById("tablet").value;
        var tablet_instance = get_tablet_instance(tablet_address);
        let record_data = "Tablet: " + tablet_address + " // " + document.getElementById("record_to_add").value;
        tablet_instance.methods.add_record(record_data)
        .send({ from: userAccount, value: "" })
        .then(tx_record => {
            document.getElementById("add_record_result").innerHTML = "pending record add";
            document.getElementById("add_record_result").className = "pending";
            console.log("Add record tx: " + tx_record);
            var record_listener = setInterval(
                function() {
                    web3.eth.getTransactionReceipt(tx_record, function(error, receipt) {
                        if(!error) {
                            console.log("receipt: " + receipt);
                            if (receipt) {
                                if (receipt.status == 1) {
                                    document.getElementById("add_record_result").innerHTML = "record has been added!";
                                    document.getElementById("add_record_result").className = "";
                                } else {
                                    document.getElementById("add_record_result").innerHTML = 
                                        "transaction: <a href='https://" + global_active_network + ".etherscan.io/tx/" + 
                                        receipt.transactionHash + "' target='_blank'>" +
                                        receipt.transactionHash + "</a> failed!";
                                    document.getElementById("add_record_result").className = "tx_error";
                                }
                                clearInterval(record_listener);
                            }
                        } else {
                            console.error(error);
                        }
                    })                                                        
                }
            , 10000);    
        })
        .catch(error => {
            console.log(error);
        });
    } else {
        return false;
    }
}