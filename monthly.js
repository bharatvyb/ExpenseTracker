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

document.addEventListener('DOMContentLoaded', function () {
    console.log("Page loaded, initializing...");
    adjustTabContentHeight();
    window.addEventListener('resize', adjustTabContentHeight);
    loadMonthlyData();
    setupModal();
    document.getElementById('defaultOpenMonthly').click();
});

function adjustTabContentHeight() {
    var tabContentElements = document.getElementsByClassName('tabcontent');
    for (var i = 0; i < tabContentElements.length; i++) {
        tabContentElements[i].style.maxHeight = `calc(100vh - ${document.querySelector('.tabs').offsetHeight + document.querySelector('.bottom-menu').offsetHeight + 120}px)`;
    }
}

function loadMonthlyData() {
    console.log("Loading monthly data...");
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const revenueTable = document.getElementById('revenue-table').getElementsByTagName('tbody')[0];
    const outgoTable = document.getElementById('outgo-table').getElementsByTagName('tbody')[0];
    const allTable = document.getElementById('all-table').getElementsByTagName('tbody')[0];

    revenueTable.innerHTML = '';
    outgoTable.innerHTML = '';
    allTable.innerHTML = '';

    transactions.forEach((transaction, index) => {
        let row = document.createElement('tr');
        row.dataset.index = index;
        row.style.color = transaction.type === 'revenue' ? 'green' : 'red';

        row.insertCell(0).textContent = transaction.date;
        row.insertCell(1).textContent = transaction.amount;
        row.insertCell(2).textContent = transaction.memo;
        row.insertCell(3).textContent = transaction.category;
        row.insertCell(4).textContent = transaction.method;

        let editCell = row.insertCell(5);
        let editBtn = document.createElement('button');
        editBtn.textContent = 'E';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', () => openEditModal(index));
        editCell.appendChild(editBtn);

        if (transaction.type === 'revenue') {
            revenueTable.appendChild(row);
        } else if (transaction.type === 'outgo') {
            outgoTable.appendChild(row);
        }

        let allRow = row.cloneNode(true);
        allRow.querySelector('.edit-btn').addEventListener('click', () => openEditModal(index));
        allTable.appendChild(allRow);
    });
}

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

function openEditModal(index) {
    console.log(`Opening modal for index: ${index}`);
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

    // Set the transaction type radio button
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

function closeModal() {
    console.log("Closing modal.");
    document.getElementById('edit-modal').style.display = 'none';
}

function saveEdit(index) {
    console.log(`Saving edit for index: ${index}`);
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const updatedTransaction = {
        date: document.getElementById('edit-date').value,
        amount: parseFloat(document.getElementById('edit-amount').value),
        memo: document.getElementById('edit-memo').value,
        category: document.getElementById('edit-category').value,
        method: document.getElementById('edit-method').value,
        type: document.querySelector('input[name="edit-type"]:checked').value.toLowerCase() // Get the selected type and convert it to lowercase
    };

    transactions[index] = updatedTransaction;
    localStorage.setItem('transactions', JSON.stringify(transactions));

    closeModal();
    loadMonthlyData();
}

function deleteTransaction(index) {
    console.log(`Deleting transaction for index: ${index}`);
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    loadMonthlyData();
}