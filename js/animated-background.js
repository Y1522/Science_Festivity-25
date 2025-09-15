(function() {
  'use strict';
  
  function createStunningBackground() {
    const magicBg = document.getElementById('magic-background');
    if (!magicBg) return;
    
    // Set up the magical background container
    magicBg.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      overflow: hidden;
      background: linear-gradient(135deg, #0c1445 0%, #1e3a5f 25%, #2d5a87 50%, #3498db 75%, #87ceeb 100%);
      background-size: 400% 400%;
      animation: gradientShift 20s ease infinite;
    `;
    
    // Create floating geometric patterns
    createFloatingGeometry(magicBg);
    
    // Create particle nebula
    createParticleNebula(magicBg);
    
    // Create energy waves
    createEnergyWaves(magicBg);
    
    // Create glowing orbs
    createGlowingOrbs(magicBg);
    
    return magicBg;
  }
  
  function createFloatingGeometry(container) {
    const geometries = [
      { shape: 'hexagon', size: 60, color: 'rgba(52, 152, 219, 0.3)' },
      { shape: 'triangle', size: 40, color: 'rgba(155, 89, 182, 0.3)' },
      { shape: 'circle', size: 50, color: 'rgba(46, 204, 113, 0.3)' },
      { shape: 'square', size: 35, color: 'rgba(241, 196, 15, 0.3)' }
    ];
    
    for (let i = 0; i < 15; i++) {
      const geo = geometries[Math.floor(Math.random() * geometries.length)];
      const element = document.createElement('div');
      element.className = `floating-geometry ${geo.shape}`;
      element.style.cssText = `
        position: absolute;
        width: ${geo.size}px;
        height: ${geo.size}px;
        background: ${geo.color};
        border-radius: ${geo.shape === 'circle' ? '50%' : geo.shape === 'hexagon' ? '10px' : '0'};
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: floatGeometry ${15 + Math.random() * 10}s linear infinite;
        animation-delay: ${Math.random() * 5}s;
        backdrop-filter: blur(2px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 0 20px ${geo.color};
      `;
      
      if (geo.shape === 'hexagon') {
        element.style.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
      } else if (geo.shape === 'triangle') {
        element.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
      }
      
      container.appendChild(element);
    }
  }
  
  function createParticleNebula(container) {
    for (let i = 0; i < 100; i++) {
      const particle = document.createElement('div');
      particle.className = 'nebula-particle';
      particle.style.cssText = `
        position: absolute;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: particleFloat ${20 + Math.random() * 15}s linear infinite;
        animation-delay: ${Math.random() * 10}s;
        filter: blur(${Math.random() * 2}px);
      `;
      container.appendChild(particle);
    }
  }
  
  function createEnergyWaves(container) {
    for (let i = 0; i < 3; i++) {
      const wave = document.createElement('div');
      wave.className = 'energy-wave';
      wave.style.cssText = `
        position: absolute;
        width: 200%;
        height: 200%;
        top: -50%;
        left: -50%;
        border-radius: 50%;
        border: 2px solid rgba(52, 152, 219, 0.2);
        animation: energyPulse ${8 + i * 2}s ease-in-out infinite;
        animation-delay: ${i * 2}s;
      `;
      container.appendChild(wave);
    }
  }
  
  function createGlowingOrbs(container) {
    const colors = [
      'rgba(52, 152, 219, 0.6)',
      'rgba(155, 89, 182, 0.6)',
      'rgba(46, 204, 113, 0.6)',
      'rgba(241, 196, 15, 0.6)',
      'rgba(231, 76, 60, 0.6)'
    ];
    
    for (let i = 0; i < 8; i++) {
      const orb = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      orb.className = 'glowing-orb';
      orb.style.cssText = `
        position: absolute;
        width: ${30 + Math.random() * 40}px;
        height: ${30 + Math.random() * 40}px;
        background: radial-gradient(circle, ${color} 0%, transparent 70%);
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: orbFloat ${12 + Math.random() * 8}s ease-in-out infinite;
        animation-delay: ${Math.random() * 6}s;
        filter: blur(1px);
        box-shadow: 0 0 50px ${color};
      `;
      container.appendChild(orb);
    }
  }
  
  function createParticleSystem(container) {
    const particleCount = 20;
    
    function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random starting position
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      
      return particle;
    }
    
    // Create initial particles
    for (let i = 0; i < particleCount; i++) {
      container.appendChild(createParticle());
    }
    
    // Continuously add new particles
    setInterval(() => {
      if (container.children.length < particleCount + 10) { // Keep some extras
        container.appendChild(createParticle());
      }
      
      // Remove old particles that have finished animating
      const particles = container.querySelectorAll('.particle');
      particles.forEach((particle, index) => {
        if (index < particles.length - particleCount) {
          particle.remove();
        }
      });
    }, 2000);
  }
  
  function addInteractiveEffects(container) {
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
      
      // Subtle parallax effect on stars
      const stars = container.querySelectorAll('.star-pattern');
      stars.forEach((star, index) => {
        const speed = (index + 1) * 0.5;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        star.style.transform += ` translate(${x}px, ${y}px)`;
      });
    });
    
    // Add click ripple effect
    document.addEventListener('click', (e) => {
      if (e.target.closest('.animated-background')) return;
      
      const ripple = document.createElement('div');
      ripple.style.position = 'absolute';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      ripple.style.width = '0px';
      ripple.style.height = '0px';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(82, 138, 199, 0.3)';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.animation = 'rippleEffect 1s ease-out forwards';
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = '1';
      
      container.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 1000);
    });
  }
  
  // Add stunning CSS animations
  function addStunningCSS() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      @keyframes floatGeometry {
        0% { 
          transform: translateY(100vh) rotate(0deg) scale(0.5);
          opacity: 0;
        }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { 
          transform: translateY(-100px) rotate(360deg) scale(1.2);
          opacity: 0;
        }
      }
      
      @keyframes particleFloat {
        0% { 
          transform: translate(0, 100vh) scale(0);
          opacity: 0;
        }
        10% { 
          opacity: 1;
          transform: scale(1);
        }
        90% { opacity: 1; }
        100% { 
          transform: translate(100px, -100px) scale(0);
          opacity: 0;
        }
      }
      
      @keyframes energyPulse {
        0% { 
          transform: scale(0) rotate(0deg);
          opacity: 1;
        }
        50% { 
          transform: scale(1) rotate(180deg);
          opacity: 0.3;
        }
        100% { 
          transform: scale(1.5) rotate(360deg);
          opacity: 0;
        }
      }
      
      @keyframes orbFloat {
        0%, 100% { 
          transform: translateY(0px) translateX(0px) scale(1);
        }
        25% { 
          transform: translateY(-30px) translateX(20px) scale(1.1);
        }
        50% { 
          transform: translateY(-10px) translateX(-15px) scale(0.9);
        }
        75% { 
          transform: translateY(-40px) translateX(10px) scale(1.05);
        }
      }
      
      /* Interactive effects */
      #magic-background:hover .floating-geometry {
        animation-duration: 8s !important;
      }
      
      #magic-background:hover .glowing-orb {
        filter: blur(0px) !important;
        transform: scale(1.2) !important;
      }
      
      /* Mobile optimizations */
      @media (max-width: 768px) {
        .floating-geometry {
          width: 30px !important;
          height: 30px !important;
        }
        .glowing-orb {
          width: 20px !important;
          height: 20px !important;
        }
        .nebula-particle {
          display: none;
        }
      }
      
      /* Accessibility */
      @media (prefers-reduced-motion: reduce) {
        #magic-background * {
          animation: none !important;
        }
        #magic-background {
          background: linear-gradient(135deg, #0c1445 0%, #2d5a87 100%) !important;
        }
      }
      
      /* Performance boost */
      .floating-geometry,
      .nebula-particle,
      .energy-wave,
      .glowing-orb {
        will-change: transform;
        transform: translateZ(0);
        backface-visibility: hidden;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize the stunning background
  function init() {
    console.log('✨ Creating magical background...');
    addStunningCSS();
    const magicBg = createStunningBackground();
    if (magicBg) {
      console.log('🌟 Stunning background created successfully!');
    }
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }
})();
