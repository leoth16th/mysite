document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = themeToggle?.querySelector('.fa-sun');
    const moonIcon = themeToggle?.querySelector('.fa-moon');
    const html = document.documentElement;

    // Theme Handling with unified attributes and smooth transition
    const setTheme = (theme) => {
        html.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        html.setAttribute('data-theme', theme); // Primary theme attribute
        html.setAttribute('data-bs-theme', theme); // Sync with Bootstrap
        localStorage.setItem('theme', theme);
        
        if (theme === 'dark') {
            sunIcon?.classList.add('d-none');
            moonIcon?.classList.remove('d-none');
            html.classList.add('theme-transition');
        } else {
            sunIcon?.classList.remove('d-none');
            moonIcon?.classList.add('d-none');
            html.classList.add('theme-transition');
        }
        setTimeout(() => html.classList.remove('theme-transition'), 500);
    };

    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
            themeToggle.classList.add('pulse-glow'); // Neon pulse feedback
            setTimeout(() => themeToggle.classList.remove('pulse-glow'), 300);
        });
        // Add hover effect for theme toggle
        themeToggle.addEventListener('mouseover', () => themeToggle.classList.add('neon-glow'));
        themeToggle.addEventListener('mouseout', () => themeToggle.classList.remove('neon-glow'));
    }

    // Go-to-Top Button with enhanced effects
    const goToTop = document.getElementById('goToTop');
    if (goToTop) {
        goToTop.addEventListener('click', (e) => {
            e.preventDefault();
 AscrollTo({ top: 0, behavior: 'smooth' });
            goToTop.classList.add('pulse-glow');
            setTimeout(() => goToTop.classList.remove('pulse-glow'), 300);
        });
        goToTop.addEventListener('mouseover', () => goToTop.classList.add('neon-glow'));
        goToTop.addEventListener('mouseout', () => goToTop.classList.remove('neon-glow'));
    }

    // Language Toggle (Header Select)
    const languageSelect = document.querySelector('#headerLanguageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', () => {
            const selectedLang = languageSelect.value;
            const currentPath = window.location.pathname;
            const newPath = currentPath.replace(/^\/(en|fa)\//, `/${selectedLang}/`);
            window.location.href = newPath;
        });
    }

    // Language Toggle (Footer Dropdown)
    const footerLanguageDropdownItems = document.querySelectorAll('.language-toggle .dropdown-item');
    if (footerLanguageDropdownItems) {
        footerLanguageDropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedLang = item.getAttribute('data-lang');
                const currentPath = window.location.pathname;
                const newPath = currentPath.replace(/^\/(en|fa)\//, `/${selectedLang}/`);
                window.location.href = newPath;
                item.classList.add('pulse-glow');
                setTimeout(() => item.classList.remove('pulse-glow'), 300);
            });
            // Add hover effect for dropdown items
            item.addEventListener('mouseover', () => item.classList.add('neon-glow'));
            item.addEventListener('mouseout', () => item.classList.remove('neon-glow'));
        });
    }

    // Initialize Lucide Icons with animations
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
        document.querySelectorAll('.lucide-icon').forEach(icon => {
            icon.addEventListener('mouseover', () => icon.classList.add('scale-up', 'neon-glow'));
            icon.addEventListener('mouseout', () => icon.classList.remove('scale-up', 'neon-glow'));
        });
    }
});