import { activeLink } from './modules/active.js';
import { toggleSection } from './modules/toggleSection.js';
import { sidebarToggle } from './modules/sidebarToggle.js';

document.addEventListener('DOMContentLoaded', () => {
    const sectionIds = ['calculators', 'resources'];

    // Restore sidebar collapsed state
    const sidebar = document.querySelector('.sidebar');
    const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    const device = getDeviceType();

    if (sidebar) {
        const saved = localStorage.getItem('sidebar-collapsed');
        if (saved === 'true' || (!saved && (device === 'mobile' || device === 'tablet'))) {
            sidebar.classList.add('collapsed');
        }
    }

    // Restore expanded sections
    sectionIds.forEach(id => {
        const section = document.getElementById(id);
        const sectionHeader = document.getElementById(`${id}-header`);
        const wasExpanded = localStorage.getItem(`sidebar-${id}-expanded`) === 'true';

        if (wasExpanded) {
            section?.classList.add('expanded');
            sectionHeader?.classList.add('expanded');
        }
    });

    // Expand section with active link
    autoExpandSectionFromActiveLink();

    // Event listeners
    document.getElementById('index-header')?.addEventListener('click', () => document.location.href = "/");
    document.getElementById('calculators-header')?.addEventListener('click', () => toggleSection('calculators'));
    document.getElementById('resources-header')?.addEventListener('click', () => toggleSection('resources'));
    document.getElementById('sidebarToggle')?.addEventListener('click', sidebarToggle);

    activeLink();
});

function autoExpandSectionFromActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-link');

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        const page = href.split('/').pop();
        if (page === currentPage) {
            const section = link.closest('.sidebar-section');
            const sectionId = section?.id;
            const header = document.getElementById(`${sectionId}-header`);

            if (section && header && !section.classList.contains('expanded')) {
                section.classList.add('expanded');
                header.classList.add('expanded');
                localStorage.setItem(`sidebar-${sectionId}-expanded`, 'true');
            }
        }
    });
}

// Check user device to handle behaviors of elements
function getDeviceType() {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
}