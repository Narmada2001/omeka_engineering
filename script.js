const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
  menuToggle.querySelector('span').textContent = isOpen ? '−' : '+';
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.querySelector('span').textContent = '+';
  });
});

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.filter.active').classList.remove('active');
    button.classList.add('active');
    const selected = button.dataset.filter;
    document.querySelectorAll('.project-card').forEach((card) => {
      card.classList.toggle('hidden', selected !== 'all' && card.dataset.location !== selected);
    });
  });
});

const inquiryForm = document.querySelector('#inquiry-form');
inquiryForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.target;
  const note = document.querySelector('#form-note');
  const submitButton = form.querySelector('button[type="submit"]');

  submitButton.disabled = true;
  note.textContent = 'Sending...';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      note.textContent = 'Thank you. We will be in touch shortly.';
      form.reset();
    } else {
      note.textContent = 'Something went wrong. Please email us directly at omekaeng@gmail.com.';
    }
  } catch (error) {
    note.textContent = 'Something went wrong. Please email us directly at omekaeng@gmail.com.';
  } finally {
    submitButton.disabled = false;
  }
});

// Scroll progress indicator
const progressBar = document.querySelector('#scroll-progress');
function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = progress + '%';
}
if (progressBar) {
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress);
  updateScrollProgress();
}

// Scrollspy: highlight the nav link for the section currently in view
const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
const sectionToLink = new Map();
navLinks.forEach((link) => {
  const section = document.querySelector(link.getAttribute('href'));
  if (section) sectionToLink.set(section, link);
});
if (sectionToLink.size && 'IntersectionObserver' in window) {
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = sectionToLink.get(entry.target);
      if (!link || !entry.isIntersecting) return;
      navLinks.forEach((l) => l.classList.remove('current'));
      link.classList.add('current');
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sectionToLink.forEach((_, section) => spyObserver.observe(section));
}

// Reveal elements as they scroll into view
const revealTargets = document.querySelectorAll('.reveal');
if (revealTargets.length && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add('in-view'));
}
