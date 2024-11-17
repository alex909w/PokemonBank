document.addEventListener('DOMContentLoaded', function() 
    // Recuperar los datos del usuario de localStorage
    const userName = localStorage.getItem('userName');
    const userAccount = localStorage.getItem('userAccount');

    // Mostrar los datos en la página
    document.getElementById('user-name').textContent = `Bienvenido, ${userName}`;
    document.getElementById('user-account').textContent = `Cuenta: ${userAccount}`;
});

document.addEventListener('DOMContentLoaded', function() {
    // Agregar un evento al botón de salir
    document.getElementById('btn-logout').addEventListener('click', function() {
        // Mostrar el modal de confirmación
        $('#salirModal').modal('show');
    });

    // Agregar un evento al botón de confirmar salir en el modal
    document.getElementById('btn-confirm-logout').addEventListener('click', function() {
        // Redirigir al usuario al login
        window.location.href = 'index.html'; 
    });
});
