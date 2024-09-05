document.getElementById('withdraw-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    const result = document.getElementById('withdraw-result');

    if (amount > 0) {
        let currentBalance = parseFloat(localStorage.getItem('balance')) || 0;

        if (amount <= currentBalance) {
            currentBalance -= amount;
            localStorage.setItem('balance', currentBalance);

            result.textContent = `Has retirado $${amount}. Nuevo saldo: $${currentBalance}`;

            // Registrar transacción
            recordTransaction(`Retiro: $${amount}`);
        } else {
            result.textContent = 'Saldo insuficiente para realizar el retiro.';
        }
    } else {
        result.textContent = 'Por favor, ingresa un monto válido.';
    }
});

function recordTransaction(description) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const date = new Date().toLocaleString();

    transactions.push({ description, date });
    localStorage.setItem('transactions', JSON.stringify(transactions));
}