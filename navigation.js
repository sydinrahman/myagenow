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

  menuButton.addEventListener('click', function (event) {
    event.stopPropagation();
    const isOpen = siteNav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && siteNav.classList.contains('is-open')) {
      closeMenu();
      menuButton.focus();
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
