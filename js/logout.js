const backendBaseURL = 'https://combrof.yzz.me/logout.php'; // Ganti dengan URL backend PHP kamu

// Dapatkan tombol logout.
const logoutButton = document.getElementById('logoutButton');

if (logoutButton) {
    // Tambahkan event listener untuk klik tombol.
    logoutButton.addEventListener('click', () => {
        // Kirim permintaan fetch ke file logout.php di backend terpisah.
        fetch(`${backendBaseURL}/logout.php`) 
            .then(response => {
                // Periksa apakah respons berhasil (status 200).
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Logout request failed.');
            })
            .then(data => {
                // Jika respons dari server menandakan sukses,
                if (data.success) {
                    // Arahkan pengguna ke halaman login.
                    window.location.href = 'login.html';
                }
            })
            .catch(error => {
                // Tangani kesalahan jika ada masalah.
                console.error('Error saat mencoba logout:', error);
                // Meskipun terjadi error, kita bisa tetap mengarahkan pengguna untuk berjaga-jaga.
                window.location.href = 'login.html';
            });
    });
}


