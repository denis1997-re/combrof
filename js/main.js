document.addEventListener('DOMContentLoaded', () => {

    // ✅ Base URL backend tanpa tambahan file PHP
    const backendBaseURL = 'https://combrof.yzz.me';

    // Fungsi bantuan untuk menampilkan pesan
    const showMessage = (element, message, isSuccess) => {
        element.textContent = message;
        element.style.color = isSuccess ? 'green' : 'red';
    };

    // --- 🔐 Login ---
    const loginForm = document.getElementById('loginForm');
    const loginMessageDiv = document.getElementById('message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!email || !password) {
                showMessage(loginMessageDiv, 'Email dan password wajib diisi.', false);
                return;
            }

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
                showMessage(loginMessageDiv, 'Gagal terhubung ke server. Coba lagi.', false);
                console.error('Login error:', error);
            }
        });
    }

    // --- 📝 Register ---
    const registerForm = document.getElementById('registerForm');
    const registerMessageDiv = document.getElementById('message');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('regUsername').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value.trim();

            if (!username || !email || !password) {
                showMessage(registerMessageDiv, 'Semua kolom wajib diisi.', false);
                return;
            }

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
                showMessage(registerMessageDiv, 'Gagal terhubung ke server. Coba lagi.', false);
                console.error('Registration error:', error);
            }
        });
    }

});
