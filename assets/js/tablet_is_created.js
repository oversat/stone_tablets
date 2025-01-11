async function tablet_is_created(tx_create_tablet, web3) {
    try {
        const receipt = await web3.eth.getTransactionReceipt(tx_create_tablet);

        if (receipt) {
            console.log("receipt: ", receipt);
            if (receipt.status) {
                document.getElementById("new_tablet_address").innerHTML = receipt.contractAddress;
                document.getElementById("new_tablet_address").className = "wallet_link";
            } else {
                document.getElementById("new_tablet_address").innerHTML = 
                `transaction: <a href='https://${global_active_network}.etherscan.io/tx/${receipt.transactionHash}' target='_blank'>
                ${receipt.transactionHash}</a> failed!`;
                document.getElementById("new_tablet_address").className = "tx_error";
            }
            return true;
        } else {
            console.log("Transaction not yet mined");
            return false;
        }
    } catch (error) {
        console.error("Error checking transaction receipt:", error);
        return false;
    }
}