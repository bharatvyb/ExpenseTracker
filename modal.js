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

    // Ensure the correct transaction type is selected and the toggle buttons are updated
    if (transaction.type.toLowerCase() === 'revenue') {
        document.getElementById('edit-revenue').checked = true;
    } else {
        document.getElementById('edit-outgo').checked = true;
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
    loadMonthlyData(); // Monthly data reload after edit
}

// Delete Transaction
function deleteTransaction(index) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    loadMonthlyData(); // Monthly data reload after delete
}

// Close Summary Category Modal
function closeSummaryCategoryModal() {
    const modal = document.getElementById('summary-category-modal');
    modal.style.display = 'none';
}

// Setup for additional modals
function setupAdditionalModals() {
    const summaryCategoryModal = document.getElementById('summary-category-modal');
    const closeSummaryModalBtn = document.getElementById('close-summary-modal');

    closeSummaryModalBtn.onclick = closeSummaryCategoryModal;

    window.onclick = function (event) {
        if (event.target == summaryCategoryModal) {
            closeSummaryCategoryModal();
        }
    };
}

// Close the Summary Category Modal
document.getElementById('close-summary-modal').onclick = function () {
    document.getElementById('summary-category-modal').style.display = 'none';
};

// Call the setup function for the additional modal
document.addEventListener('DOMContentLoaded', setupAdditionalModals);