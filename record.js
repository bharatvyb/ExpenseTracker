document.getElementById('transaction-form').addEventListener('submit', function(e) {
    addTransaction(e);
});

function addTransaction(e) {
    e.preventDefault();

    // Get selected transaction type from radio buttons
    const transactionType = document.querySelector('input[name="transaction-type"]:checked').value;

    const transactionDate = document.getElementById('transaction-date').value;
    console.log(`${transactionType} Date:`, transactionDate); // Log the date to verify it's being captured

    const transaction = {
        date: transactionDate,
        amount: parseFloat(document.getElementById('transaction-amount').value),
        memo: document.getElementById('transaction-memo').value,
        category: document.getElementById('transaction-category').value,
        method: document.getElementById('transaction-method').value,
        type: transactionType // Add the type field
    };

    storeTransaction(transaction);
    document.getElementById('transaction-form').reset();
    document.getElementById('transaction-date').value = transactionDate; // Set the date back after resetting
}

function storeTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultMethods();      // Initialize methods if not already in localStorage
    initializeDefaultCategories();  // Initialize categories if not already in localStorage
    loadDropdownValues();
    setDefaultDateFields();  // Set the default date on page load
    setupTransactionTypeToggle(); // Setup radio button toggle
});

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

function setDefaultDateFields() {
    resetDateField('transaction-date');
}

function resetDateField(dateFieldId) {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById(dateFieldId).value = today;
}

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