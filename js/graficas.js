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

        // Crear un objeto para almacenar datos de pagos de servicios por tipo de servicio
        let servicesData = {};

        payments.forEach(payment => {
            const serviceName = payment.description.split(' ')[2]; // Suponiendo que el nombre del servicio está en la descripción
            if (!servicesData[serviceName]) {
                servicesData[serviceName] = {
                    labels: [],
                    data: []
                };
            }
            const paymentDate = payment.date.split('T')[0]; // Quitar hora
            const amount = parseFloat(payment.description.replace(/[^0-9.-]/g, '')) || 0;

            if (!servicesData[serviceName].labels.includes(paymentDate)) {
                servicesData[serviceName].labels.push(paymentDate);
                servicesData[serviceName].data.push(amount);
            } else {
                const index = servicesData[serviceName].labels.indexOf(paymentDate);
                servicesData[serviceName].data[index] += amount; // Sumar montos en la misma fecha
            }
        });

        // Crear etiquetas únicas para todos los servicios
        let allLabels = Array.from(new Set([...depositData.labels, ...withdrawalData.labels, ...Object.values(servicesData).flatMap(service => service.labels)]));

        // Preparar los datasets para el gráfico
        const datasets = [
            {
                label: 'Depósitos',
                data: allLabels.map(label => {
                    const index = depositData.labels.indexOf(label);
                    return index !== -1 ? depositData.data[index] : 0;
                }),
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                borderWidth: 2,
                fill: false,
                pointRadius: 5,
            },
            {
                label: 'Retiros',
                data: allLabels.map(label => {
                    const index = withdrawalData.labels.indexOf(label);
                    return index !== -1 ? withdrawalData.data[index] : 0;
                }),
                borderColor: '#FF5722',
                backgroundColor: 'rgba(255, 87, 34, 0.2)',
                borderWidth: 2,
                fill: false,
                pointRadius: 5,
            },
        ];

        // Generar colores aleatorios
        function getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        // Añadir cada servicio como un dataset con colores aleatorios
        for (const [serviceName, data] of Object.entries(servicesData)) {
            const serviceData = allLabels.map(label => {
                const index = data.labels.indexOf(label);
                return index !== -1 ? data.data[index] : 0; // Usar 0 si no hay datos
            });

            datasets.push({
                label: `Pago de ${serviceName}`,
                data: serviceData,
                borderColor: getRandomColor(),
                backgroundColor: 'rgba(0, 0, 0, 0.0)',
                borderWidth: 2,
                fill: false,
                pointRadius: 5,
            });
        }

        const transactionsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: allLabels,
                datasets: datasets
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            color: '#000000' 
                        }
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'nearest',
                        intersect: false, 
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
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Movimientos',
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
