document.addEventListener('DOMContentLoaded', loadMonthlyData);

function loadMonthlyData() {
    loadRevenueData();
    loadOutGoData();
    loadAllData();
}

function loadRevenueData() {
    const revenueTable = document.getElementById('revenue-table').getElementsByTagName('tbody')[0];
    const revenues = JSON.parse(localStorage.getItem('revenue')) || [];
    revenueTable.innerHTML = '';

    revenues.forEach(revenue => {
        let row = revenueTable.insertRow();
        row.insertCell(0).textContent = revenue.date;
        row.insertCell(1).textContent = revenue.amount;
        row.insertCell(2).textContent = revenue.memo;
        row.insertCell(3).textContent = revenue.category;
        row.insertCell(4).textContent = revenue.method;
    });
}

function loadOutGoData() {
    const outgoTable = document.getElementById('outgo-table').getElementsByTagName('tbody')[0];
    const outgoes = JSON.parse(localStorage.getItem('outgo')) || [];
    outgoTable.innerHTML = '';

    outgoes.forEach(outgo => {
        let row = outgoTable.insertRow();
        row.insertCell(0).textContent = outgo.date;
        row.insertCell(1).textContent = outgo.amount;
        row.insertCell(2).textContent = outgo.memo;
        row.insertCell(3).textContent = outgo.category;
        row.insertCell(4).textContent = outgo.method;
    });
}

function loadAllData() {
    const allTable = document.getElementById('all-table').getElementsByTagName('tbody')[0];
    const revenues = JSON.parse(localStorage.getItem('revenue')) || [];
    const outgoes = JSON.parse(localStorage.getItem('outgo')) || [];
    allTable.innerHTML = '';

    revenues.forEach(revenue => {
        let row = allTable.insertRow();
        row.style.color = 'green';
        row.insertCell(0).textContent = revenue.date;
        row.insertCell(1).textContent = 'Revenue';
        row.insertCell(2).textContent = revenue.amount;
        row.insertCell(3).textContent = revenue.memo;
        row.insertCell(4).textContent = revenue.category;
        row.insertCell(5).textContent = revenue.method;
    });

    outgoes.forEach(outgo => {
        let row = allTable.insertRow();
        row.style.color = 'red';
        row.insertCell(0).textContent = outgo.date;
        row.insertCell(1).textContent = 'OutGo';
        row.insertCell(2).textContent = outgo.amount;
        row.insertCell(3).textContent = outgo.memo;
        row.insertCell(4).textContent = outgo.category;
        row.insertCell(5).textContent = outgo.method;
    });
}