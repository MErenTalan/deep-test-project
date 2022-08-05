/*
Template Name: Spark - App Landing Page Template.
Author: GrayGrids
*/

(function () {

    /*=====================================
    Navbar Sticky
    ======================================= */
    window.onscroll = function () {
        const header_navbar = document.querySelector(".navbar-area");
        const sticky = header_navbar.offsetTop;

        const logo = document.querySelector('.navbar-brand img')
        if (window.pageYOffset > sticky) {
          header_navbar.classList.add("sticky");
          logo.src = 'assets/images/logo/deepcontrol_black_logo.png';
        } else {
          header_navbar.classList.remove("sticky");
          logo.src = 'assets/images/logo/deepcontrol_white_logo.png';
        }

        // Back-to-top button show-hide
        const backToTo = document.querySelector(".scroll-top");
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            backToTo.style.display = "flex";
        } else {
            backToTo.style.display = "none";
        }
    };

    // WOW active
    new WOW().init();

    //===== Mobile button
    let navbarToggler = document.querySelector(".mobile-menu-btn");
    navbarToggler.addEventListener('click', function () {
        navbarToggler.classList.toggle("active");
    });


})();