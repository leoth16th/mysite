document.addEventListener('DOMContentLoaded', () => {
    const sliderTrack = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dots = document.querySelectorAll('.slide-dot');
    let currentSlide = 0;

    // Initialize Feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // Initialize Bootstrap carousel with configuration
    const carousel = document.querySelector('#resourcesCarousel');
    if (carousel && typeof bootstrap !== 'undefined') {
        const bsCarousel = new bootstrap.Carousel(carousel, {
            interval: 5000,     // Change slides every 5 seconds
            keyboard: true,     // Enable keyboard navigation
            pause: 'hover',     // Pause on mouse hover
            ride: 'carousel',   // Start cycling automatically
            wrap: true         // Enable continuous loop
        });

        // Add touch swipe support
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

        // Add touch event listeners with passive option for better performance
        carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
        carousel.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                bsCarousel.prev();
            } else if (e.key === 'ArrowRight') {
                bsCarousel.next();
            }
        });
    }

    function updateSlider() {
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });

    updateSlider(); // Initial setup
});