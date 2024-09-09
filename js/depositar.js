document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('deposito-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const amount = parseFloat(document.getElementById('deposito-amount').value);
        const result = document.getElementById('deposito-result');

        if (amount > 0) {
            let currentBalance = parseFloat(localStorage.getItem('balance')) || 0;
            currentBalance += amount;
            localStorage.setItem('balance', currentBalance);

            result.textContent = `Has depositado $${amount}. Nuevo saldo: $${currentBalance}`;

            // Generar un ID de depósito único
            const id_deposito = generateUniqueId('DE', 5);
            localStorage.setItem('last_deposito_id', id_deposito);

            // Registrar la transacción
            recordTransaction(id_deposito, `Depósito de $${amount}`);

            // Cerrar el modal de depósito y mostrar el de voucher
            $('#depositarModal').modal('hide');
            $('#depositoVoucherModal').modal('show');
        } else {
            result.textContent = 'Por favor, ingresa un monto válido.';
        }
    });

    document.getElementById('depositoGenerateVoucher').addEventListener('click', function() {
        const amount = parseFloat(document.getElementById('deposito-amount').value);
        const currentBalance = parseFloat(localStorage.getItem('balance')) || 0;
        const id = localStorage.getItem('last_deposito_id');

        // Generar y abrir el PDF del voucher
        const pdfData = generateVoucherPDF(id, amount, currentBalance);
        window.open(pdfData, '_blank');

        // Cerrar el modal de voucher y mostrar el de opciones
        $('#depositoVoucherModal').modal('hide');
        $('#depositoOptionModal').modal('show');
    });

    document.getElementById('depositoNoVoucher').addEventListener('click', function() {
        // Cerrar el modal de voucher y mostrar el de opciones
        $('#depositoVoucherModal').modal('hide');
        $('#depositoOptionModal').modal('show');
    });

    document.getElementById('depositoRetryDeposit').addEventListener('click', function() {
        // Limpiar el campo de entrada y el resultado
        document.getElementById('deposito-amount').value = '';
        document.getElementById('deposito-result').textContent = '';
        // Mostrar el modal de depósito
        $('#depositarModal').modal('show');
        // Cerrar el modal de opciones
        $('#depositoOptionModal').modal('hide');
    });

    document.getElementById('depositoGoToMenu').addEventListener('click', function() {
        window.location.href = '../acciones.html'; // Volver al menú de acciones
    });
});

function recordTransaction(id, description) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const date = new Date().toLocaleString();

    transactions.push({ id, description, date });
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function generateUniqueId(prefix, length) {
    const digits = '1234567890';
    let id = prefix;
    for (let i = 0; i < length; i++) {
        const digit = digits[Math.floor(Math.random() * digits.length)];
        id += digit;
    }
    return id;
}

function generateVoucherPDF(id, amount, currentBalance) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const date = new Date().toLocaleString();
    const accountNumber = localStorage.getItem('userAccount'); // Reemplaza con el número de cuenta real
    const userName = localStorage.getItem('userName'); // Reemplaza con el nombre del usuario

    doc.setFontSize(16);
    doc.text('Voucher de Depósito', 20, 20);
    doc.setFontSize(12);
    doc.text(`Fecha y Hora: ${date}`, 20, 40);
    doc.text(`Nombre: ${userName}`, 20, 50);
    doc.text(`Número de Cuenta: ${accountNumber}`, 20, 60);
    doc.text(`ID de Transacción: ${id}`, 20, 70);
    doc.text(`Monto Depositado: $${amount}`, 20, 80);
    doc.text(`Nuevo Saldo: $${currentBalance}`, 20, 90);
    doc.text(`Gracias por utilizar Pokémon Bank!`, 20, 100);

    // Guardar el PDF como un archivo
    const pdfData = doc.output('datauristring');
    return pdfData; // Devuelve la cadena de datos URI del PDF
}

