document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('deposit-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const amount = parseFloat(document.getElementById('deposit-amount').value);
        const result = document.getElementById('deposit-result');
        const voucherSection = document.getElementById('voucher-section');
        let id_deposito = ''
    
        if (amount > 0) {
            let currentBalance = parseFloat(localStorage.getItem('balance')) || 0;
            currentBalance += amount;
            localStorage.setItem('balance', currentBalance);
    
            result.textContent = `Has depositado $${amount}. Nuevo saldo: $${currentBalance}`;
    
            // Generamos un ID generico para deposito y lo almacenamos en localstorage
            let id = ''
            let iniciales = 'DE'
            let digitos = '1234567890'
            for (let i = 0; i < 5; i++) {
                const digitoRandom = Math.floor(Math.random() * digitos.length)
                id += digitos[digitoRandom]
            }
            id_deposito = iniciales + id
            localStorage.setItem('id_deposito', id_deposito);
    
            // Registrar la transacción y generar voucher
            const voucher = generateVoucherPDF(id_deposito, amount, currentBalance);
            recordTransaction(id_deposito, `Depósito de $${amount}`, voucher);
    
            // Mostrar el voucher en el modal
            voucherSection.innerHTML = `<pre>${voucher}</pre>`;
    
            // Mostrar el modal de voucher
            $('#voucherModal').modal('show');
            
        } else {
            result.textContent = 'Por favor, ingresa un monto válido.';
        }
    });
    
    document.getElementById('generateVoucher').addEventListener('click', function() {
        const amount = parseFloat(document.getElementById('deposit-amount').value);
        let currentBalance = parseFloat(localStorage.getItem('balance')) || 0;
        const id = localStorage.getItem('id_deposito')
    
        generateVoucherPDF(id, amount, currentBalance);
    
        // Cerrar el modal de voucher y mostrar el de opciones
        $('#voucherModal').modal('hide');
        $('#optionModal').modal('show');
    });
    
    document.getElementById('noVoucher').addEventListener('click', function() {
        // Cerrar el modal de voucher y mostrar el de opciones
        $('#voucherModal').modal('hide');
        $('#optionModal').modal('show');
    });
    
    document.getElementById('retryDeposit').addEventListener('click', function() {
        // Limpiar el campo de entrada y el resultado
        document.getElementById('deposit-amount').value = '';
        document.getElementById('deposit-result').textContent = '';
        // Mostrar el modal de depósito
        $('#depositModal').modal('show');
        // Cerrar el modal de opciones
        $('#optionModal').modal('hide');
    });
    
    document.getElementById('goToMenu').addEventListener('click', function() {
        window.location.href = '../acciones.html'; // Volver al menú de acciones
    });
})

function recordTransaction(id, description, voucher = '') {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const date = new Date().toLocaleString();

    transactions.push({ id, description, voucher, date });
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function generateVoucherPDF(id, amount, currentBalance) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const date = new Date().toLocaleString();
    const accountNumber = localStorage.getItem('userAccount') // Reemplaza con el número de cuenta real
    const userName = localStorage.getItem('userName'); // Reemplaza con el nombre del usuario

    doc.setFontSize(16);
    doc.text('Voucher de Depósito', 20, 20);
    doc.setFontSize(12);
    doc.text(`Fecha y Hora: ${date}`, 20, 40);
    doc.text(`Nombre: ${userName}`, 20, 50);
    doc.text(`Número de Cuenta: ${accountNumber}`, 20, 60);
    doc.text(`ID de Transaccion: ${id}`, 20, 70);
    doc.text(`Monto Depositado: $${amount}`, 20, 80);
    doc.text(`Nuevo Saldo: $${currentBalance}`, 20, 90);
    doc.text(`Gracias por utilizar Pokémon Bank!`, 20, 100);

    // Guardar el PDF
    doc.save('Deposito.pdf');
}
