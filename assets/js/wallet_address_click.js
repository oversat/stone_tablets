function wallet_address_click(element) {
    // Implement the click handler for wallet addresses
}

async function updateWalletDisplay(address) {
    const walletDisplay = document.getElementById('walletAddress');
    if (walletDisplay) {
        const formattedAddress = await formatAddress(address);
        walletDisplay.textContent = formattedAddress;
        walletDisplay.title = address; // Full address on hover
    }
}

window.wallet_address_click = wallet_address_click;