// Define las reglas de validación
const constraints = {
    pin: {
        presence: {
            message: "es requerido"
        },
        format: {
            pattern: "\\d{4}", // Asegura que el PIN sea de 4 dígitos
            message: "debe ser un PIN de 4 dígitos" // Mensaje de error personalizado
        }
    }
};

const pinInputField = document.getElementById('pin');
const errorMessageElement = document.getElementById('error-message');

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene el envío del formulario

    // Limpiar el mensaje de error antes de la validación
    errorMessageElement.style.display = 'none'; // Ocultar el mensaje antes de la validación
    errorMessageElement.innerText = ''; // Limpiar mensaje previo

    // Obtener el valor del PIN ingresado
    const pinInput = pinInputField.value;

    // Validar el PIN usando Validate.js
    const errors = validate({ pin: pinInput }, constraints);

    if (errors) {
        // Si hay errores, mostrar el primer mensaje de error
        errorMessageElement.innerText = errors.pin[0];
        errorMessageElement.style.display = 'block'; // Mostrar el mensaje
    } else {
        // Si el PIN es correcto, redirige o envía el formulario
        // Puedes reemplazar '1234' con la lógica para verificar el PIN correcto
        if (pinInput === '1234') {
            window.location.href = 'acciones.html'; // Redirige a la página deseada
        } else {
            errorMessageElement.innerText = 'PIN incorrecto. Inténtalo de nuevo.'; // Mostrar mensaje de error
            errorMessageElement.style.display = 'block'; // Mostrar el mensaje
        }
    }

    // Limpiar el campo de entrada para que el usuario pueda ingresar un nuevo PIN
    pinInputField.value = ''; // Limpiar el campo de entrada
});

// Limpiar el mensaje de error al hacer foco en el campo de entrada
pinInputField.addEventListener('focus', function() {
    errorMessageElement.style.display = 'none'; // Ocultar el mensaje de error
    errorMessageElement.innerText = ''; // Limpiar mensaje previo
});
