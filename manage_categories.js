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
    const categoryList = document.getElementById('category-list');
    const categories = JSON.parse(localStorage.getItem('categories')) || [];

    categoryList.innerHTML = '';
    categories.forEach((category, index) => {
        const categoryRow = document.createElement('div');
        categoryRow.classList.add('category-row');
        
        const categorySpan = document.createElement('span');
        categorySpan.textContent = category;

        const buttonGroup = document.createElement('div');
        buttonGroup.classList.add('button-group');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');
        editButton.onclick = function() {
            editDropdownValue(index);
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.onclick = function() {
            deleteDropdownValue(index);
        };

        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(deleteButton);

        categoryRow.appendChild(categorySpan);
        categoryRow.appendChild(buttonGroup);
        categoryList.appendChild(categoryRow);
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