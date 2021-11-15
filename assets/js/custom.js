//Code for scroll issue
var baseoffset = 120;
var additionalOffset = 50;
$("a[href^='#']:not('a#close'):not('a.play'):not(a[href='#pricing-details'])").on('click', function (event) {
    event.preventDefault();
    baseoffset = 120;
    additionalOffset = 50;
    var jumplink = $(this).attr("href");
    if (jumplink === "#") {
        scrollToTop();
    //    return false;
    } else {
        scrollToElement(jumplink);
        if ($('.popup:target')[0]) {
            location.href = $('.popup:target .popup__close').attr("href");
            startScroll();
        }
      //  return false;
    }
});

function getOffset(jumplink) {
    baseoffset = $('.CookieBanner--is-visible')[0] ? 179 : 120;
    checkAdditionalOffset(jumplink);
    checkRTE(jumplink);
    return baseoffset;
}

function checkAdditionalOffset(jumplink) {
    if ($(jumplink + '[data-scroll-item]')[0] && !$(jumplink).hasClass('show-from-scroll')) {
        baseoffset += 50;
    }
}

function checkRTE(jumplink) {
    if ($(jumplink).parents('.RichText')[0]) {
        if ($($(jumplink).parents('.RichText')[0]).hasClass('show-from-scroll')) {
            baseoffset += 60;
        } else {
            baseoffset += 110;
        }
    }
}

function checkLocationFragment() {
    location.hash ? scrollToElement(location.hash) : '';
}

function scrollToElement(jumplink) {
    $("html, body").animate(
        { scrollTop: $(jumplink).offset().top - getOffset(jumplink) },
        "slow"
    );
}

function scrollToTop() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
}

window.onload = function () { checkLocationFragment(); };