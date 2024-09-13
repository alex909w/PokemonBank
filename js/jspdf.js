// JSPDF LIBRARY 
var doc = new jsPDF();

document.addEventListener('DOMContentLoaded', () => {
    // Textos a mostrar en el encabezado del documento pdf
    const usuario = localStorage.getItem('userName') || "Usuario Desconocido";
    const numero_cuenta = localStorage.getItem('userAccount') || "N/A";

    // Encabezados para la tabla
    const encabezados = [['ID', 'TRANSACCIÓN', 'CANTIDAD', 'HORA', 'FECHA']];
    const datos = [];

    // Variables a usar para mostrar en la tabla
    let fecha_transaccion = '';
    let hora_transaccion = '';
    let transaccion_opciones = [
        'Depósito', 
        'Retiro', 
        'Pago de Energía Eléctrica', 
        'Pago de Internet', 
        'Pago de Telefonía', 
        'Pago de Agua Potable'
    ];
    let transaccionSeleccionada = '';

    const transacciones = JSON.parse(localStorage.getItem('transactions')) || [];

    // Iterar sobre las transacciones almacenadas en localStorage
    transacciones.forEach(transaccion => {
        let fechaInicial = transaccion.date;
        let descripcion = transaccion.description;
        let id = transaccion.id || 'N/A';  // Obtener el ID de cada transacción

        // Convertir la fecha a array para obtener fecha y hora
        const arrFecha = fechaInicial.split(', ');
        fecha_transaccion = arrFecha[0]; // FECHA
        hora_transaccion = arrFecha[1]; // HORA

        let monto = null;

        // Determinar el tipo de transacción y extraer el monto
        if (descripcion.includes('Depósito de ')) {
            monto = descripcion.split('Depósito de')[1].trim();
            transaccionSeleccionada = transaccion_opciones[0];
        } else if (descripcion.includes('Retiro:')) {
            monto = descripcion.split('Retiro:')[1].trim();
            transaccionSeleccionada = transaccion_opciones[1];
        } else if (descripcion.includes('Pago de Energía Eléctrica:')) {
            monto = descripcion.split('Pago de Energía Eléctrica:')[1].trim();
            transaccionSeleccionada = transaccion_opciones[2];
        } else if (descripcion.includes('Pago de Internet:')) {
            monto = descripcion.split('Pago de Internet:')[1].trim();
            transaccionSeleccionada = transaccion_opciones[3];
        } else if (descripcion.includes('Pago de Telefonía:')) {
            monto = descripcion.split('Pago de Telefonía:')[1].trim();
            transaccionSeleccionada = transaccion_opciones[4];
        } else if (descripcion.includes('Pago de Agua Potable:')) {
            monto = descripcion.split('Pago de Agua Potable:')[1].trim();
            transaccionSeleccionada = transaccion_opciones[5];
        }

        // Limpiar y formatear el monto
        if (monto) {
            monto = monto.slice(1);  // Eliminar el símbolo de moneda
            monto = parseFloat(monto).toFixed(2);  // Convertir a formato numérico con dos decimales
        } else {
            monto = '0.00';  // Monto por defecto en caso de error
        }

        // Ingresar los datos a la tabla
        datos.push([id, transaccionSeleccionada, `$${monto}`, hora_transaccion, fecha_transaccion]);
    });

    // Función para generar el reporte en PDF
    const generarReporteHistorial = () => {
        // Encabezado del documento
        doc.setFontSize(20);
        doc.setTextColor('#555');
        doc.text("HISTORIAL DE TRANSACCIONES", 10, 20);

        // Línea divisoria
        doc.setDrawColor('#ccc');
        doc.setLineWidth(0.8);
        doc.line(10, 25, 200, 25);

        // Información del usuario
        doc.setFontSize(12);
        doc.setTextColor('#777');
        doc.text(`Usuario: ${usuario}`, 15, 40);
        doc.text(`Número de cuenta: ${numero_cuenta}`, 15, 48);

        // Generar la tabla con autoTable
        doc.autoTable({
            head: encabezados,
            body: datos,
            startY: 56,
            theme: 'grid',
            headStyles: {
                fillColor: '#333',
                textColor: '#fff'
            },
            styles: {
                fontSize: 10,
                textColor: '#000'
            }
        });

        // Guardar el PDF como un blob
        const pdfBlob = doc.output("blob");

        // Crear un enlace de descarga
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfBlob);
        link.download = "Reporte_Transacciones.pdf";

        // Simular clic en el enlace para iniciar la descarga
        link.click();

        // Revocar el enlace después de la descarga
        URL.revokeObjectURL(link.href);
    };

    // Vincular el botón con la función de generar reporte
    document.getElementById("historial_reporte").addEventListener("click", generarReporteHistorial);
});
