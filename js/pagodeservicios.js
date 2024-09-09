document.getElementById('formPagarServicios').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const serviceType = document.getElementById('selectServicio').value;
    const amount = parseFloat(document.getElementById('inputMontoPago').value);
    const result = document.getElementById('resultadoPago');
    let id_ps = '';

    if (!isNaN(amount) && amount > 0 && serviceType) {
        let currentBalance = parseFloat(localStorage.getItem('balance')) || 0;
        if (amount <= currentBalance) {
            currentBalance -= amount;
            localStorage.setItem('balance', currentBalance.toFixed(2)); // Guardar saldo con dos decimales

            result.textContent = `Has pagado $${amount.toFixed(2)} por ${serviceType}. Nuevo saldo: $${currentBalance.toFixed(2)}`;

            // DEFINIMOS EL ID DEPENDIENDO DEL TIPO DE SERVICIO
            let id = '';
            let digitos = '1234567890';
            for (let i = 0; i < 5; i++) {
                const digitoRandom = Math.floor(Math.random() * digitos.length);
                id += digitos[digitoRandom];
            }

            if (serviceType.includes('Energía Eléctrica')) {
                id_ps = 'PSE' + id;
            } else if (serviceType.includes('Internet')) {
                id_ps = 'PSI' + id;
            } else if (serviceType.includes('Telefonía')) {
                id_ps = 'PST' + id;
            } else if (serviceType.includes('Agua Potable')) {
                id_ps = 'PSA' + id;
            }
            localStorage.setItem('last_pago_servicio_id', id_ps);
            
            // Registrar la transacción
            recordTransaction(id_ps, `Pago de ${serviceType}: $${amount.toFixed(2)}`);
            
            // Generar el voucher PDF (opcional)
            const voucher = generateVoucherPDF(id_ps, amount, currentBalance, serviceType);
            // Mostrar el voucher en el modal
            document.getElementById('voucher-section').innerHTML = `<pre>${voucher}</pre>`;
            // Mostrar el modal de voucher
            $('#modalGenerarVoucher').modal('show');
        } else {
            result.textContent = 'Saldo insuficiente.';
        }
    } else {
        result.textContent = 'Por favor, completa todos los campos con valores válidos.';
    }
});

function recordTransaction(id, description) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const date = new Date().toLocaleString();

    transactions.push({ id, description, date });
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function generateVoucherPDF(id_pago_servicio, amount, currentBalance, serviceType) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const date = new Date().toLocaleString();
    const accountNumber = '0987654321'; // Reemplaza con el número de cuenta real
    const userName = 'Ash Ketchum'; // Reemplaza con el nombre del usuario

    doc.setFontSize(16);
    doc.text('Voucher de Pago de Servicio', 20, 20);
    doc.setFontSize(12);
    doc.text(`Fecha y Hora: ${date}`, 20, 30);
    doc.text(`Nombre: ${userName}`, 20, 40);
    doc.text(`Número de Cuenta: ${accountNumber}`, 20, 50);
    doc.text(`ID de Pago: ${id_pago_servicio}`, 20, 60);
    doc.text(`Tipo de Servicio: ${serviceType}`, 20, 70);
    doc.text(`Monto Pagado: $${amount.toFixed(2)}`, 20, 80);
    doc.text(`Nuevo Saldo: $${currentBalance.toFixed(2)}`, 20, 90);
    doc.text(`Gracias por utilizar Pokémon Bank!`, 20, 100);

    // Guardar el PDF como un archivo
    const pdfDataUri = doc.output('datauristring');
    return pdfDataUri; // Devuelve la cadena de datos URI del PDF
}
