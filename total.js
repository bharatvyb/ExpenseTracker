document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded, initializing...");
    adjustTabContentHeight(); // Adjust the height on load
    window.addEventListener('resize', adjustTabContentHeight); // Adjust the height on window resize
    loadTotalData();
    document.getElementById('defaultOpenTotal').click();  // Initialize the default tab
});

function adjustTabContentHeight() {
    var tabContentElements = document.getElementsByClassName('tabcontent');
    for (var i = 0; i < tabContentElements.length; i++) {
        tabContentElements[i].style.maxHeight = `calc(100vh - ${document.querySelector('.tabs').offsetHeight + document.querySelector('.bottom-menu').offsetHeight + 120}px)`;
    }
}

function loadTotalData() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    loadTotalDataForType(transactions, 'revenue');
    loadTotalDataForType(transactions, 'outgo');
    loadTotalAllData(transactions);
}

function loadTotalDataForType(transactions, type) {
    const table = document.getElementById(type === 'revenue' ? 'total-revenue' : 'total-outgo');
    const monthlyTotals = calculateMonthlyTotals(transactions, type);
    
    table.innerHTML = '';
    table.innerHTML += generateTotalsHtml(monthlyTotals, type);
}

function loadTotalAllData(transactions) {
    const allTable = document.getElementById('total-all');
    const monthlyRevenue = calculateMonthlyTotals(transactions, 'revenue');
    const monthlyOutGo = calculateMonthlyTotals(transactions, 'outgo');
    
    const monthlyAll = {};

    for (let month in monthlyRevenue) {
        monthlyAll[month] = (monthlyRevenue[month] || 0) - (monthlyOutGo[month] || 0);
    }
    
    for (let month in monthlyOutGo) {
        if (!monthlyAll[month]) {
            monthlyAll[month] = -monthlyOutGo[month];
        }
    }

    allTable.innerHTML = '';
    allTable.innerHTML += generateTotalsHtml(monthlyAll, 'All');
}

function calculateMonthlyTotals(transactions, type) {
    const totals = {};

    transactions.forEach(transaction => {
        if (transaction.type === type) {
            const month = transaction.date.substring(0, 7);  // Extract YYYY-MM format
            if (!totals[month]) {
                totals[month] = 0;
            }
            totals[month] += transaction.amount;
        }
    });

    return totals;
}

function generateTotalsHtml(monthlyData, type) {
    let html = '';
    let overallTotal = 0;
    
    for (let month in monthlyData) {
        overallTotal += monthlyData[month];
        html += `<div class="header">
                    <span>${month}</span>
                    <span class="total" style="color: ${monthlyData[month] < 0 ? 'red' : 'green'};">
                        ${monthlyData[month].toFixed(2)}
                    </span>
                </div>`;
    }

    html += `<div class="header">
                <span>Entire duration</span>
                <span class="total" style="color: black;">
                    ${overallTotal.toFixed(2)}
                </span>
            </div>`;

    return html;
}