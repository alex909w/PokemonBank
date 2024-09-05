document.getElementById('deposit-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Obtener los valores del formulario
    const amount = parseFloat(document.getElementById('deposit-amount').value);
    const result = document.getElementById('deposit-result');

    if (amount > 0) {
        let currentBalance = parseFloat(localStorage.getItem('balance')) || 0;
        currentBalance += amount;
        localStorage.setItem('balance', currentBalance);

        result.textContent = `Has depositado $${amount}. Nuevo saldo: $${currentBalance}`;

        // Registrar la transacción
        recordTransaction(`Depósito de $${amount}`);

        // Limpiar el formulario después de realizar el depósito
        document.getElementById('deposit-amount').value = '';
        
        // Mostrar el modal para generar el voucher
        $('#voucherModal').modal('show');
        
    } else {
        result.textContent = 'Por favor, ingresa un monto válido.';
    }
});


document.getElementById('generateVoucher').addEventListener('click', function() {
    const amount = parseFloat(document.getElementById('deposit-amount').value);
    let currentBalance = parseFloat(localStorage.getItem('balance')) || 0;

    generateVoucherPDF(amount, currentBalance);

    // Cerrar el modal de voucher y redirigir
    $('#voucherModal').modal('hide');
    $('#optionModal').modal('show');
});

document.getElementById('noVoucher').addEventListener('click', function() {
    // Cerrar el modal de voucher manualmente
    $('#voucherModal').modal('hide');

    // Usar un delay para asegurar que el modal se cierra antes de abrir el siguiente
    setTimeout(function() {
        // Mostrar el modal de opciones después de que el anterior se haya cerrado
        $('#optionModal').modal('show');
    }); 
});


function recordTransaction(description) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const date = new Date().toLocaleString();

    transactions.push({ description, date });
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function generateVoucherPDF(amount, currentBalance) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const date = new Date().toLocaleString();
    const accountNumber = '0987654321'; // Reemplaza con el número de cuenta real
    const userName = 'Ash Ketchum'; // Reemplaza con el nombre del usuario

    doc.setFontSize(16);
    doc.text('Voucher de Depósito', 20, 20);
    doc.setFontSize(12);
    doc.text(`Fecha y Hora: ${date}`, 20, 40);
    doc.text(`Nombre: ${userName}`, 20, 50);
    doc.text(`Número de Cuenta: ${accountNumber}`, 20, 60);
    doc.text(`Monto Depositado: $${amount}`, 20, 70);
    doc.text(`Nuevo Saldo: $${currentBalance}`, 20, 80);
    doc.text(`Gracias por utilizar Pokémon Bank!`, 20, 100);

    // Guardar el PDF
    doc.save('voucher.pdf');
}