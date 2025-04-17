document.addEventListener('DOMContentLoaded', function() {
    // Stat counter animation with Intersection Observer
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
                
                card.classList.add('fade-in-up'); // Add fade-in animation
                setTimeout(() => {
                    animateValue(statNumber, 0, value, 1500);
                }, 300);
                
                observer.unobserve(card);
            }
        });
    }, { threshold: 0.5 });
    
    statCards.forEach(card => observer.observe(card));
    
    // Journey steps interaction with enhanced animations
    const journeySteps = document.querySelectorAll('.journey-step');
    const journeyProgress = document.getElementById('journeyProgress');
    const totalSteps = journeySteps.length;
    let activeStep = 0;
    let isAnimating = false;

    function setActiveStep(index) {
        if (isAnimating) return;
        isAnimating = true;

        journeySteps.forEach((step, i) => {
            const stepNumber = parseInt(step.dataset.step);
            
            if (stepNumber <= index + 1) {
                step.classList.add('completed');
                if (stepNumber === index + 1) {
                    step.classList.add('active', 'pulse-glow'); // Add neon pulse
                } else {
                    step.classList.remove('active', 'pulse-glow');
                }
            } else {
                step.classList.remove('active', 'completed', 'pulse-glow');
            }
        });

        // Smooth progress bar animation
        const progressPercentage = (index / (totalSteps - 1)) * 100;
        journeyProgress.style.transition = 'width 0.5s ease-out, box-shadow 0.5s ease-out';
        journeyProgress.style.width = `${progressPercentage}%`;
        journeyProgress.classList.add('glow-progress'); // Add glow effect

        activeStep = index;
        setTimeout(() => {
            isAnimating = false;
            journeyProgress.classList.remove('glow-progress');
        }, 500);
    }

    journeySteps.forEach(step => {
        step.addEventListener('click', function() {
            if (!isAnimating) {
                const newStep = parseInt(this.dataset.step) - 1;
                setActiveStep(newStep);
            }
        });
    });

    setActiveStep(0); // Initialize first step
    
    // CTA button with enhanced hover effect
    const ctaButton = document.getElementById('ctaButton');
    if (ctaButton) {
        ctaButton.addEventListener('mouseover', function() {
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            this.style.transform = 'translateY(-5px)';
            this.classList.add('neon-glow'); // Add neon glow
        });
        ctaButton.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.classList.remove('neon-glow');
        });
    }
});