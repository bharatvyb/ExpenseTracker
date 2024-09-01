document.getElementById('revenue-form').addEventListener('submit', addRevenue);
document.getElementById('outgo-form').addEventListener('submit', addOutGo);

function addRevenue(e) {
    e.preventDefault();
    const revenueDate = document.getElementById('revenue-date').value;
    console.log('Revenue Date:', revenueDate); // Log the date to verify it's being captured
    const revenue = {
        date: revenueDate,
        amount: parseFloat(document.getElementById('revenue-amount').value),
        memo: document.getElementById('revenue-memo').value,
        category: document.getElementById('revenue-category').value,
        method: document.getElementById('revenue-method').value
    };
    storeTransaction('revenue', revenue);
    document.getElementById('revenue-form').reset();
    document.getElementById('revenue-date').value = revenueDate; // Set the date back after resetting
}

function addOutGo(e) {
    e.preventDefault();
    const outgoDate = document.getElementById('outgo-date').value;
    console.log('OutGo Date:', outgoDate); // Log the date to verify it's being captured
    const outgo = {
        date: outgoDate,
        amount: parseFloat(document.getElementById('outgo-amount').value),
        memo: document.getElementById('outgo-memo').value,
        category: document.getElementById('outgo-category').value,
        method: document.getElementById('outgo-method').value
    };
    storeTransaction('outgo', outgo);
    document.getElementById('outgo-form').reset();
    document.getElementById('outgo-date').value = outgoDate; // Set the date back after resetting
}

function storeTransaction(type, transaction) {
    let transactions = JSON.parse(localStorage.getItem(type)) || [];
    transactions.push(transaction);
    localStorage.setItem(type, JSON.stringify(transactions));
}

document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultMethods();      // Initialize methods if not already in localStorage
    initializeDefaultCategories();  // Initialize categories if not already in localStorage
    loadDropdownValues();
    setDefaultDateFields();  // Set the default date on page load
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
    const revenueMethodSelect = document.getElementById('revenue-method');
    const outgoMethodSelect = document.getElementById('outgo-method');
    const revenueCategorySelect = document.getElementById('revenue-category');
    const outgoCategorySelect = document.getElementById('outgo-category');
    
    const methods = JSON.parse(localStorage.getItem('methods')) || [];
    const categories = JSON.parse(localStorage.getItem('categories')) || [];

    revenueMethodSelect.innerHTML = '';
    outgoMethodSelect.innerHTML = '';
    revenueCategorySelect.innerHTML = '';
    outgoCategorySelect.innerHTML = '';

    methods.forEach(method => {
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        option1.value = method;
        option1.textContent = method;
        option2.value = method;
        option2.textContent = method;
        revenueMethodSelect.appendChild(option1);
        outgoMethodSelect.appendChild(option2);
    });

    categories.forEach(category => {
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        option1.value = category;
        option1.textContent = category;
        option2.value = category;
        option2.textContent = category;
        revenueCategorySelect.appendChild(option1);
        outgoCategorySelect.appendChild(option2);
    });
}

function setDefaultDateFields() {
    resetDateField('revenue-date');
    resetDateField('outgo-date');
}

function resetDateField(dateFieldId) {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById(dateFieldId).value = today;
}