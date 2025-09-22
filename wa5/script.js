const navToggle = document.querySelector('.nav-toggle');
const navBurger = document.querySelector('.nav-burger-menu');

navToggle.addEventListener('click', () => {
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', !isExpanded);
  navBurger.classList.toggle('show');
});

navToggle.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    navToggle.click();
  }
});