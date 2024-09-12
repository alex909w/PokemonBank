$(document).ready(function() {
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

            // Registrar la transacción
            recordTransaction(id_pago, `Pago de Servicios: $${amount} (${serviceName})`);

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
        pendingPaymentData = null;
        $('#modalOpcionesPostPago').modal('show');
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
        centerText('Voucher de Pago de Servicios', 15);
    
        // Información
        const lineHeight = 10;
        let verticalOffset = 30; // Inicio del texto
    
        centerText(`Fecha y Hora: ${new Date().toLocaleString()}`, verticalOffset);
        verticalOffset += lineHeight;
    
        centerText(`Nombre: ${'Ash Ketchum'}`, verticalOffset);
        verticalOffset += lineHeight;
    
        // Obtener el número de cuenta y mostrar solo los últimos 4 dígitos
        const accountNumber = 'XXXX-4321'; // Número de cuenta con los primeros dígitos ocultos
        centerText(`Número de Cuenta: ${accountNumber}`, verticalOffset);
        verticalOffset += lineHeight;
    
        centerText(`ID de Transacción: ${id_pago}`, verticalOffset);
        verticalOffset += lineHeight;
    
        // Agregar nombre del servicio
        centerText(`Servicio: ${serviceName}`, verticalOffset);
        verticalOffset += lineHeight;
    
        centerText(`Monto Pagado: $${amount}`, verticalOffset);
        verticalOffset += lineHeight;
    
        centerText(`Saldo Actual: $${currentBalance}`, verticalOffset);
        verticalOffset += lineHeight;
    
        centerText('Gracias por utilizar Pokémon Bank!', verticalOffset);
    
        // Guardar y descargar el PDF como 'Pago_servicios.pdf'
        doc.save('Pago_servicios.pdf');
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
