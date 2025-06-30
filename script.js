"use strict";

// Initialize Dragon Cursor
const initDragonCursor = () => {
  const screen = document.getElementById("screen");
  const xmlns = "http://www.w3.org/2000/svg";
  const xlinkns = "http://www.w3.org/1999/xlink";

  // Track mouse position
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  window.addEventListener("pointermove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    rad = 0;
  });

  // Handle resize
  let width = window.innerWidth;
  let height = window.innerHeight;
  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
  };
  window.addEventListener("resize", resize);

  // Create dragon segments
  const prepend = (use, i) => {
    const elem = document.createElementNS(xmlns, "use");
    elems[i].use = elem;
    elem.setAttributeNS(xlinkns, "xlink:href", "#" + use);
    screen.prepend(elem);
  };

  const N = 40;
  const elems = [];
  for (let i = 0; i < N; i++) elems[i] = { use: null, x: width / 2, y: 0 };
  
  const radm = Math.min(pointer.x, pointer.y) - 20;
  let frm = Math.random();
  let rad = 0;

  // Create different parts of the dragon
  for (let i = 1; i < N; i++) {
    if (i === 1) prepend("Cabeza", i); // Head
    else if (i === 8 || i === 14) prepend("Aletas", i); // Fins
    else prepend("Espina", i); // Spine
  }

  // Animation loop
  const run = () => {
    requestAnimationFrame(run);
    
    // Update head position
    let e = elems[0];
    const ax = (Math.cos(3 * frm) * rad * width) / height;
    const ay = (Math.sin(4 * frm) * rad * height) / width;
    e.x += (ax + pointer.x - e.x) / 10;
    e.y += (ay + pointer.y - e.y) / 10;
    
    // Update body segments
    for (let i = 1; i < N; i++) {
      let e = elems[i];
      let ep = elems[i - 1];
      const a = Math.atan2(e.y - ep.y, e.x - ep.x);
      e.x += (ep.x - e.x + (Math.cos(a) * (100 - i)) / 5) / 4;
      e.y += (ep.y - e.y + (Math.sin(a) * (100 - i)) / 5) / 4;
      const s = (162 + 4 * (1 - i)) / 50;
      
      // Apply transformations
      e.use.setAttributeNS(
        null,
        "transform",
        `translate(${(ep.x + e.x) / 2},${(ep.y + e.y) / 2}) rotate(${(180 / Math.PI) * a}) translate(0,0) scale(${s},${s})`
      );
    }
    
    // Animation controls
    if (rad < radm) rad++;
    frm += 0.003;
    
    // Return to center if idle
    if (rad > 60) {
      pointer.x += (width / 2 - pointer.x) * 0.05;
      pointer.y += (height / 2 - pointer.y) * 0.05;
    }
  };

  run();
};

// Mobile menu toggle
const initMobileMenu = () => {
  const menuButton = document.querySelector('.mobile-menu-button');
  const nav = document.querySelector('nav');
  
  menuButton.addEventListener('click', () => {
    menuButton.classList.toggle('active');
    nav.classList.toggle('active');
  });
};

// Smooth scroll for anchor links
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Close mobile menu if open
      const menuButton = document.querySelector('.mobile-menu-button');
      const nav = document.querySelector('nav');
      if (nav.classList.contains('active')) {
        menuButton.classList.remove('active');
        nav.classList.remove('active');
      }
      
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
};

// Animate stats counters
const animateStats = () => {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-count');
        const count = +entry.target.innerText;
        const increment = target / 50;
        
        if (count < target) {
          entry.target.innerText = Math.ceil(count + increment);
          setTimeout(animateStats, 20);
        } else {
          entry.target.innerText = target;
        }
      }
    });
  }, { threshold: 0.5 });
  
  statNumbers.forEach(stat => {
    observer.observe(stat);
  });
};

// Set current year in footer
const setCurrentYear = () => {
  document.getElementById('year').textContent = new Date().getFullYear();
};

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initDragonCursor();
  initMobileMenu();
  initSmoothScroll();
  animateStats();
  setCurrentYear();
});