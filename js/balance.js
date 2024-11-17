document.addEventListener('DOMContentLoaded', function() 
    const balance = parseFloat(localStorage.getItem('balance')) || 0;
    document.getElementById('balance').textContent = `Saldo disponible: $${balance}`;
});
