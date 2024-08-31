document.getElementById('revenue-form').addEventListener('submit', addRevenue);
document.getElementById('outgo-form').addEventListener('submit', addOutGo);

function addRevenue(e) {
    e.preventDefault();
    const revenue = {
        date: document.getElementById('revenue-date').value,
        amount: parseFloat(document.getElementById('revenue-amount').value),
        memo: document.getElementById('revenue-memo').value,
        category: document.getElementById('revenue-category').value,
        method: document.getElementById('revenue-method').value
    };
    storeTransaction('revenue', revenue);
    document.getElementById('revenue-form').reset();
}

function addOutGo(e) {
    e.preventDefault();
    const outgo = {
        date: document.getElementById('outgo-date').value,
        amount: parseFloat(document.getElementById('outgo-amount').value),
        memo: document.getElementById('outgo-memo').value,
        category: document.getElementById('outgo-category').value,
        method: document.getElementById('outgo-method').value
    };
    storeTransaction('outgo', outgo);
    document.getElementById('outgo-form').reset();
}

function storeTransaction(type, transaction) {
    let transactions = JSON.parse(localStorage.getItem(type)) || [];
    transactions.push(transaction);
    localStorage.setItem(type, JSON.stringify(transactions));
}

document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultCategories();  // Initialize categories if not already in localStorage
    loadDropdownValues();
});

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