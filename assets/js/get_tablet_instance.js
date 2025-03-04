function get_tablet_instance(tablet_address) {
    var tablet_ABI = [
        {"constant":false,"inputs":[{"name":"record","type":"string"}],"name":"add_record","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":false,"inputs":[{"name":"new_owner","type":"address"}],"name":"change_owner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":false,"inputs":[{"name":"scribe","type":"address"}],"name":"remove_scribe","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"records","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[],"name":"tablet_owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"scribes_hisory","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[],"name":"scribes_hisory_length","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":false,"inputs":[{"name":"scribe","type":"address"}],"name":"add_scribe","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":true,"inputs":[],"name":"this_tablet_name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[],"name":"tablet_length","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[{"name":"","type":"address"}],"name":"scribes","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},
        {"inputs":[{"name":"tablet_name","type":"bytes32"},{"name":"tablet_creator","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},
        {"anonymous":false,"inputs":[{"indexed":true,"name":"tablet_creator","type":"address"},{"indexed":false,"name":"tablet_name","type":"bytes32"},{"indexed":false,"name":"tablet_address","type":"address"}],"name":"new_tablet_created","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"name":"tablet_address","type":"address"},{"indexed":true,"name":"scribe","type":"address"},{"indexed":false,"name":"record_nubmer","type":"uint256"}],"name":"new_record","type":"event"}
    ];
    const web3 = new Web3(window.ethereum); // Ensure web3 is initialized
    return new web3.eth.Contract(tablet_ABI, tablet_address);
}