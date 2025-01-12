function get_tablet_factory_instance() {
    const factoryABI = [
        {"constant":true,"inputs":[],"name":"creators_count","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":false,"inputs":[{"name":"new_tablet_name","type":"bytes32"}],"name":"create_tablet","outputs":[{"name":"","type":"address"}],"payable":true,"stateMutability":"payable","type":"function"},
        {"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"tablets","outputs":[{"name":"tablet_name","type":"bytes32"},{"name":"tablet_address","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[{"name":"creator_address","type":"address"}],"name":"is_creator","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"creators","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[{"name":"creator_address","type":"address"}],"name":"creator_tablets_count","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}
    ];
    
    const factoryAddress = "0x1CF47e78bf9c5e0403FACF7B9B261BE3998DeB8F";
    const web3 = new Web3(window.ethereum);
    return new web3.eth.Contract(factoryABI, factoryAddress);
}

// Export the function
window.get_tablet_factory_instance = get_tablet_factory_instance; 