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
    setupModal();
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

            transactionRow.addEventListener('click', () => openEditModal(transaction.index));

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

// Modal Setup Functions
function setupModal() {
    const modal = document.getElementById('edit-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const deleteTransactionBtn = document.getElementById('delete-transaction');

    closeModalBtn.onclick = closeModal;
    cancelEditBtn.onclick = closeModal;

    deleteTransactionBtn.onclick = function () {
        const transactionIndex = modal.getAttribute('data-index');
        deleteTransaction(transactionIndex);
        closeModal();
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            closeModal();
        }
    };
}

// Open Edit Modal
function openEditModal(index) {
    const modal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const transaction = transactions[index];

    modal.setAttribute('data-index', index);

    document.getElementById('edit-date').value = transaction.date;
    document.getElementById('edit-amount').value = transaction.amount;
    document.getElementById('edit-memo').value = transaction.memo;
    document.getElementById('edit-category').value = transaction.category;

    const paymentMethodDropdown = document.getElementById('edit-method');
    const methods = JSON.parse(localStorage.getItem('methods')) || ['UPI', 'Cash', 'Credit Card'];
    paymentMethodDropdown.innerHTML = '';

    methods.forEach(method => {
        const option = document.createElement('option');
        option.value = method;
        option.textContent = method;
        if (method === transaction.method) {
            option.selected = true;
        }
        paymentMethodDropdown.appendChild(option);
    });

    const categoryDropdown = document.getElementById('edit-category');
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    categoryDropdown.innerHTML = '';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        if (category === transaction.category) {
            option.selected = true;
        }
        categoryDropdown.appendChild(option);
    });

    const typeRadioButtons = document.getElementsByName('edit-type');
    for (let i = 0; i < typeRadioButtons.length; i++) {
        if (typeRadioButtons[i].value.toLowerCase() === transaction.type) {
            typeRadioButtons[i].checked = true;
            break;
        }
    }

    modal.style.display = 'block';

    editForm.onsubmit = function (e) {
        e.preventDefault();
        saveEdit(index);
    };
}

// Close Modal
function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

// Save Edited Transaction
function saveEdit(index) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const updatedTransaction = {
        date: document.getElementById('edit-date').value,
        amount: parseFloat(document.getElementById('edit-amount').value),
        memo: document.getElementById('edit-memo').value,
        category: document.getElementById('edit-category').value,
        method: document.getElementById('edit-method').value,
        type: document.querySelector('input[name="edit-type"]:checked').value.toLowerCase()
    };

    transactions[index] = updatedTransaction;
    localStorage.setItem('transactions', JSON.stringify(transactions));

    closeModal();
    loadMonthlyData();
}

// Delete Transaction
function deleteTransaction(index) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    loadMonthlyData();
}