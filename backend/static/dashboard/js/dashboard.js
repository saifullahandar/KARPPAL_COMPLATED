document.addEventListener("DOMContentLoaded", function () {
    var sidebar = document.getElementById("sidebar");
    var backdrop = document.getElementById("sidebarBackdrop");
    var toggle = document.getElementById("sidebarToggle");

    function closeSidebar() {
        sidebar.classList.remove("open");
        backdrop.classList.remove("show");
    }

    if (toggle) {
        toggle.addEventListener("click", function () {
            sidebar.classList.toggle("open");
            backdrop.classList.toggle("show");
        });
    }
    if (backdrop) {
        backdrop.addEventListener("click", closeSidebar);
    }

    var alerts = document.querySelectorAll(".alert");
    alerts.forEach(function (alertEl) {
        setTimeout(function () {
            var closeBtn = alertEl.querySelector(".btn-close");
            if (closeBtn) closeBtn.click();
        }, 6000);
    });
});
