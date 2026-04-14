function toggleHub() {
    if (document.body.classList.contains('regular-sidebar')) return;
    const sidebar = document.querySelector('.sidebar');
    const trigger = document.querySelector('.hub-trigger');
    sidebar.classList.toggle('active');
    trigger.classList.toggle('active');
    
    // Toggle icon/text
    if (trigger.classList.contains('active')) {
        trigger.textContent = '✕';
    } else {
        trigger.textContent = 'S';
    }
}

function applySidebarSetting() {
    const isRegular = localStorage.getItem('sidebarMode') === 'regular';
    if (isRegular) {
        document.body.classList.add('regular-sidebar');
    } else {
        document.body.classList.remove('regular-sidebar');
    }
}

window.toggleSidebarMode = function(isRegular) {
    localStorage.setItem('sidebarMode', isRegular ? 'regular' : 'hub');
    applySidebarSetting();
};

// Close hub when clicking outside
document.addEventListener('click', (e) => {
    if (document.body.classList.contains('regular-sidebar')) return;
    const sidebar = document.querySelector('.sidebar');
    const trigger = document.querySelector('.hub-trigger');
    if (sidebar && sidebar.classList.contains('active')) {
        if (!sidebar.contains(e.target) && !trigger.contains(e.target)) {
            sidebar.classList.remove('active');
            trigger.classList.remove('active');
            trigger.textContent = 'S';
        }
    }
});

// Animation observer for scroll animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    applySidebarSetting();
    // Add animation classes to initial elements
    const animateElements = document.querySelectorAll('.hero-copy > *, .math-section, .about > *, .hero-panel');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Handle dynamically added cards (for games.html)
    const gamesGrid = document.getElementById('gamesGrid');
    if (gamesGrid) {
        const gridObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains('math-card')) {
                        node.style.opacity = '0';
                        node.style.animationDelay = `${mutation.target.children.length * 0.05}s`;
                        observer.observe(node);
                    }
                });
            });
        });
        gridObserver.observe(gamesGrid, { childList: true });
    }
    
    // Initial check for any cards already there
    document.querySelectorAll('.math-card').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
});
