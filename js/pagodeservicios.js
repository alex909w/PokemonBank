document.getElementById('pay-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const serviceType = document.getElementById('service-type').value;
    const amount = parseFloat(document.getElementById('pay-amount').value);
    const result = document.getElementById('pay-result');
    let id = ''

    if (!isNaN(amount) && amount > 0 && serviceType) {
        let currentBalance = parseFloat(localStorage.getItem('balance')) || 0;
        if (amount <= currentBalance) {
            currentBalance -= amount;
            localStorage.setItem('balance', currentBalance.toFixed(2)); // Guardar saldo con dos decimales

            result.textContent = `Has pagado $${amount.toFixed(2)} por ${serviceType}. Nuevo saldo: $${currentBalance.toFixed(2)}`;

            // DEFINIMOS EL ID DEPENDIENDO DEL TIPO DE SERVICIO
            let id_ps = ''
            let digitos = '1234567890'
            for (let i = 0; i < 5; i++) {
                const digitoRandom = Math.floor(Math.random() * digitos.length)
                id += digitos[digitoRandom]
            }
            if (serviceType.includes('Energía Eléctrica')) {
                id_ps = 'PSE' + id
            } else if (serviceType.includes('Internet')) {
                id_ps = 'PSI' + id
            } else if (serviceType.includes('Telefonía')) {
                id_ps = 'PST' + id
            } else if (serviceType.includes('Agua Potable')) {
                id_ps = 'PSA' + id
            }
            localStorage.setItem('id_pago_servicio', id_ps)
            
            // Registrar la transacción
            recordTransaction(id_ps, `Pago de ${serviceType}: $${amount.toFixed(2)}`);
        } else {
            result.textContent = 'Saldo insuficiente.';
        }
    } else {
        result.textContent = 'Por favor, completa todos los campos con valores válidos.';
    }
});

function recordTransaction(id, description) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const date = new Date().toLocaleString();

    transactions.push({ id, description, date });
    localStorage.setItem('transactions', JSON.stringify(transactions));
}
