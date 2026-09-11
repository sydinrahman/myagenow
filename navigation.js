function resetHowItWorksHash() {
  if (window.location.hash === '#how-it-works' || window.location.hash === '#howitworks') {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    history.replaceState(null, '', window.location.pathname + window.location.search);
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    var times = [50, 100, 200, 300];
    times.forEach(function (t) {
      setTimeout(function () {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        if (t === 300) document.documentElement.style.scrollBehavior = '';
      }, t);
    });
  }
}
resetHowItWorksHash();
window.addEventListener('hashchange', resetHowItWorksHash);

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
