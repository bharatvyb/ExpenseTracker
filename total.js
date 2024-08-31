document.addEventListener('DOMContentLoaded', function() {
    // Load all the data
    loadTotalData();
    // Simulate a click on the OutGo tab to make it the default tab
    document.getElementById('defaultOpenOutGo').click();
});

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
    revenueTable.innerHTML += generateTotalsHtml(monthlyRevenue, 'Revenue');
}

function loadTotalOutGoData() {
    const outgoTable = document.getElementById('total-outgo');
    const outgoes = JSON.parse(localStorage.getItem('outgo')) || [];
    const monthlyOutGo = calculateMonthlyTotals(outgoes);
    
    outgoTable.innerHTML = '';
    outgoTable.innerHTML += generateTotalsHtml(monthlyOutGo, 'OutGo');
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

function generateTotalsHtml(monthlyData, type) {
    let html = '';
    let overallTotal = 0;
    
    for (let month in monthlyData) {
        overallTotal += monthlyData[month];
        html += `<div class="header">
                    <span>${month}</span>
                    <span class="total ${monthlyData[month] < 0 ? 'negative' : ''}">
                        ${monthlyData[month].toFixed(2)}
                    </span>
                </div>`;
    }

    html += `<div class="header">
                <span>Entire duration</span>
                <span class="total ${overallTotal < 0 ? 'negative' : ''}">
                    ${overallTotal.toFixed(2)}
                </span>
            </div>`;

    return html;
}