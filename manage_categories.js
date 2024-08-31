document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultCategories();
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
    const categoryTableBody = document.getElementById('category-list');
    const categories = JSON.parse(localStorage.getItem('categories')) || [];

    categoryTableBody.innerHTML = '';
    categories.forEach((category, index) => {
        const row = categoryTableBody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);

        cell1.textContent = category;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-btn';
        editButton.onclick = function() {
            editDropdownValue(index);
        };
        cell2.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            deleteDropdownValue(index);
        };
        cell3.appendChild(deleteButton);
    });
}

document.getElementById('category-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const newCategory = document.getElementById('new-category').value.trim();
    if (newCategory) {
        let categories = JSON.parse(localStorage.getItem('categories')) || [];
        categories.push(newCategory);
        localStorage.setItem('categories', JSON.stringify(categories));
        document.getElementById('new-category').value = '';
        loadDropdownValues();
    }
});

function deleteDropdownValue(index) {
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    categories.splice(index, 1);
    localStorage.setItem('categories', JSON.stringify(categories));
    loadDropdownValues();
}

function editDropdownValue(index) {
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    const newValue = prompt("Edit the category:", categories[index]);
    if (newValue !== null && newValue.trim() !== "") {
        categories[index] = newValue.trim();
        localStorage.setItem('categories', JSON.stringify(categories));
        loadDropdownValues();
    }
}