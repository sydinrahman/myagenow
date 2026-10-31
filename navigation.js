document.addEventListener('DOMContentLoaded', function () {

  const menuButton = document.getElementById('menu-button');
  const siteNav = document.getElementById('site-nav');

  if (!menuButton || !siteNav) return;

  function closeMenu() {
    if (siteNav.classList.contains('is-open')) {
      siteNav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    }
  }

  // ⚡ Optimization: Pre-cache navigation link DOM elements using getElementsByTagName once on init to eliminate repeated DOM querySelector/querySelectorAll parsing during mobile menu toggle and keyboard Tab focus trapping
  const navLinks = Array.from(siteNav.getElementsByTagName('a'));

  menuButton.addEventListener('click', function (event) {
    event.stopPropagation();
    const isOpen = siteNav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    if (isOpen) {
      if (navLinks.length > 0) navLinks[0].focus();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (!siteNav.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      closeMenu();
      menuButton.focus();
      return;
    }

    if (event.key === 'Tab') {
      const focusables = [menuButton, ...navLinks];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  document.addEventListener('click', function (event) {
    if (siteNav.classList.contains('is-open') && !siteNav.contains(event.target) && !menuButton.contains(event.target)) {
      closeMenu();
    }
  });

  siteNav.addEventListener('click', function (event) {
    if (event.target.tagName === 'A') {
      closeMenu();
    }
  });
});
