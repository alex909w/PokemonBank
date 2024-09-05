document.getElementById('pay-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const serviceType = document.getElementById('service-type').value;
    const amount = parseFloat(document.getElementById('pay-amount').value);
    const result = document.getElementById('pay-result');

    if (!isNaN(amount) && amount > 0 && serviceType) {
        let currentBalance = parseFloat(localStorage.getItem('balance')) || 0;
        if (amount <= currentBalance) {
            currentBalance -= amount;
            localStorage.setItem('balance', currentBalance.toFixed(2)); // Guardar saldo con dos decimales

            result.textContent = `Has pagado $${amount.toFixed(2)} por ${serviceType}. Nuevo saldo: $${currentBalance.toFixed(2)}`;
            
            // Registrar la transacción
            recordTransaction(`Pago de ${serviceType}: $${amount.toFixed(2)}`);
        } else {
            result.textContent = 'Saldo insuficiente.';
        }
    } else {
        result.textContent = 'Por favor, completa todos los campos con valores válidos.';
    }
});

function recordTransaction(description) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const date = new Date().toLocaleString();

    transactions.push({ description, date });
    localStorage.setItem('transactions', JSON.stringify(transactions));
}
