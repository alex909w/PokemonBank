document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('transactionsChart').getContext('2d');

    // Obtener transacciones del almacenamiento local
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Filtrar las transacciones por tipo
    let deposits = transactions.filter(t => t.description.includes('Depósito'));
    let withdrawals = transactions.filter(t => t.description.includes('Retiro'));
    let payments = transactions.filter(t => t.description.includes('Pago de'));

    // Preparar datos para cada categoría
    function prepareData(transactions) {
        return {
            labels: transactions.map(t => t.date),
            data: transactions.map(t => parseFloat(t.description.replace(/[^0-9.-]/g, '')) || 0)
        };
    }

    let depositData = prepareData(deposits);
    let withdrawalData = prepareData(withdrawals);
    let paymentData = prepareData(payments);

    // Función para separar fecha y hora en líneas distintas
    function formatLabel(dateTimeString) {
        const [date, time] = dateTimeString.split(', '); // Suponiendo que el formato sea "fecha, hora"
        return `${date}\n${time}`; // Fecha en una línea, hora en otra
    }

    // Aplicar el formato a las etiquetas
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
            scales: {
                x: {
                    beginAtZero: true,

                    ticks: {
                        color: '#FFFFFF',
                        callback: function(value) {
                            // Permitir que Chart.js divida en múltiples líneas
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
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#FFFFFF' // Color de las etiquetas de la leyenda
                    }
                }
            }
        }
    });
});
