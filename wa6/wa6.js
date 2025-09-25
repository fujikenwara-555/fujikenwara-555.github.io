// Get all filter buttons and photo cards
const filterButtons = document.querySelectorAll('.gallery-nav button');
const photoCards = document.querySelectorAll('.photo-card');

// Add click event to each button
filterButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const filterValue = event.target.textContent.toLowerCase();
    filterPhotos(filterValue);
  });
});

function filterPhotos(category) {
  photoCards.forEach(card => {
    const cardCategory = card.dataset.category; // use dataset safely
    if (category === 'all' || cardCategory === category) {
      card.style.display = 'flex';  // keep flex for centering content
    } else {
      card.style.display = 'none';
    }
  });
}