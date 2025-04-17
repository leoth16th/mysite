window.addEventListener('scroll', () => {
  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const progressBar = document.getElementById('reading-progress');

  if (progressBar) {
      progressBar.style.transition = 'width 0.3s ease-out, box-shadow 0.3s ease-out';
      progressBar.style.width = `${scrolled}%`;
      
      // Add glow effect when scrolling
      if (winScroll > 0) {
          progressBar.classList.add('glow-progress');
      } else {
          progressBar.classList.remove('glow-progress');
      }
  }
});

// Ensure initial state on page load
document.addEventListener('DOMContentLoaded', () => {
  const progressBar = document.getElementById('reading-progress');
  if (progressBar) {
      progressBar.style.width = '0%'; // Reset on load
  }
});