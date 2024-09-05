document.addEventListener('DOMContentLoaded', function() {
    // Recuperar los datos del usuario de localStorage
    const userName = localStorage.getItem('userName');
    const userAccount = localStorage.getItem('userAccount');

    // Mostrar los datos en la página
    document.getElementById('user-name').textContent = `Bienvenido, ${userName}`;
    document.getElementById('user-account').textContent = `Cuenta: ${userAccount}`;
});
