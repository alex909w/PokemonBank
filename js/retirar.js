$(document).ready(function() {
    // Variables para almacenar los datos necesarios
    let pendingWithdrawalData = null;

    // Funcionalidad del formulario de retiro de dinero
    document.getElementById('formRetiroDinero').addEventListener('submit', function(event) {
        event.preventDefault();
        const amount = parseFloat(document.getElementById('inputMontoRetiro').value);
        const result = document.getElementById('resultadoRetiro');
        const voucherSection = document.getElementById('voucher-section-retirar');

        if (amount > 0) {
            // Generar un ID único para el retiro
            const id_retiro = generateUniqueId('RE', 5);

            // Almacenar los datos del retiro en una variable para usarlos después
            pendingWithdrawalData = { id_retiro, amount };

            // Mostrar el modal de confirmar generación de voucher
            $('#modalGenerarVoucherRetiro').modal('show');
            
        } else {
            result.textContent = 'Por favor, ingresa un monto válido.';
            voucherSection.innerHTML = ''; // Limpiar voucher si el monto es inválido
        }
    });

    // Funcionalidad del botón "Generar" del modal de confirmar generación de voucher
    document.getElementById('btnGenerarVoucherRetiro').addEventListener('click', function() {
        if (pendingWithdrawalData) {
            const { id_retiro, amount } = pendingWithdrawalData;
            const currentBalance = parseFloat(localStorage.getItem('balance')) || 0;

            // Registrar la transacción
            recordTransaction(id_retiro, `Retiro de Dinero: $${amount}`);

            // Generar el voucher PDF
            const voucherDataUri = generateVoucherPDF(id_retiro, amount, currentBalance);

            // Descargar el voucher PDF
            const link = document.createElement('a');
            link.href = voucherDataUri;
            link.download = 'retiro_dinero.pdf';
            link.click();

            // Limpiar los datos pendientes
            pendingWithdrawalData = null;

            // Mostrar el modal de opciones
            $('#modalOpcionesNavegacionRetiro').modal('show');
        }

        // Cerrar el modal de confirmar generación de voucher
        $('#modalGenerarVoucherRetiro').modal('hide');
    });

    // Funcionalidad del botón "No Generar" del modal de confirmar generación de voucher
    document.getElementById('btnNoGenerarVoucherRetiro').addEventListener('click', function() {
        // Limpiar los datos pendientes
        pendingWithdrawalData = null;

        // Cerrar el modal de confirmar generación de voucher
        $('#modalGenerarVoucherRetiro').modal('hide');
    });

    // Funcionalidad del botón para volver a retirar dinero
    document.getElementById('btnVolverRetirar').addEventListener('click', function() {
        // Limpiar el campo de entrada y el resultado
        document.getElementById('inputMontoRetiro').value = '';
        document.getElementById('resultadoRetiro').textContent = '';
        // Mostrar el modal de retiro de dinero
        $('#modalRetirarDinero').modal('show');
        // Cerrar el modal de opciones
        $('#modalOpcionesNavegacionRetiro').modal('hide');
    });

    // Funcionalidad del botón para volver al menú principal
    document.getElementById('btnVolverMenuRetiro').addEventListener('click', function() {
        window.location.href = 'acciones.html'; // Volver al menú de acciones
    });

    // Función para registrar la transacción
    function recordTransaction(id_retiro, description) {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const date = new Date().toLocaleString();

        transactions.push({ id_retiro, description, date });
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // Función para generar el voucher en formato PDF
    function generateVoucherPDF(id_retiro, amount, currentBalance) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const date = new Date().toLocaleString();
        const accountNumber = 'XXX-XXXX-XXXX-4321'; // Número de cuenta con los primeros dígitos ocultos
        const userName = 'Ash Ketchum'; // Nombre del usuario

        doc.setFontSize(16);
        doc.text('Voucher de Retiro de Dinero', 20, 20);
        doc.setFontSize(12);
        doc.text(`Fecha y Hora: ${date}`, 20, 30);
        doc.text(`Nombre: ${userName}`, 20, 40);
        doc.text(`Número de Cuenta: ${accountNumber}`, 20, 50);
        doc.text(`ID de Transacción: ${id_retiro}`, 20, 60);
        doc.text(`Monto Retirado: $${amount}`, 20, 70);
        doc.text(`Saldo Actual: $${currentBalance}`, 20, 80);
        doc.text(`Gracias por utilizar Pokémon Bank!`, 20, 90);

        // Guardar el PDF como un archivo
        const pdfDataUri = doc.output('datauristring');
        return pdfDataUri; // Devuelve la cadena de datos URI del PDF
    }

    // Función para generar un ID único
    function generateUniqueId(prefix, length) {
        const digits = '1234567890';
        let id = prefix;
        for (let i = 0; i < length; i++) {
            const digit = digits[Math.floor(Math.random() * digits.length)];
            id += digit;
        }
        return id;
    }
});
