function handleGoogleLogin(response) {
    const idToken = response.credential;
    console.log("ID Token dari Google: " + idToken);
    
    // Temukan elemen pesan status di halaman
    const statusMessage = document.getElementById('statusMessage');
    if (statusMessage) {
        statusMessage.textContent = 'Memvalidasi token Google...';
        statusMessage.classList.remove('text-success', 'text-danger');
        statusMessage.classList.add('text-primary'); 
    }

    // Kirim ID Token ke server PHP Anda
    fetch('htdocs/google_auth_api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // supaya cookie/session ikut terkirim
        body: JSON.stringify({ idToken: idToken }),
    })
    .then(res => res.json())
    .then(data => {
        console.log('Response dari server:', data);  // Debug: Lihat respons server

        if (data.success) {
            // Jika login/registrasi berhasil
            if (statusMessage) {
                statusMessage.textContent = data.message;
                statusMessage.classList.remove('text-primary', 'text-danger');
                statusMessage.classList.add('text-success');
            }
            
            // Simpan nama pengguna ke localStorage
            localStorage.setItem('username', data.username);
            
            // Arahkan ke halaman dashboard.html
            window.location.href = 'dashboard.html';
        } else {
            // Tampilkan pesan error jika login/registrasi gagal
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
            statusMessage.textContent = 'Terjadi kesalahan saat menghubungi server. Silakan coba lagi.';
            statusMessage.classList.remove('text-primary', 'text-success');
            statusMessage.classList.add('text-danger');
        }
    });
}
