// Dynamic Background Image Handler
// Removed WhatsApp image background functionality

(function() {
  'use strict';
  
  function setBackgroundImage() {
    // Set default background without WhatsApp image
    document.body.style.background = '#182746';
    document.body.style.backgroundAttachment = 'fixed';
    
    // Set background for magic-background element
    const magicBg = document.getElementById('magic-background');
    if (magicBg) {
      magicBg.style.background = 'linear-gradient(rgba(24, 39, 70, 0.6), rgba(30, 58, 95, 0.5))';
      magicBg.style.backgroundAttachment = 'fixed';
    }
    
    // Set background for animated-background element (3D background)
    const animatedBg = document.getElementById('animated-background');
    if (animatedBg) {
      // Keep the 3D background but remove WhatsApp image
      animatedBg.style.background = 'linear-gradient(rgba(24, 39, 70, 0.3), rgba(30, 58, 95, 0.2))';
      animatedBg.style.backgroundAttachment = 'fixed';
    }
    
    // Also set background for any elements with class 'container' or 'main'
    const containers = document.querySelectorAll('.container, main, .map-hero');
    containers.forEach(container => {
      if (container) {
        container.style.background = 'linear-gradient(rgba(24, 39, 70, 0.4), rgba(30, 58, 95, 0.3))';
        container.style.backgroundAttachment = 'fixed';
      }
    });
    
    console.log('Background set to default without WhatsApp image');
  }
  
  // Set background when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setBackgroundImage);
  } else {
    setBackgroundImage();
  }
  
  // Also set background when page loads (for navigation)
  window.addEventListener('load', setBackgroundImage);
  
})();
