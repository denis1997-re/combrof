document.addEventListener('DOMContentLoaded', function() {
    const burgerMenuToggle = document.querySelector('.burger-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (burgerMenuToggle && sidebar && overlay) {
        burgerMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-open');
            burgerMenuToggle.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', function() {
            sidebar.classList.remove('mobile-open');
            burgerMenuToggle.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
});