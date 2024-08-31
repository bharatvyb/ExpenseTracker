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
    loadDropdownValues();
});

function loadDropdownValues() {
    const revenueSelect = document.getElementById('revenue-method');
    const outgoSelect = document.getElementById('outgo-method');
    const methods = JSON.parse(localStorage.getItem('methods')) || [];

    revenueSelect.innerHTML = '';
    outgoSelect.innerHTML = '';
    methods.forEach(method => {
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        option1.value = method;
        option1.textContent = method;
        option2.value = method;
        option2.textContent = method;
        revenueSelect.appendChild(option1);
        outgoSelect.appendChild(option2);
    });
}