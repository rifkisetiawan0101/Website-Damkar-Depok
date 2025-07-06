document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const formResponse = document.getElementById('formResponse');

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);

        fetch('../src/core/register-process.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            formResponse.classList.remove('d-none', 'alert-success', 'alert-danger');
            formResponse.classList.add(data.status === 'success' ? 'alert-success' : 'alert-danger');
            formResponse.textContent = data.message;

            if (data.status === 'success') {
                registerForm.reset();
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }
        })
        .catch(error => {
            formResponse.classList.remove('d-none', 'alert-success');
            formResponse.classList.add('alert-danger');
            formResponse.textContent = 'Terjadi Kesalahan, Harap Coba Ulang.';
        });
    });
});