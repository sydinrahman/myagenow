document.addEventListener('DOMContentLoaded', function () {

  // Dark Mode Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // Mobile Menu Navigation
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

  menuButton.addEventListener('click', function (event) {
    event.stopPropagation();
    const isOpen = siteNav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    if (isOpen) {
      const firstLink = siteNav.querySelector('a');
      if (firstLink) firstLink.focus();
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
      const focusables = [menuButton, ...siteNav.querySelectorAll('a')];
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
