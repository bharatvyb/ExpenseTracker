function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablink" and remove the class "active"
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded, initializing...");
    loadMonthlyData();
    setupModal();
    document.getElementById('defaultOpenMonthly').click();  // Initialize the first tab
});

function loadMonthlyData() {
    console.log("Loading monthly data...");
    loadRevenueData();
    loadOutGoData();
    loadAllData();
}

function loadRevenueData() {
    const revenueTable = document.getElementById('revenue-table').getElementsByTagName('tbody')[0];
    const revenues = JSON.parse(localStorage.getItem('revenue')) || [];
    console.log("Revenue data loaded:", revenues);

    revenueTable.innerHTML = '';

    if (revenues.length === 0) {
        console.log("No revenue data found.");
    }

    revenues.forEach((revenue, index) => {
        let row = revenueTable.insertRow();
        row.dataset.type = 'revenue';
        row.dataset.index = index;
        row.style.color = 'green';  // Set row color to green for Revenue
        row.insertCell(0).textContent = revenue.date;
        row.insertCell(1).textContent = revenue.amount;
        row.insertCell(2).textContent = revenue.memo;
        row.insertCell(3).textContent = revenue.category;
        row.insertCell(4).textContent = revenue.method;

        // Add the > symbol to indicate editability
        row.insertCell(5).textContent = '>';

        row.addEventListener('click', () => openEditModal('revenue', index));
    });
}

function loadOutGoData() {
    const outgoTable = document.getElementById('outgo-table').getElementsByTagName('tbody')[0];
    const outgoes = JSON.parse(localStorage.getItem('outgo')) || [];
    console.log("OutGo data loaded:", outgoes);

    outgoTable.innerHTML = '';

    if (outgoes.length === 0) {
        console.log("No OutGo data found.");
    }

    outgoes.forEach((outgo, index) => {
        let row = outgoTable.insertRow();
        row.dataset.type = 'outgo';
        row.dataset.index = index;
        row.style.color = 'red';  // Set row color to red for OutGo
        row.insertCell(0).textContent = outgo.date;
        row.insertCell(1).textContent = outgo.amount;
        row.insertCell(2).textContent = outgo.memo;
        row.insertCell(3).textContent = outgo.category;
        row.insertCell(4).textContent = outgo.method;

        // Add the > symbol to indicate editability
        row.insertCell(5).textContent = '>';

        row.addEventListener('click', () => openEditModal('outgo', index));
    });
}

function loadAllData() {
    const allTable = document.getElementById('all-table').getElementsByTagName('tbody')[0];
    const revenues = JSON.parse(localStorage.getItem('revenue')) || [];
    const outgoes = JSON.parse(localStorage.getItem('outgo')) || [];
    console.log("All data loaded. Revenues:", revenues, "OutGoes:", outgoes);

    allTable.innerHTML = '';

    if (revenues.length === 0 && outgoes.length === 0) {
        console.log("No data found for All tab.");
    }

    revenues.forEach((revenue, index) => {
        let row = allTable.insertRow();
        row.style.color = 'green';
        row.dataset.type = 'revenue';
        row.dataset.index = index;
        row.insertCell(0).textContent = revenue.date;
        row.insertCell(1).textContent = revenue.amount;
        row.insertCell(2).textContent = revenue.memo;
        row.insertCell(3).textContent = revenue.category;
        row.insertCell(4).textContent = revenue.method;

        // Add the > symbol to indicate editability
        row.insertCell(5).textContent = '>';

        row.addEventListener('click', () => openEditModal('revenue', index));
    });

    outgoes.forEach((outgo, index) => {
        let row = allTable.insertRow();
        row.style.color = 'red';
        row.dataset.type = 'outgo';
        row.dataset.index = index;
        row.insertCell(0).textContent = outgo.date;
        row.insertCell(1).textContent = outgo.amount;
        row.insertCell(2).textContent = outgo.memo;
        row.insertCell(3).textContent = outgo.category;
        row.insertCell(4).textContent = outgo.method;

        // Add the > symbol to indicate editability
        row.insertCell(5).textContent = '>';

        row.addEventListener('click', () => openEditModal('outgo', index));
    });
}

// Modal setup function
function setupModal() {
    const modal = document.getElementById('edit-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelEditBtn = document.getElementById('cancel-edit');

    closeModalBtn.onclick = closeModal;
    cancelEditBtn.onclick = closeModal;

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }
}

// Open Edit Modal function
function openEditModal(type, index) {
    const modal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const transactions = JSON.parse(localStorage.getItem(type)) || [];
    const transaction = transactions[index];

    // Populate the modal form with the current transaction data
    document.getElementById('edit-date').value = transaction.date;
    document.getElementById('edit-amount').value = transaction.amount;
    document.getElementById('edit-memo').value = transaction.memo;
    document.getElementById('edit-category').value = transaction.category;

    // Populate the payment method dropdown
    const paymentMethodDropdown = document.getElementById('edit-method');
    const methods = JSON.parse(localStorage.getItem('methods')) || ['UPI', 'Cash', 'Credit Card'];
    paymentMethodDropdown.innerHTML = '';  // Clear existing options

    methods.forEach(method => {
        const option = document.createElement('option');
        option.value = method;
        option.textContent = method;
        if (method === transaction.method) {
            option.selected = true;
        }
        paymentMethodDropdown.appendChild(option);
    });

    modal.style.display = 'block';

    editForm.onsubmit = function(e) {
        e.preventDefault();
        saveEdit(type, index);
    };
}

function closeModal() {
    console.log("Closing modal.");
    document.getElementById('edit-modal').style.display = 'none';
}

function saveEdit(type, index) {
    console.log(`Saving edit for type: ${type}, index: ${index}`);
    const transactions = JSON.parse(localStorage.getItem(type)) || [];
    const updatedTransaction = {
        date: document.getElementById('edit-date').value,
        amount: parseFloat(document.getElementById('edit-amount').value),
        memo: document.getElementById('edit-memo').value,
        category: document.getElementById('edit-category').value,
        method: document.getElementById('edit-method').value
    };

    transactions[index] = updatedTransaction;
    localStorage.setItem(type, JSON.stringify(transactions));

    closeModal();
    loadMonthlyData();  // Reload the data to reflect the changes
}