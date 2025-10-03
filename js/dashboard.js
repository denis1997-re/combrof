// BASE URL backend kamu
const baseUrl = 'http://combrof.yzz.me';

// ==========================
// Ambil dan Tampilkan Username dari Session
// ==========================
function getAndDisplayUsername() {
    fetch(`${baseUrl}/get_session_data.php`, {
        credentials: 'include',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Gagal mengambil data sesi. Status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const usernameDisplay = document.getElementById('usernameDisplay');
            if (usernameDisplay && data.username) {
                usernameDisplay.textContent = data.username;
            } else if (usernameDisplay) {
                usernameDisplay.textContent = 'Pengguna';
            }
        })
        .catch(error => {
            console.error('Kesalahan saat mengambil data sesi:', error);
            const usernameDisplay = document.getElementById('usernameDisplay');
            if (usernameDisplay) {
                usernameDisplay.textContent = 'Pengguna';
            }
        });
}

// ==========================
// Fungsi Logout
// ==========================
function setupLogout() {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            fetch(`${baseUrl}/htdocs/logout.php`, {
                credentials: 'include',
            })
                .then(response => {
                    if (response.ok) {
                        window.location.href = 'login.html';
                    } else {
                        console.error('Logout gagal. Status:', response.status);
                    }
                })
                .catch(error => {
                    console.error('Gagal logout:', error);
                });
        });
    }
}

// ==========================
// Modal Pengaturan & Bantuan
// ==========================
function setupModals() {
    const settingsBtn = document.getElementById("settingsButton");
    const helpBtn = document.getElementById("helpButton");

    const settingsModalElem = document.getElementById('settingsModal');
    const helpModalElem = document.getElementById('helpModal');

    if (!settingsModalElem || !helpModalElem) return;

    const settingsModal = new bootstrap.Modal(settingsModalElem);
    const helpModal = new bootstrap.Modal(helpModalElem);

    if (settingsBtn) {
        settingsBtn.addEventListener("click", () => {
            settingsModal.show();
        });
    }

    if (helpBtn) {
        helpBtn.addEventListener("click", () => {
            helpModal.show();
        });
    }
}

// ==========================
// Hapus Semua Riwayat Chat
// ==========================
function setupClearHistory() {
    const clearHistoryBtn = document.getElementById("clearHistoryBtn");
    const historyList = document.getElementById("historyList");

    if (clearHistoryBtn && historyList) {
        clearHistoryBtn.addEventListener("click", () => {
            const confirmDelete = confirm("Apakah Anda yakin ingin menghapus semua riwayat percakapan?");
            if (confirmDelete) {
                historyList.innerHTML = '';
                // Jika ada penyimpanan riwayat di localStorage, hapus juga
                localStorage.removeItem('chatHistory');
            }
        });
    }
}

// ==========================
// Setup Tema dan Warna
// ==========================
function setupThemeSettings() {
    const themeSelect = document.getElementById('themeSelect');
    const colorPicker = document.getElementById('colorPicker');

    // Load tema dan warna dari localStorage atau default
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedColor = localStorage.getItem('themeColor') || '#0d6efd';

    if (themeSelect) themeSelect.value = savedTheme;
    if (colorPicker) colorPicker.value = savedColor;

    applyTheme(savedTheme, savedColor);

    if (themeSelect) {
        themeSelect.addEventListener('change', () => {
            const selectedTheme = themeSelect.value;
            const selectedColor = colorPicker.value;
            applyTheme(selectedTheme, selectedColor);
            localStorage.setItem('theme', selectedTheme);
            localStorage.setItem('themeColor', selectedColor);
        });
    }

    if (colorPicker) {
        colorPicker.addEventListener('input', () => {
            const selectedTheme = themeSelect ? themeSelect.value : 'light';
            const selectedColor = colorPicker.value;
            applyTheme(selectedTheme, selectedColor);
            localStorage.setItem('themeColor', selectedColor);
        });
    }
}

function applyTheme(theme, color) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
    } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
    }

    // Set warna tema di CSS variable
    document.documentElement.style.setProperty('--theme-color', color);

    // Opsional: Sesuaikan warna sidebar & header-top sesuai theme-color
    const sidebar = document.querySelector('.sidebar');
    const headerTop = document.querySelector('.header-top');
    if (sidebar) sidebar.style.backgroundColor = color;
    if (headerTop) headerTop.style.backgroundColor = color;
}

// ==========================
// Inisialisasi Semua Saat DOM Siap
// ==========================
document.addEventListener('DOMContentLoaded', function () {
    getAndDisplayUsername();
    setupLogout();
    setupModals();
    setupClearHistory();
    setupThemeSettings();
});



