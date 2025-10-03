function handleGoogleLogin(response) {
    const idToken = response.credential;
    console.log("ID Token dari Google: " + idToken);
    
    const statusMessage = document.getElementById('statusMessage');
    if (statusMessage) {
        statusMessage.textContent = 'Memvalidasi token Google...';
        statusMessage.classList.remove('text-success', 'text-danger');
        statusMessage.classList.add('text-primary'); 
    }

    fetch('https://combrof.yzz.me/google_auth_api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // kirim cookie/session juga
        body: JSON.stringify({ idToken: idToken }),
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
            statusMessage.textContent = 'Terjadi kesalahan saat menghubungi server. Silakan coba lagi.';
            statusMessage.classList.remove('text-primary', 'text-success');
            statusMessage.classList.add('text-danger');
        }
    });
}

