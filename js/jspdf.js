// JSPDF LIBRARY 
var doc = new jsPDF();

document.addEventListener('DOMContentLoaded', () => {
    // Textos a mostrar en el encabezado del documento pdf
    const usuario = localStorage.getItem('userName')
    const numero_cuenta = localStorage.getItem('userAccount')

    // Encabezados para la tabla
    const encabezados = [['ID', 'TRANSACCION', 'CANTIDAD', 'HORA', 'FECHA']]
    const datos = []

    // Variables a usar para mostrar en la tabla
    let fecha_transaccion = ''
    let hora_transaccion = ''
    let transaccion_opciones = ['Depósito', 'Retiro', 'Pago de Energía Eléctrica', 'Pago de Internet', 'Pago de Telefonía', 'Pago de Agua Potable']
    let transaccionSeleccionada = ''

    const transacciones = JSON.parse(localStorage.getItem('transactions'))
    // Con este forEach puedo acceder al los elementos propios de localStorage segun cada tipo de transaccion
    transacciones.forEach(transaccion => {
        let fechaInicial = transaccion.date
        let descripcion = transaccion.description
        let id = transaccion.id // Obtenemos el ID de cada transaccion hecha

        // Convertimos el string a un array
        const arrFecha = fechaInicial.split(', ')
        // Obtenemos cada elementos del objeto DATE
        fecha_transaccion = arrFecha[0] // FECHA
        hora_transaccion = arrFecha[1] // HORA

        let monto = null

        if (descripcion.includes('Depósito de ')) {
            monto = descripcion.split('Depósito de')
            transaccionSeleccionada = transaccion_opciones[0]
        } else if (descripcion.includes('Retiro:')) {
            monto = descripcion.split('Retiro:')
            transaccionSeleccionada = transaccion_opciones[1]
        } else if(descripcion.includes('Pago de Energía Eléctrica:')) {
            monto = descripcion.split('Pago de Energía Eléctrica:')
            transaccionSeleccionada = transaccion_opciones[2]
        } else if(descripcion.includes('Pago de Internet:')) {
            monto = descripcion.split('Pago de Internet:')
            transaccionSeleccionada = transaccion_opciones[3]
        } else if(descripcion.includes('Pago de Telefonía:')) {
            monto = descripcion.split('Pago de Telefonía:')
            transaccionSeleccionada = transaccion_opciones[4]
        } else if(descripcion.includes('Pago de Agua Potable:')) {
            monto = descripcion.split('Pago de Agua Potable:')
            transaccionSeleccionada = transaccion_opciones[5]
        }

        // Extraemos el valor del monto de cada servicio a traves del array creado descripcion para despues convertirlo a float para mostrarlo como numero
        monto = monto[1].trim()
        monto = monto.slice(1)
        monto = parseFloat(monto)
        monto = `$${monto.toFixed(2)}`

        

        // Ingresamos los datos a la tabla
        datos.push([id, transaccionSeleccionada, monto, hora_transaccion, fecha_transaccion])
    });

    const generarReporteHistorial = () => {
        doc.setFontSize(20)
        doc.setTextColor('#555')
        doc.text("HISTORIAL DE TRANSACCIONES", 10, 20)

        doc.setDrawColor('#ccc')
        doc.setLineWidth(.8)
        doc.line(10, 25, 200, 25)
    
        doc.setFontSize(12)
        doc.setTextColor('#777')
        doc.text(`Usuario: ${usuario}`, 15, 50)
        doc.text(`Numero de cuenta: ${numero_cuenta}`, 65, 50)
    
        doc.autoTable({
            head: encabezados,
            body: datos,
            startY: 56,
            theme: 'grid',
            textAlign: "center",
            styles: {
                fontSize: 10,
                cellPadding: 3,
                textColor: '#a1df00',
                halign: "center"
            },
            headStyles: {
                textColor: "#fff",
                fillColor: '#333',
            },
            bodyStyles: {
                textColor: '#000',
            }
        })
    
    
    
    
    
    
    
    
    
        // Aqui definimos que 
        const pdfBlob = doc.output("blob");
        const pdfLink = URL.createObjectURL(pdfBlob);
        window.open(pdfLink, "_blank");
        window.document.title = "Reporte de Historial de Transacciones"
    };

    // Mandamos a llamar a los elementos
    document.getElementById("historial_reporte").addEventListener("click", generarReporteHistorial);

})