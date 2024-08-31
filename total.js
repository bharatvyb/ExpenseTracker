document.addEventListener('DOMContentLoaded', function() {
    loadTotalData();
    // Ensure the correct tab is opened by default
    document.getElementById('defaultOpenTotal').click();
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
    revenueTable.innerHTML += generateTotalsHtml(monthlyRevenue);
}

function loadTotalOutGoData() {
    const outgoTable = document.getElementById('total-outgo');
    const outgoes = JSON.parse(localStorage.getItem('outgo')) || [];
    const monthlyOutGo = calculateMonthlyTotals(outgoes);
    
    outgoTable.innerHTML = '';
    outgoTable.innerHTML += generateTotalsHtml(monthlyOutGo);
}

function loadTotalAllData() {
    const allTable = document.getElementById('total-all');
    const revenues = JSON.parse(localStorage.getItem('revenue')) || [];
    const outgoes = JSON.parse(localStorage.getItem('outgo')) || [];

    const monthlyRevenue = calculateMonthlyTotals(revenues);
    const monthlyOutGo = calculateMonthlyTotals(outgoes);
    
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
    allTable.innerHTML += generateTotalsHtml(monthlyAll);
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

function generateTotalsHtml(monthlyData) {
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