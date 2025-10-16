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
let currentIndex = 0

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
