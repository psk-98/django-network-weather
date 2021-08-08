document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger')
    const navbar = document.querySelector('.navbar')

    burger.addEventListener('click', ()=> {
        navbar.classList.toggle("change")
    })

    const navlinks = document.querySelectorAll('.nav-link')

    navlinks.forEach(navlink => {
        navlink.addEventListener('click', () => {
            navbar.classList.toggle("change")
        })
    })

    var lastScrollTop = 0
    const navbarTop = document.querySelector('.top-wrapper')
    window.addEventListener("scroll", () => {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop
        if (scrollTop > lastScrollTop) {
            navbarTop.style.display = "none"
        }
        else {
            navbarTop.style.display = "block"
        }
        lastScrollTop =scrollTop
    })
})
