document.addEventListener('DOMContentLoaded', () => {

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

            // Mengambil nilai dari input dengan ID 'email'
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Umpan balik visual saat proses berjalan
            loginMessageDiv.textContent = 'Memproses...';
            loginMessageDiv.style.color = '#007bff';

            try {
                const response = await fetch('php/login_process.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // Mengirim data 'email' dan 'password' ke server
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();
                
                if (data.success) {
                    showMessage(loginMessageDiv, data.message, true);
                    
                    // ? TAMBAHAN: Simpan email ke localStorage setelah login berhasil
                    localStorage.setItem('email', email);

                    // Redirect ke halaman dashboard setelah login berhasil
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

            // Umpan balik visual saat proses berjalan
            registerMessageDiv.textContent = 'Memproses...';
            registerMessageDiv.style.color = '#007bff';

            try {
                const response = await fetch('php/register_process.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await response.json();
                
                if (data.success) {
                    // Redirect ke halaman sukses registrasi dengan membawa username di URL
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