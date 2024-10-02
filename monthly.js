// Open Tabs
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Ensure that colors are updated after loading data
document.addEventListener('DOMContentLoaded', function () {
    adjustTabContentHeight();
    window.addEventListener('resize', adjustTabContentHeight);
    loadMonthlyData();
    setupModal();
    document.getElementById('defaultOpenMonthly').click();
    loadSummaryData(); // Load the Summary tab data
    updateSumColors(); // Update colors on initial load
});

// Adjust Tab Content Height
function adjustTabContentHeight() {
    var tabContentElements = document.getElementsByClassName('tabcontent');
    for (var i = 0; i < tabContentElements.length; i++) {
        tabContentElements[i].style.maxHeight = `calc(100vh - ${document.querySelector('.tabs').offsetHeight + document.querySelector('.bottom-menu').offsetHeight + 120}px)`;
    }
}

// Group Transactions By Date for Non-Summary Tabs
function groupTransactionsByDate(transactions) {
    return transactions.reduce((acc, transaction, index) => {
        transaction.index = index; // Assign index here for proper reference in modal
        const date = transaction.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
    }, {});
}

// Load Monthly Data for Non-Summary Tabs (Revenue, OutGo, All)
function loadMonthlyData() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let groupedTransactions = groupTransactionsByDate(transactions);

    // Sort the grouped transactions by date in descending order
    const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b) - new Date(a));

    const revenueContainer = document.getElementById('revenue-container');
    const outgoContainer = document.getElementById('outgo-container');
    const allContainer = document.getElementById('all-container');

    revenueContainer.innerHTML = '';
    outgoContainer.innerHTML = '';
    allContainer.innerHTML = '';

    sortedDates.forEach(date => {
        const dailyTransactions = groupedTransactions[date];

        const revenueCard = createFilteredTransactionCard(date, dailyTransactions, 'revenue');
        const outgoCard = createFilteredTransactionCard(date, dailyTransactions, 'outgo');
        const allCard = createFilteredTransactionCard(date, dailyTransactions, 'all');

        if (revenueCard) revenueContainer.appendChild(revenueCard);
        if (outgoCard) outgoContainer.appendChild(outgoCard);
        if (allCard) allContainer.appendChild(allCard);
    });
}

// Create Filtered Transaction Card to Skip Empty Transaction Lists
function createFilteredTransactionCard(date, transactions, type) {
    const filteredTransactions = transactions.filter(transaction => transaction.type === type || type === 'all');
    if (filteredTransactions.length === 0) {
        return null; // Skip cards with no transactions
    }
    return createTransactionCard(date, filteredTransactions, type);
}

// Create Transaction Card for Non-Summary Tabs (Revenue, OutGo, All)
function createTransactionCard(date, transactions, type) {
    const total = transactions.reduce((acc, transaction) => {
        if (type === 'all') {
            return transaction.type === 'revenue' ? acc + parseFloat(transaction.amount) : acc - parseFloat(transaction.amount);
        }
        return transaction.type === type ? acc + parseFloat(transaction.amount) : acc;
    }, 0);

    const formattedTotal = type === 'outgo' ? `- ${Math.abs(total).toFixed(2)}` : total.toFixed(2);
    const card = document.createElement('div');
    card.classList.add('transaction-card');

    const header = document.createElement('div');
    header.classList.add('card-header');

    const totalClass = type === 'outgo' ? 'negative-sum' : (total >= 0 ? 'positive-sum' : 'negative-sum');

    header.innerHTML = `
        <span class="card-date">${date}</span>
        <span class="card-total ${totalClass}">Total: ${formattedTotal}</span>
    `;
    card.appendChild(header);

    const table = document.createElement('table');
    table.classList.add('transaction-table');

    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = `
        <tr>
            <th>Amount</th>
            <th>Memo</th>
            <th>Method</th>
        </tr>
    `;
    table.appendChild(tableHeader);

    const tableBody = document.createElement('tbody');
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        const colorClass = transaction.type === 'revenue' ? 'revenue-row' : 'outgo-row';
        row.classList.add(colorClass);

        row.innerHTML = `
            <td>${truncateText(transaction.amount.toString())}</td>
            <td>${truncateText(transaction.memo)}</td>
            <td>${truncateText(transaction.method)}</td>
        `;

        row.addEventListener('click', () => openEditModal(transaction.index));
        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    card.appendChild(table);
    return card;
}

// Load category-wise summary and sort in descending order
function loadSummaryData() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const summaryContainer = document.getElementById('summary-container');
    summaryContainer.innerHTML = '';

    const monthlyCategoryTotals = calculateMonthlyCategoryTotals(transactions);
    const sortedMonths = Object.keys(monthlyCategoryTotals).sort((a, b) => new Date(b) - new Date(a));

    sortedMonths.forEach(month => {
        const categoriesForMonth = monthlyCategoryTotals[month];
        const summaryCard = createSummaryTransactionCard(month, categoriesForMonth);
        summaryContainer.appendChild(summaryCard);
    });
}

// Create Transaction Card for the Summary Tab
// Update the Summary Tab creation to add the click event for the modal popup
function createSummaryTransactionCard(month, categoriesForMonth) {
    const totalSum = categoriesForMonth.reduce((acc, category) => acc + category.amount, 0);
    const card = document.createElement('div');
    card.classList.add('transaction-card');

    const sumColorClass = totalSum < 0 ? 'negative-sum' : 'positive-sum';
    const header = `
        <div class="card-header">
            <span>${month}</span>
            <span class="card-total ${sumColorClass}">Overall Sum: ${totalSum.toFixed(2)}</span>
        </div>
    `;
    card.innerHTML = header;

    const table = document.createElement('table');
    table.classList.add('transaction-table');
    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = `
        <tr>
            <th>Category</th>
            <th>Amount</th>
        </tr>
    `;
    table.appendChild(tableHeader);

    const tableBody = document.createElement('tbody');
    categoriesForMonth.forEach(categoryData => {
        const row = document.createElement('tr');
        const amountClass = categoryData.amount >= 0 ? 'revenue-row' : 'outgo-row';
        row.classList.add(amountClass);

        row.innerHTML = `
            <td>${categoryData.category}</td>
            <td>${categoryData.amount.toFixed(2)}</td>
        `;

        // Add click event to open the detailed modal
        row.onclick = () => openSummaryCategoryModal(categoryData.category, month);

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    card.appendChild(table);
    return card;
}

// Calculate monthly category totals
function calculateMonthlyCategoryTotals(transactions) {
    const monthlyCategoryTotals = {};
    transactions.forEach(transaction => {
        const month = transaction.date.substring(0, 7);
        const category = transaction.category;
        const typeMultiplier = transaction.type === 'revenue' ? 1 : -1;
        const amount = transaction.amount * typeMultiplier;

        if (!monthlyCategoryTotals[month]) {
            monthlyCategoryTotals[month] = [];
        }

        let categoryData = monthlyCategoryTotals[month].find(cat => cat.category === category);
        if (categoryData) {
            categoryData.amount += amount;
        } else {
            monthlyCategoryTotals[month].push({ category: category, amount: amount });
        }
    });
    return monthlyCategoryTotals;
}

// Truncate text for Memo, Method, and Amount in non-Summary tabs
function truncateText(text, length = 15) {
    if (text.length > length) {
        return text.substring(0, length) + '...';
    }
    return text;
}

// Open the Summary Category Modal to show detailed transactions for a category
function openSummaryCategoryModal(category, month) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const modal = document.getElementById('summary-category-modal');
    const modalBody = document.getElementById('summary-category-modal-body');
    
    // Filter transactions for the given category and month
    const categoryTransactions = transactions
        .filter(t => t.category === category && t.date.startsWith(month))
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

    // Calculate the total sum for the category transactions
    const totalSum = categoryTransactions.reduce((acc, t) => acc + (t.type === 'revenue' ? t.amount : -t.amount), 0);

    // Update the modal header with the total sum
    const sumColorClass = totalSum < 0 ? 'negative-sum' : 'positive-sum';
    document.getElementById('summary-modal-header').innerHTML = `
        <h3>Transactions for ${category} in ${month} - <span class="${sumColorClass}">Total: ${totalSum.toFixed(2)}</span></h3>
    `;

    // Clear previous modal data
    modalBody.innerHTML = '';

    // Create a table for the detailed transactions
    const table = document.createElement('table');
    table.classList.add('transaction-table');

    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = `
        <tr>
            <th>Amount</th>
            <th>Memo</th>
            <th>Payment Method</th>
        </tr>
    `;
    table.appendChild(tableHeader);

    const tableBody = document.createElement('tbody');
    categoryTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        const amountClass = transaction.type === 'revenue' ? 'revenue-row' : 'outgo-row';
        row.classList.add(amountClass);

        row.innerHTML = `
            <td>${transaction.amount.toFixed(2)}</td>
            <td>${transaction.memo}</td>
            <td>${transaction.method}</td>
        `;
        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    modalBody.appendChild(table);

    // Open the modal
    modal.style.display = 'block';
}
