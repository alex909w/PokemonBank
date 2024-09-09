// Esperar a que el documento esté completamente cargado
$(document).ready(function() {
    // Funcionalidad del formulario de retiro
    document.getElementById('formRetiroDinero').addEventListener('submit', function(event) {
        event.preventDefault();
        const amount = parseFloat(document.getElementById('inputMontoRetiro').value);
        const result = document.getElementById('resultadoRetiro');
        const voucherSection = document.getElementById('voucher-section');
        let id_retiro = '';

        if (amount > 0) {
            let currentBalance = parseFloat(localStorage.getItem('balance')) || 0;

            if (amount <= currentBalance) {
                currentBalance -= amount;
                localStorage.setItem('balance', currentBalance);

                result.textContent = `Has retirado $${amount}. Nuevo saldo: $${currentBalance}`;

                // Generar un ID único para retiro y almacenarlo en localStorage
                id_retiro = generateUniqueId('RE', 5);
                localStorage.setItem('last_retiro_id', id_retiro);

                // Registrar la transacción
                recordTransaction(id_retiro, `Retiro: $${amount}`);

                // Generar el voucher PDF
                const voucher = generateVoucherPDF(id_retiro, amount, currentBalance);
                // Mostrar el voucher en el modal
                voucherSection.innerHTML = `<pre>${voucher}</pre>`;

                // Mostrar el modal de voucher
                $('#modalGenerarVoucher').modal('show');

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
    document.getElementById('btnGenerarVoucher').addEventListener('click', function() {
        const amount = parseFloat(document.getElementById('inputMontoRetiro').value);
        const currentBalance = parseFloat(localStorage.getItem('balance')) || 0;
        const id_retiro = localStorage.getItem('last_retiro_id');

        // Generar el voucher PDF y devolver la cadena de datos URI
        const voucherDataUri = generateVoucherPDF(id_retiro, amount, currentBalance);

        // Guardar la cadena de datos URI del voucher en el localStorage
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const transactionIndex = transactions.findIndex(t => t.id_retiro === id_retiro);
        if (transactionIndex !== -1) {
            transactions[transactionIndex].voucher = voucherDataUri;
            localStorage.setItem('transactions', JSON.stringify(transactions));
        }

        // Cerrar el modal de voucher y mostrar el de opciones
        $('#modalGenerarVoucher').modal('hide');
        $('#modalOpcionesNavegacion').modal('show');
    });

    // Funcionalidad del botón para no generar voucher
    document.getElementById('btnNoGenerarVoucher').addEventListener('click', function() {
        // Cerrar el modal de voucher y mostrar el de opciones
        $('#modalGenerarVoucher').modal('hide');
        $('#modalOpcionesNavegacion').modal('show');
    });

    // Funcionalidad del botón para volver a retirar dinero
    document.getElementById('btnVolverRetirar').addEventListener('click', function() {
        // Limpiar el campo de entrada y el resultado
        document.getElementById('inputMontoRetiro').value = '';
        document.getElementById('resultadoRetiro').textContent = '';
        // Mostrar el modal de retiro
        $('#modalRetirarDinero').modal('show');
        // Cerrar el modal de opciones
        $('#modalOpcionesNavegacion').modal('hide');
    });

    // Funcionalidad del botón para volver al menú principal
    document.getElementById('btnVolverMenu').addEventListener('click', function() {
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
        const accountNumber = '0987654321'; // Reemplaza con el número de cuenta real
        const userName = 'Ash Ketchum'; // Reemplaza con el nombre del usuario

        doc.setFontSize(16);
        doc.text('Voucher de Retiro', 20, 20);
        doc.setFontSize(12);
        doc.text(`Fecha y Hora: ${date}`, 20, 30);
        doc.text(`Nombre: ${userName}`, 20, 40);
        doc.text(`Número de Cuenta: ${accountNumber}`, 20, 50);
        doc.text(`ID de Transacción: ${id_retiro}`, 20, 60);
        doc.text(`Monto Retirado: $${amount}`, 20, 70);
        doc.text(`Nuevo Saldo: $${currentBalance}`, 20, 80);
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
