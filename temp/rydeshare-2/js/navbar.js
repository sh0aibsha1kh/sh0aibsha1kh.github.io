function checkScroll() {
    var startY = $('.navbar').height() * 2; //The point where the navbar changes in px

    if ($(window).scrollTop() > startY) {
        $('.navbar').addClass("scrolled");

    } else {
        $('.navbar').removeClass("scrolled");
        $('.navbar').addClass("navbar-light");
        $('.navbar').removeClass("navbar-dark");
    }
}

if ($('.navbar').length > 0) {
    $(window).on("scroll load resize", function () {
        checkScroll();
    });
}