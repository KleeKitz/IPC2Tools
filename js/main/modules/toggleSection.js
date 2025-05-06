export function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const sectionHeader = document.getElementById(`${sectionId}-header`);

    if (!section || !sectionHeader) {
        console.error(`Error: Could not find elements for ${sectionId}`);
        return;
    }

    section.classList.toggle('expanded');
    sectionHeader.classList.toggle('expanded');
    const labelSpan = sectionHeader.querySelector('.label');

    // Save state on localStorage for page transition
    const isExpanded = section.classList.contains('expanded');
    localStorage.setItem(`sidebar-${sectionId}-expanded`, isExpanded);
}