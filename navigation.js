document.addEventListener('DOMContentLoaded', function () {

  const menuButton = document.getElementById('menu-button');
  const siteNav = document.getElementById('site-nav');

  if (!menuButton || !siteNav) return;

  menuButton.addEventListener('click', function () {
    const isOpen = siteNav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
});
