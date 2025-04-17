document.addEventListener('DOMContentLoaded', function() {
  // Find all roadmaps on the page
  const roadmaps = document.querySelectorAll('.roadmap');
  
  roadmaps.forEach(roadmap => {
    const roadmapId = roadmap.id;
    const timelineProgress = roadmap.querySelector('.timeline-progress');
    const roadmapContent = roadmap.querySelector('.roadmap-content');
    const pointButtons = roadmap.querySelectorAll('.point-button');
    const stepContents = roadmap.querySelectorAll('.step-content');
    const timelinePoints = roadmap.querySelectorAll('.timeline-point');
    const nextButtons = roadmap.querySelectorAll('.next-button');
    const prevButtons = roadmap.querySelectorAll('.prev-button');
    
    let activeStep = 0;
    let isAnimating = false;
    const totalSteps = pointButtons.length;
    
    // Initialize
    setActiveStep(0);
    
    // Set up event listeners
    pointButtons.forEach(button => {
      button.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        if (index !== activeStep && !isAnimating) {
          setActiveStep(index);
        }
      });
    });
    
    nextButtons.forEach(button => {
      button.addEventListener('click', function() {
        if (activeStep < totalSteps - 1 && !isAnimating) {
          setActiveStep(activeStep + 1);
        }
      });
    });
    
    prevButtons.forEach(button => {
      button.addEventListener('click', function() {
        if (activeStep > 0 && !isAnimating) {
          setActiveStep(activeStep - 1);
        }
      });
    });
    
    function setActiveStep(index) {
      if (isAnimating) return;
      
      isAnimating = true;
      
      // Start animation
      roadmapContent.classList.add('animating');
      
      setTimeout(() => {
        // Update active classes for point buttons
        pointButtons.forEach((button, i) => {
          const pointIndex = parseInt(button.getAttribute('data-index'));
          
          if (pointIndex < index) {
            button.classList.add('completed');
            button.classList.remove('active');
          } else if (pointIndex === index) {
            button.classList.add('active');
            button.classList.remove('completed');
          } else {
            button.classList.remove('active', 'completed');
          }
        });
        
        // Update active classes for timeline points
        timelinePoints.forEach((point, i) => {
          if (i === index) {
            point.classList.add('active');
          } else {
            point.classList.remove('active');
          }
        });
        
        // Update active content
        stepContents.forEach((content, i) => {
          if (i === index) {
            content.classList.add('active');
          } else {
            content.classList.remove('active');
          }
        });
        
        // Update progress bar
        const progressWidth = (index / (totalSteps - 1)) * 100;
        timelineProgress.style.width = `${progressWidth}%`;
        
        // Update active step
        activeStep = index;
        
        // End animation
        roadmapContent.classList.remove('animating');
        
        setTimeout(() => {
          isAnimating = false;
        }, 100);
      }, 300);
    }
  });
});