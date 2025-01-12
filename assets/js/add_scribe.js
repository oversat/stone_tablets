function add_scribe() {
    MetaMask_check();
    var tablet_address = document.getElementById("tabletDropdown").value;
    var tablet_instance = get_tablet_instance(tablet_address);
    tablet_instance.methods.add_scribe(document.getElementById("add_scribe_address").value)
    .send({ from: userAccount })
    .then(tx_scribe_add => {
        document.getElementById("add_scribe_result").innerHTML = "adding";
        document.getElementById("add_scribe_result").className = "pending";
        console.log("Add scribe tx: " + tx_scribe_add);
        var record_listener = setInterval(
            function() {
                web3.eth.getTransactionReceipt(tx_scribe_add, function(error, receipt) {
                    if(!error) {
                        console.log("receipt: " + receipt);
                        if (receipt) {
                            if (receipt.status == 1) {
                                document.getElementById("add_scribe_result").innerHTML = "scribe has been added!";
                                document.getElementById("add_scribe_result").className = "";
                            } else {
                                document.getElementById("add_scribe_result").innerHTML = 
                                "transaction: <a href='https://" + global_active_network + ".etherscan.io/tx/" + 
                                receipt.transactionHash + "' target='_blank'>" +
                                receipt.transactionHash + "</a> failed!";
                                document.getElementById("add_scribe_result").className = "tx_error";
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
}