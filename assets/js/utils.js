function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show feedback
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = 'Address copied!';
        document.body.appendChild(notification);
        
        // Remove notification after delay
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add to document
    document.body.appendChild(notification);

    // Remove after animation completes
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

async function resolveENS(address) {
    try {
        if (!window.web3) {
            return address;
        }

        // Try reverse lookup
        const name = await window.web3.eth.ens.lookupAddress(address);
        if (name) {
            return name;
        }
        return address; // Return original address if no ENS found
    } catch (error) {
        console.error("ENS lookup failed:", error);
        return address; // Return original address on error
    }
}

// Helper to format address display with ENS
async function formatAddress(address) {
    if (!address) return '';

    const ensName = await resolveENS(address);
    if (ensName !== address) {
        return `${ensName} (${address.substring(0, 6)}...${address.substring(38)})`;
    }
    return `${address.substring(0, 6)}...${address.substring(38)}`;
}

function showConsoleNotification(message, duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'console-notification';
    
    // Add text character by character
    let index = 0;
    const typeWriter = () => {
        if (index < message.length) {
            notification.textContent += message.charAt(index);
            index++;
            setTimeout(typeWriter, 50); // Adjust speed of typing
        }
    };
    
    // Add to document
    document.body.appendChild(notification);
    typeWriter();
    
    // Remove after duration
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, duration);
}

// Safe console notification that won't break on circular references
function logToConsole(message) {
    console.log(message);
    showConsoleNotification(message);
}

window.copyToClipboard = copyToClipboard;
window.showNotification = showNotification;
window.formatAddress = formatAddress;
window.resolveENS = resolveENS;
window.logToConsole = logToConsole; 