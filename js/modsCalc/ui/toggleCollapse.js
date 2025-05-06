export function toggleCollapse(contentElement) {
    if (!contentElement) return;
    contentElement.classList.toggle('expanded');
}