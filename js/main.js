document.addEventListener('DOMContentLoaded', () => {

    // ✅ Base URL ke backend PHP kamu (pastikan TANPA /login_process.php di akhir)
    const backendBaseURL = 'https://combrof.yzz.me';

    // Fungsi untuk menampilkan pesan ke user
    const showMessage = (element, message, isSuccess) => {
        element.textContent = message;
        element.style.color = isSuccess ? 'green' : 'red';
    };

    // --- LOGIN FORM ---
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
                    credentials: 'include', // penting untuk session/cookie
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

    // --- REGISTER FORM ---
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
                    credentials: 'include',
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

    // --- LOGOUT BUTTON ---
    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            fetch(`${backendBaseURL}/logout.php`, {
                credentials: 'include'
            })
            .then(response => {
                if (response.ok) return response.json();
                throw new Error('Logout request failed.');
            })
            .then(data => {
                if (data.success) {
                    window.location.href = 'login.html';
                }
            })
            .catch(error => {
                console.error('Error saat mencoba logout:', error);
                window.location.href = 'login.html';
            });
        });
    }

    // --- GOOGLE LOGIN HANDLER (Jika digunakan) ---
    window.handleGoogleLogin = function(response) {
        const idToken = response.credential;
        console.log("ID Token dari Google: " + idToken);

        const statusMessage = document.getElementById('statusMessage');
        if (statusMessage) {
            statusMessage.textContent = 'Memvalidasi token Google...';
            statusMessage.classList.remove('text-success', 'text-danger');
            statusMessage.classList.add('text-primary');
        }

        fetch(`${backendBaseURL}/google_auth_api.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ idToken }),
        })
        .then(res => res.json())
        .then(data => {
            console.log('Response dari server:', data);

            if (data.success) {
                if (statusMessage) {
                    statusMessage.textContent = data.message;
                    statusMessage.classList.remove('text-primary', 'text-danger');
                    statusMessage.classList.add('text-success');
                }

                localStorage.setItem('username', data.username);
                window.location.href = 'dashboard.html';
            } else {
                if (statusMessage) {
                    statusMessage.textContent = 'Kesalahan: ' + data.message;
                    statusMessage.classList.remove('text-primary', 'text-success');
                    statusMessage.classList.add('text-danger');
                }
            }
        })
        .catch(error => {
            console.error('Error saat mengirim token ke server:', error);
            if (statusMessage) {
                statusMessage.textContent = 'Terjadi kesalahan saat menghubungi server.';
                statusMessage.classList.remove('text-primary', 'text-success');
                statusMessage.classList.add('text-danger');
            }
        });
    };
});
