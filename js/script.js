// Validación del formulario de login con redirección a acciones.html
document.getElementById('loginForm').addEventListener('submit', function(e) 
    e.preventDefault();
    const pin = document.getElementById('pin').value;
    
    if (pin.length === 4) {
        window.location.href = 'acciones.html';
    } else {
        alert('El PIN debe tener 4 dígitos');
    }
});
