document.addEventListener('DOMContentLoaded', function() {
    // Cargar y mostrar historial de transacciones
    function loadTransactionHistory() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const container = document.getElementById('transaction-history');

        const table = document.createElement('table');
        table.id = 'transaction-table';
        table.style.width = '100%';
        table.style.tableLayout = 'fixed';
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
        voucherHeader.classList.add('voucher-column');

        headerRow.appendChild(dateHeader);
        headerRow.appendChild(idHeader);
        headerRow.appendChild(descriptionHeader);
        headerRow.appendChild(voucherHeader);
        thead.appendChild(headerRow);
        table.appendChild(thead);

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

            if (index < transactions.length - 1) {
                row.style.borderBottom = '1px solid #ddd';
            }

            tbody.appendChild(row);
        });

        table.appendChild(tbody);

        container.innerHTML = '';
        container.appendChild(table);
    }

    // Cargar historial de transacciones al cargar la página
    loadTransactionHistory();

    // Configurar gráfico
    const ctx = document.getElementById('transactionsChart').getContext('2d');

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let deposits = transactions.filter(t => t.description.includes('Depósito'));
    let withdrawals = transactions.filter(t => t.description.includes('Retiro'));
    let payments = transactions.filter(t => t.description.includes('Pago de'));

    function prepareData(transactions) {
        return {
            labels: transactions.map(t => t.date),
            data: transactions.map(t => parseFloat(t.description.replace(/[^0-9.-]/g, '')) || 0)
        };
    }

    let depositData = prepareData(deposits);
    let withdrawalData = prepareData(withdrawals);
    let paymentData = prepareData(payments);

    function formatLabel(dateTimeString) {
        const [date, time] = dateTimeString.split(', ');
        return `${date}\n${time}`;
    }

    let labels = Array.from(new Set([...depositData.labels, ...withdrawalData.labels, ...paymentData.labels]))
                      .map(formatLabel);

    const transactionsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Depósitos',
                    data: depositData.data,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Retiros',
                    data: withdrawalData.data,
                    borderColor: '#FF5722',
                    backgroundColor: 'rgba(255, 87, 34, 0.2)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Pagos de Servicios',
                    data: paymentData.data,
                    borderColor: '#FFCB05',
                    backgroundColor: 'rgba(255, 203, 5, 0.2)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            plugins: {
                datalabels: {
                    display: true,
                    color: '#FFFFFF',
                    align: 'top',
                    anchor: 'end',
                    formatter: (value) => value.toFixed(2)
                },
                legend: {
                    labels: {
                        color: '#FFFFFF'
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Fecha y Hora',
                        color: '#FFFFFF'
                    },
                    ticks: {
                        color: '#FFFFFF',
                        callback: function(value) {
                            return this.getLabelForValue(value).split('\n');
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Monto ($)',
                        color: '#FFFFFF'
                    },
                    ticks: {
                        color: '#FFFFFF'
                    }
                }
            }
        }
    });
});
