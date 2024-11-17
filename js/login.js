document.getElementById('login-form').addEventListener('submit', function(e) 
    e.preventDefault();
    
    // Validar el PIN ingresado
    const enteredPin = document.getElementById('pin').value;
    const correctPin = "1234"; // El PIN correcto para Ash Ketchum
    const pinInputField = document.getElementById('pin');
    const errorMessage = document.getElementById('error-message');

    if (enteredPin === correctPin) {
        // Limpiar el localStorage
        localStorage.clear();
        // Guardar los datos del usuario en localStorage
        localStorage.setItem('userName', 'Ash Ketchum');
        localStorage.setItem('userAccount', '0987654321');
        
        // Redirigir a la página de acciones
        window.location.href = "acciones.html";
    } else {
        // Mostrar mensaje de error debajo del botón
        errorMessage.textContent = 'PIN incorrecto. Inténtalo de nuevo.';
        errorMessage.style.display = 'block'; // Mostrar el mensaje

        // Limpiar el campo de entrada de PIN
        pinInputField.value = '';
        
        // Enfocar el campo de PIN para un nuevo intento
        pinInputField.focus();
    }
});

// Borrar el mensaje de error cuando el usuario hace clic en el campo de PIN
document.getElementById('pin').addEventListener('input', function() {
    document.getElementById('error-message').style.display = 'none';
});