// nav menu stuff
const navToggle = document.querySelector(".nav-toggle")
const navMenu = document.querySelector(".nav-menu")

navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open")
})

// dropdown stuff
const dropdownBtns = document.querySelectorAll(".dropdown-toggle")
dropdownBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault()
        const parent = btn.parentElement

        if (window.innerWidth <= 768) {
            parent.classList.toggle("active")
        } else {
            const siblings = Array.from(parent.parentElement.children)
                .filter(li => li !== parent)
            siblings.forEach(s => s.classList.remove("active"))
            parent.classList.toggle("active")
        }
    })
})

// resize fix
window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        navMenu.classList.remove("open")
        document.querySelectorAll(".nested-menu").forEach(el => {
            el.classList.remove("active")
        })
    }
})

// slideshow section
const slides = document.querySelectorAll(".slide")
const prevBtn = document.querySelector(".prev")
const nextBtn = document.querySelector(".next")
let currentIndex = 0 //start at first picture

function showSlide(i) {
    slides.forEach((slide, idx) => {
        slide.classList.toggle("active", idx === i)
    })
}

prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length
    showSlide(currentIndex)
})

nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length
    showSlide(currentIndex)
})

// part request form stuff
const partForm = document.getElementById("partRequestForm")
const savedRequestDiv = document.getElementById("savedRequest")
const clearBtn = document.getElementById("clearRequest")

// load any saved stuff
window.addEventListener("load", () => {
    const savedName = localStorage.getItem("requestName")
    const savedPart = localStorage.getItem("requestPart")
    if (savedName && savedPart) {
        savedRequestDiv.textContent = "Saved Request: " + savedName + " requested \"" + savedPart + "\""
    }
})

// form submit
partForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const name = document.getElementById("username").value.trim()
    const part = document.getElementById("part").value.trim()

    if (name && part) {
        localStorage.setItem("requestName", name)
        localStorage.setItem("requestPart", part)
        savedRequestDiv.textContent = "Saved Request: " + name + " requested \"" + part + "\""
        partForm.reset()
    }
})

// clear button
clearBtn.addEventListener("click", () => {
    localStorage.removeItem("requestName")
    localStorage.removeItem("requestPart")
    savedRequestDiv.textContent = "Request cleared."
})

// theme stuff
function setTheme(theme) {
    localStorage.setItem("userTheme", theme)
    document.body.className = theme
}

// load theme on start
window.addEventListener("load", () => {
    const savedTheme = localStorage.getItem("userTheme") || "light"
    document.body.className = savedTheme
})

// 1. Auto-sliding carousel with pause on hover
let autoSlideInterval;

function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    
    autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }, 5000);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

// Start auto-slide
window.addEventListener('load', () => {
    startAutoSlide();
});

// Pause on hover
const slideshow = document.querySelector('.slideshow');
if (slideshow) {
    slideshow.addEventListener('mouseenter', stopAutoSlide);
    slideshow.addEventListener('mouseleave', startAutoSlide);
}

// Restart timer after manual switching
prevBtn.addEventListener('click', startAutoSlide);
nextBtn.addEventListener('click', startAutoSlide);

// 2. Rotating quotes
const quotes = [
    "Save the first gens!",
    "When in doubt, Flat Out",
    "Got Questions? The RS25 Forum has all of your answers",
    "Replace your rusty panels",
    "Unbeatable Symmetrical AWD"
];

function updateQuote() {
    quoteElement.textContent = quotes[quoteIndex];

    if (quoteCounter) {
        quoteCounter.textContent = `${quoteIndex + 1} / ${quotes.length}`;
    }
}

let quoteIndex = 0;
const quoteElement = document.getElementById('current-quote');
const quoteCounter = document.getElementById('quote-counter');
const prevQuoteBtn = document.getElementById('prev-quote');
const nextQuoteBtn = document.getElementById('next-quote');

if (quoteElement) {
    updateQuote();
}

// Manual quote controls
if (prevQuoteBtn) {
    prevQuoteBtn.addEventListener('click', () => {
        quoteIndex = (quoteIndex - 1 + quotes.length) % quotes.length;
        updateQuote();
        console.log('Prev quote clicked, index:', quoteIndex); // for debug
    });
}

if (nextQuoteBtn) {
    nextQuoteBtn.addEventListener('click', () => {
        quoteIndex = (quoteIndex + 1) % quotes.length;
        updateQuote();
        console.log('Next quote clicked, index:', quoteIndex); // for debug
    });
}

// Auto-rotate quote
let quoteInterval;
if (quoteElement) {
    quoteInterval = setInterval(() => { //starts 8 sec timer
        quoteIndex = (quoteIndex + 1) % quotes.length; //cycles from 0-4 ho
        updateQuote();
        console.log('Auto-rotating quote, new index:', quoteIndex); //for debug
    }, 8000); // 8 sec
}

// Pause the quote on hover
if (quoteElement) {
    const quotesSection = document.querySelector('.quotes-section');
    if (quotesSection) {
        quotesSection.addEventListener('mouseenter', () => {
            console.log('Pausing auto-rotate');
            clearInterval(quoteInterval);
        });
        
        quotesSection.addEventListener('mouseleave', () => {
            console.log('Resuming auto-rotate');
            clearInterval(quoteInterval); // Clear the old interval
            quoteInterval = setInterval(() => {
                quoteIndex = (quoteIndex + 1) % quotes.length;
                updateQuote();
            }, 8000);
        });
    }
}

// 3. Cat API
const catImage = document.getElementById('cat-image');
const newCatBtn = document.getElementById('new-cat-btn');

function fetchCatImage() {
    if (!catImage) return;
    
    catImage.src = 'img/placeholder-cat.jpg';
    catImage.alt = 'Loading cat picture...';
    
    fetch('https://api.thecatapi.com/v1/images/search')
        .then(response => response.json())
        .then(data => {
            if (data && data[0] && data[0].url) {
                catImage.src = data[0].url;
                catImage.alt = 'Random cat picture';
            }
        })
        .catch(error => {
            console.log('Could not load cat:', error);
            catImage.alt = 'Cat image failed to load';
        });
}

if (newCatBtn) {
    newCatBtn.addEventListener('click', fetchCatImage);
}

// Load cat on page load
window.addEventListener('load', () => {
    setTimeout(fetchCatImage, 500);
});

// 4. Dynamic changing background based on time
function updateBackgroundByTime() {
    const hour = new Date().getHours();
    const body = document.body;

     body.classList.remove('light', 'dark');
    
    if (hour >= 6 && hour < 12) {
    // Morning, lighter yellow
        body.style.backgroundColor = '#FFF8E1';
        body.style.color = '#333';
    body.classList.add('light'); // Keep light mode
    } else if (hour >= 12 && hour < 18) {
    // Afternoon, lighter blue
        body.style.backgroundColor = '#E3F2FD';
        body.style.color = '#333';
    body.classList.add('light'); // Keep light mode
    } else if (hour >= 18 && hour < 22) {
    // Evening, purple color
        body.style.backgroundColor = '#9B5FA2';
        body.style.color = '#333';
    body.classList.add('dark'); // Change to dark mode
    } else {
    // Night, dark color
        body.style.backgroundColor = '#121212';
        body.style.color = '#fff';
    body.classList.add('dark'); // Change to dark mode
    }

    updateThemeButtons(); //Change the theme buttons too
}

// Update background on load and for every hour
window.addEventListener('load', updateBackgroundByTime);
setInterval(updateBackgroundByTime, 3600000);

// 5. Fix privacy button color visibility
function updatePrivacyButton() {
    const privacyBtn = document.querySelector('.privacy-btn');
    if (!privacyBtn) return;
    
    if (document.body.classList.contains('dark')) {
        privacyBtn.style.backgroundColor = '#66aaff';
        privacyBtn.style.color = '#111';
    } else {
        privacyBtn.style.backgroundColor = '#0044cc';
        privacyBtn.style.color = '#fff';
    }
}

// Update button when theme changes
window.addEventListener('load', updatePrivacyButton);
document.querySelectorAll('[onclick^="setTheme"]').forEach(btn => {
    btn.addEventListener('click', () => {
        setTimeout(updatePrivacyButton, 100);
    });
});
