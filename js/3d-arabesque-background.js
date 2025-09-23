// 3D Arabesque Background with Three.js
// Professional Islamic geometric patterns for Science Festivity

class ArabesqueBackground {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.meshes = [];
    this.animationId = null;
    this.mosqueLamp = null;
    this.lampDirection = 1;
    this.lampSpeed = 0.02;
    
    this.init();
  }

  init() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0f1a); // Deep Islamic blue

    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add to DOM (create container if missing)
    let container = document.getElementById('animated-background');
    if (!container) {
      container = document.createElement('div');
      container.id = 'animated-background';
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -2;
        pointer-events: none;
      `;
      document.body.insertBefore(container, document.body.firstChild);
    }
    this.renderer.domElement.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `;
    container.appendChild(this.renderer.domElement);

    this.createArabesquePatterns();
    this.createMosqueLamp();
    this.setupLighting();
    this.animate();

    // Handle resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  createArabesquePatterns() {
    // Create multiple layers of Islamic geometric patterns
    
    // Layer 1: Large geometric shapes
    this.createGeometricLayer(0, 0, -2, 8, 0x1a2332, 0.3);
    
    // Layer 2: Medium patterns
    this.createGeometricLayer(0, 0, -1, 6, 0x2d3748, 0.4);
    
    // Layer 3: Small detailed patterns
    this.createGeometricLayer(0, 0, 0, 4, 0x4a5568, 0.5);
    
    // Add floating geometric elements
    this.createFloatingElements();
  }

  createGeometricLayer(x, y, z, size, color, opacity) {
    const geometry = new THREE.PlaneGeometry(size, size, 32, 32);
    
    // Create Islamic geometric pattern texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Draw Islamic geometric pattern
    this.drawIslamicPattern(ctx, canvas.width, canvas.height, color);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshLambertMaterial({ 
      map: texture, 
      transparent: true, 
      opacity: opacity,
      side: THREE.DoubleSide
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.x = Math.PI / 2;
    
    this.scene.add(mesh);
    this.meshes.push(mesh);
  }

  drawIslamicPattern(ctx, width, height, color) {
    ctx.fillStyle = '#0a0f1a';
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.4;
    
    // Draw 8-pointed star (Rub el Hizb)
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
    
    // Draw inner geometric patterns
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI) / 8;
      const innerRadius = radius * 0.6;
      const x = centerX + Math.cos(angle) * innerRadius;
      const y = centerY + Math.sin(angle) * innerRadius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
    
    // Add decorative circles
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const x = centerX + Math.cos(angle) * radius * 0.8;
      const y = centerY + Math.sin(angle) * radius * 0.8;
      
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  createFloatingElements() {
    // Create floating geometric shapes
    for (let i = 0; i < 20; i++) {
      const geometry = new THREE.OctahedronGeometry(0.1 + Math.random() * 0.2);
      const material = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.7, 0.5),
        transparent: true,
        opacity: 0.3
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10
      );
      
      mesh.userData = {
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        floatSpeed: Math.random() * 0.01 + 0.005
      };
      
      this.scene.add(mesh);
      this.meshes.push(mesh);
    }
  }

  createMosqueLamp() {
    // Create 3D mosque lamp geometry
    const lampGroup = new THREE.Group();
    
    // Lamp body (main cylinder)
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 16);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffd700,
      shininess: 100,
      transparent: true,
      opacity: 0.9
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0;
    lampGroup.add(body);
    
    // Lamp top (dome)
    const topGeometry = new THREE.SphereGeometry(0.35, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const topMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffd700,
      shininess: 100
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 0.6;
    lampGroup.add(top);
    
    // Lamp chain
    const chainGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8);
    const chainMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const chain = new THREE.Mesh(chainGeometry, chainMaterial);
    chain.position.y = 1.2;
    lampGroup.add(chain);
    
    // Lamp base
    const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.7;
    lampGroup.add(base);
    
    // Position lamp in header area
    lampGroup.position.set(0, 2, 1);
    lampGroup.scale.set(0.8, 0.8, 0.8);
    
    this.scene.add(lampGroup);
    this.mosqueLamp = lampGroup;
  }

  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
    
    // Point light for lamp
    const lampLight = new THREE.PointLight(0xffd700, 1, 10);
    lampLight.position.set(0, 2, 1);
    this.scene.add(lampLight);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    // Rotate geometric patterns
    this.meshes.forEach((mesh, index) => {
      if (mesh.userData.rotationSpeed) {
        mesh.rotation.y += mesh.userData.rotationSpeed;
        mesh.rotation.x += mesh.userData.rotationSpeed * 0.5;
      }
      
      if (mesh.userData.floatSpeed) {
        mesh.position.y += Math.sin(Date.now() * 0.001 + index) * mesh.userData.floatSpeed;
      }
    });
    
    // Animate mosque lamp
    if (this.mosqueLamp) {
      this.mosqueLamp.position.x += this.lampDirection * this.lampSpeed;
      
      // Change direction when reaching boundaries
      if (this.mosqueLamp.position.x > 2) {
        this.lampDirection = -1;
      } else if (this.mosqueLamp.position.x < -2) {
        this.lampDirection = 1;
      }
      
      // Gentle swaying motion
      this.mosqueLamp.rotation.z = Math.sin(Date.now() * 0.002) * 0.1;
    }
    
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit to ensure other scripts have loaded
  setTimeout(() => {
    // Check if Three.js is loaded
    if (typeof THREE !== 'undefined') {
      try {
        new ArabesqueBackground();
        console.log('3D Arabesque Background initialized successfully');
      } catch (error) {
        console.error('Error initializing 3D background:', error);
      }
    } else {
      console.warn('Three.js not loaded. Loading from CDN...');
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => {
        try {
          new ArabesqueBackground();
          console.log('3D Arabesque Background initialized successfully after loading Three.js');
        } catch (error) {
          console.error('Error initializing 3D background after loading Three.js:', error);
        }
      };
      script.onerror = () => {
        console.error('Failed to load Three.js from CDN');
      };
      document.head.appendChild(script);
    }
  }, 1000); // Wait 1 second to ensure other scripts have loaded
});
