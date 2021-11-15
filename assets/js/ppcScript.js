var liveValidation;
var cookiename = 'hasConsent';
var cookieSessionName = 'sessionCookie';
$(document).ready(function () {
    try {
        liveValidation = LiveValidation;
    } catch (err) {
        // console.log(err)
    }
    if (liveValidation) {
        setValidationForSelect();
    }

    //setContactIdInForm();
    var a = document.cookie.indexOf(cookiename + '=true');
    var b = document.cookie.indexOf(cookieSessionName + '=true');
    console.log(a);
    if (a > -1 || b > -1) {
        $('section.CookieBanner').css("display", "none");
    } else {
        $('.CookieBanner').css("display", "block");
    }

    $('.Accept-Button').on('click', function () {
        $('section.CookieBanner').css("display", "none");
        setCookie(); 
    });
    $(document).on('click', '#onetrust-accept-btn-handler, #accept-recommended-btn-handler, .save-preference-btn-handler', function () {
        setCookie();
        unDockCookieInOntrust();
});
    $(document).on('click', '#onetrust-reject-all-handler, .banner-close-button, #accept-recommended-btn-handler, .save-preference-btn-handler', function () {
    unDockCookieInOntrust();
})

    $('.CookieBanner-closeButton').on('click', function () {
        $('section.CookieBanner').css("display", "none");
        document.cookie = cookieSessionName + '=true; Secure; path=/'
    });
  

    Array.prototype.slice.call(document.querySelectorAll('[data-form-field]')).forEach(function (el) {
        el.addEventListener('blur', validateField);
    })
    Array.prototype.slice.call(document.querySelectorAll('[data-form-field-select]')).forEach(function (el) {
        el.addEventListener('change', bindCountrySelectEvent);
    })
    Array.prototype.slice.call(document.querySelectorAll('[data-form-field-checkbox]')).forEach(function (el) {
        el.addEventListener('change', validateField);
    })
});
function setValidationForSelect() {
    var select = [];
    var selectId = [];
    var form = document.querySelector('form.elq-form');
    if (form) {
        var formId = form.id;
        var formsID = '#' + formId + ' ' + 'select';
        var selectnodes = $(formsID);
        selectnodes.each(function (index) {
            $this = selectnodes[index];
            if ($(this).siblings('label').children('span').hasClass('required') || $(this).closest('.grid-layout-col').find('label').find('span').hasClass('required')) {
                var siblingID = '#' + formId + ' ' + '#' + this.id;
                select[index] = document.querySelector(siblingID);
                selectId[index] = new LiveValidation(select[index], {
                    validMessage: "", onlyOnBlur: false, wait: 300
                }
                );
                selectId[index].add(Validate.Custom, {
                    against: function (value) {
                        return !value.match(/please select/i);
                    }
                    , failureMessage: "This field is required"
                }
                );
            };
        })
    }
}
function stopScroll(event, el) {
    event.preventDefault();
    $("body").addClass("body-of-hidden");
    $("#" + el).addClass('popupOpen');
}

function startScroll(event, el, isAudio) {
    event.preventDefault();
    isAudio = isAudio || false;
    $("#" + el).removeClass('popupOpen');
    $("body").removeClass("body-of-hidden");
    if (window.Wistia) {
        var v = Wistia.api($('#' + el)[0].value);
        v.pause();
    } else {
        if (isAudio) {
            var player = videojs("#you" + el);
            player.pause();
        } else {
            $("#you" + el).attr('src', $("#you" + el).attr('src'))
        }
         //$("#you" + el).attr('src',$("#you"+ el).attr('src'))
        //var player = videojs("#you" + el);
        //player.pause();
    }

}
//function setContactIdInForm() {
//            var eloquaFormNode = $('form.elq-form')[0];
//            if (eloquaFormNode) {
//                var eloquaContactIdElement = $("form.elq-form #sitecoreContactID1")[0];
//                if (!eloquaContactIdElement) {
//                    var newinputElement = document.createElement('input');
//                    newinputElement.id = 'sitecoreContactID1';
//                    newinputElement.type = 'hidden';
//                    newinputElement.name = 'sitecoreContactID1';
//                    $(eloquaFormNode).prepend(newinputElement);
//                }
//            }
//            var contactIdElementNodes = document.querySelectorAll("#sitecoreContactID1");
//            if (contactIdElementNodes.length > 0) {
//                var contactIdElementArray = Array.prototype.slice.call(contactIdElementNodes);
//                contactIdElementArray.forEach(function (element) {
//                    element.value = localStorage.sitecoreContactId;
//                })
//            }
//}
var formData = {};
var valid = true;
function validateField(event) {
    field = event.target || event;
    var fieldType = field.type;
    switch (fieldType) {
        case "text":
            if (field.required) {
                var requiredFlag = Required(field);
                setValidationFlag(field.name, requiredFlag)
                if (requiredFlag && field.className.indexOf('business-phone') != -1) {
                    setValidationFlag(field.name, validatePhone(field))
                }
            }
            addFieldDataToLocalStorage(field.name, field.value);

            break;
        case "email":
            if (field.required) {
                var requiredFlag = Required(field);
                setValidationFlag(field.name, requiredFlag)
                if (requiredFlag) {
                    setValidationFlag(field.name, validateEmail(field))
                }
            }

            break;
        case "select-one":
            setValidationFlag(field.name, isSelectSelected(field))
            addFieldDataToLocalStorage(field.name, field.value);
            break;
        case "textarea":
            if (field.required) {
                setValidationFlag(field.name, Required(field))
            }
        case "checkbox":
            if (field.required) {
                setValidationFlag(field.name, Required(field))
            }
        default:
    }
}

function validateEmail(field) {
    var filter = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,})?$/;
    var domainFilter = /^([\w-\.]+@(?!gmail.com)(?!yahoo.com)(?!yahoo.co.in)(?!aol.com)(?!mail.com)(?!outlook.com)(?!protonmail.com)(?!icloud.com)(?!yandex.com)(?!Tutanota.com)(?!fastmail.com)(?!gmx.com.com)(?!hushmail.com)(?!mailfence.com)(?!live.com)([\w-]+\.)+[\w-]{2,})?$/;
    //var filter = $(field).attr('data-validate-attribute');
    if (!field.value) return false;
    if (field.className.indexOf('business-email') != -1) {
        if (filter.test(field.value)) {
            setvalidType(field);
            if (domainFilter.test(field.value)) {
                setvalidEmailDomain(field);
                addFieldDataToLocalStorage(field.name, field.value);
                return true;
            }
            else {
                setInvalidEmailDomain(field);
                return false;
            }
        }
        else {
            setInvalidType(field);
            return false;
        }
    }
    else {
        if (filter.test(field.value)) {
            setvalidType(field);
            addFieldDataToLocalStorage(field.name, field.value);
            return true;
        }
        else {
            setInvalidType(field);
            return false;
        }
    }
}

function validatePhone(field) {
    if (!field.value) return false;
    var filter = /^[0-9]+$/;
    if (filter.test(field.value) && field.value.length >= 7) {
        setvalidType(field);
        addFieldDataToLocalStorage(field.name, field.value);
        return true;
    }
    else {
        setInvalidType(field);
        return false;
    }
}

function setInvalidType(field) {
    $(field).parent().siblings(".validation-text-type").removeClass("sm-hide");
    $(field).addClass("is-invalid");
}

function setvalidType(field) {
    $(field).parent().siblings(".validation-text-type").addClass("sm-hide");
    $(field).removeClass("is-invalid");
}

function setInvalidEmailDomain(field) {
    $(field).parent().siblings(".validation-email-domain").removeClass("sm-hide");
    $(field).addClass("is-invalid");
}

function setvalidEmailDomain(field) {
    $(field).parent().siblings(".validation-email-domain").addClass("sm-hide");
    $(field).removeClass("is-invalid");
}

function setInvalidRequired(field) {
    $(field).parent().siblings(".validation-text-required").removeClass("sm-hide");
    $(field).addClass("is-invalid");
}
function setvalidRequired(field) {
    $(field).parent().siblings(".validation-text-required").addClass("sm-hide");
    $(field).removeClass("is-invalid");
}

function Required(field) {
    if (field.type !== 'checkbox') {
        if (field.value.trim().length < 1 || field.value === null) {
            setInvalidRequired(field)
            return false;
        } else {
            setvalidRequired(field);
            addFieldDataToLocalStorage(field.name, field.value);
            return true;
        }
    } else {
        if (field.checked) {
            setvalidRequired(field);
            return true;
        } else {
            setInvalidRequired(field);
            return false;
        }
    }



}
function getFormElementValidity(formElement) {
    var parentWarpper = formElement.parentElement.parentElement;
    if ($(parentWarpper).css('display') === 'none') {
        return true;
    } else {
        if (formElement.required) {
            return false;
        } else {
            return true;
        }
    }
}
function isSelectSelected(field) {
    if (field.parentElement.parentElement.hasAttribute('data-country')) {
        var stateProvince = document.querySelector('[data-stateprovince]');
        if (stateProvince && stateProvince.style.display === 'none') {
            var stateProvinceField = stateProvince.querySelector('select');
            setvalidRequired(stateProvinceField)
            setValidationFlag(stateProvinceField.name, true)
            //  return true;
        }
    }
    if ($(field.parentElement.parentElement).css('display') === 'none') {
        this.setvalidRequired(field)
        this.setValidationFlag(field.name, true)

    } else {
        if (field.selectedIndex == 0) {
            setInvalidRequired(field)
            return false;
        } else {
            setvalidRequired(field)
            return true;
        }
    }
}

function openFormPopUp(id, event) {
    event.preventDefault();
    $('#' + id).removeClass('sm-hide');
}

function closeFormPopUp(id, event) {
    event.preventDefault();
    $('#' + id).addClass('sm-hide');
    unsetZIndexToLower();
}

$('.form-container form.elq-form .form-submit-button').on('click', function (event) {
    event.preventDefault();
    var $form = $('.form-container form.elq-form');
    // if ($form.find('.is-invalid').length > 0) {
    //     return;
    // }
    var fields = $(".form-container .field-container.field-required").find("select, textarea, input");
    $.each(fields, function (i, field) {
        validateField(field);
    });
    if (formElements.filter(function (formElement) { return formElement.valid === false }).length > 0) return false;
    else {
        $('.form-container').hide();
        document.querySelector('.loader').style.display = 'block';


        $.ajax({
            url: "/api/duff/contact/current", success: function (data) {
                var eloquaFormNode = $('.form-container form.elq-form');
                if (eloquaFormNode.length > 0) {
                    $(eloquaFormNode).each(function (index, formNode) {
                        if ($(formNode).find("#sitecoreContactID1").length < 1) {
                            var newinputElement = document.createElement('input');
                            newinputElement.id = 'sitecoreContactID1';
                            newinputElement.type = 'hidden';
                            newinputElement.name = 'sitecoreContactID1';
                            newinputElement.value = data.id;
                            $(formNode).prepend(newinputElement);
                        } else {
                            $(formNode).find("#sitecoreContactID1").each(function (index, node) {
                                node.value = data.id;
                            });
                        }
                    });
                }
                $.post($form.attr('data-sandbox-url') ? $(form).attr('data-sandbox-url') : 'https://s615419487.t.eloqua.com/e/f2', $form.serialize())
                    .done(function (data, textStatus) {
                        var eventname = $form.attr('data-event-title');
                        var itemid = $form.attr('data-item-id');
                        var lang = $form.attr('data-lang');
                        var dataAdditionalParam = $form.attr('data-additional-param');
                        var success = textStatus === 'success' && (data.indexOf('DefaultFormSubmitConfirmation') > 0 || data.indexOf('thank-you') > 0);
                        if (success) {
                            var eventElement = $form.find('[data-lead-score-form]')
                            if (eventElement) {
                                var eventId = $(eventElement).attr('data-lead-score-form');
                                if (eventId) {
                                    eventId = eventId.replace('{', '').replace('}', '')
                                    $.ajax({
                                        type: "GET",
                                        url: "?sc_trk=" + eventId,
                                        // headers: {
                                        //     'Sitelify-PageView-Url': window.location.href
                                        // },
                                        // xhrFields: {
                                        //     withCredentials: true
                                        //  },
                                        success: function (response) {
                                            // console.log(response)
                                        },
                                        failure: function (response) {
                                            console.log(response)
                                        },
                                        error: function (err) {
                                            console.log(err)
                                        }
                                    });
                                }
                            }
                            if (itemid) {
                                $.ajax({
                                    type: "POST",
                                    url: "/api/duff/form/eloqua",
                                    data: {
                                        'id': itemid,
                                        'lang': lang
                                    },
                                    success: function (response) {
                                        window.open(response.url, response.target);
                                        document.querySelector('.loader').style.display = 'none';
                                        $('#successFormResult').show();
                                    },
                                    failure: function (response) {
                                        $('#errorFormResult').show();
                                    },
                                    error: function (response) {
                                        $('#errorFormResult').show();
                                    }
                                });
                            } else {
                                document.querySelector('.loader').style.display = 'none';
                                $('#successFormResult').show();
                            }



                            // trigger from submission successful data.event

                            window.dataLayer = window.dataLayer || [];
                            window.dataLayer.push({
                                'event': eventname,
                                'cuPageName': location.pathname,
                                'cuPageTitle': document.title,
                                'cuProfessionalName': '',
                                'data-additional-param': dataAdditionalParam
                            });
                        } else {
                            document.querySelector('.loader').style.display = 'none';
                            $('#errorFormResult').show();
                        }
                    });
            }
        }); 



        
    }
})



function checkEmbedForm() {
    var form = $('.form-container form.elq-form');
    if (form) {
        Array.prototype.slice.call(document.querySelectorAll('.form-container .field-container')).forEach(function (formGroup) {
            var formElement = formGroup.querySelector('input') || formGroup.querySelector('select') || formGroup.querySelector('textarea')
            formElements.push({
                node: formElement,
                name: formElement.name,
                type: formElement.type,
                required: formElement.required,
                //   valid: formElement.required && !window.getComputedStyle(formElement).display === 'none' ? false : true,
                valid: getFormElementValidity(formElement)
            })
        });
    }
    var userFormData = fetchFormData();
    if (userFormData) {
        formElements.forEach(function (formElementNode) {
            formElement = formElementNode.node;
            if (formElement.type === 'text' || formElement.type === 'email') {
                if (userFormData[formElement.name]) {
                    formElement.value = userFormData[formElement.name];
                    //  formElement.dispatchEvent(new Event('blur'));
                  //  $(formElement).trigger('blur');
                    validateField(formElement);
                }
            } else if (formElement.type === 'select-one') {
                if (userFormData[formElement.name]) {
                    var selectedIndex = Array.prototype.slice.call(formElement.children).map(function (el) { return el.value }).indexOf(userFormData[formElement.name]);
                    if (selectedIndex > 0) {
                        formElement.value = userFormData[formElement.name];
                        formElement.selectedIndex = selectedIndex;
                        //   formElement.dispatchEvent(new Event('blur'));
                        //  $(formElement).trigger('blur');
                        //  $(formElement).trigger('change');
                        bindCountrySelectEvent(formElement);
                    }

                }

            }
        })
    }
}

var formElements = [];
checkEmbedForm();

function setValidationFlag(elementName, validationFlag) {
    formElements.filter(function (formElement) {
        return formElement.name === elementName;
    }).forEach(function (element) { element.valid = validationFlag })
}

function addFieldDataToLocalStorage(fieldName, data) {
    //   fetchFormData();
    formData[fieldName] = data;
    localStorage.setItem('formData', JSON.stringify(formData))
}



function fetchFormData() {
    if (!localStorage['formData']) {
        localStorage.setItem('formData', JSON.stringify(formData));
        return false;
    } else {
        var data = JSON.parse(localStorage['formData']);
        // formData = Object.assign({}, data);
        formData = $.extend(true, {}, data)
        return formData;
    }
};

function bindFormPopupEvent() {
    Array.prototype.slice.call(document.querySelectorAll('[popup-toggle]')).forEach(function (element) {
        if (element) {
            element.addEventListener('click', function (event) {
                event.preventDefault();
                openFormPopUp(element.getAttribute('form-id'), event);
                stopScroll();
            });
        }
    });
}
bindFormPopupEvent();

function bindCountrySelectEvent(event) {
    field = event.target || event;
    var stateProvince = document.querySelector('[data-stateprovince]')
    var country = field.parentElement.parentElement.hasAttribute('data-country')
    if (stateProvince && country) {
        $('[data-stateprovince] option:first-child')[0].value = '';
        if (field.value === "United States") {
            $(stateProvince).show();
            $(stateProvince.querySelector('select')).trigger('change');
            //  if (stateProvince.querySelector('select').selectedIndex == 0) {
            //      formElements.filter(function(element) {
            //          return element.name === 'stateProv';
            //      }).valid = false;
            //  }

        } else {
            var stateProvinceSelect = stateProvince.querySelector('select');
            stateProvinceSelect.selectedIndex = 0;
            stateProvinceSelect.value = '';
            $(stateProvince).hide();

        }

    } else {
      //  return;
    }
    validateField(field);
}

function showForm(event) {
    event.preventDefault();
    $('#errorFormResult').hide();
    $('.form-container').show();
}

if (document.querySelector('[show-form]')) {
    document.querySelector('[show-form]').addEventListener('click', showForm);
}

function setZIndexToLower() {
    $(".Header").addClass("popup-header-index-override");
    $(".Footer-prefooter").addClass("popup-footer-index-override");
    $("body").addClass("body-of-hidden");
    if ($('.CookieBanner')[0]) {
        $('.CookieBanner').addClass("popup-footer-index-override");
    }

    if ($('.InPageSearch')[0]) {
        $('.InPageSearch').addClass("popup-index--1")
    }
    if ($('.ServicesListing')[0]) {
        $('.ServicesListing').addClass("popup-index--1")
    }

    if ($('.ArticleDetail-main .RichText')[0]) {
        $('.ArticleDetail-main .RichText').addClass("popup-index--1")
    }

    if ($('.ArticleDetail-main .ServicesDetail-cta')[0]) {
        $('.ArticleDetail-main .ServicesDetail-cta').addClass("popup-index--1")
        $('.ArticleDetail-main .ServicesDetail-cta').addClass("u-relative")
    }

    if ($('.ArticleDetail-main .DownloadPDF ')[0]) {
        $('.ArticleDetail-main .DownloadPDF ').addClass("popup-index--1")
    }
    if ($('.SocialShare')[0]) {
        $('.SocialShare').addClass("popup-index--1")
    }

    if ($('.form-richtext')[0]) {
        $('.form-richtext').addClass("popup-index--1")
        $('.form-richtext').addClass("u-relative")
    }

    if ($('.ServicesDetail-cta .Button.ContactButton')[0]) {
        $('.ServicesDetail-cta .Button.ContactButton').addClass("popup-index--1")

    }

    if ($('.ServicesDetail-cta .Button.PrintButton')[0]) {
        $('.ServicesDetail-cta .Button.PrintButton').addClass("popup-index--1")

    }

}


function unsetZIndexToLower() {
    $(".Header").removeClass("popup-header-index-override");
    $(".Footer-prefooter").removeClass("popup-footer-index-override");
    $("body").removeClass("body-of-hidden");
    if ($('.CookieBanner')[0]) {
        $('.CookieBanner').removeClass("popup-footer-index-override");
    }
    if ($('.InPageSearch')[0]) {
        $('.InPageSearch').removeClass("popup-index--1")
    }
    if ($('.ServicesListing')[0]) {
        $('.ServicesListing').removeClass("popup-index--1")
    }
    if ($('.ArticleDetail-main .RichText')[0]) {
        $('.ArticleDetail-main .RichText').removeClass("popup-index--1")
    }

    if ($('.ArticleDetail-main .ServicesDetail-cta')[0]) {
        $('.ArticleDetail-main .ServicesDetail-cta').removeClass("popup-index--1")
        $('.ArticleDetail-main .ServicesDetail-cta').removeClass("u-relative")
    }

    if ($('.ArticleDetail-main .DownloadPDF')[0]) {
        $('.ArticleDetail-main .DownloadPDF').removeClass("popup-index--1")
    }

    if ($('.SocialShare')[0]) {
        $('.SocialShare').removeClass("popup-index--1")
    }

    if ($('.form-richtext')[0]) {
        $('.form-richtext').removeClass("popup-index--1")
        $('.form-richtext').removeClass("u-relative")
    }

    if ($('.ServicesDetail-cta .Button.ContactButton')[0]) {
        $('.ServicesDetail-cta .Button.ContactButton').removeClass("popup-index--1")

    }

    if ($('.ServicesDetail-cta .Button.PrintButton')[0]) {
        $('.ServicesDetail-cta .Button.PrintButton').removeClass("popup-index--1")

    }
}

function dockCookieInFooterOntrust() {
    $('footer').css({ 'margin-bottom': parseInt($('#onetrust-banner-sdk').height()) })
}
function unDockCookieInOntrust() {
    $('footer').css({ 'margin-bottom': 0 });
}

function setCookie() {
    var cookietimeout = 33696000000;
    var e = new Date();
    console.log(e.getTime());
    console.log(e.getTime() + cookietimeout);
    e.setTime(e.getTime() + cookietimeout);
    document.cookie = cookiename + '=true;expires=' + e.toGMTString() + '; Secure; path=/'
}

$(window).on('load', function () {
    setTimeout(function () {
        if (document.cookie.indexOf('OptanonAlertBoxClosed') > -1) {
            return;
        }
        dockCookieInFooterOntrust();
    }, 2000);
});

$('.form-container .business-phone').on('keypress', function (event) {
    var filter = /^[0-9]+$/;
    if (!filter.test(event.key)) {
        event.preventDefault();
    }
})