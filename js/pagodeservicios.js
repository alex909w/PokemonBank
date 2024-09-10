$(document).ready(function() {
    // Variables para almacenar los datos necesarios
    let pendingPaymentData = null;
    let voucherGenerated = false; // Bandera para verificar si el voucher ya se generó

    // Funcionalidad del formulario de pago de servicios
    document.getElementById('formPagarServicios').addEventListener('submit', function(event) {
        event.preventDefault();
        const amount = parseFloat(document.getElementById('inputMontoPago').value);
        const result = document.getElementById('resultadoPago');

        if (amount > 0) {
            // Generar un ID único para el pago
            const id_pago = generateUniqueId('PA', 5);

            // Almacenar los datos del pago en una variable para usarlos después
            pendingPaymentData = { id_pago, amount };

            // Mostrar el modal de confirmar generación de voucher
            $('#modalConfirmarGenerarVoucherPagoServicios').modal('show');
        } else {
            result.textContent = 'Por favor, ingresa un monto válido.';
        }
    });

    // Funcionalidad del botón "Sí" del modal de confirmar generación de voucher
    document.getElementById('btnConfirmarVoucherPagoServiciosSi').addEventListener('click', function() {
        if (pendingPaymentData && !voucherGenerated) { // Verificar si el voucher no se ha generado ya
            const { id_pago, amount } = pendingPaymentData;
            const currentBalance = parseFloat(localStorage.getItem('balance')) || 0;

            // Registrar la transacción
            recordTransaction(id_pago, `Pago de Servicios: $${amount}`);

            // Generar el voucher PDF
            const voucherDataUri = generateVoucherPDF(id_pago, amount, currentBalance);

            // Descargar el voucher PDF
            const link = document.createElement('a');
            link.href = voucherDataUri;
            link.download = 'Pago_servicios.pdf';
            link.click();

            // Marcar que el voucher ya ha sido generado
            voucherGenerated = true;

            // Limpiar los datos pendientes
            pendingPaymentData = null;

            // Mostrar el modal de opciones posteriores
            $('#modalOpcionesPostPago').modal('show');
        }

        // Cerrar el modal de confirmar generación de voucher
        $('#modalConfirmarGenerarVoucherPagoServicios').modal('hide');
    });

    // Funcionalidad del botón "No" del modal de confirmar generación de voucher
    document.getElementById('btnConfirmarVoucherPagoServiciosNo').addEventListener('click', function() {
        // Limpiar los datos pendientes
        pendingPaymentData = null;

        // Mostrar el modal de opciones posteriores
        $('#modalOpcionesPostPago').modal('show');

        // Cerrar el modal de confirmar generación de voucher
        $('#modalConfirmarGenerarVoucherPagoServicios').modal('hide');
    });

    // Funcionalidad del botón para volver a pagar otro servicio
    document.getElementById('btnVolverPagarOtroServicio').addEventListener('click', function() {
        // Limpiar el campo de entrada y el resultado
        document.getElementById('inputMontoPago').value = '';
        document.getElementById('resultadoPago').textContent = '';
        // Mostrar el modal de pago de servicios
        $('#modalPagarServicios').modal('show');
        // Cerrar el modal de opciones posteriores
        $('#modalOpcionesPostPago').modal('hide');

        // Resetear la bandera de voucher generado
        voucherGenerated = false;
    });

    // Funcionalidad del botón para volver al menú principal
    document.getElementById('btnVolverMenuPrincipal').addEventListener('click', function() {
        window.location.href = 'acciones.html'; // Volver al menú de acciones
    });

    // Función para registrar la transacción
    function recordTransaction(id_pago, description) {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const date = new Date().toLocaleString();

        transactions.push({ id_pago, description, date });
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // Función para generar el voucher en formato PDF
    function generateVoucherPDF(id_pago, amount, currentBalance) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const date = new Date().toLocaleString();
        const accountNumber = 'XXXX-4321'; // Número de cuenta con los primeros dígitos ocultos
        const userName = 'Ash Ketchum'; // Nombre del usuario

        doc.setFontSize(16);
        doc.text('Voucher de Pago de Servicios', 20, 20);
        doc.setFontSize(12);
        doc.text(`Fecha y Hora: ${date}`, 20, 30);
        doc.text(`Nombre: ${userName}`, 20, 40);
        doc.text(`Número de Cuenta: ${accountNumber}`, 20, 50);
        doc.text(`ID de Transacción: ${id_pago}`, 20, 60);
        doc.text(`Monto Pagado: $${amount}`, 20, 70);
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
