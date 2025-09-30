const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

document.querySelectorAll('.dropdown-toggle').forEach(button => {
  button.addEventListener('click', e => {
    e.preventDefault();
    const parent = button.parentElement;

    if (window.innerWidth <= 768) {
      // Mobile: toggle submenu open/close
      parent.classList.toggle('active');
    } else {
      // Desktop: toggle this submenu, close siblings
      const siblings = Array.from(parent.parentElement.children)
        .filter(li => li !== parent);

      siblings.forEach(sib => sib.classList.remove('active'));
      parent.classList.toggle('active');
    }
  });
});

// Close all menus when resizing from mobile to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    navMenu.classList.remove('open');
    document.querySelectorAll('.nested-menu').forEach(li => li.classList.remove('active'));
  }
});

// Slides
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentIndex = 0;

// Function to show the slide at currentIndex
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

// Event listeners for buttons
prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
});