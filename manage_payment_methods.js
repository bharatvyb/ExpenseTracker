document.addEventListener('DOMContentLoaded', function () {
    initializeDefaultMethods();
    loadDropdownValues();
});

function initializeDefaultMethods() {
    let methods = JSON.parse(localStorage.getItem('methods')) || [];
    if (methods.length === 0) {
        methods = ['UPI', 'Credit Card', 'Cash'];
        localStorage.setItem('methods', JSON.stringify(methods));
    }
}

function loadDropdownValues() {
    const methodList = document.getElementById('method-list');
    const methods = JSON.parse(localStorage.getItem('methods')) || [];

    methodList.innerHTML = ''; // Clear the list before adding new entries

    methods.forEach((method, index) => {
        const row = document.createElement('div');
        row.classList.add('method-row');

        const methodName = document.createElement('div');
        methodName.className = 'method-name';
        methodName.textContent = method;

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-btn';
        editButton.onclick = function () {
            editDropdownValue(index);
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = function () {
            deleteDropdownValue(index);
        };

        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(deleteButton);

        row.appendChild(methodName);
        row.appendChild(buttonGroup);

        methodList.appendChild(row);
    });
}

document.getElementById('method-form').addEventListener('submit', function (e) {
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

function deleteDropdownValue(index) {
    let methods = JSON.parse(localStorage.getItem('methods')) || [];
    methods.splice(index, 1);
    localStorage.setItem('methods', JSON.stringify(methods));
    loadDropdownValues();
}

function editDropdownValue(index) {
    let methods = JSON.parse(localStorage.getItem('methods')) || [];
    const newValue = prompt('Edit the method:', methods[index]);
    if (newValue !== null && newValue.trim() !== '') {
        methods[index] = newValue.trim();
        localStorage.setItem('methods', JSON.stringify(methods));
        loadDropdownValues();
    }
}