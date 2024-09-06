// Funcionalidad del formulario de retiro
document.getElementById('withdraw-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    const result = document.getElementById('withdraw-result');
    const voucherSection = document.getElementById('voucher-section');

    if (amount > 0) {
        let currentBalance = parseFloat(localStorage.getItem('balance')) || 0;

        if (amount <= currentBalance) {
            currentBalance -= amount;
            localStorage.setItem('balance', currentBalance);

            result.textContent = `Has retirado $${amount}. Nuevo saldo: $${currentBalance}`;

            // Registrar la transacción y generar voucher
            const voucher = generateVoucher(amount, currentBalance);
            recordTransaction(`Retiro: $${amount}`, voucher);

            // Mostrar el voucher en el modal
            voucherSection.innerHTML = `<pre>${voucher}</pre>`;

            // Mostrar el modal de voucher
            $('#voucherModal').modal('show');
        } else {
            result.textContent = 'Saldo insuficiente para realizar el retiro.';
            voucherSection.innerHTML = ''; // Limpiar voucher si el retiro falla
        }
    } else {
        result.textContent = 'Por favor, ingresa un monto válido.';
        voucherSection.innerHTML = ''; // Limpiar voucher si el monto es inválido
    }
});

// Funcionalidad del botón para generar el voucher
document.getElementById('generateVoucher').addEventListener('click', function() {
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    let currentBalance = parseFloat(localStorage.getItem('balance')) || 0;

    generateVoucherPDF(amount, currentBalance);

    // Cerrar el modal de voucher y mostrar el de opciones
    $('#voucherModal').modal('hide');
    $('#optionModal').modal('show');
});

// Funcionalidad del botón para no generar voucher
document.getElementById('noVoucher').addEventListener('click', function() {
    // Cerrar el modal de voucher y mostrar el de opciones
    $('#voucherModal').modal('hide');
    $('#optionModal').modal('show');
});

// Funcionalidad del botón para volver a depositar
document.getElementById('retryDeposit').addEventListener('click', function() {
    // Limpiar el campo de entrada y el resultado
    document.getElementById('withdraw-amount').value = '';
    document.getElementById('withdraw-result').textContent = '';
    // Mostrar el modal de retiro
    $('#retirarModal').modal('show');
    // Cerrar el modal de opciones
    $('#optionModal').modal('hide');
});

// Funcionalidad del botón para volver al menú principal
document.getElementById('goToMenu').addEventListener('click', function() {
    window.location.href = '../acciones.html'; // Volver al menú de acciones
});

// Función para registrar la transacción
function recordTransaction(description, voucher) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const date = new Date().toLocaleString();

    transactions.push({ description, voucher, date });
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Función para generar el voucher en formato PDF
function generateVoucherPDF(amount, currentBalance) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const date = new Date().toLocaleString();
    const accountNumber = '0987654321'; // Reemplaza con el número de cuenta real
    const userName = 'Ash Ketchum'; // Reemplaza con el nombre del usuario

    doc.setFontSize(16);
    doc.text('Voucher de Retiro', 20, 20);
    doc.setFontSize(12);
    doc.text(`Fecha y Hora: ${date}`, 20, 30);
    doc.text(`Nombre: ${userName}`, 20, 40);
    doc.text(`Número de Cuenta: ${accountNumber}`, 20, 50);
    doc.text(`Monto Retirado: $${amount}`, 20, 60);
    doc.text(`Nuevo Saldo: $${currentBalance}`, 20, 70);
    doc.text(`Gracias por utilizar Pokémon Bank!`, 20, 80);

    // Guardar el PDF
    doc.save('Retiro.pdf');
}
