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

window.copyToClipboard = copyToClipboard;
window.showNotification = showNotification; 