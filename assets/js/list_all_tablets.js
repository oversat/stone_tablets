async function getAllTablets(page = 1, pageSize = 10) {
    if (!window.tabletFactoryContract) {
        showNotification("Please connect your wallet first.", "error");
        return { tablets: [], total: 0 };
    }

    try {
        // Show loading state
        showNotification("Fetching tablets...", "info");

        // Get total number of creators
        const creatorCount = await window.tabletFactoryContract.methods.creators_count().call();
        
        // Calculate pagination
        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, creatorCount);
        
        let allTablets = [];
        
        // Only fetch the current page
        for (let i = startIndex; i < endIndex; i++) {
            const creator = await window.tabletFactoryContract.methods.creators(i).call();
            const tabletCount = await window.tabletFactoryContract.methods.creator_tablets_count(creator).call();
            
            for (let j = 0; j < tabletCount; j++) {
                const tablet = await window.tabletFactoryContract.methods.tablets(creator, j).call();
                const tabletInstance = window.get_tablet_instance(tablet.tablet_address);
                const currentOwner = await tabletInstance.methods.tablet_owner().call();
                
                // Format addresses
                const formattedCreator = await window.formatAddress(creator);
                const formattedOwner = await window.formatAddress(currentOwner);
                
                allTablets.push({
                    name: web3.utils.hexToAscii(tablet.tablet_name).replace(/\u0000/g, ''),
                    address: tablet.tablet_address,
                    creator: formattedCreator,
                    currentOwner: formattedOwner
                });
            }
        }

        return { 
            tablets: allTablets, 
            total: creatorCount,
            currentPage: page,
            totalPages: Math.ceil(creatorCount / pageSize)
        };

    } catch (error) {
        console.error("Error fetching tablets:", error);
        if (error.message.includes("Rate Limit")) {
            showNotification("Rate limit reached. Please try again in a moment.", "error");
        } else {
            showNotification("Error fetching tablets: " + error.message, "error");
        }
        return { tablets: [], total: 0, currentPage: 1, totalPages: 1 };
    }
}

function displayAllTablets(data) {
    if (!data.tablets || data.tablets.length === 0) {
        return `
            <div class="nes-text is-warning">
                No tablets found.
            </div>
        `;
    }

    let html = `
        <table id="all_tablets_table" class="nes-table is-bordered is-centered records-table">
            <thead>
                <tr class="header-row">
                    <th class="table-header col-num">#</th>
                    <th class="table-header col-name">Name</th>
                    <th class="table-header col-address">Contract Address</th>
                    <th class="table-header col-creator">Created By</th>
                    <th class="table-header col-owner">Owner</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.tablets.forEach((tablet, index) => {
        html += `
            <tr>
                <td data-label="#" class="col-num">${index + 1}</td>
                <td data-label="Name" class="col-name">${tablet.name}</td>
                <td data-label="Contract Address" class="col-address">
                     <a href="https://etherscan.io/address/${tablet.address}" 
                        class="contract-link" 
                        target="_blank" 
                        rel="noopener noreferrer">${tablet.address}</a>
                 </td>
                <td data-label="Created By" class="col-creator">${tablet.creator}</td>
                <td data-label="Owner" class="col-owner">${tablet.currentOwner}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    html += `
        <div class="pagination">
            ${generatePaginationControls(data.currentPage, data.totalPages)}
        </div>
    `;
    return html;
}

function generatePaginationControls(currentPage, totalPages) {
    return `
        <div class="pagination-controls">
            <button 
                class="nes-btn ${currentPage === 1 ? 'is-disabled' : ''}" 
                onclick="changePage(${currentPage - 1})"
                ${currentPage === 1 ? 'disabled' : ''}>
                Previous
            </button>
            <span class="page-info">Page ${currentPage} of ${totalPages}</span>
            <button 
                class="nes-btn ${currentPage === totalPages ? 'is-disabled' : ''}" 
                onclick="changePage(${currentPage + 1})"
                ${currentPage === totalPages ? 'disabled' : ''}>
                Next
            </button>
        </div>
    `;
}

async function changePage(newPage) {
    const container = document.getElementById('all_tablets_container');
    container.innerHTML = `
        <div class="loading-message">
            Loading page ${newPage}...
        </div>
    `;
    
    const data = await getAllTablets(newPage);
    container.innerHTML = displayAllTablets(data);
}

async function showAllTablets() {
    const container = document.getElementById('all_tablets_container');
    if (!container) {
        console.error('Container not found');
        return;
    }

    // Show loading state
    container.innerHTML = `
        <div class="loading-message">
            Loading tablets...
        </div>
    `;
    
    // Load first page
    const data = await getAllTablets(1);
    container.innerHTML = displayAllTablets(data);
}

window.changePage = changePage;
window.showAllTablets = showAllTablets; 