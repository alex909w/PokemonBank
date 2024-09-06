// SWEETALERT2 LIBRARY

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
});


// Alerta para cuando se ingrese un nuevo deposito junto con sus validaciones
const depositoClick = () => {
    const depositoValor = document.getElementById('deposit-amount').value
    if (depositoValor === '') {
        return false;
    }
    let valorNumero = Number(depositoValor)
    if (valorNumero <= 0) {
        return false;
    }
    if (!Number.isInteger(valorNumero)) {
        return false;
    }
    Toast.fire({
        icon: "success",
        title: "DEPOSITO REALIZADO CON EXITO."
    });
}

// Agregamos la funcion a los elementos
document.getElementById('btn_deposito').addEventListener('click', depositoClick);