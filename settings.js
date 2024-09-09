document.getElementById('export-btn').addEventListener('click', function() {
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '');
    const fileName = `ExpenseTracker_Backup_${timestamp}.tsv`;

    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const methods = JSON.parse(localStorage.getItem('methods')) || [];
    const categories = JSON.parse(localStorage.getItem('categories')) || [];

    let data = "Date\tAmount\tMemo\tCategory\tMethod\tType\n";

    transactions.forEach(item => {
        data += `${item.date}\t${item.amount}\t${item.memo}\t${item.category}\t${item.method}\t${item.type}\n`;
    });

    data += "\n\nPayment Methods:\n" + methods.join('\t') + "\n";
    data += "Categories:\n" + categories.join('\t') + "\n";

    const blob = new Blob([data], { type: 'text/tab-separated-values;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);

    const exportsLog = JSON.parse(localStorage.getItem('exportsLog')) || [];
    exportsLog.push({ date: new Date().toISOString(), fileName: fileName });
    localStorage.setItem('exportsLog', JSON.stringify(exportsLog));

    showExportMessage(fileName);
});

document.getElementById('import-btn').addEventListener('click', function() {
    document.getElementById('import-file').click();
});

document.getElementById('import-file').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const content = e.target.result;
        const lines = content.split('\n');

        const transactions = [];
        const methods = [];
        const categories = [];

        let parsingMethods = false;
        let parsingCategories = false;

        lines.forEach(line => {
            const values = line.split('\t');

            if (line.startsWith("Payment Methods:")) {
                parsingMethods = true;
                parsingCategories = false;
                return;
            }

            if (line.startsWith("Categories:")) {
                parsingMethods = false;
                parsingCategories = true;
                return;
            }

            if (parsingMethods) {
                methods.push(...values.filter(v => v.trim() !== ""));
            } else if (parsingCategories) {
                categories.push(...values.filter(v => v.trim() !== ""));
            } else if (values.length === 6 && values[0] !== "Date") {
                transactions.push({
                    date: values[0],
                    amount: parseFloat(values[1]),
                    memo: values[2],
                    category: values[3],
                    method: values[4],
                    type: values[5].toLowerCase()
                });
            }
        });

        localStorage.setItem('transactions', JSON.stringify(transactions));
        localStorage.setItem('methods', JSON.stringify(methods));
        localStorage.setItem('categories', JSON.stringify(categories));

        alert("Data imported successfully!");
    };

    reader.readAsText(file);
});

function showExportMessage(fileName) {
    const messageDiv = document.getElementById('export-message');
    const fileNameSpan = document.getElementById('exported-file-name');

    fileNameSpan.textContent = fileName;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 6000);
}

// User Profile Edit Logic
document.getElementById('edit-profile-btn').addEventListener('click', function() {
    document.getElementById('edit-profile-modal').style.display = 'block';
});

// Close modal
document.getElementById('close-modal').addEventListener('click', closeProfileModal);
document.getElementById('cancel-profile-edit').addEventListener('click', closeProfileModal);

function closeProfileModal() {
    document.getElementById('edit-profile-modal').style.display = 'none';
}

// Save Nickname
document.getElementById('edit-profile-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const nickname = document.getElementById('nickname').value;
    localStorage.setItem('nickname', nickname);
    document.getElementById('user-name').textContent = nickname;
    closeProfileModal();
});

// Load nickname if available
document.addEventListener('DOMContentLoaded', function() {
    const savedNickname = localStorage.getItem('nickname');
    if (savedNickname) {
        document.getElementById('user-name').textContent = savedNickname;
    }
});