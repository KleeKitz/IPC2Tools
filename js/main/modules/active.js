export function activeLink() {
    let currentPage = window.location.pathname.split('/').pop() || "index.html";

    let navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        let linkHref = link.getAttribute('href');

        if (!linkHref) return;

        let linkPage = linkHref.split('/').pop();

        if (currentPage === linkPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}