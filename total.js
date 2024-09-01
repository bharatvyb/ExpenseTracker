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
    loadTotalRevenueData();
    loadTotalOutGoData();
    loadTotalAllData();
}

function loadTotalRevenueData() {
    const revenueTable = document.getElementById('total-revenue');
    const revenues = JSON.parse(localStorage.getItem('revenue')) || [];
    const monthlyRevenue = calculateMonthlyTotals(revenues);
    
    revenueTable.innerHTML = '';
    revenueTable.innerHTML += generateTotalsHtml(monthlyRevenue, 'Revenue', 'green');
}

function loadTotalOutGoData() {
    const outgoTable = document.getElementById('total-outgo');
    const outgoes = JSON.parse(localStorage.getItem('outgo')) || [];
    const monthlyOutGo = calculateMonthlyTotals(outgoes);
    
    outgoTable.innerHTML = '';
    outgoTable.innerHTML += generateTotalsHtml(monthlyOutGo, 'OutGo', 'red');
}

function loadTotalAllData() {
    const allTable = document.getElementById('total-all');
    const revenues = JSON.parse(localStorage.getItem('revenue')) || [];
    const outgoes = JSON.parse(localStorage.getItem('outgo')) || [];

    const monthlyRevenue = calculateMonthlyTotals(revenues);
    const monthlyOutGo = calculateMonthlyTotals(outgoes);
    
    const monthlyAll = {};

    // Calculate totals for months with either revenue or outgo
    for (let month in monthlyRevenue) {
        monthlyAll[month] = (monthlyRevenue[month] || 0) - (monthlyOutGo[month] || 0);
    }
    
    // Ensure that months with only outgoes are included in the monthlyAll calculation
    for (let month in monthlyOutGo) {
        if (!monthlyAll[month]) {
            monthlyAll[month] = -monthlyOutGo[month];
        }
    }

    allTable.innerHTML = '';
    allTable.innerHTML += generateTotalsHtml(monthlyAll, 'All');
}

function calculateMonthlyTotals(transactions) {
    const totals = {};

    transactions.forEach(transaction => {
        const month = transaction.date.substring(0, 7);  // Extract YYYY-MM format
        if (!totals[month]) {
            totals[month] = 0;
        }
        totals[month] += transaction.amount;
    });

    return totals;
}

function generateTotalsHtml(monthlyData, type, color = null) {
    let html = '';
    let overallTotal = 0;
    
    for (let month in monthlyData) {
        overallTotal += monthlyData[month];
        const totalColor = color || (monthlyData[month] < 0 ? 'red' : 'green');
        html += `<div class="header">
                    <span>${month}</span>
                    <span class="total" style="color: ${totalColor};">
                        ${monthlyData[month].toFixed(2)}
                    </span>
                </div>`;
    }

    // Set "Entire duration" to always be black
    html += `<div class="header">
                <span>Entire duration</span>
                <span class="total" style="color: black;">
                    ${overallTotal.toFixed(2)}
                </span>
            </div>`;

    return html;
}