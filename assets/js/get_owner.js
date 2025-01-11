function get_owner() {
    MetaMask_check();
    var tablet_address = document.getElementById("settings_tablet").value;
    var tablet_instance = get_tablet_instance(tablet_address);
    tablet_instance.methods.tablet_owner().call()
    .then(owner => {
        document.getElementById("tablet_owner").innerHTML = owner;
    })
    .catch(error => {
        console.log(error);
    });
}