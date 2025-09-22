const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navBurger = document.querySelector('.nav-burger-menu');

let toggle = false;

navToggle.addEventListener("click", () => {
    if (toggle==false) {
        navBurger.style.display = "block";
        navBurger.ariaLabel = "nav bar";
        toggle = true;
    }
    else {
        navBurger.style.display = "none";
        toggle = false;
    }

})
