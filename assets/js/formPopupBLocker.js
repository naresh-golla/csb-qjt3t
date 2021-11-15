$(window).on('load', function() {
    $('.formPopup .popup__formClose').remove();
    var id;
    $('[data-app-tmpl="FormsModule"]').each(function(index, element) {
      if ($(element).find('.formPopup').length > 0) {
        id = $(element).attr('id')
      }
    })
    var fakeEventObj = {preventDefault: function() {}};
    showFormWithPopup(id, fakeEventObj)
    if (!localStorage[id]) {
        $(document).on('scroll', function() {
          if (!localStorage[id]) {
              showFormWithPopup(id, fakeEventObj)
          }
    })
    }
  
    $('[elq-form-submit]').on('click', function() {
      var successCheckInterval = setInterval(function() {
        if($('#successFormResult').css('display') === 'block') {
          closeFormPopUp(id, fakeEventObj)
          startScroll(fakeEventObj);
          localStorage[id] = true;
          clearInterval(successCheckInterval)
        }
        if ($('#errorFormResult').css('display') === 'block') {
          clearInterval(successCheckInterval)
        }
      },500)
    })
  })
  
  function showFormWithPopup(id, event) {
    if (!localStorage[id]) {
     if (window.scrollY >= 1550) {
          openFormPopUp(id, event)
          stopScroll(event)
     }
    }
  }