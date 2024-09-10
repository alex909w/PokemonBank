document.addEventListener('DOMContentLoaded', function() {
    function loadTransactionHistory() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const container = document.getElementById('transaction-history');

        // Crear la tabla y el encabezado
        const table = document.createElement('table');
        table.id = 'transaction-table';
        table.style.width = '100%'; // Tabla ocupa todo el ancho
        table.style.tableLayout = 'fixed'; // Columnas proporcionadas
        table.style.borderCollapse = 'collapse';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const dateHeader = document.createElement('th');
        const idHeader = document.createElement('th');
        const descriptionHeader = document.createElement('th');
        const voucherHeader = document.createElement('th');

        dateHeader.textContent = 'Fecha';
        idHeader.textContent = 'ID';
        descriptionHeader.textContent = 'Descripción';
        voucherHeader.textContent = 'Voucher';
        voucherHeader.classList.add('voucher-column'); // Añadir clase a la columna de voucher

        headerRow.appendChild(dateHeader);
        headerRow.appendChild(idHeader);
        headerRow.appendChild(descriptionHeader);
        headerRow.appendChild(voucherHeader);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Crear el cuerpo de la tabla
        const tbody = document.createElement('tbody');
        transactions.forEach((transaction, index) => {
            const row = document.createElement('tr');
            const dateCell = document.createElement('td');
            const idCell = document.createElement('td');
            const descriptionCell = document.createElement('td');
            const voucherCell = document.createElement('td');

            dateCell.textContent = transaction.date;
            idCell.textContent = transaction.id || 'N/A';
            descriptionCell.textContent = transaction.description;
            voucherCell.textContent = transaction.voucher || 'N/A';
            voucherCell.classList.add('voucher-column');

            row.appendChild(dateCell);
            row.appendChild(idCell);
            row.appendChild(descriptionCell);
            row.appendChild(voucherCell);

            // Agregar línea separadora
            if (index < transactions.length - 1) {
                row.style.borderBottom = '1px solid #ddd';
            }

            tbody.appendChild(row);
        });

        table.appendChild(tbody);

        // Limpiar el contenedor y agregar la tabla
        container.innerHTML = '';
        container.appendChild(table);
    }

    // Llamar a la función cuando la ventana se haya cargado
    window.onload = loadTransactionHistory;
});
