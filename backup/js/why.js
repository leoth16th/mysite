document.addEventListener('DOMContentLoaded', function() {
    // Stat counter animation
    const statCards = document.querySelectorAll('.stat-card');
    
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            let value = Math.floor(progress * (end - start) + start);
            
            if (end === 7.5) {
                value = (progress * (end - start) + start).toFixed(1);
                obj.innerHTML = value + '+';
            } else {
                obj.innerHTML = value + (end === 300 ? '+' : '%');
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const statNumber = card.querySelector('.stat-number');
                const value = parseFloat(card.dataset.value);
                
                setTimeout(() => {
                    animateValue(statNumber, 0, value, 1500);
                }, 300);
                
                observer.unobserve(card);
            }
        });
    }, { threshold: 0.5 });
    
    statCards.forEach(card => observer.observe(card));
    
    // Journey steps interaction (updated)
    const journeySteps = document.querySelectorAll('.journey-step');
    const journeyProgress = document.getElementById('journeyProgress');
    const totalSteps = journeySteps.length;
    let activeStep = 0;
    let isAnimating = false;

    function setActiveStep(index) {
        if (isAnimating) return;
        isAnimating = true;

        // Start animation
        journeySteps.forEach((step, i) => {
            const stepNumber = parseInt(step.dataset.step);
            
            if (stepNumber <= index + 1) {
                step.classList.add('completed');
                if (stepNumber === index + 1) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            } else {
                step.classList.remove('active', 'completed');
            }
        });

        // Update progress bar with animation
        const progressPercentage = (index / (totalSteps - 1)) * 100;
        journeyProgress.style.width = `${progressPercentage}%`;

        activeStep = index;

        // Reset animation flag
        setTimeout(() => {
            isAnimating = false;
        }, 300);
    }

    // Event listeners for journey steps
    journeySteps.forEach(step => {
        step.addEventListener('click', function() {
            if (!isAnimating) {
                const newStep = parseInt(this.dataset.step) - 1;
                setActiveStep(newStep);
            }
        });
    });

    // Initialize first step
    setActiveStep(0);
    
    // CTA button effect
    const ctaButton = document.getElementById('ctaButton');
    ctaButton.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-5px)';
    });
    ctaButton.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0)';
    });
});