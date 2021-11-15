var MIN_SLIDES_REQUIRED = {
    'regular': {
      'default': 2,
      'tabletportrait': 4,
      'tabletlandscape': 4,
      'desktop': 5
    },
    'contacts': {
      'default': 2,
      'tabletportrait': 2,
      'tabletlandscape': 2,
      'desktop': 3
    },
    'cases': {
      'default': 2,
      'tabletportrait': 2,
      'tabletlandscape': 2,
      'desktop': 2
    }
  }


var config =  {
    initialSlide: 0,
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,

    direction: 'horizontal',

    setWrapperSize: true,

    speed: 350,
    effect: 'slide',
    roundLengths: true,

    grabCursor: true,

    pagination: '[data-slider-pagination]',
    paginationBulletRender: function (idx, className) { return '<div class="' + className + '"></div>' },
    paginationFractionRender: function (swiper, currentClass, totalClass) { return '<span class="' + currentClass + '"></span> of <span class="' + totalClass + '"></span>' },
    paginationClickable: true,

    slideClass: 'Slider-slide',
    slideActiveClass: 'Slider-slide--active',
    slideVisibleClass: 'Slider-slide--visible',
    slideNextClass: 'Slider-slide--next',
    slidePrevClass: 'Slider-slide--prev',
    slideDuplicateClass: 'Slider-slide--duplicate',
    wrapperClass: 'Slider-frame',
    bulletClass: 'Slider-pagination--bullet',
    bulletActiveClass: 'Slider-pagination--active',
    paginationHiddenClass: 'Slider-pagination--hidden',
    paginationCurrentClass: 'Slider-pagination--current',
    paginationTotalClass: 'Slider-pagination--total',
    paginationProgressBarClass: 'Slider-pagination--progress',
    buttonDisabledClass: 'btn--disabled',

    prevButton: '.Slider-ctrl-prev',
    nextButton: '.Slider-ctrl-next',

    hashNav: false,

    enableEventOnMove: false,
    enableEventChangeEnd: false,

    initialiseWithSingleSlide: false
  }



function getDeviceState() {
    var re = /('|")/
    var value = window.getComputedStyle(window.JS_EL).getPropertyValue('font-family')
    if (re.test(value.charAt(0)) && re.test(value.charAt(value.length - 1))) {
      value = value.substr(1, value.length - 2)
    }
    return value
  }
  $(document).ready(function () {
    window.JS_EL = document.createElement('div');
    window.JS_EL.className = 'js-mediaqueries';
    document.body.appendChild(window.JS_EL);

    $('[data-app-tmpl=Slider]').each(function(index, el) {
        var sliderConfig = $.extend({}, config)
        var slides = $(el).find('[data-slider-frame] [data-slider-slide]')
        var slidesTotal = slides.length > 0 ? slides.length : 0;
        var type = el.getAttribute('data-block-types')
        if (type === 'people') {
                type = 'contacts'
          } else if (!MIN_SLIDES_REQUIRED.hasOwnProperty(type)) {
                type = 'regular'
          }
          var deviceState = getDeviceState().split(' ')[0]
          if (slidesTotal < MIN_SLIDES_REQUIRED[type][deviceState]) {
            el.classList.add('ContentBlocks--hideControls')
          } else if (slidesTotal >= MIN_SLIDES_REQUIRED[type][deviceState]) {
            el.classList.remove('ContentBlocks--hideControls')
          }
        sliderConfig.onInit = function(instance) {
            // this.slider = instance
            el.classList.add('Slider--initialized')
            el.getBoundingClientRect()
            // this.trigger(events.INIT, instance)
          }
          if (el.hasAttribute('data-slider-conf') &&
          Object.keys(JSON.parse(el.getAttribute('data-slider-conf'))).length !== 0) {
          const elConf = JSON.parse(el.getAttribute('data-slider-conf'))
    
          sliderConfig = $.extend(sliderConfig, elConf)
        }
        if ((el.classList.contains('is-stacked') || slides.length === 1) && !sliderConfig.initialiseWithSingleSlide) {
            return
          }
        new Swiper(el, sliderConfig)
    })
  })




