$(document).ready(function() 
    // Variables para almacenar los datos necesarios
    let pendingWithdrawalData = null;

    // Funcionalidad del formulario de retiro de dinero
    document.getElementById('formRetiroDinero').addEventListener('submit', function(event) {
        event.preventDefault();
        const amount = parseFloat(document.getElementById('inputMontoRetiro').value);
        const result = document.getElementById('resultadoRetiro');
        const voucherSection = document.getElementById('voucher-section-retirar');
        const currentBalance = parseFloat(localStorage.getItem('balance')) || 0;

        // Validaciones de monto
        if (isNaN(amount) || amount <= 0) {
            result.textContent = 'Por favor, ingresa un monto válido.';
            voucherSection.innerHTML = ''; // Limpiar voucher si el monto es inválido
            return;
        }

        if (amount > currentBalance) {
            result.textContent = 'No tienes suficiente saldo para realizar este retiro.';
            voucherSection.innerHTML = ''; // Limpiar voucher si el monto es inválido
            return;
        }

        // Generar un ID único para el retiro
        const id_retiro = generateUniqueId('RE', 5);

        // Almacenar los datos del retiro en una variable para usarlos después
        pendingWithdrawalData = { id_retiro, amount };

        // Mostrar el modal de confirmar generación de voucher
        $('#modalGenerarVoucherRetiro').modal('show');
    });

    // Funcionalidad del botón "Generar" del modal de confirmar generación de voucher
    document.getElementById('btnGenerarVoucherRetiro').addEventListener('click', function() {
        if (pendingWithdrawalData) {
            const { id_retiro, amount } = pendingWithdrawalData;
            let currentBalance = parseFloat(localStorage.getItem('balance')) || 0;

            // Restar el monto del saldo actual
            currentBalance -= amount;
            localStorage.setItem('balance', currentBalance);

            // **Registrar la transacción de retiro**
            recordTransaction(id_retiro, `Retiro: $${amount.toFixed(2)}`);

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
        if (pendingWithdrawalData) {
            const { id_retiro, amount } = pendingWithdrawalData;
            let currentBalance = parseFloat(localStorage.getItem('balance')) || 0;

            // Restar el monto del saldo actual
            currentBalance -= amount;
            localStorage.setItem('balance', currentBalance);

            // **Registrar la transacción de retiro aunque no se genere el voucher**
            recordTransaction(id_retiro, `Retiro: $${amount.toFixed(2)}`);

            // Limpiar los datos pendientes
            pendingWithdrawalData = null;

            // Mostrar el modal de opciones
            $('#modalOpcionesNavegacionRetiro').modal('show');
        }

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

        transactions.push({ id: id_retiro, description, date });
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // Función para generar el voucher en formato PDF
    function generateVoucherPDF(id_retiro, amount, currentBalance) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            unit: 'mm',
            format: [100, 150], // Tamaño tipo recibo
        });

        const date = new Date().toLocaleString();
        const accountNumber = 'XXX-XXXX-XXXX-4321'; // Número de cuenta con los primeros dígitos ocultos
        const userName = 'Ash Ketchum'; // Nombre del usuario

        // Estilos de recibo con bordes y centrar texto
        doc.setFillColor(255, 255, 255); // Fondo blanco
        doc.rect(0, 0, 100, 150, 'F'); // Tamaño del recibo
        doc.setDrawColor(0, 0, 0); // Color del borde
        doc.setLineWidth(0.5);
        doc.rect(1, 1, 98, 148); // Borde del voucher

        doc.setFont("Courier", "normal");
        doc.setFontSize(10);

        // Centrar texto
        const centerText = (text, y) => {
            const textWidth = doc.getTextWidth(text);
            const x = (100 - textWidth) / 2; // Centrar horizontalmente
            doc.text(text, x, y);
        };

        // Información del voucher
        centerText('Voucher de Retiro de Dinero', 15);
        centerText(`Fecha y Hora: ${date}`, 25);
        centerText(`Nombre: ${userName}`, 35);
        centerText(`Número de Cuenta: ${accountNumber}`, 45);
        centerText(`ID de Transacción: ${id_retiro}`, 55);
        centerText(`Monto Retirado: $${amount}`, 65);
        centerText(`Saldo Actual: $${currentBalance}`, 75);
        centerText('Gracias por utilizar Pokémon Bank!', 85);

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
