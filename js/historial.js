function loadTransactionHistory() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const transactionHistory = document.getElementById('transaction-history');

    transactionHistory.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos

    transactions.forEach(transaction => {
        const listItem = document.createElement('li');
        listItem.textContent = `${transaction.date} - ${transaction.description}`;
        transactionHistory.appendChild(listItem);
    });
}

window.onload = loadTransactionHistory;