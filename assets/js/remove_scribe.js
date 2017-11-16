function remove_scribe() {
    MetaMask_check();
    var tablet_address = document.getElementById("settings_tablet").value;
    var tablet_instance = get_tablet_instance(tablet_address);
    tablet_instance.remove_scribe(document.getElementById("remove_scribe_address").value, {from:web3.eth.accounts[0], value:""},
        function remove_scribe_call(error, tx_scribe_remove) {
            if (!error) {
                document.getElementById("remove_scribe_result").innerHTML = "removing";
                document.getElementById("remove_scribe_result").className = "pending";
                console.log("remove scribe tx: " + tx_scribe_remove);
                var record_listener = setInterval(
                    function() {
                        web3.eth.getTransactionReceipt(tx_scribe_remove, function(error, receipt) {
                            if(!error) {
                                console.log("receipt: " + receipt);
                                if (receipt) {
                                    document.getElementById("remove_scribe_result").innerHTML = "scribe has been removed!";
                                    document.getElementById("remove_scribe_result").className = "";
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