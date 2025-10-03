document.addEventListener('DOMContentLoaded', () => {

    // Base URL backend kamu tanpa nama file PHP
    const backendBaseURL = 'https://combrof.yzz.me';

    // Fungsi Bantuan untuk Menampilkan Pesan
    const showMessage = (element, message, isSuccess) => {
        element.textContent = message;
        element.style.color = isSuccess ? 'green' : 'red';
    };

    // --- Logika untuk Form Login ---
    const loginForm = document.getElementById('loginForm');
    const loginMessageDiv = document.getElementById('message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            loginMessageDiv.textContent = 'Memproses...';
            loginMessageDiv.style.color = '#007bff';

            try {
                const response = await fetch(`${backendBaseURL}/login_process.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (data.success) {
                    showMessage(loginMessageDiv, data.message, true);

                    localStorage.setItem('email', email);

                    setTimeout(() => {
                        window.location.href = "dashboard.html";
                    }, 1000);
                } else {
                    showMessage(loginMessageDiv, data.message, false);
                }
            } catch (error) {
                showMessage(loginMessageDiv, 'Terjadi kesalahan pada server. Silakan coba lagi.', false);
                console.error('Login error:', error);
            }
        });
    }

    // --- Logika untuk Form Registrasi ---
    const registerForm = document.getElementById('registerForm');
    const registerMessageDiv = document.getElementById('message');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('regUsername').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;

            registerMessageDiv.textContent = 'Memproses...';
            registerMessageDiv.style.color = '#007bff';

            try {
                const response = await fetch(`${backendBaseURL}/register_process.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await response.json();

                if (data.success) {
                    window.location.href = `register_success.html?username=${data.username}`;
                } else {
                    showMessage(registerMessageDiv, data.message, false);
                }
            } catch (error) {
                showMessage(registerMessageDiv, 'Terjadi kesalahan pada server. Silakan coba lagi.', false);
                console.error('Registration error:', error);
            }
        });
    }

});
