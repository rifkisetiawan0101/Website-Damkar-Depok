document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const formResponse = document.getElementById('formResponse');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        };

        fetch('login-process.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            formResponse.classList.remove('d-none', 'alert-success', 'alert-danger');
            formResponse.classList.add(data.status === 'success' ? 'alert-success' : 'alert-danger');
            formResponse.textContent = data.message;

            if (data.status === 'success') {
                loginForm.reset();
                formResponse.classList.remove('d-none', 'alert-danger');
                formResponse.classList.add('alert-success');
                formResponse.textContent = 'Berhasil Login.';
                setTimeout(() => {
                    window.location.href = 'admin-damkar.html';
                }, 1500);
            }
        })
        .catch(error => {
            formResponse.classList.remove('d-none', 'alert-success');
            formResponse.classList.add('alert-danger');
            formResponse.textContent = 'An error occurred. Please try again.';
        });
    });
});