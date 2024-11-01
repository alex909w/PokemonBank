document.addEventListener("DOMContentLoaded", function () {
    // Verifica si el canvas existe antes de crear el gráfico
    var canvas = document.getElementById('transaccionesChart');
    
    if (canvas) {
        var ctx = canvas.getContext('2d');
        var transaccionesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Depositar', 'Retirar', 'Energía Eléctrica', 'Agua Potable', 'Teléfono', 'Internet'],
                datasets: [{
                    label: 'Cantidad de Transacciones',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});
