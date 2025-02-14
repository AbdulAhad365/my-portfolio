// Scroll Progress Indicator
window.addEventListener('scroll', () => {
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.transform = `scaleX(${scrollPercent / 100})`;
});

// Custom Cursor
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.cursor-dot');
    
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
});

// Add hover effect to clickable elements
document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('mouseenter', () => {
        const cursor = document.querySelector('.custom-cursor');
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursor.style.borderColor = 'var(--primary-color)';
    });
    
    element.addEventListener('mouseleave', () => {
        const cursor = document.querySelector('.custom-cursor');
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.borderColor = 'var(--primary-color)';
    });
}); 