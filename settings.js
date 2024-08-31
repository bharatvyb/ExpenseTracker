document.addEventListener('DOMContentLoaded', function() {
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

function deleteDropdownValue(index) {
    let methods = JSON.parse(localStorage.getItem('methods')) || [];
    methods.splice(index, 1);
    localStorage.setItem('methods', JSON.stringify(methods));
    loadDropdownValues();
}

function editDropdownValue(index) {
    let methods = JSON.parse(localStorage.getItem('methods')) || [];
    const newValue = prompt("Edit the method:", methods[index]);
    if (newValue !== null && newValue.trim() !== "") {
        methods[index] = newValue.trim();
        localStorage.setItem('methods', JSON.stringify(methods));
        loadDropdownValues();
    }
}