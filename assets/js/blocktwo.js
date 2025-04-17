document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('#resourcesCarousel');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dots = document.querySelectorAll('.slide-dot');

    // Initialize Feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
        document.querySelectorAll('[data-feather]').forEach(icon => {
            icon.addEventListener('mouseover', () => icon.classList.add('scale-up'));
            icon.addEventListener('mouseout', () => icon.classList.remove('scale-up'));
        });
    }

    // Initialize Bootstrap carousel
    if (carousel && typeof bootstrap !== 'undefined') {
        const bsCarousel = new bootstrap.Carousel(carousel, {
            interval: 5000,
            keyboard: true,
            pause: 'hover',
            ride: 'carousel',
            wrap: true
        });

        // Touch swipe support
        let touchStartX = 0;
        const handleTouchStart = (e) => {
            touchStartX = e.changedTouches[0].screenX;
        };

        const handleTouchEnd = (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;

            if (Math.abs(swipeDistance) >= swipeThreshold) {
                if (swipeDistance > 0) {
                    bsCarousel.prev();
                } else {
                    bsCarousel.next();
                }
            }
        };

        carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
        carousel.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                bsCarousel.prev();
            } else if (e.key === 'ArrowRight') {
                bsCarousel.next();
            }
        });

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                bsCarousel.to(index);
            });
            dot.addEventListener('mouseover', () => dot.classList.add('scale-up'));
            dot.addEventListener('mouseout', () => dot.classList.remove('scale-up'));
        });
    }
});