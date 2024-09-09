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

document.addEventListener('DOMContentLoaded', function () {
    adjustTabContentHeight();
    window.addEventListener('resize', adjustTabContentHeight);
    loadMonthlyData();
    setupModal();  // Ensure this is loaded after the modal.js is imported
    document.getElementById('defaultOpenMonthly').click();
});

// Adjust Tab Content Height
function adjustTabContentHeight() {
    var tabContentElements = document.getElementsByClassName('tabcontent');
    for (var i = 0; i < tabContentElements.length; i++) {
        tabContentElements[i].style.maxHeight = `calc(100vh - ${document.querySelector('.tabs').offsetHeight + document.querySelector('.bottom-menu').offsetHeight + 120}px)`;
    }
}

// Group Transactions By Date
function groupTransactionsByDate(transactions) {
    return transactions.reduce((acc, transaction, index) => {
        transaction.index = index;  // Assign index here for proper reference in modal
        const date = transaction.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
    }, {});
}

// Load Monthly Data and Sort in Descending Order
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

        const revenueCard = createTransactionCard(date, dailyTransactions, 'revenue');
        const outgoCard = createTransactionCard(date, dailyTransactions, 'outgo');
        const allCard = createTransactionCard(date, dailyTransactions, 'all');

        revenueContainer.appendChild(revenueCard);
        outgoContainer.appendChild(outgoCard);
        allContainer.appendChild(allCard);
    });
}

// Create Transaction Card with 15 Character Width Columns
function createTransactionCard(date, transactions, type) {
    const total = transactions.reduce((acc, transaction) => {
        if (type === 'all') {
            return transaction.type === 'revenue' ? acc + parseFloat(transaction.amount) : acc - parseFloat(transaction.amount);
        }
        return transaction.type === type ? acc + parseFloat(transaction.amount) : acc;
    }, 0);

    const card = document.createElement('div');
    card.classList.add('transaction-card');

    const header = document.createElement('div');
    header.classList.add('card-header');
    header.innerHTML = `
        <span class="card-date">${date}</span>
        <span class="card-total">Total: ${total}</span>
    `;
    card.appendChild(header);

    const tableHeader = document.createElement('div');
    tableHeader.classList.add('table-header');
    tableHeader.innerHTML = `
        <span>Amount</span>
        <span>Memo</span>
        <span>Method</span>
    `;
    card.appendChild(tableHeader);

    const body = document.createElement('div');
    body.classList.add('card-body');

    transactions.forEach(transaction => {
        if (transaction.type === type || type === 'all') {
            const transactionRow = document.createElement('div');
            transactionRow.classList.add('transaction-row');
            const colorClass = transaction.type === 'revenue' ? 'revenue-row' : 'outgo-row';

            transactionRow.innerHTML = `
                <span class="${colorClass}">${truncateText(transaction.amount.toString())}</span>
                <span class="${colorClass}">${truncateText(transaction.memo)}</span>
                <span class="${colorClass}">${truncateText(transaction.method)}</span>
            `;

            transactionRow.addEventListener('click', () => openEditModal(transaction.index));  // Modal-related

            body.appendChild(transactionRow);
        }
    });

    card.appendChild(body);
    return card;
}

// Truncate Text for Memo, Method, and Amount
function truncateText(text, length = 15) {
    if (text.length > length) {
        return text.substring(0, length) + '...';
    }
    return text;
}