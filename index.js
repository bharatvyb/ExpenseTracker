document.getElementById('transaction-form').addEventListener('submit', function(e) {
    addOrUpdateTransaction(e);
});

document.getElementById('transaction-date').addEventListener('change', function() {
    loadTransactionsForDate();  // Update the table when the date changes
});

// To handle adding or updating a transaction
function addOrUpdateTransaction(e) {
    e.preventDefault();

    const transactionType = document.querySelector('input[name="transaction-type"]:checked').value;
    const transactionDate = document.getElementById('transaction-date').value;
    const transactionAmount = parseFloat(document.getElementById('transaction-amount').value);
    const transactionMemo = document.getElementById('transaction-memo').value;
    const transactionCategory = document.getElementById('transaction-category').value;
    const transactionMethod = document.getElementById('transaction-method').value;

    const transaction = {
        date: transactionDate,
        amount: transactionAmount,
        memo: transactionMemo,
        category: transactionCategory,
        method: transactionMethod,
        type: transactionType
    };

    const isEditMode = document.getElementById('transaction-form').getAttribute('data-edit-mode');

    if (isEditMode === 'true') {
        const editIndex = document.getElementById('transaction-form').getAttribute('data-edit-index');
        updateTransaction(editIndex, transaction);
    } else {
        storeTransaction(transaction);
    }

    document.getElementById('transaction-form').reset();
    document.getElementById('transaction-date').value = transactionDate;

    loadTransactionsForDate();
    resetFormButton();
}

// Store new transaction in localStorage
function storeTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Update existing transaction in localStorage
function updateTransaction(index, updatedTransaction) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions[parseInt(index, 10)] = updatedTransaction; // Ensure the index is used correctly
    localStorage.setItem('transactions', JSON.stringify(transactions));

    document.getElementById('transaction-form').removeAttribute('data-edit-mode');
    document.getElementById('transaction-form').removeAttribute('data-edit-index');
}

// Load transactions for the selected date and apply color coding
function loadTransactionsForDate() {
    const selectedDate = document.getElementById('transaction-date').value;
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    
    // Create an array of objects that include the transaction and its original index
    const filteredTransactions = transactions
        .map((transaction, originalIndex) => ({ ...transaction, originalIndex }))
        .filter(transaction => transaction.date === selectedDate);

    const transactionTableCard = document.getElementById('transaction-table-card');
    const transactionTableBody = document.getElementById('transaction-table').querySelector('tbody');

    if (filteredTransactions.length > 0) {
        transactionTableCard.style.display = 'block';
        document.getElementById('selected-date').textContent = selectedDate;

        transactionTableBody.innerHTML = '';  // Clear table body before populating

        filteredTransactions.forEach((transaction) => {
            const row = document.createElement('tr');

            // Apply revenue-row or outgo-row class based on transaction type
            row.classList.add(transaction.type === 'revenue' ? 'revenue-row' : 'outgo-row');
            
            row.innerHTML = `
                <td>${transaction.amount}</td>
                <td>${transaction.memo}</td>
                <td>
                    <button class="delete-btn">Delete</button>
                </td>
            `;
            
            // Add click event to populate form for editing
            row.addEventListener('click', function() {
                populateTransactionForEditing(transaction, transaction.originalIndex);
            });

            // Add event listener to the delete button
            row.querySelector('.delete-btn').addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent triggering the row click event
                deleteTransaction(transaction.originalIndex);
            });

            transactionTableBody.appendChild(row);
        });
    } else {
        transactionTableCard.style.display = 'none';
    }
}

// Populate transaction details for editing
function populateTransactionForEditing(transaction, index) {
    document.getElementById('transaction-date').value = transaction.date;
    document.getElementById('transaction-amount').value = transaction.amount;
    document.getElementById('transaction-memo').value = transaction.memo;
    document.getElementById('transaction-category').value = transaction.category;
    document.getElementById('transaction-method').value = transaction.method;

    // Set the correct transaction type
    const transactionTypeRadios = document.querySelectorAll('input[name="transaction-type"]');
    transactionTypeRadios.forEach(radio => {
        if (radio.value === transaction.type) {
            radio.checked = true;
            radio.nextElementSibling.classList.add('active');
        } else {
            radio.nextElementSibling.classList.remove('active');
        }
    });

    document.getElementById('transaction-form').setAttribute('data-edit-mode', 'true');
    document.getElementById('transaction-form').setAttribute('data-edit-index', index);

    // Change button text to "Save Changes"
    document.querySelector('.primary-btn').textContent = 'Save Changes';
}

// Reset form button to "Add Transaction" when not in edit mode
function resetFormButton() {
    document.querySelector('.primary-btn').textContent = 'Add Transaction';
    document.getElementById('transaction-form').removeAttribute('data-edit-mode');
    document.getElementById('transaction-form').removeAttribute('data-edit-index');
}

// Delete a transaction
function deleteTransaction(originalIndex) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.splice(originalIndex, 1); // Remove the transaction at the original index
        localStorage.setItem('transactions', JSON.stringify(transactions));
        loadTransactionsForDate(); // Reload the transactions table
    }
}

// Initialize dropdown values and event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultMethods();
    initializeDefaultCategories();
    loadDropdownValues();
    setDefaultDateFields();
    setupTransactionTypeToggle();
    displayUsername();
    loadTransactionsForDate(); // Load transactions for the default date
});

// Set default methods and categories if they don't exist in localStorage
function initializeDefaultMethods() {
    let methods = JSON.parse(localStorage.getItem('methods')) || [];
    if (methods.length === 0) {
        methods = ['UPI', 'Credit Card', 'Cash'];
        localStorage.setItem('methods', JSON.stringify(methods));
    }
}

function initializeDefaultCategories() {
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    if (categories.length === 0) {
        categories = ['Shopping', 'Cabs', 'CC Bill', 'Hospital', 'Medicines', 'Vegetables', 'Fruits', 'Groceries', 'Milk', 'Subscription', 'School Fee', 'Office Expenses'];
        localStorage.setItem('categories', JSON.stringify(categories));
    }
}

// Load dropdown values for payment method and category
function loadDropdownValues() {
    const transactionMethodSelect = document.getElementById('transaction-method');
    const transactionCategorySelect = document.getElementById('transaction-category');
    
    const methods = JSON.parse(localStorage.getItem('methods')) || [];
    const categories = JSON.parse(localStorage.getItem('categories')) || [];

    transactionMethodSelect.innerHTML = '';
    transactionCategorySelect.innerHTML = '';

    methods.forEach(method => {
        const option = document.createElement('option');
        option.value = method;
        option.textContent = method;
        transactionMethodSelect.appendChild(option);
    });

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        transactionCategorySelect.appendChild(option);
    });
}

// Set default date on page load
function setDefaultDateFields() {
    resetDateField('transaction-date');
}

// Reset date field to current date
function resetDateField(dateFieldId) {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById(dateFieldId).value = today;
}

// Setup radio button toggle for transaction type
function setupTransactionTypeToggle() {
    const radios = document.querySelectorAll('input[name="transaction-type"]');
    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.tablink').forEach(tab => {
                tab.classList.remove('active');
            });
            this.nextElementSibling.classList.add('active');
        });
    });
    radios[1].dispatchEvent(new Event('change')); // Set OutGo as the default
}

// Display username from localStorage
function displayUsername() {
    const savedNickname = localStorage.getItem('nickname');
    const userNameSpan = document.getElementById('user-name');
    if (savedNickname) {
        userNameSpan.textContent = savedNickname;
    }
}