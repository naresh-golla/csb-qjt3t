/**
 * Function geting attrigutes from element
 */
(function ($) {

    getUrlQS = function (q, url) {
        var vars = [], hash;

        if (typeof url == 'undefined') {

            var url = window.location.href;

        }

        var hashes = url.slice(url.indexOf('?') + 1).split('&');

        for (var i = 0; i < hashes.length; i++) {

            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];

        }

        var qs = (typeof vars[q] !== 'undefined') ? decodeURIComponent(vars[q]) : '';

        return qs;

    }

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (searchString, position) {
            position = position || 0;
            return this.substr(position, searchString.length) === searchString;
        };
    }

    $.fn.attrs = function (attrs) {
        var t = $(this);
        if (attrs) {

            // Set attributes
            t.each(function (i, e) {
                var j = $(e);
                for (var attr in attrs) {
                    j.attr(attr, attrs[attr]);
                }
            });

            return t;

        } else {

            // Get attributes
            var a = {},
                    r = t.get(0);
            if (r) {
                r = r.attributes;
                for (var i in r) {
                    var p = r[i];

                    if (p !== null && typeof p.nodeValue !== 'undefined')
                        a[p.nodeName] = p.nodeValue;
                }
            }

            return a;

        }
    };

})(jQuery);


window.guid = '';
var timerId = null, timeout = 5;
function WaitUntilCustomerGUIDIsRetrieved() {

    if (!!(timerId)) {
        if (timeout == 0) {
            return;
        }
        if (typeof this.GetElqCustomerGUID === 'function') {
            //console.log(GetElqCustomerGUID());
            window.guid = GetElqCustomerGUID();
            return;
        }
        timeout -= 1;
    }
    timerId = setTimeout("WaitUntilCustomerGUIDIsRetrieved()", 500);
    return;
}

WaitUntilCustomerGUIDIsRetrieved();


var DEBUG_MODE_ON = getUrlQS('DEBUG_MODE_ON') || false; /* debug mode on/off */
/* disable console log in production */
if (!DEBUG_MODE_ON) {
    console = console || {};
    console.log = function () { };
}

/*! jQuery gatedForm Plugin - v1.0 - 08/25/2016 */
/* lid = '' */
(function ($) {


    $.expr[":"].contains = $.expr.createPseudo(function (arg) {
        return function (elem) {
            return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
        };
    });

    $.gatedForm = function (options) {

        /* required actions in elq-form */
        $('.elq-form').find('input,select').each(function () {

            var $form = $('.elq-form');
            var val = $(this).val();
            var id = $(this).attr('id');
            var $label = $form.find('label[for=' + id + ']');
            var required = $label.find('span').text().replace(/ /g, '');

            /* add required to field if label contains {*} */
            if (required.indexOf('*') !== -1) {
                console.log($(this))
                $(this).prop('required', true);
            }

            /* clear all elq field merges*/
            if (val.substring(0, 7) == "<eloqua") {
                $(this).val('');
            }

        });

        var _video = false;
        var geted = true; /* know {false} / unknow {true} */
        var form;
        var linkOptions = {}; /* object for .elq-gated-asset options extend */
        var thisOption = {}; /* object for .elq-gated-asset options */

        /* form settings */
        var settings = $.extend(true, {
            elqFormName: 'asset',
            elqSiteId: '615419487',
            elqClientId: '615419487',
            jQueryValidate: true,
            lookupID: '4051014b-d3f7-45a7-b1de-8e8cb8060219',
            visitorLookup: 'fdf4d6ab-228c-4a2a-9a93-2f37d267600b',
            cssLID: '43620',
            'elq-asset-formcnt': '[class^="wistia_embed"]',
            hiddenFields: {
                elqFormName: '',
                elqSiteId: '',
                documentURL: '',
                formTargetTab: '',
                elqCustomerGUI: window.guid,
                know: '',
                locationHref: location.href
            },
            formFields: {
                firstName: {
                    name: 'firstName',
                    required: true,
                    type: 'text',
                    label: 'First Name',
                    value: '',
                    id: ''
                },
                lastName: {
                    name: 'lastName',
                    required: true,
                    type: 'text',
                    label: 'Last Name',
                    value: '',
                    id: ''
                },
                company: {
                    name: 'company',
                    required: true,
                    type: 'text',
                    label: 'Company',
                    value: '',
                    id: ''
                },
                emailAddress: {
                    name: 'emailAddress',
                    required: true,
                    type: 'email',
                    label: 'Email Address',
                    value: '',
                    id: ''
                }
            },
            popupHTML: '<div class="header"><h2 style="font-size:20px !important;">Please complete the form  to view the asset.</h2><small><i><strong class="ra">*</strong>All fields required.</i></small></div>',
            fornHTML: '<div class="header"><h2 style="font-size:20px !important;">Please complete the form to view the video.</h2><small><i><strong class="ra">*</strong>All fields required.</i></small></div>'
        }, options);

        settings.hiddenFields.elqFormName = settings.elqFormName;
        settings.hiddenFields.elqSiteId = settings.elqSiteId;
        $('<link href="//img04.en25.com/Web/DuffPhelps/{22630e08-f76e-4caa-aa76-bc05a15410dc}_style.css" rel="stylesheet" type="text/css"/>').appendTo('head');

        /**
         * Function creating form from settings fields
         *
         * @return {HTMLElement}
         */
        var createForm = function () {

            console.log('/* create form */');

            /*clear form container*/
            $('#gatedForm').html('');

            /* creating hiddenframe for form */
            $('<div class="hidden" id="gatedForm"><iframe class="hidden" name="hiddenframe" id="hiddenframe" frameborder="0" style="display:none;" height="0" width="0"></iframe></div>').appendTo('body');

            /* creating form*/
            form = $('<form method="post" id="' + settings.elqFormName + '" action="https://s' + settings.elqClientId + '.t.eloqua.com/e/f2" class="hidden elq-form">');

            /* adding hidden fields */
            $.each(settings.hiddenFields, function (key, value) {
                if (key.substring(0, 5) == "_Utm_") {
                    value = getUrlQS(key);
                }
                var field = $('<input type="hidden" name="' + key + '" value="' + value + '">');
                $(field).appendTo(form);
            });


            /* adding form fields fields */
            $.each(settings.formFields, function (key, value) {


                var fieldWrap = $('<div class="form-group"></div>');
                var label = $('<label></label>');

                $(label).attr('for', ((typeof settings.formFields[key].id != 'undefined' && settings.formFields[key].id.lenght > 0) ? settings.formFields[key].id : "field-" + settings.formFields[key].name));
                if (typeof settings.formFields[key].type == 'undefined' || settings.formFields[key].type != 'checkbox') {

                    $(label).appendTo(fieldWrap);

                }

                var field = $('<input class="form-control">');
                if ((typeof settings.formFields[key].type != 'undefined' && settings.formFields[key].type == 'select')) {

                    field = $('<select class="form-control"></select>');

                }


                $(field).appendTo(fieldWrap);

                if (typeof settings.formFields[key].type != 'undefined' && settings.formFields[key].type == 'checkbox') {

                    $(label).appendTo(fieldWrap);

                }

                /* adding form firelds attributes */
                $.each(settings.formFields[key], function (key2, value2) {

                    $(label).text(settings.formFields[key].label);

                    if (typeof settings.formFields[key].required != 'undefined' && settings.formFields[key].required == true) {

                        $(label).append('<span class="ra">*</span>');

                    }

                    if (typeof settings.formFields[key].label == 'undefined') {

                        $(label).text(settings.formFields[key].name);

                    }
                    if (typeof settings.formFields[key].type != 'undefined' && settings.formFields[key].type != 'select') {

                        field.attr(key2, value2);

                    } else {
                        field.html(settings.formFields[key].options);
                    }


                    if (typeof settings.formFields[key].type == 'undefined') {

                        field.attr('type', 'text');

                    } else {

                        if (settings.formFields[key].type == 'checkbox') {
                            field.addClass('field-check');
                        }

                    }

                });
                field.attr('name', settings.formFields[key].name).attr('id', ((typeof settings.formFields[key].id != 'undefined' && settings.formFields[key].id.lenght > 0) ? settings.formFields[key].id : "field-" + settings.formFields[key].name))
                $(fieldWrap).appendTo(form);


            });

            $('<div class="form-group submit-form-wrapper"><input class="btn" type="submit" value="Submit"></div>').appendTo(form);


            return form;
        };

        /* call createForm*/
        createForm();

        /**
         * Function creating object from {HTMLElement} custom attributes which begins with {elq-asset}
         *
         * @param {HTMLElement} link The link that was clicked
         */
        var createLinkParams = function (elem) {

            console.log('/*createLinkParams*/');

            linkOptions = {};
            //console.log(createForm()[0].outerHTML);

            thisOption = {};
            var attrs = elem.attrs();
            console.log(attrs);

            /* creating elem options object*/
            $.each(attrs, function (i, a) {

                if (i.substring(0, 9) == 'elq-asset' || i == 'target' || i == 'href') {
                    thisOption[i.toLowerCase()] = a;
                }

            });

            console.log(thisOption);
            console.log(typeof attrs.href != 'undefined');
            if (typeof attrs.href != 'undefined') {
                console.log(attrs.href);
                var pat = /^https?:\/\//i;
                var pat2 = /^http?:\/\//i;
                if (pat.test(attrs.href) || pat2.test(attrs.href)) {
                    console.log('/* url is relative*/');
                    var url = attrs.href;

                } else {
                    console.log('/* url is static*/');
                    var url = location.hostname + attrs.href;
                }
            } else {
                elem.attr('href');
            }
            console.log(url);
            /* cresate default link options*/
            linkOptions = $.extend(true, {
                'elq-asset-formname': settings.elqFormName,
                'elq-asset-formcnt': settings['elq-asset-formcnt'],
                'elq-asset-url': elem.data('href'),
                'elq-asset-source': '',
                'elq-asset-id': '',
                'target': '_blank'

            }, thisOption);
            console.log(linkOptions);
        };


        /**
         * Function checking if link has target blank
         *
         * @param {objcec}
         * @param {HTML5 element}
         * @param {object}
         * @param {HTML5 element}
         */
        function checkTarget(e, elem, linkOptions, f) {
            var Newform = (typeof f != 'undefined' ? f : form);
            if (linkOptions.target == '_blank') {

                /* set attr href from linkOptions*/
                elem.attr('href', linkOptions['elq-asset-url']);
                elem.attr('target', '_blank');

                /* send form to hiddenframe*/
                console.log("/* send form to hiddenframe*/");
                $(Newform).attr('target', 'hiddenframe');

            } else {

                /* prevent redirect */
                console.log("/* prevent redirect*/");
                e.preventDefault();

            }
        }


        /**
         * Function checking if form fields value is defined
         *
         * $param {bolean} form return true/false
         */
        function checkGated() {

            var lengthTest = false;

            if ($(linkOptions['elq-asset-formcnt']).find('form').length > 0) {

                $(linkOptions['elq-asset-formcnt']).find('form').find('input[type=text]:not([disabled]), input[type=email]:not([disabled]), select:not([disabled])').each(function () {

                    if ($(this).val().length == 0) {

                        lengthTest = true;
                        console.log($(this).attr('name'));
                        console.log('*/lengtgh test true linkOptions*/');

                        return false;

                    }

                });

            } else {

                $(form).find('input[type=text]:not([disabled]), input[type=email]:not([disabled]), select:not([disabled])').each(function () {

                    if ($(this).val().length == 0) {

                        lengthTest = true;
                        console.log($(this).attr('name'));
                        console.log('*/lengtgh test true form*/');

                        return false;

                    }

                });
            }

            return lengthTest;

        }

        var links = [];
        function getGatedLink(string) {
            var strLength = string.length;
            links = [];
            $('a:link').each(function () {
                var url = $(this).attr('href');
                if (url.slice(-strLength) == string) {
                    console.log($(this).attr('href'));
                    links.push($(this));
                    console.log(links);
                }

            });
        }

        /**
         * Function adding action to each {.elq-gated-asset} elements
         */
        var addAction = function () {

            console.log('* add action *');


            return $('.wistia_embed, div[class^="wistia_embed"] > div, a[href*=".pdf"]').each(function (i) {
                var counter = 0;
                $(this).attr('id', 'gated-element-' + i);

                console.log($(this));
                /* update {linkOptions} object */
                createLinkParams($(this));

                console.log("gated: " + geted);

                geted = checkGated();
                console.log("gated: " + geted);

                if (geted == false) {

                    console.log('/*know*/');

                    /* if know */

                    if ($(this).hasClass('wistia_embed') || $(this).is(':contains("wistia_embed")')) {

                        /*wistiaEmbed.bind("play", function(e) {
                         onClick(e)
                         });*/

                        console.log('/*this is wistia*/');
                        $(this).wrap('<div class="overlayIframe" style="position: relative"></div>');
                        $(this).parent().append('<div class="overlayElem" style="position: absolute;top: 0;left:0;right:0;bottom:0;"></div>');
                        $('.overlayElem').on('click', function (e) {
                            console.log($(this));
                            _video = true;
                            if ($(this).closest('[class^="wistia_embed"]').length > 0 || $(this).hasClass('wistia_embed') || $(this).is(':contains("wistia_embed")') || $(this).hasClass('overlayElem')) {

                                console.log('/*wistia_embed*/');
                                _video = true;

                            }
                            $('.overlayElem').hide();
                            $(".wistia_embed")[0].src += "?autoplay=1";



                            createLinkParams($(this));
                            checkTarget(e, $(this), linkOptions);

                            if ($(linkOptions['elq-asset-formcnt']).find('form').length == 0) {

                                /* if form container is defined and form is undefined */

                                console.log('if form container is defined and form is undefined');
                                $(form).appendTo('#gatedForm');
                                sendHiddenForm(linkOptions);

                            } else {

                                /* if form container is defined and form is inside */

                                console.log('if form container is defined and form is inside');
                                console.log(thisOption);

                                if (typeof thisOption['elq-asset-formname'] == 'undefined' || thisOption['elq-asset-formname'].length == 0) {

                                    /* if elq form name is undefined  */

                                    var $thisForm = $(linkOptions['elq-asset-formcnt']).find('form');

                                    console.log('if elq form name is undefined');

                                    /* checking if tarhet is blank*/
                                    checkTarget(e, $(this), linkOptions, $thisForm);

                                    /*settings hidden fields from {linkOptions}*/
                                    setHiddenField($thisForm, linkOptions, false);

                                    $thisForm.submit();


                                } else if (typeof thisOption['elq-asset-formname'] != 'undefined' || thisOption['elq-asset-formname'].length > 0) {

                                    /* if elq form name is defined  */

                                    console.log('if elq form name is defined');
                                    var $thisForm = $(linkOptions['elq-asset-formcnt']).find('form');
                                    var $elqFormName = $thisForm.find('input[name=elqFormName]');

                                    if ($elqFormName.length == 0) {

                                        var $elgFormNameInput = $('<inut type="hidden" name="elqFormName">');
                                        $thisForm.prepend($elgFormNameInput);
                                    }

                                    /* set {elqFormName} value from {linkOptions} objects */
                                    $elqFormName.val(linkOptions['elq-asset-formname']);


                                    /* checking if tarhet is blank*/
                                    checkTarget(e, $(this), linkOptions, $thisForm);

                                    /*settings hidden fields from {linkOptions}*/
                                    setHiddenField($thisForm, linkOptions, false);

                                    $thisForm.submit();

                                }

                            }
                        });


                    } else {

                        if ($(this).is('a')) {

                            var query = window.location.search.startsWith('?') ? '&' : '?';
                            var href = $(this).attr('href');
                            var id = $(this).attr('id').replace('gated-element-', '');
                            $(this).attr('href', query + 'showForm=true&id=' + id).data('href', href);
                            console.log($(this).attr('href'));

                        }

                        console.log('/*gated element is link*/');

                        $(this).on('click', function (e) {

                            console.log($(this));

                            if ($(this).closest('[class^="wistia_embed"]').length > 0 || $(this).hasClass('wistia_embed') || $(this).is(':contains("wistia_embed")') || $(this).hasClass('overlayElem')) {

                                console.log('/*wistia_embed*/');
                                _video = true;


                            }


                            createLinkParams($(this));
                            checkTarget(e, $(this), linkOptions);

                            if ($(linkOptions['elq-asset-formcnt']).find('form').length == 0) {

                                /* if form container is defined and form is undefined */
                                console.log('if form container is defined and form is undefined');
                                $(form).appendTo('#gatedForm');

                                /* checking if tarhet is blank*/
                                checkTarget(e, $(this), linkOptions, form);

                                sendHiddenForm(linkOptions);

                            } else {

                                /* if form container is defined and form is inside */

                                console.log('if form container is defined and form is inside');
                                console.log(thisOption);

                                if (typeof thisOption['elq-asset-formname'] == 'undefined' || thisOption['elq-asset-formname'].length == 0) {

                                    /* if elq form name is undefined  */

                                    var $thisForm = $(linkOptions['elq-asset-formcnt']).find('form');

                                    console.log('if elq form name is undefined');

                                    /* checking if tarhet is blank*/
                                    checkTarget(e, $(this), linkOptions, $thisForm);

                                    /*settings hidden fields from {linkOptions}*/
                                    setHiddenField($thisForm, linkOptions, false);

                                    $thisForm.submit();


                                } else if (typeof thisOption['elq-asset-formname'] != 'undefined' || thisOption['elq-asset-formname'].length > 0) {

                                    /* if elq form name is defined  */

                                    console.log('if elq form name is defined');
                                    var $thisForm = $(linkOptions['elq-asset-formcnt']).find('form');
                                    var $elqFormName = $thisForm.find('input[name=elqFormName]');

                                    if ($elqFormName.length == 0) {

                                        var $elgFormNameInput = $('<inut type="hidden" name="elqFormName">');
                                        $thisForm.prepend($elgFormNameInput);
                                    }

                                    /* set {elqFormName} value from {linkOptions} objects */
                                    $elqFormName.val(linkOptions['elq-asset-formname']);


                                    /* checking if tarhet is blank*/
                                    checkTarget(e, $(this), linkOptions, $thisForm);

                                    /*settings hidden fields from {linkOptions}*/
                                    setHiddenField($thisForm, linkOptions, false);

                                    $thisForm.submit();

                                }

                            }

                        });

                    }

                } else {

                    if ($(this).is('a')) {

                        var href = $(this).attr('href');
                        var query = window.location.search.startsWith('?') ? '&' : '?';
                        var id = $(this).attr('id').replace('gated-element-', '');
                        $(this).attr('href', query + 'showForm=true&id=' + id).data('href', href);
                        console.log($(this).attr('href'));

                    }

                    $(this).bind('contextmenu', function (e) {

                        if (!window.location.search.startsWith('?') && $(this).attr('href').startsWith('&')) {

                            $(this).attr('href', $(this).attr('href').replace(/^\&/, "?"));
                        }

                    });

                    console.log('append & show form');

                    if ($(this).closest('[class^="wistia_embed"]').length > 0 || $(this).hasClass('wistia_embed') || $(this).is(':contains("wistia_embed")') || $(this).hasClass('overlayElem')) {

                        console.log('/*wistia_embed*/');

                        $(this).wrap('<div class="overlayIframe" style="position: relative"></div>');
                        $(this).parent().append('<div class="overlayElem" style="position: absolute;top: 0;left:0;right:0;bottom:0;"></div>');
                        $('.overlayElem').on('click', function (e) {
                            _video = true;
                            $(form).attr('target', 'hiddenframe');
                            actionIfUnknow();
                        });

                        //$(this).hide();




                    } else {

                        _video = false;
                        $(this).mousedown(function (e) {

                            if (!window.location.search.startsWith('?') && $(this).attr('href').startsWith('&')) {

                                $(this).attr('href', $(this).attr('href').replace(/^\&/, "?"));
                            }

                        });

                        $(this).on('click', function (e) {

                            console.log('/*this is link*/');

                            /* update {linkOptions} object */
                            createLinkParams($(this));
                            actionIfUnknow();

                            e.preventDefault();

                        });


                        if (getUrlQS('showForm') == 'true' && counter == 0) {

                            var id = getUrlQS("id")
                            console.log($('#gated-element-' + id));

                            createLinkParams($('#gated-element-' + id));
                            actionIfUnknow();

                            counter++;
                        }

                    }

                    function actionIfUnknow() {

                        console.log('/*actionIfUnknow*/');

                        if ($(linkOptions['elq-asset-formcnt']).find('form').length == 0) {

                            /* if form container is defined and form is undefined */

                            console.log('if form container is defined and form is undefined');
                            var $thisForm = $(linkOptions['elq-asset-formcnt']).find('form');
                            /* setting attr {for} in {checkbox + label}*/
                            //arsewLabelWithCheckbox($thisForm);



                            showForm(linkOptions);


                        } else {

                            var $thisForm = $(linkOptions['elq-asset-formcnt']).find('form');

                            /* setting attr {for} in {checkbox + label}*/
                            //parsewLabelWithCheckbox($thisForm);

                            /* if form container is defined and form is inside */

                            console.log('if form container is defined and form is inside');
                            console.log(thisOption);

                            if (typeof thisOption['elq-asset-formname'] == 'undefined' || thisOption['elq-asset-formname'].length == 0) {

                                /* if elq form name is undefined  */

                                console.log('if elq form name is undefined');

                                /* show form and update require hidden inputs value from {linkoptions}*/
                                showForm(linkOptions, $thisForm);



                            } else if (typeof thisOption['elq-asset-formname'] != 'undefined' || thisOption['elq-asset-formname'].length > 0) {

                                /* if elq form name is defined  */

                                console.log('if elq form name is defined');

                                /* show form and update require hidden inputs value from {linkoptions}*/
                                showForm(linkOptions, $thisForm, true);

                            }

                        }

                    }


                }

                /*  set on/off value if checkbox is {:checked}/{:unchecked} */
                $(linkOptions['elq-asset-formcnt']).find('form').find('input[type=checkbox]').on('change', function () {
                    if ($(this).is(':checked')) {
                        $(this).val('on');
                    } else {
                        $(this).val('');
                    }
                });

            });


        };

        /* call addAction*/
        //addAction();


        /**
         * Function appending form to container
         *
         * @param {Object}
         * $param {HTML elemnt}
         * $param {Bolean}
         */
        function showForm(linkOptions, f, elgFormName) {

            console.log(linkOptions);
            /* checking if form is transmitted from the parameter {f} */
            var Newform = (typeof f != 'undefined' ? f : form);

            if (window.isBlocked == true) {
                $(Newform).attr('target', 'hiddenframe');
                $(Newform).attr('action', 'https://img04.en25.com/e/f2');

            }
            if (typeof f == 'undefined') {

                if (linkOptions['elq-asset-formcnt'] == '.form-process' && $('.form-process').length == 0) {

                    $("<div class='form-process' id='elqGatedForm'></div>").appendTo('#wrapper .inside');
                    $(Newform).appendTo(linkOptions['elq-asset-formcnt']).fadeIn();


                } else {

                    /* if gated elem is video*/

                    console.log('/* if gated elem is video*/');

                    if (_video == true) {

                        console.log('_video is true');
                        console.log(linkOptions['elq-asset-formcnt']);
                        console.log($(linkOptions['elq-asset-formcnt']).attr("type"));

                        if ($(linkOptions['elq-asset-formcnt']).find('.header').length == '0') {

                            console.log('/*if header is emptu*/')
                            $(settings.fornHTML).appendTo(linkOptions['elq-asset-formcnt']);
                            $(settings.fornHTML).appendTo('#gatedForm')

                        }

                        if ($(linkOptions['elq-asset-formcnt']).is("iframe")) {

                            console.log('/* elq-asset-formcnt is iframe*/')

                            $(Newform).appendTo($(linkOptions['elq-asset-formcnt']).parent()).fadeIn();

                            $.magnificPopup.open({
                                items: {
                                    src: '#gatedForm', // can be a HTML string, jQuery object, or CSS selector
                                    type: 'inline'
                                },
                                callbacks: {
                                    open: function () {

                                        var src = $('input[name="documentURL"]').val();

                                        if (src.startsWith('//')) {

                                            src = window.location.protocol + src;
                                            $('input[name="documentURL"]').val(src);

                                        }

                                        $(Newform).appendTo('#gatedForm').fadeIn();
                                        $('#gatedForm').removeClass('hidden').fadeIn();

                                    },
                                    close: function () {

                                        $('#gatedForm').fadeOut();
                                        var validator = $(form).validate();
                                        validator.resetForm();

                                    }

                                }
                            });

                        } else {

                            $(Newform).appendTo(linkOptions['elq-asset-formcnt']).fadeIn();

                        }





                    } else {

                        if ($('#gatedForm').find('.header').length == '0') {

                            $(settings.popupHTML).appendTo('#gatedForm');

                        }

                        $(Newform).appendTo('#gatedForm').fadeIn();

                        /*show popup*/
                        $.magnificPopup.open({
                            items: {
                                src: '#gatedForm', // can be a HTML string, jQuery object, or CSS selector
                                type: 'inline'
                            },
                            callbacks: {
                                open: function () {
                                    $('#gatedForm').fadeIn();
                                },
                                close: function () {
                                    $('#gatedForm').fadeOut();
                                    validator.resetForm();
                                    if (window.location.href.indexOf('?') > -1) {
                                        history.pushState('', document.title, window.location.pathname);
                                    }
                                }

                            }
                        });

                    }

                }

            } else {

                $(Newform).fadeIn();

            }

            if ((typeof elgFormName != 'undefined' && elgFormName) || typeof f == 'undefined') {

                var $elqFormName = $(Newform).find('input[name="elqFormName"]');

                if ($elqFormName.length == 0) {

                    $(Newform).prepend('<input type="hidden" name="elqFormName">');

                }

                $(Newform).find('input[name="elqFormName"]').val(linkOptions['elq-asset-formname']);

            }

            /* settings hidden field from {linkOptions}*/
            setHiddenField(Newform, linkOptions);


            /* add jquery validation*/
            addValidation(Newform);

            $(Newform).find('.checkbox').on('click', function () {
                var $input = $(this).find('input[type=checkbox]');
                if ($input.is(':checked')) {
                    $input.val('on');
                } else {
                    $input.val('');
                }
            });

            /* enabled submit button */
            $(Newform).find('input[type=submit]').prop( "disabled", false );

            $('input[type=submit]').closest('.sc-view').css('width', '100%');
            $('html, body').animate({
                scrollTop: $(Newform).offset().top - 140
            }, 500);


            return false;

        }
        ;


        /**
         * Function adding jquery.validate to selected element
         *
         * @param {HTML element}
         */
        var validator;
        function addValidation(f) {
            var form = f;
            validator = $(form).validate({
                highlight: function (element) {
                    $(element).parent().addClass("field-error");
                    $(element).addClass("error");
                },
                unhighlight: function (element) {
                    $(element).parent().removeClass("field-error");
                    $(element).removeClass("error");
                    $(element).siblings('label.error').remove();
                    console.log($(element));
                },
                submitHandler: function (form) {
                    $('input[name="elqCustomerGUID"]').val(window.guid);
                    var src = $(form).find('input[name="documentURL"]').val();

                    if (src.startsWith('//')) {

                        src = window.location.protocol + src;
                        $(Newform).find('input[name="documentURL"]').val(src);

                    }
                    if (_video == true) {
                        console.log('popup close')
                        $(form).siblings('div').fadeIn();
                        $(form).siblings('iframe').fadeIn();
                        //$(form).hide();
                        $.magnificPopup.close();
                        $('.overlayElem').hide();
                        $(".wistia_embed")[0].src += "?autoplay=1";
                    }

                    $('[name=know]').val(!geted);
                    $('[name=locationHref]').val(location.href);
                    if (window.isBlocked == true && _video != true) {
                        $.magnificPopup.close();
                        var win = window.open(linkOptions['elq-asset-url'], '_blank');
                        win.focus();
                    }

                    form.submit();


                },
                errorPlacement: function (error, element) {

                    if (element.attr("type") == "checkbox") {

                        error.insertAfter($(element).parents('label'));

                    } else {

                        error.insertAfter($(element));
                    }

                }

            });

        }

        /**
         * Function set hidden field
         *
         * @param {HTML elemnt}
         * @param {Object}
         * @param {bolen}
         */
        function setHiddenField(f, linkOptions, blank) {

            console.log('/*setHiddenField*/');

            var Newform = (typeof f != 'undefined' ? f : form);

            console.log(Newform);
            console.log(linkOptions);

            var $documentURL = $(Newform).find('input[name="documentURL"]');
            var $formTargetTab = $(Newform).find('input[name="formTargetTab"]');
            var $elqCustomerGUID = $(Newform).find('input[name="elqCustomerGUID"]');

            if ($elqCustomerGUID.length == 0) {

                $(Newform).prepend('<input type="hidden" name="elqCustomerGUID">');

            }

            if ($documentURL.length == 0) {

                $(Newform).prepend('<input type="hidden" name="documentURL">');

            }

            if ($formTargetTab.length == 0) {

                $(Newform).prepend('<input type="hidden" name="formTargetTab">');

            }

            /* create hidden field for utm */
            if (window.location.search.length > 0) {

                var query = window.location.search.substring(1);
                var vars = query.split("&");

                for (var i in vars) {

                    if (vars[i].startsWith("_Utm_")) {

                        var name = vars[i].substring(0, vars[i].indexOf("="));


                        if ($(Newform).find('input[name="' + name + '"]').length == 0) {

                            //console.log( /* append new hidden  field with utm nama & value*/);

                            /* append new hidden  field with utm nama & value*/
                            $(Newform).prepend('<input type="hidden" name="' + name + '" value="' + getUrlQS(name) + '">');

                        } else {

                            //console.log( /* append  value to exist hidden field*/);

                            /* append  value to exist hidden field*/
                            $(Newform).find('input[name="' + name + '"]').val(getUrlQS(name));
                        }


                    }

                }

            }

            if (typeof blank == 'undefined' && blank == true) {

                $(Newform).find('input[name="formTargetTab"]').val('');

            }

            if (_video == false) {
                var protocol = location.protocol;
                var host = location.hostname;
                var url = linkOptions['elq-asset-url'];
                console.log(url);

                if (url) {
                    if (!(url.startsWith('http://') || url.startsWith('https://'))) {

                        $(Newform).find('input[name="documentURL"]').val(protocol + '//' + host + linkOptions['elq-asset-url']);

                    } else {

                        $(Newform).find('input[name="documentURL"]').val(linkOptions['elq-asset-url']);

                    }
                }

            } else {

                var src = $('.overlayIframe').find('iframe').attr('src');

                if (src.startsWith('//')) {

                    src = window.location.protocol + src;

                }

                $(Newform).find('input[name="documentURL"]').val(src);

            }

            return {
                documentURL: $documentURL.val(),
                formTargetTab: $formTargetTab.val(),
                elqCustomerGUID: $elqCustomerGUID.val()


            }

        }
        ;


        /**
         * Function sending hiddenForm
         *
         * @param {Object}
         */
        var sendHiddenForm = function (linkOptions) {

            console.log('/*sendHiddenForm*/');

            var hiddenfields = setHiddenField(form, linkOptions);

            $('input[name="elqFormName"]').val(linkOptions['elq-asset-formname']);
            $('input[name="documentURL"]').val(hiddenfields.documentURL);
            $('input[name="formTargetTab"]').val(linkOptions.target);
            $('input[name=know]').val(!geted);
            $('input[name=locationHref]').val(location.href);
            $('input[name="elqCustomerGUID"]').val(window.guid);
            console.log($('.overlayIframe').find('iframe').attr('src'));
            if (_video) {
                $('input[name="documentURL"]').val($('.overlayIframe').find('iframe').attr('src'));
            }
            $('#' + settings.elqFormName).submit();

        };

        /**
         * Function ettings attr {for} in {checkbox + label}
         *
         * @param {HTML elemnt}
         */
        function parsewLabelWithCheckbox(e) {

            e.find('input[type=checkbox]').each(function () {

                var name = $(this).attr('name');
                var id = $(this).attr('id');

                if (typeof id == 'undefined') {

                    $(this).attr('id', name).addClass('field-check');
                    var forAttr = $(this).siblings('label').attr('for');

                    if (typeof forAttr == 'undefined') {

                        $(this).siblings('label').attr('for', name);

                    }

                }

            });

        }

        /**
         * Function lookup
         */
        var lookup = function () {

            _elqQ = window._elqQ || [];
            _elqQ.push(['elqSetSiteId', settings.elqSiteId]);
            _elqQ.push(['elqGetCustomerGUID']);

            (function () {
                function async_load() {

                    var s = document.createElement('script');
                    s.type = 'text/javascript';
                    s.async = true;
                    s.src = '//img04.en25.com/i/elqCfg.min.js';
                    var x = document.getElementsByTagName('script')[0];
                    x.parentNode.insertBefore(s, x);

                }



                if (window.addEventListener) {

                    window.addEventListener('DOMContentLoaded', async_load, false);

                } else if (window.attachEvent) {

                    window.attachEvent('onload', async_load);

                }

            })();

            function wdl(e) {



                console.log('/*wdl*/');

                window.GetElqContentPersonalizationValue = undefined;

                _elqQ.push(['elqSetSiteId', settings.elqSiteId]);
                vlookup({ DLKey: settings.lookupID, DLLookup: "<C_EmailAddress>" + e + "</C_EmailAddress>" }, function () {

                    if (typeof GetElqContentPersonalizationValue == "function") {

                        if (window.GetElqContentPersonalizationValue && (GetElqContentPersonalizationValue('C_EmailAddress').toLowerCase() === e.toLowerCase())) {

                            function UpperCaseFirstLetter(string) {
                                return string.charAt(0).toUpperCase() + string.slice(1);
                            }

                            createLinkParams($('.elq-gated-asset'));
                            console.log(linkOptions['elq-asset-formcnt']);
                            if ($(linkOptions['elq-asset-formcnt']).find('form').length > 0) {

                                $(linkOptions['elq-asset-formcnt']).find('form').find('input:not([type=hidden]):not([type=submit]):not([type=checkbox]), select:not([type=hidden])').each(function (key, value) {

                                    var k = $(this).attr('name');
                                    console.log(k);
                                    var field = GetElqContentPersonalizationValue(UpperCaseFirstLetter(k));
                                    if (k == 'accountName') {
                                        field = GetElqContentPersonalizationValue('Company');
                                    }
                                    if (k == 'company') {
                                        field = GetElqContentPersonalizationValue('Eloqua_Company1');
                                    }

                                    $(this).val(field);
                                });
                            }

                            $.each(settings.formFields, function (key, value) {

                                var field = GetElqContentPersonalizationValue(UpperCaseFirstLetter(key));
                                if (key == 'company') {
                                    field = GetElqContentPersonalizationValue('Eloqua_Company1');
                                }
                                settings.formFields[key].value = field;
                                if (field.length > 0) {
                                    $('input[name="' + settings.formFields[key].name + '"]').val(settings.formFields[key].value);

                                    $(form).find('input[name="' + settings.formFields[key].name + '"]').val(settings.formFields[key].value);
                                    //console.log($('input[name="' + key + '"]').val());
                                }

                            });


                            $.each(settings.hiddenFields, function (key, value) {

                                var field = GetElqContentPersonalizationValue(key);
                                //console.log(field)

                                if (typeof field != 'undefined' && field != '') {

                                    $('input[name="' + key + '"]').val(field);
                                    // console.log($('input[name="' + key + '"]').val());

                                }

                            });

                        }
                        console.log("known");
                        addAction();

                    } else {

                        console.log("unknown");
                        /* call addAction*/
                        addAction();

                    }

                });


            }


            function vlookup(options, callback) {

                console.log('/* vlookup */');

                if (typeof options == "undefined") {

                    options = {};

                }
                if (typeof callback == "undefined") {

                    var callback = function () { };

                }
                // defaults (emp id lookup)
                if (typeof options.pps == "undefined") {

                    options.pps = "50";

                }
                if (typeof options.DLKey == "undefined") {

                    options.DLKey = settings.visitorLookup;

                } // lookup
                if (typeof options.DLLookup == "undefined") {

                    options.DLLookup = "";

                } //
                var elqDt = new Date();
                options.ms = elqDt.getMilliseconds();
                if (typeof elqCurE == "undefined") {

                    var elqCurE = "//s" + settings.elqClientId + ".t.eloqua.com/visitor/v200/svrGP";

                    /*"http://images.duffandphelps.com/visitor/v200/svrGP";*/

                }

                options.siteid = settings.elqSiteId;

                var script = elqCurE + "?" + decodeURIComponent($.param(options));
                console.log("/* before get script */");
                elqScript = false;
                $.getScript(script, function () {

                    elqScript = true;
                    console.log("/* elq script load success*/");
                    gotElqScript = 1;
                    window.isBlocked = false;
                    callback();

                }).fail(function (jqxhr, settings, exception) {

                    console.log("/* elq script load failed*/");
                    window.isBlocked = true;
                    callback();

                });

                setTimeout(function () {

                    if (!elqScript) {
                        console.log("/* elq script load failed*/");
                        callback();
                        window.isBlocked = true;

                    }

                }, 3000);


                //                if(!elqScript) {
                //
                //                    console.log("/* elq script load failed*/");
                //                    callback();
                //
                //                }



            }

            function visitorLookup() {

                console.log("/* visitor lookup */");

                vlookup({}, function () {

                    if (typeof GetElqContentPersonalizationValue == "function") {

                        wdl(GetElqContentPersonalizationValue('V_ElqEmailAddress'));
                        //contactLookup(_e);
                        console.log("known");
                        window.isBlocked = false;

                    } else {

                        console.log("unknown");
                        /* call addAction*/
                        addAction();

                    }

                });

            }

            if (settings.visitorLookup.length > 0) {

                /*call visitorLookup*/
                visitorLookup();

            } else {

                console.log("/* visitor lookup disabled */");

                /* call addAction*/
                addAction();

            }

        };

        /*call lookup*/
        lookup();


        if (typeof options === 'undefined') {

            options = {};

        }

        if (settings.jQueryValidate) {

            if (typeof jQuery().validate == 'undefined' && typeof jQuery().validate != 'function') {

                /*appending jquery validate scripts*/
                console.log(/*appending jquery validate scripts*/);
                $.getScript("https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.15.1/jquery.validate.min.js");

            }

        }
        /*$('<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js"></script>').appendTo('head');*/
        if (typeof jQuery().magnificPopup == 'undefined' && typeof jQuery().magnificPopup != 'function') {

            $('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.min.css" />').appendTo('head');
            $.getScript("https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js");

        }
    };
}(jQuery));