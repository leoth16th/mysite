document.addEventListener('DOMContentLoaded', function() {
  const roadmaps = document.querySelectorAll('.roadmap');
  
  roadmaps.forEach(roadmap => {
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
      
      setActiveStep(0); // Initialize
      
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
          
          roadmapContent.classList.add('animating', 'fade-in-up');
          
          setTimeout(() => {
              pointButtons.forEach((button, i) => {
                  const pointIndex = parseInt(button.getAttribute('data-index'));
                  if (pointIndex < index) {
                      button.classList.add('completed');
                      button.classList.remove('active', 'pulse-glow');
                  } else if (pointIndex === index) {
                      button.classList.add('active', 'pulse-glow');
                      button.classList.remove('completed');
                  } else {
                      button.classList.remove('active', 'completed', 'pulse-glow');
                  }
              });
              
              timelinePoints.forEach((point, i) => {
                  if (i === index) {
                      point.classList.add('active', 'neon-glow');
                  } else {
                      point.classList.remove('active', 'neon-glow');
                  }
              });
              
              stepContents.forEach((content, i) => {
                  if (i === index) {
                      content.classList.add('active', 'fade-in-up');
                  } else {
                      content.classList.remove('active', 'fade-in-up');
                  }
              });
              
              const progressWidth = (index / (totalSteps - 1)) * 100;
              timelineProgress.style.transition = 'width 0.5s ease-out, box-shadow 0.5s ease-out';
              timelineProgress.style.width = `${progressWidth}%`;
              timelineProgress.classList.add('glow-progress');
              
              activeStep = index;
              roadmapContent.classList.remove('animating');
              setTimeout(() => {
                  isAnimating = false;
                  timelineProgress.classList.remove('glow-progress');
              }, 500);
          }, 300);
      }
  });
});