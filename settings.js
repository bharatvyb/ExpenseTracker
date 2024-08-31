document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultMethods();
    initializeDefaultCategories();
    loadDropdownValues();
    loadCategoryValues();

    // Add event listener for export button
    document.getElementById('export-data').addEventListener('click', exportData);
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
    const methods = JSON.parse(localStorage.getItem('methods')) || [];

    methodTableBody.innerHTML = '';
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
            editDropdownValue('methods', index);
        };
        cell2.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            deleteDropdownValue('methods', index);
        };
        cell3.appendChild(deleteButton);
    });
}

function loadCategoryValues() {
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
            editDropdownValue('categories', index);
        };
        cell2.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            deleteDropdownValue('categories', index);
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
        loadCategoryValues();
    }
});

function deleteDropdownValue(type, index) {
    let items = JSON.parse(localStorage.getItem(type)) || [];
    items.splice(index, 1);
    localStorage.setItem(type, JSON.stringify(items));
    if (type === 'methods') {
        loadDropdownValues();
    } else if (type === 'categories') {
        loadCategoryValues();
    }
}

function editDropdownValue(type, index) {
    let items = JSON.parse(localStorage.getItem(type)) || [];
    const newValue = prompt("Edit the value:", items[index]);
    if (newValue !== null && newValue.trim() !== "") {
        items[index] = newValue.trim();
        localStorage.setItem(type, JSON.stringify(items));
        if (type === 'methods') {
            loadDropdownValues();
        } else if (type === 'categories') {
            loadCategoryValues();
        }
    }
}

function exportData() {
    const revenues = JSON.parse(localStorage.getItem('revenue')) || [];
    const outgoes = JSON.parse(localStorage.getItem('outgo')) || [];

    let csvContent = "data:text/tab-separated-values;charset=utf-8,";
    csvContent += "Date\tAmount\tMemo\tCategory\tMethod\tType\n";

    revenues.forEach(revenue => {
        csvContent += `${revenue.date}\t${revenue.amount}\t${revenue.memo}\t${revenue.category}\t${revenue.method}\tRevenue\n`;
    });

    outgoes.forEach(outgo => {
        csvContent += `${outgo.date}\t${outgo.amount}\t${outgo.memo}\t${outgo.category}\t${outgo.method}\tOutGo\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'expense_data.tsv');
    document.body.appendChild(link); // Required for FF

    link.click();
}