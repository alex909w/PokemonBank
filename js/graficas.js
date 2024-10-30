document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById("graficosModal");
    const ctx = document.getElementById('transactionsChart').getContext('2d');

    // Función para cargar el gráfico
    function loadChart() {
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        let deposits = transactions.filter(t => t.description.includes('Depósito'));
        let withdrawals = transactions.filter(t => t.description.includes('Retiro'));
        let payments = transactions.filter(t => t.description.includes('Pago de'));

        function prepareData(transactions) {
            return {
                labels: transactions.map(t => t.date.split('T')[0]), // Quitar hora
                data: transactions.map(t => parseFloat(t.description.replace(/[^0-9.-]/g, '')) || 0)
            };
        }

        let depositData = prepareData(deposits);
        let withdrawalData = prepareData(withdrawals);
        let paymentData = prepareData(payments);

        let labels = Array.from(new Set([...depositData.labels, ...withdrawalData.labels, ...paymentData.labels]));

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
                        fill: false,
                        pointRadius: 5,
                    },
                    {
                        label: 'Retiros',
                        data: withdrawalData.data,
                        borderColor: '#FF5722',
                        backgroundColor: 'rgba(255, 87, 34, 0.2)',
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 5,
                    },
                    {
                        label: 'Pagos de Servicios',
                        data: paymentData.data,
                        borderColor: '#FFCB05',
                        backgroundColor: 'rgba(255, 203, 5, 0.2)',
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 5,
                    }
                ]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            color: '#000000' // Cambia a color deseado
                        }
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'nearest',
                        intersect: true,
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.dataset.label}: $${tooltipItem.raw.toFixed(2)}`;
                            }
                        },
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleColor: '#FFFFFF',
                        bodyColor: '#FFFFFF',
                        borderColor: '#FFFFFF',
                        borderWidth: 1
                    },
                    zoom: {
                        // Configuración de zoom
                        pan: {
                            enabled: true,
                            mode: 'xy' // Habilita el desplazamiento en ambos ejes
                        },
                        zoom: {
                            enabled: true,
                            mode: 'xy', // Habilita el zoom en ambos ejes
                            speed: 0.1, // Velocidad de zoom
                            sensitivity: 3 // Sensibilidad del zoom
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Movimientos', // Solo se muestra "Movimientos" como título del eje X
                            color: '#000000'
                        },
                        ticks: {
                            display: false, // Oculta todas las etiquetas de los valores en el eje X
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Monto ($)',
                            color: '#000000'
                        },
                        ticks: {
                            color: '#000000' // Cambia a color deseado
                        }
                    }
                }
            }
        });        
    }

    // Inicializa el gráfico solo cuando el modal se muestre
    $('#graficosModal').on('show.bs.modal', function () {
        loadChart();
    });
});
