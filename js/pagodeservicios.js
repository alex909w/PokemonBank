$(document).ready(function() 
    let pendingPaymentData = null;
    let voucherGenerated = false;

    document.getElementById('formPagarServicios').addEventListener('submit', function(event) {
        event.preventDefault();
        const amount = parseFloat(document.getElementById('inputMontoPago').value);
        const result = document.getElementById('resultadoPago');
        const currentBalance = parseFloat(localStorage.getItem('balance')) || 0;

        // Captura del nombre del servicio
        const serviceName = document.getElementById('selectServicio').value;

        // Validar monto y saldo
        if (isNaN(amount) || amount <= 0) {
            result.textContent = 'Por favor, ingresa un monto válido.';
            return;
        }

        if (amount > currentBalance) {
            result.textContent = 'No tienes suficiente saldo para realizar este pago.';
            return;
        }

        if (!serviceName) {
            result.textContent = 'Por favor, selecciona un servicio.';
            return;
        }

        // Generar un ID único
        const id_pago = generateUniqueId('PA', 5);
        pendingPaymentData = { id_pago, amount, serviceName };

        // Mostrar modal de confirmación
        $('#modalConfirmarGenerarVoucherPagoServicios').modal('show');
    });

    document.getElementById('btnConfirmarVoucherPagoServiciosSi').addEventListener('click', function() {
        if (pendingPaymentData && !voucherGenerated) {
            const { id_pago, amount, serviceName } = pendingPaymentData;
            let currentBalance = parseFloat(localStorage.getItem('balance')) || 0;

            // Restar el monto del saldo
            currentBalance -= amount;
            localStorage.setItem('balance', currentBalance);

            // **Registrar la transacción independientemente de la generación del voucher**
            recordTransaction(id_pago, `Pago de ${serviceName}: $${amount.toFixed(2)}`);

            // Generar el PDF del voucher
            const voucherDataUri = generateVoucherPDF(id_pago, amount, currentBalance, serviceName);
            const link = document.createElement('a');
            link.href = voucherDataUri;
            link.download = 'Pago_servicios.pdf';
            link.click();

            voucherGenerated = true;
            pendingPaymentData = null;

            $('#modalOpcionesPostPago').modal('show');
        }

        $('#modalConfirmarGenerarVoucherPagoServicios').modal('hide');
    });

    document.getElementById('btnConfirmarVoucherPagoServiciosNo').addEventListener('click', function() {
        if (pendingPaymentData) {
            const { id_pago, amount, serviceName } = pendingPaymentData;
            let currentBalance = parseFloat(localStorage.getItem('balance')) || 0;

            // Restar el monto del saldo
            currentBalance -= amount;
            localStorage.setItem('balance', currentBalance);

            // **Registrar la transacción aunque no se genere el voucher**
            recordTransaction(id_pago, `Pago de ${serviceName}: $${amount.toFixed(2)}`);

            pendingPaymentData = null;
            $('#modalOpcionesPostPago').modal('show');
        }

        $('#modalConfirmarGenerarVoucherPagoServicios').modal('hide');
    });

    document.getElementById('btnVolverPagarOtroServicio').addEventListener('click', function() {
        document.getElementById('inputMontoPago').value = '';
        document.getElementById('resultadoPago').textContent = '';
        $('#modalPagarServicios').modal('show');
        $('#modalOpcionesPostPago').modal('hide');
        voucherGenerated = false;
    });

    document.getElementById('btnVolverMenuPrincipal').addEventListener('click', function() {
        window.location.href = 'acciones.html';
    });

    function recordTransaction(id_pago, description) {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const date = new Date().toLocaleString();
        transactions.push({ id: id_pago, description, date });
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function generateVoucherPDF(id_pago, amount, currentBalance, serviceName) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            unit: 'mm',
            format: [100, 150], // Tamaño de recibo 100mm x 150mm
        });

        doc.setFillColor(255, 255, 255); // Color de fondo blanco
        doc.rect(0, 0, 100, 150, 'F'); // Tamaño del recibo
        doc.setDrawColor(0, 0, 0); // Color del borde
        doc.setLineWidth(0.5);
        doc.rect(1, 1, 98, 148); // Borde del recibo

        doc.setFont("Courier", "normal");
        doc.setFontSize(10);

        // Centrar texto
        const centerText = (text, y) => {
            const textWidth = doc.getTextWidth(text);
            const x = (100 - textWidth) / 2; // Centrar horizontalmente
            doc.text(text, x, y);
        };

        // Agregar información al PDF
        centerText('Voucher de Pago de Servicios', 15);
        centerText(`Fecha y Hora: ${new Date().toLocaleString()}`, 25);
        centerText(`Nombre: ${'Ash Ketchum'}`, 35);
        centerText(`Número de Cuenta: XXXX-4321`, 45);
        centerText(`ID de Transacción: ${id_pago}`, 55);
        centerText(`Servicio: ${serviceName}`, 65);
        centerText(`Monto Pagado: $${amount.toFixed(2)}`, 75);
        centerText(`Saldo Actual: $${currentBalance.toFixed(2)}`, 85);
        centerText('Gracias por utilizar Pokémon Bank!', 95);

        // Guardar y descargar el PDF como 'Pago_servicios.pdf'
        const pdfDataUri = doc.output('datauristring');
        return pdfDataUri; // Devuelve la cadena de datos URI del PDF
    }

    function generateUniqueId(prefix, length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        let id = prefix;
        for (let i = 0; i < length; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
});
