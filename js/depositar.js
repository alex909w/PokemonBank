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

            // Cerrar el modal de depósito
            $('#depositarModal').modal('hide');

            // Esperar a que el modal de depósito esté completamente cerrado antes de abrir el modal de opciones
            $('#depositarModal').on('hidden.bs.modal', function () {
                $('#depositoVoucherModal').modal('show'); // Mostrar modal de voucher primero
                $('#depositarModal').off('hidden.bs.modal'); // Limpiar el evento para evitar ejecuciones múltiples
            });
        } else {
            result.textContent = 'Por favor, ingresa un monto válido.';
        }
    });

    // Si el usuario elige generar el voucher
    document.getElementById('depositoGenerateVoucher').addEventListener('click', function() {
        const amount = parseFloat(document.getElementById('deposito-amount').value);
        const currentBalance = parseFloat(localStorage.getItem('balance')) || 0;
        const id = localStorage.getItem('last_deposito_id');

        // Generar y descargar el PDF del voucher directamente
        generateVoucherPDF(id, amount, currentBalance); // Cambia a esto para que maneje la descarga

        // Cerrar el modal de voucher y mostrar el modal de opciones
        $('#depositoVoucherModal').modal('hide');
        $('#depositoOptionModal').modal('show');
    });

    // Si el usuario elige no generar el voucher
    document.getElementById('depositoNoVoucher').addEventListener('click', function() {
        // Cerrar el modal de voucher y mostrar el modal de opciones
        $('#depositoVoucherModal').modal('hide');
        $('#depositoOptionModal').modal('show');
    });

    // Opción para intentar otro depósito
    document.getElementById('depositoRetryDeposit').addEventListener('click', function() {
        // Limpiar el campo de entrada y el resultado
        document.getElementById('deposito-amount').value = '';
        document.getElementById('deposito-result').textContent = '';
        // Mostrar el modal de depósito nuevamente
        $('#depositarModal').modal('show');
        // Cerrar el modal de opciones
        $('#depositoOptionModal').modal('hide');
    });

    // Opción para volver al menú principal
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
    const doc = new jsPDF({
        unit: 'mm',
        format: [100, 150], // Tamaño de recibo 100mm x 150mm
    });

    // Configuración de colores y fuentes
    doc.setFillColor(255, 255, 255); // Color de fondo blanco
    doc.rect(0, 0, 100, 150, 'F'); // Tamaño del recibo

    doc.setDrawColor(0, 0, 0); // Color del borde
    doc.setLineWidth(0.5);
    doc.rect(1, 1, 98, 148); // Borde del recibo

    // Fuente y tamaño
    doc.setFont("Courier", "normal");
    doc.setFontSize(10);

    // Centrar texto
    const centerText = (text, y) => {
        const textWidth = doc.getTextWidth(text);
        const x = (100 - textWidth) / 2; // Centrar horizontalmente
        doc.text(text, x, y);
    };

    // Agregar descripción en la parte superior
    centerText('Voucher de Depósito', 15);

    // Información
    const lineHeight = 10;
    let verticalOffset = 30; // Inicio del texto

    centerText(`Fecha y Hora: ${new Date().toLocaleString()}`, verticalOffset);
    verticalOffset += lineHeight;

    centerText(`Nombre: ${localStorage.getItem('userName') || 'Usuario'}`, verticalOffset);
    verticalOffset += lineHeight;

    // Obtener el número de cuenta y mostrar solo los últimos 4 dígitos
    const accountNumber = localStorage.getItem('userAccount') || 'No disponible';
    const maskedAccountNumber = accountNumber.slice(0, -4).replace(/\d/g, 'X') + accountNumber.slice(-4);
    
    centerText(`Número de Cuenta: ${maskedAccountNumber}`, verticalOffset);
    verticalOffset += lineHeight;

    centerText(`ID de Transacción: ${id}`, verticalOffset);
    verticalOffset += lineHeight;

    centerText(`Monto Depositado: $${amount}`, verticalOffset);
    verticalOffset += lineHeight;

    centerText(`Nuevo Saldo: $${currentBalance}`, verticalOffset);
    verticalOffset += lineHeight;

    centerText('Gracias por utilizar Pokémon Bank!', verticalOffset);

    // Guardar y descargar el PDF como 'deposito.pdf'
    doc.save('Deposito.pdf');
}
