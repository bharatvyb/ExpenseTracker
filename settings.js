document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultMethods();
    initializeDefaultCategories();
    loadDropdownValues();
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
    const methodTableBody = document.getElementById('method-list');
    const categoryTableBody = document.getElementById('category-list');
    const methods = JSON.parse(localStorage.getItem('methods')) || [];
    const categories = JSON.parse(localStorage.getItem('categories')) || [];

    methodTableBody.innerHTML = '';
    categoryTableBody.innerHTML = '';

    methods.forEach((method, index) => {
        const row = methodTableBody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);

        cell1.textContent = method;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-btn';
        editButton.onclick = function() {
            editDropdownValue(index, 'methods');
        };
        cell2.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            deleteDropdownValue(index, 'methods');
        };
        cell3.appendChild(deleteButton);
    });

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
            editDropdownValue(index, 'categories');
        };
        cell2.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            deleteDropdownValue(index, 'categories');
        };
        cell3.appendChild(deleteButton);
    });
}

document.getElementById('method-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const newMethod = document.getElementById('new-method').value.trim();
    if (newMethod) {
        let methods = JSON.parse(localStorage.getItem('methods')) || [];
        methods.push(newMethod);
        localStorage.setItem('methods', JSON.stringify(methods));
        document.getElementById('new-method').value = '';
        loadDropdownValues();
    }
});

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

function deleteDropdownValue(index, type) {
    let items = JSON.parse(localStorage.getItem(type)) || [];
    items.splice(index, 1);
    localStorage.setItem(type, JSON.stringify(items));
    loadDropdownValues();
}

function editDropdownValue(index, type) {
    let items = JSON.parse(localStorage.getItem(type)) || [];
    const newValue = prompt("Edit the item:", items[index]);
    if (newValue !== null && newValue.trim() !== "") {
        items[index] = newValue.trim();
        localStorage.setItem(type, JSON.stringify(items));
        loadDropdownValues();
    }
}