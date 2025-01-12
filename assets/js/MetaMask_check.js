// Ensure Web3 is imported or defined
if (typeof Web3 === 'undefined') {
    var Web3 = require('web3');
}

function MetaMask_check() {
    if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed. Please install MetaMask and try again.");
    } else {
        web3 = new Web3(window.ethereum);
    }
}

window.MetaMask_check = MetaMask_check;
