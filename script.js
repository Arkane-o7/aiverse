(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('.site-nav');
  const toast = document.getElementById('toast');
  const form = document.getElementById('join-form');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.getElementById('year').textContent = new Date().getFullYear();

  const setHeader = () => header.classList.toggle('scrolled', window.scrollY > 20);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton?.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px' });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  document.querySelectorAll('[data-modal-open]').forEach((button) => {
    button.addEventListener('click', () => {
      const modal = document.getElementById(button.dataset.modalOpen);
      if (!modal) return;
      modal.showModal();
      document.body.classList.add('modal-open');
    });
  });

  document.querySelectorAll('.mission-modal').forEach((modal) => {
    const close = () => {
      modal.close();
      document.body.classList.remove('modal-open');
    };
    modal.querySelector('.modal-close')?.addEventListener('click', close);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) close();
    });
    modal.addEventListener('close', () => document.body.classList.remove('modal-open'));
    modal.querySelector('[data-modal-jump]')?.addEventListener('click', close);
  });

  let toastTimer;
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4300);
  };

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const topic = form.elements.topic.value;

    if (!name) {
      form.elements.name.focus();
      showToast('IDENTITY REQUIRED: ENTER YOUR BUILDER NAME.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      form.elements.email.focus();
      showToast('TRANSMISSION FAILED: ENTER A VALID EMAIL.');
      return;
    }

    showToast(`ACCESS REQUESTED. ${topic.toUpperCase()} RECEIVED YOUR VOTE.`);
    form.reset();
  });

  const typedLine = document.getElementById('typed-line');
  const heroRobot = document.getElementById('aiverse-robot');
  const phrases = [
    'learn by building',
    'turn curiosity into capability',
    'ship before the hype cycle ends',
    'make agents do useful things'
  ];

  const startTypingLoop = () => {
    if (!typedLine) return;

    if (reducedMotion) {
      typedLine.textContent = phrases[0];
      return;
    }

    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let deleting = true;

    const typeLoop = () => {
      const phrase = phrases[phraseIndex];
      if (deleting) {
        charIndex -= 1;
        typedLine.textContent = phrase.slice(0, charIndex);
        if (charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          window.setTimeout(typeLoop, 420);
          return;
        }
      } else {
        const next = phrases[phraseIndex];
        charIndex += 1;
        typedLine.textContent = next.slice(0, charIndex);
        if (charIndex >= next.length) {
          deleting = true;
          window.setTimeout(typeLoop, 1500);
          return;
        }
      }
      window.setTimeout(typeLoop, deleting ? 30 : 48);
    };

    window.setTimeout(typeLoop, 1200);
  };

  if (heroRobot) {
    const activateTerminal = () => {
      heroRobot.classList.add('terminal-mode');
      startTypingLoop();
    };

    if (reducedMotion) {
      activateTerminal();
    } else {
      window.setTimeout(activateTerminal, 5000);
    }
  }


  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let width = 0;
  let height = 0;
  let frame = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.max(42, Math.floor((width * height) / 19000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() > .85 ? 2 : 1,
      speed: .04 + Math.random() * .14,
      alpha: .18 + Math.random() * .58,
      phase: Math.random() * Math.PI * 2
    }));
  };

  const drawStars = () => {
    ctx.clearRect(0, 0, width, height);
    frame += 1;
    stars.forEach((star, index) => {
      const twinkle = reducedMotion ? 1 : .62 + Math.sin(frame * .018 + star.phase) * .38;
      ctx.globalAlpha = star.alpha * twinkle;
      ctx.fillStyle = index % 7 === 0 ? '#d8ff74' : '#6ff4e3';
      ctx.fillRect(Math.round(star.x), Math.round(star.y), star.size, star.size);
      if (!reducedMotion) {
        star.y += star.speed;
        if (star.y > height + 3) { star.y = -3; star.x = Math.random() * width; }
      }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawStars);
  };

  resize();
  drawStars();
  window.addEventListener('resize', resize);
})();
