var liveValidation;
var role;
var issue;
var COOKIE_NAME = 'hasConsent';
var COOKIE_TIMEOUT = 33696000000;
function sendContactUsFormToEloqua() {
    var $form = $('form#contact-us');
    $form.find('.mock-field').remove();
    var selected = $('option[data-eloqua-field-name][selected=selected]', $form);
    
    if (selected.length > 0)
        selected.each(function (i, el) {
            $form.append('<input type="hidden" class=".mock-field" name="' + $(el).data('eloqua-field-name') + '" value="' + el.value + '"/>');
        });
        $.ajax({url: "/api/duff/contact/current", success: function(data) {
            var eloquaFormNode = $('form#contact-us');
            if(eloquaFormNode.length > 0) {
             $(eloquaFormNode).each(function(index, formNode) {
                if ($(formNode).find("#sitecoreContactID1").length < 1) {
                    var newinputElement = document.createElement('input');
                    newinputElement.id = 'sitecoreContactID1';
                    newinputElement.type = 'hidden';
                    newinputElement.name = 'sitecoreContactID1';
                    newinputElement.value = data.id;
                    $(formNode).prepend(newinputElement);
                } else {
                    $(formNode).find("#sitecoreContactID1").each(function(index, node) {
                        node.value = data.id;
                    });
                }
            }); 
        }
        $.post($form.attr('data-sandbox-url') ? $form.attr('data-sandbox-url') : 'https://s615419487.t.eloqua.com/e/f2', $form.serialize())
        .done(function (data, textStatus) {
            var success = textStatus === 'success' && (data.indexOf('DefaultFormSubmitConfirmation') > 0 || data.indexOf('thank-you') > 0);
            $('.ContactForm-section', $form).hide();
            addEloquaListenerForLeadScore(textStatus, $form);
            if (success) {
                $('#success-result').show();
                
                var professional = $form.find('input[name=send_notification]');
                var professionalName = professional.length > 0 ? $(professional).val() : '';
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'event': 'contact-us-form-submitted',
                    'cuPageName': location.pathname,
                    'cuPageTitle': document.title,
                    'cuProfessionalName': professionalName
                });
            } else {
                $('#error-result').show();
            }
            var src = $('form#contact-us').data('download');
            if (success && src) {
                window.open(src);
            }
        });
        }});
    
}

function sendNewsletterSubscriptionToEloqua() {
    $.ajax({url: "/api/duff/contact/current", success: function(data) {
        var eloquaFormNode = $('form#newsletter-subscription');
        if(eloquaFormNode.length > 0) {
         $(eloquaFormNode).each(function(index, formNode) {
            if ($(formNode).find("#sitecoreContactID1").length < 1) {
                var newinputElement = document.createElement('input');
                newinputElement.id = 'sitecoreContactID1';
                newinputElement.type = 'hidden';
                newinputElement.name = 'sitecoreContactID1';
                newinputElement.value = data.id;
                $(formNode).prepend(newinputElement);
            } else {
                $(formNode).find("#sitecoreContactID1").each(function(index, node) {
                    node.value = data.id;
                });
            }
        }); 
    }
    var $form = $('form#newsletter-subscription');
    $.post($form.attr('data-sandbox-url') ? $form.attr('data-sandbox-url') : 'https://s615419487.t.eloqua.com/e/f2', $form.serialize())
        .done(function (data, textStatus) {
            $form.hide();
            $(textStatus === 'success' && data.indexOf('thank-you') > 0 ? '.Footer-newsletter .success' : '.Footer-newsletter .error').show();
            addEloquaListenerForLeadScore(textStatus, $form);
        });
    }}); 

}
function sendSubscriptionToEloqua() {
        $.ajax({url: "/api/duff/contact/current", success: function(data) {
            var eloquaFormNode = $('form#subscription-module');
            if(eloquaFormNode.length > 0) {
             $(eloquaFormNode).each(function(index, formNode) {
                if ($(formNode).find("#sitecoreContactID1").length < 1) {
                    var newinputElement = document.createElement('input');
                    newinputElement.id = 'sitecoreContactID1';
                    newinputElement.type = 'hidden';
                    newinputElement.name = 'sitecoreContactID1';
                    newinputElement.value = data.id;
                    $(formNode).prepend(newinputElement);
                } else {
                    $(formNode).find("#sitecoreContactID1").each(function(index, node) {
                        node.value = data.id;
                    });
                }
            }); 
        }
        var $form = $('form#subscription-module');
    $.post($form.attr('data-sandbox-url') ? $form.attr('data-sandbox-url') : 'https://s615419487.t.eloqua.com/e/f2', $form.serialize())
        .done(function (data, textStatus) {
            $form.hide();
            $(textStatus === 'success' && data.indexOf('thank-you') > 0 ? '.SubscribeForm .success' : '.SubscribeForm .error').show();
            addEloquaListenerForLeadScore(textStatus, $form);
        });   
        }}); 
}
function contactusform() {
    $('a[data-email]').on('click', function (e) {
        var $link = $(e.currentTarget);
        var contactButtomImplementation = $('.contactButtonImplementation').attr('data-url');
        if (contactButtomImplementation != undefined && contactButtomImplementation.length > 0) {
            if (($('html').attr('data-swiftype-web-name').indexOf('kroll.com') != -1) || ($('.kbs').length > 0)) {
                localStorage['contactemail'] = $link.data('email')           
                window.open(contactButtomImplementation + "?contact=" + $link.data('name').replaceAll(' ', '-'), '_blank');
            } else {
                window.open(contactButtomImplementation, '_blank');
            }
        }
        else {
            $('#contact-us-title').text($('#contact-us-title').data('title') + ' ' + $link.data('name'));
            $('form#contact-us input[name=send_notification]').val($link.data('email'));
            $('body').addClass('contactform-is-open');
        }
        return false;
    });
}

$(document).ready(function () {

    try {
        liveValidation = LiveValidation;
       } catch (err) {
          
       }
    contactusform();
    setValidationForSelect();
    
    dataLayerPushForServicesCTA();
    dataLayerPushForSubscriptionNewsletter()
    $('.contactButtonImplementation').on('click', function (e) {
        var $this = $(this);
        var locationURL = $this.attr('data-url')
        if (locationURL != undefined && locationURL.length > 0) {
            
            window.open(locationURL, '_blank');
        }
        else {
            $('body').addClass('contactform-is-open');
        }
        return false;
    });
    $('.GetStartedButton').on('click', function (e) {
        var value = $('#gs-role').val();
        if (value != '') {
            $('#role').val(value);
            $('#role-js span.Select-display--selected').text(value);
            $('#role-js').addClass('has-selection');
        }
       
        value = $('#gs-issue').val();
        if (value != '') {
            $('#issue').val(value);
            $('#issue-js span.Select-display--selected').text(value);
            $('#issue-js').addClass('has-selection');
        }
        $('.ContactForm-section.about-section').removeClass('u-hide');        
        $('body').addClass('contactform-is-open');
        return false;
    });
    $('form#newsletter-subscription button').on('click', function () {
        var $input = $('form#newsletter-subscription input[type=email]');
        if (!
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($input.val())) {
            $input.css('border', 'solid 1px red');
            return false;
        } else {
            $input.css('border', '0');
        }
        sendNewsletterSubscriptionToEloqua();
        return false;
    });

    $('form#subscription-module button').on('click', function () {
        var $input = $('form#subscription-module input[type=email]');
        if (!
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($input.val())) {
            $input.css('border', 'solid 1px red');
            return false;
        } else {
            $input.css('border', '0');
        }
        sendSubscriptionToEloqua();
        return false;
    });

    $('.Footer-Telephone-Number a').on('click', function () {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'Footer Telephone Number',
            'ftnPage': window.location.href
        });
    });
    $('section.Announcement a').on('click', function () {
        var headlineText = $('section.Announcement span').first().text();
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'Breaking News',
            'bnTitle': headlineText
        });
    });

});
$(window).on('load', function () {
    
    var divNodes = Array.prototype.slice.call($('.clientServiceBody>div'))
    if (divNodes.length > 0) {
        divNodes.shift();
        divNodes.forEach(function (div) { Array.prototype.slice.call(div.children).forEach(function (article) { article.setAttribute('data-scroll-item', '') }) });
    }
setTimeout(function() {
    
        if (document.cookie.indexOf('OptanonAlertBoxClosed') > -1){
            return;
        }
        dockCookieInFooterOntrust ();
    // }
}, 2000);
    $(document).on('click', '#onetrust-accept-btn-handler, #accept-recommended-btn-handler, .save-preference-btn-handler', function () {
            setCookie ();
            setFloodlightTagOnetrust ();
            unDockCookieInOntrust ();
        })
    $(document).on('click', '#onetrust-reject-all-handler, .banner-close-button, #accept-recommended-btn-handler, .save-preference-btn-handler', function () {
        unDockCookieInOntrust ();
    })

    addListenerForLeadScore();

    
});
function setHeaderTop() {
    var headerElement = $('header.Header');
    var wrapperElement = $('main.Wrapper');
    var cookieElement = $('section.CookieBanner');
    var acceptButtonElement = $('Button.Accept-Button');
    var mobileNav = $('.MobileNav');
    if (cookieElement.hasClass('CookieBanner--is-visible')) {
        var cookieBannerHeight = cookieElement.height();
        var acceptButtonTop = (parseInt(cookieBannerHeight) - parseInt(acceptButtonElement.height())) / 2;
        var wrapperMarginTopDesktop = 180 + parseInt(cookieBannerHeight);
        var wrapperMarginTopMobile = 60 + parseInt(cookieBannerHeight);
        headerElement.css({ top: cookieBannerHeight });
        acceptButtonElement.css({ top: acceptButtonTop });
        if ($(window).width() > 1024) {
            wrapperElement.css({ 'margin-top': wrapperMarginTopDesktop });
        }
        else {
            wrapperElement.css({ 'margin-top': wrapperMarginTopMobile });
            mobileNav.css({ 'top': wrapperMarginTopMobile });
        }
    }
    else {
        headerElement.css({ top: 0 });
        if ($(window).width() > 1024) {
            wrapperElement.css({ 'margin-top': 180 });
        }
        else {
            wrapperElement.css({ 'margin-top': 60 });
            if (mobileNav.css('top') !== 60) {
                mobileNav.css({ 'top': '' });
            }
        }
    }
}

function setValidationForSelect() {
    if (liveValidation) {
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
}

function stopScroll(event, el) {
    event.preventDefault();
  setZIndexToLower();
  $("#" + el).addClass('popupOpen');
    }

function startScroll(event, el, isAudio) {
    event.preventDefault();
    isAudio = isAudio || false;
    $("#" + el).removeClass('popupOpen');
    unsetZIndexToLower();
    if (window.Wistia) {
        var v = Wistia.api($('#'+ el)[0].value);
        v.pause();
    } else {
        if (isAudio) {
        var player = videojs("#you" + el);
        player.pause();
        } else {
            $("#you" + el).attr('src',$("#you"+ el).attr('src'))
        }
        
        
    }
}
function vCardDLPush(e) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'Contact a Team Member',
        'ctmName': $(e).data('contact-name'),
        'ctmContactType': 'vcard',
        'ctmPage': window.location.href
    });
}
function PhoneDLPush(e) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'Contact a Team Member',
        'ctmName': $(e).data('contact-name'),
        'ctmContactType': 'phone',
        'ctmPage': window.location.href
    });
}

function toggleSubNav() {
    document.querySelector('.productSubHeader').classList.toggle('InPageSubNav--showMobile')
    document.querySelector('.productSubHeader').classList.toggle('DetailHeaderProductZ-index')
    document.querySelector('body').classList.toggle('u-of-hidden')
    document.querySelector('body').classList.toggle('show-subnav')
}

function proSubHeader() {
    var proSubHeader = document.querySelector('.productSubHeader')
    if (proSubHeader) {
        Array.prototype.slice.call(document.querySelectorAll('[toggle-sub-nav]')).forEach(function (element) {
            element.addEventListener('click', toggleSubNav);
        })
    }
}
proSubHeader();


function setContactIdInForm() {
    
    $.ajax({url: "/api/duff/contact/current", success: function(data) {
        var eloquaFormNode = $('form.elq-form');
        if(eloquaFormNode.length > 0) {
         $(eloquaFormNode).each(function(index, formNode) {
            if ($(formNode).find("#sitecoreContactID1").length < 1) {
                var newinputElement = document.createElement('input');
                newinputElement.id = 'sitecoreContactID1';
                newinputElement.type = 'hidden';
                newinputElement.name = 'sitecoreContactID1';
                newinputElement.value = data.id;
                $(formNode).prepend(newinputElement);
            } else {
                $(formNode).find("#sitecoreContactID1").each(function(index, node) {
                    node.value = data.id;
                });
            }
        }); 
    }
    }});    
}

function dataLayerPushForServicesCTA () {
    if (document.querySelector(".ServicesOfferingV2 .ContactBlocks-cta")) {
        document.querySelector(".ServicesOfferingV2 .ContactBlocks-cta").addEventListener('click', function() {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'View All Services'
            });
        }, true)  
    }
        
}

function dataLayerPushForSubscriptionNewsletter() {
    if (document.querySelector("#subscription-module")) {
        document.querySelector("#subscription-module button").addEventListener('click', function() {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'newsletter-sign-up',
                'cuPageName': location.pathname,
                'cuPageTitle': document.title,
                'cuProfessionalName': ''
            });
        }, true)  
    }
        
}

function showService(selectedService) {
    Array.prototype.slice.call(document.querySelectorAll('.clientServiceCategory article')).map(
        function (service) {
            toggleServices(service, selectedService);
            removeShowFromScroll(service.innerText);
        }
    )
    Array.prototype.slice.call(document.querySelectorAll('.clientServices .SearchFilter-list li')).map(
        function (service) {
            toggleServices(service, selectedService);
        }
    )

    selectedService.classList.add('active');
    showServices(selectedService.innerText);
    showShowFromScroll(selectedService.innerText);
    $('.selected-mobile-items b')[0].innerText = selectedService.innerText;
}

function hideServices(serviceName) {
    document.querySelector('[service-category="' + serviceName + '"]').classList.add('hideServices')
}
function showServices(serviceName) {
    document.querySelector('[service-category="' + serviceName + '"]').classList.remove('hideServices')
}

function toggleServices(service, selectedService) {
    if (service != selectedService) {
        if (Array.prototype.slice.call(service.classList).indexOf('active') !== -1) {
            service.classList.remove('active');
            hideServices(service.innerText);
        }
    }
    
}

function removeShowFromScroll(serviceName) {
    Array.prototype.slice.call(document.querySelector('[service-category="' + serviceName + '"]').children).forEach(function (ele) {
                ele.classList.remove('show-from-scroll');
            })
}

function showShowFromScroll(serviceName) {
    showServiceItems(Array.prototype.slice.call(document.querySelector('[service-category="' + serviceName + '"]').children));
}

function showServiceItems(items) {
    var delayCount = 0

    items.forEach(function(item, i) {
        (function(_item) {
            var delay = 0
                delay = 150 * delayCount
                delayCount++
            setTimeout(function()  {
                this.showServiceItem(_item)
            }, delay)
        })(item, i)
    })
}

function showServiceItem(el) {
    if (el.classList.contains('show-from-scroll')) {
        return
    }
    el.classList.add('show-from-scroll')
    el.setAttribute('data-scroll-item', '')
}

function setInvalidType(field) {
    $(field).parent().siblings(".validation-text-type").removeClass("sm-hide");
    $(field).addClass("is-invalid");
}

function setvalidType(field) {
    $(field).parent().siblings(".validation-text-type").addClass("sm-hide");
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

function openFormPopUp(id, event) {
     event.preventDefault();
    $('#' + id).removeClass('sm-hide');
    var formElement = document.querySelector('#' + id);
    if (formElement.hasAttribute('data-app-tmpl', 'FormsModule')) {             
        Array.prototype.slice.call($('.Wrapper>*>*')).filter(function(element) {
            return formElement != element;
        }).forEach(function(el) {
            $(el).addClass('popup-index--1 u-pos-relative')
        });
    }
}

function closeFormPopUp(id, event) {
    event.preventDefault();
    $('#' + id).addClass('sm-hide');
   unsetZIndexToLower();
   var formElement = document.querySelector('#' + id);
    if (formElement.hasAttribute('data-app-tmpl', 'FormsModule')) {             
        Array.prototype.slice.call($('.Wrapper>*>*')).filter(function(element) {
            return formElement != element;
        }).forEach(function(el) {
            $(el).removeClass('popup-index--1 u-pos-relative')
        });
    }
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

    $('.GetStarted.ExploreService .GetStartedService').on('click', function (e) {
        e.preventDefault();
        var dataId = $(this).attr('data-datasource');
      var promise = new Promise(function(resolve, reject) {
            var gsRole;
            var gsIssue;
            if (document.querySelector('#gs-role').querySelector('[selected=selected]') && document.querySelector('#gs-issue').querySelector('[selected=selected]')) {
            gsRole = document.querySelector('#gs-role').querySelector('[selected=selected]').textContent;
            gsIssue = document.querySelector('#gs-issue').querySelector('[selected=selected]').textContent;
            }
    
            if (gsRole && gsIssue) {
                resolve([gsRole, gsIssue])
            } else {
                reject(Error('didnt worked'))
            } 
        });

        promise.then(function(resoleveObject) {
            $.ajax({
                type: "POST",
                url: "/api/duff/service/exploreservice",
                data: {
                'id': dataId,
                'role': resoleveObject[0],
                'issue': resoleveObject[1]
                },
                success: function (response) {
                window.location.href = response.resUrl;
                },
                failure: function (response) {
                
                },
                error: function (response) { }
                });
        })
        })

        function setFloodlightTagOnetrust () {
            if (document.querySelector('html').classList.contains('fltriggered')) return;
            var duffandphelps = 'duffandphelps';
            var kroll = 'kroll';
            var hostName = location.hostname;
            var path = location.pathname.split('/');
            var pathName;
            var duffandphelpsFlag;
            var krollFlag;
            if (hostName.match(duffandphelps)) {
               pathName = path[1];
               duffandphelpsFlag = true;
            } else if (hostName.match(kroll)) {
              pathName = path[2];
              krollFlag = true;
            }
            if(duffandphelpsFlag && (pathName === "")) {
              $('body').prepend('<!-- \
            Start of Floodlight Tag: Please do not remove \n\
            Activity name of this tag: DandP_Home-duffandphelps_Landing Page View \n\
            URL of the webpage where the tag is expected to be placed: https://www.duffandphelps.com/ \n\
            This tag must be placed between the <body> and </body> tags, as close as possible to the opening tag. \n\
            Creation Date: 07/24/2019 \n\
            --> \n\
            <script type="text/javascript" id="DoubleClickFloodlightTag8698692"> \n\
            //<![CDATA[ \n\
            var axel = Math.random() + ""; \n\
            var a = axel * 10000000000000; \n\
            var newIFrame=document.createElement("iframe"); \n\
            newIFrame.src="https://3483970.fls.doubleclick.net/activityi;src=3483970;type=pgv;cat=dnp0;dc_lat=;dc_rdid=; tag_for_child_directed_treatment=;tfua=;npa=;ord=" + a + "?"; \n\
            newIFrame.width="1"; \n\
            newIFrame.frameBorder="0"; \n\
            newIFrame.height="1"; \n\
            newIFrame.style.display = "none" \n\
            var scriptNode=document.getElementById("DoubleClickFloodlightTag8698692"); \n\
            scriptNode.parentNode.insertBefore(newIFrame,scriptNode); \n\
            //]]> \n\
            </script> \n\
            <noscript> \n\
            <iframe src="https://3483970.fls.doubleclick.net/activityi;src=3483970;type=pgv;cat=dnp0;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;ord=1?" width="1" height="1" frameborder="0" style="display:none"></iframe> \n\
            </noscript> \n\
            <!-- End of Floodlight Tag: Please do not remove --')
            document.querySelector('html').classList.add('fltriggered');
            return;
            } 
            if (duffandphelpsFlag && (pathName !== "")) {
              $('body').prepend('<!-- \n\
              Start of Floodlight Tag: Please do not remove \n\
              Activity name of this tag: DandP_duffandphelps_Leaf Page View \n\
              URL of the webpage where the tag is expected to be placed: https://www.duffandphelps.com/ \n\
              This tag must be placed between the <body> and </body> tags, as close as possible to the opening tag. \n\
              Creation Date: 07/24/2019  \n\
              --> \n\
              <script type="text/javascript" id="DoubleClickFloodlightTag8722330"> \n\
              //<![CDATA[ \n\
              var axel = Math.random() + ""; \n\
              var a = axel * 10000000000000; \n\
              var newIFrame=document.createElement("iframe"); \n\
              newIFrame.src="https://3483970.fls.doubleclick.net/activityi;src=3483970;type=pgv;cat=dnp000;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;ord=" + a + "?"; \n\
              newIFrame.width="1"; \n\
              newIFrame.frameBorder="0"; \n\
              newIFrame.height="1";\n\
              newIFrame.style.display = "none" \n\
              var scriptNode=document.getElementById("DoubleClickFloodlightTag8722330"); \n\
              scriptNode.parentNode.insertBefore(newIFrame,scriptNode); \n\
              //]]> \n\
              </script> \n\
              <noscript> \n\
              <iframe src="https://3483970.fls.doubleclick.net/activityi;src=3483970;type=pgv;cat=dnp000;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;ord=1?" width="1" height="1" frameborder="0" style="display:none"></iframe> \n\
              </noscript> \n\
              <!-- End of Floodlight Tag: Please do not remove -->')
              document.querySelector('html').classList.add('fltriggered');
              return;
            }
            if(krollFlag && (pathName === undefined)) {
              $('body').prepend('<!-- \n\
              Start of Floodlight Tag: Please do not remove \n\
              Activity name of this tag: DandP_Home-kroll_Landing Page View \n\
              URL of the webpage where the tag is expected to be placed: https://www.kroll.com/ \n\
              This tag must be placed between the <body> and </body> tags, as close as possible to the opening tag. \n\
              Creation Date: 07/24/2019 \n\
              --> \n\
              <script type="text/javascript" id="DoubleClickFloodlightTag8713282"> \n\
              //<![CDATA[ \n\
              var axel = Math.random() + ""; \n\
              var a = axel * 10000000000000; \n\
              var newIFrame=document.createElement("iframe"); \n\
              newIFrame.src="https://3483970.fls.doubleclick.net/activityi;src=3483970;type=pgv;cat=dnp00;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;ord=" + a + "?"; \n\
              newIFrame.width="1"; \n\
              newIFrame.frameBorder="0"; \n\
              newIFrame.height="1"; \n\
              newIFrame.style.display = "none" \n\
              var scriptNode=document.getElementById("DoubleClickFloodlightTag8713282"); \n\
              scriptNode.parentNode.insertBefore(newIFrame,scriptNode); \n\
              //]]> \n\
              </script> \n\
              <noscript> \n\
              <iframe src="https://3483970.fls.doubleclick.net/activityi;src=3483970;type=pgv;cat=dnp00;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;ord=1?" width="1" height="1" frameborder="0" style="display:none"></iframe> \n\
              </noscript> \n\
              <!-- End of Floodlight Tag: Please do not remove -->')
              document.querySelector('html').classList.add('fltriggered');
              return;
            }
            if(krollFlag && (pathName !== undefined)) {
              $('body').prepend('<!-- \n\
              Start of Floodlight Tag: Please do not remove \n\
              Activity name of this tag: DandP_kroll_Leaf Page View \n\
              URL of the webpage where the tag is expected to be placed: https://www.kroll.com/ \n\
              This tag must be placed between the <body> and </body> tags, as close as possible to the opening tag. \n\
              Creation Date: 07/24/2019 \n\
              --> \n\
              <script type="text/javascript" id="DoubleClickFloodlightTag8699912"> \n\
              //<![CDATA[ \n\
              var axel = Math.random() + ""; \n\
              var a = axel * 10000000000000; \n\
              var newIFrame=document.createElement("iframe"); \n\
              newIFrame.src="https://3483970.fls.doubleclick.net/activityi;src=3483970;type=pgv;cat=dnp001;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;ord=" + a + "?"; \n\
              newIFrame.width="1"; \n\
              newIFrame.frameBorder="0"; \n\
              newIFrame.height="1"; \n\
              newIFrame.style.display = "none" \n\
              var scriptNode=document.getElementById("DoubleClickFloodlightTag8699912"); \n\
              scriptNode.parentNode.insertBefore(newIFrame,scriptNode); \n\
              //]]> \n\
              </script> \n\
              <noscript> \n\
              <iframe src="https://3483970.fls.doubleclick.net/activityi;src=3483970;type=pgv;cat=dnp001;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;ord=1?" width="1" height="1" frameborder="0" style="display:none"></iframe> \n\
              </noscript> \n\
              <!-- End of Floodlight Tag: Please do not remove -->')
              document.querySelector('html').classList.add('fltriggered');
              return;
            }
          }

          function dockCookieInFooterOntrust () {
            $('.Footer-main').css({'margin-bottom': parseInt($('#onetrust-banner-sdk').height())})
          }
          function unDockCookieInOntrust () {
           
            $('.Footer-main').css({'margin-bottom': 0});
            
          }

          function setCookie () {
            var date = new Date()
            date.setTime(date.getTime() + COOKIE_TIMEOUT)
            document.cookie = COOKIE_NAME + '=true;expires=' + date.toGMTString() + '; Secure; path=/'
          }

          function addListenerForLeadScore () {
              $('[data-lead-score]').each(function(index, element) {
                  var eventId = $(element).attr('data-lead-score');
                  if (eventId) {
                      eventId = eventId.replace('{', '').replace('}','')
                    $(element).on('click', {eventId: eventId}, sendLeadScore)
                  }
              })
          }

          function addEloquaListenerForLeadScore (textStatus, form) {
            if(textStatus === 'success') {
                var eventElement = $(form).find('[data-lead-score-form]');
                var eventId = $(eventElement).attr('data-lead-score-form');
                if (eventId) {
                    eventId = eventId.replace('{', '').replace('}','')
                    sendLeadScore({data: {
                        eventId: eventId
                    }});
                } 
            }
          }


            function sendLeadScore(event) {
                $.ajax({
                    type: "GET",
                    url: "?sc_trk="+event.data.eventId,
                    
                    success: function (response) {
                      
                    },
                    failure: function (response) {
                         console.log(response)
                    },
                   error: function (err) {
                        console.log(err)
                    }
                });
          }

function UpdateQueryString(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null) {
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        } 
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) {
                url += '#' + hash[1];
            }
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) {
                url += '#' + hash[1];
            }
            return url;
        }
        else {
            return url;
        }
    }
}