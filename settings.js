document.getElementById('export-btn').addEventListener('click', function() {
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '');
    const fileName = `ExpenseTracker_Backup_${timestamp}.tsv`;

    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const methods = JSON.parse(localStorage.getItem('methods')) || [];
    const categories = JSON.parse(localStorage.getItem('categories')) || [];

    // Add "Type" column to indicate whether the transaction is Revenue or OutGo
    let data = "Date\tAmount\tMemo\tCategory\tMethod\tType\n";

    transactions.forEach(item => {
        data += `${item.date}\t${item.amount}\t${item.memo}\t${item.category}\t${item.method}\t${item.type}\n`;
    });

    data += "\n\nPayment Methods:\n" + methods.join('\t');
    data += "\n\nCategories:\n" + categories.join('\t');

    const blob = new Blob([data], { type: 'text/tab-separated-values;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
});