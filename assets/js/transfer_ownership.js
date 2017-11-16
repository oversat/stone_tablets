function transfer_ownership() {
    MetaMask_check();
    var tablet_address = document.getElementById("settings_tablet").value;
    var tablet_instance = get_tablet_instance(tablet_address);
    tablet_instance.change_owner(document.getElementById("transfer_ownership_address").value, {from:web3.eth.accounts[0], value:""},
        function transfer_ownership_call(error, tx_transfer_ownership) {
            if (!error) {
                document.getElementById("transfer_ownership_result").innerHTML = "transferring";
                document.getElementById("transfer_ownership_result").className = "pending";
                console.log("transfer_ownership tx: " + tx_transfer_ownership);
                var record_listener = setInterval(
                    function() {
                        web3.eth.getTransactionReceipt(tx_transfer_ownership, function(error, receipt) {
                            if(!error) {
                                console.log("receipt: " + receipt);
                                if (receipt) {
                                    document.getElementById("transfer_ownership_result").innerHTML = "ownership has been transferred!";
                                    document.getElementById("transfer_ownership_result").className = "";
                                    clearInterval(record_listener);
                                }
                            } else {
                                console.error(error);
                            }
                        })                                                        
                    }
                , 10000);    
            } else {
                console.log(error);
            }
        }
    );
}