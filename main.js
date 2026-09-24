// --- Preloader Hide Logic (Home Page Only) ---
(function() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const progressLine = preloader.querySelector('.loader-progress-line');
  const progressSteps = [15, 35, 55, 75, 90, 100];
  let currentStep = 0;
  let pageLoaded = false;
  let finishTriggered = false;

  // Set initial progress style
  if (progressLine) {
    progressLine.style.animation = 'none';
    progressLine.style.left = '-100%';
    progressLine.style.transition = 'left 0.4s cubic-bezier(0.1, 0.8, 0.2, 1)';
  }

  function triggerFadeOut() {
    if (finishTriggered) return;
    finishTriggered = true;
    
    // Update to 100% progress
    if (progressLine) progressLine.style.left = '0%';

    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => preloader.remove(), 900);
    }, 400); // 400ms hold time at 100% before fading out
  }

  function runLoader() {
    if (currentStep >= progressSteps.length - 1) {
      // If the page is loaded, finish up. If not, wait for it at 90%
      if (pageLoaded) {
        triggerFadeOut();
      }
      return;
    }

    const progress = progressSteps[currentStep];
    
    // Update progress line (translate 0-100% to -100% to 0% left value)
    if (progressLine) {
      progressLine.style.left = `${-100 + progress}%`;
    }

    currentStep++;

    // Schedule next step with a slight random variation (200ms to 450ms)
    const nextDelay = 200 + Math.random() * 250;
    setTimeout(runLoader, nextDelay);
  }

  // Set pageLoaded when window load event fires
  if (document.readyState === 'complete') {
    pageLoaded = true;
  } else {
    window.addEventListener('load', () => {
      pageLoaded = true;
      // If we already reached 90% (step index 4), trigger the finish
      if (currentStep >= progressSteps.length - 1) {
        triggerFadeOut();
      }
    });
  }

  // Start loader sequence
  setTimeout(runLoader, 150);

  // Fail-safe: force hide preloader after 4.5 seconds regardless of state
  setTimeout(triggerFadeOut, 4500);
})();

document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle ---
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('theme');
  } catch (e) {
    console.warn('LocalStorage is blocked or disabled in this environment:', e);
  }
  
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      try {
        if (document.body.classList.contains('dark-theme')) {
          localStorage.setItem('theme', 'dark');
        } else {
          localStorage.setItem('theme', 'light');
        }
      } catch (e) {
        console.warn('Could not save theme preference to localStorage:', e);
      }
    });
  }

  // --- 1. Mobile Navigation Toggle ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // --- 2. Spotlight Card Glow Effect ---
  // Tracks mouse movement on cards to position a glowing gradient hover highlight
  const diagnosisCards = document.querySelectorAll('.diagnosis-card');
  diagnosisCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
  });

  // --- 3. Interactive Automation Console Simulation ---
  const consoleTimer = document.getElementById('consoleTimer');
  const consoleRow1 = document.getElementById('consoleRow1');
  const consoleCheckRow1 = consoleRow1 ? consoleRow1.querySelector('.console-check-icon') : null;

  const consoleQueue = document.getElementById('consoleQueue');
  const consoleQueueCheck = document.getElementById('consoleQueueCheck');

  // Simulated Processing States for Invoice Batch (Row 1)
  let processingInterval;
  function startInvoiceSimulation() {
    if (!consoleTimer || !consoleCheckRow1) return;
    
    let time = 4.2;
    consoleCheckRow1.classList.remove('active');
    consoleTimer.style.color = 'var(--text-muted)';
    consoleTimer.textContent = '4.2s';
    
    // Simulate countdown processing
    clearInterval(processingInterval);
    processingInterval = setInterval(() => {
      time -= 0.1;
      if (time <= 0) {
        time = 0.0;
        clearInterval(processingInterval);
        consoleCheckRow1.classList.add('active');
        consoleTimer.style.color = 'var(--accent-green)';
        consoleTimer.textContent = '4.2s'; // Keep final duration
        
        // Wait 5 seconds and restart simulation loop
        setTimeout(startInvoiceSimulation, 5000);
      } else {
        consoleTimer.textContent = `${time.toFixed(1)}s`;
      }
    }, 100);
  }

  // Simulated Live Data Queue (Row 3)
  let queueInterval;
  function startQueueSimulation() {
    if (!consoleQueue || !consoleQueueCheck) return;

    let itemsPending = Math.floor(Math.random() * 40) + 50; // Random starting queue size
    consoleQueueCheck.classList.remove('active');
    consoleQueue.classList.remove('success');
    consoleQueue.classList.add('pending');
    consoleQueue.textContent = `${itemsPending} pending`;

    clearInterval(queueInterval);
    queueInterval = setInterval(() => {
      const processingStep = Math.floor(Math.random() * 5) + 3;
      itemsPending -= processingStep;

      if (itemsPending <= 0) {
        itemsPending = 0;
        clearInterval(queueInterval);
        consoleQueue.textContent = '0 pending';
        consoleQueue.classList.remove('pending');
        consoleQueue.classList.add('success');
        consoleQueue.textContent = '0 pending';
        consoleQueueCheck.classList.add('active');
        
        // Wait 8 seconds before refilling data entry queue
        setTimeout(startQueueSimulation, 8000);
      } else {
        consoleQueue.textContent = `${itemsPending} pending`;
      }
    }, 400);
  }

  // Simulate Live Fluctuation of Console Chart Bars
  const chartBars = document.querySelectorAll('.chart-bar');
  function fluctuateChart() {
    chartBars.forEach(bar => {
      const currentVal = parseInt(bar.style.getPropertyValue('--val')) || 50;
      // Fluctuate by +/- 15%
      const delta = Math.floor(Math.random() * 31) - 15;
      let newVal = currentVal + delta;
      if (newVal < 10) newVal = 10;
      if (newVal > 100) newVal = 100;
      bar.style.setProperty('--val', `${newVal}%`);
    });
  }

  // Start all console widgets
  startInvoiceSimulation();
  startQueueSimulation();
  setInterval(fluctuateChart, 1500);


  // --- 4. Scroll-Triggered Stat Counters ---
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const countUp = (element) => {
    const targetString = element.getAttribute('data-target'); // e.g. "70" or "90"
    const targetNum = parseInt(targetString);
    let startNum = 0;
    
    // We want the text to look like: e.g. "50-70%" or "80-90%" during count up
    // Lower bound start points
    const lowerBound = targetNum === 70 ? 50 : 80; 
    let currentLower = 0;
    let currentUpper = 0;
    
    const duration = 2000; // 2 seconds
    const frameRate = 60;
    const totalFrames = (duration / 1000) * frameRate;
    let frame = 0;
    
    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      
      // Easing out quadratic
      const easedProgress = progress * (2 - progress);
      
      currentLower = Math.floor(lowerBound * easedProgress);
      currentUpper = Math.floor(targetNum * easedProgress);
      
      element.textContent = `${currentLower}-${currentUpper}%`;
      
      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = `${lowerBound}-${targetNum}%`;
      }
    };
    
    requestAnimationFrame(animate);
  };

  // Intersection Observer to run counters when they scroll into view
  const observerOptions = {
    root: null,
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statNumbers.forEach(num => {
    observer.observe(num);
  });

  // --- 5. Navigation Scroll Spy & Mobile Menu Close ---
  const sections = document.querySelectorAll('section, footer');
  const navLinksItems = document.querySelectorAll('.nav-links a');

  const isServicesPage = window.location.pathname.includes('services.html');
  const isSolutionsPage = window.location.pathname.includes('solutions.html');
  const isAboutPage = window.location.pathname.includes('about.html');
  const isContactPage = window.location.pathname.includes('contact.html');
  const isPrivacyPage = window.location.pathname.includes('privacy.html');

  function updateActiveLink() {
    if (isServicesPage || isSolutionsPage || isAboutPage || isContactPage || isPrivacyPage) return;
    
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 150; 

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 15) {
      currentSectionId = 'contact';
    }

    const sectionToNavLink = {
      'hero': '#hero',
      'diagnosis': '#diagnosis',
      'comparison': '#comparison',
      'risk-removed': '#comparison',
      'capabilities': '#capabilities',
      'contact': '#contact'
    };

    const targetHref = sectionToNavLink[currentSectionId];
    if (targetHref) {
      navLinksItems.forEach(link => {
        if (link.getAttribute('href') === targetHref) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();

  // Close mobile menu when any navigation link is clicked
  if (navLinks) {
    navLinksItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // Auto-play / pause card videos based on viewport intersection
  const cardVideos = document.querySelectorAll('.engine-card-media video');
  if (cardVideos.length > 0 && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.25 });

    cardVideos.forEach(v => videoObserver.observe(v));
  }
});
