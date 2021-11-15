
$(document).ready(function () {
    clearAll();

    var step = 0;
    $('#tab1').on('click', function (e) {
        e.preventDefault();
        currentTab = 0


        if (visitedTab > 0) {
            step = currentTab - visitedTab;
            nextPrev(step)
        }
    });

    $('#tab2').on('click', function (e) {
        e.preventDefault();
        currentTab = 1;
        if (visitedTab >= 1) {
            if (visitedTab > 0) {
                step = currentTab - visitedTab;
                nextPrev(step)
            }
        }
    });

    $('#tab3').on('click', function (e) {
        e.preventDefault();
        currentTab = 2;
        if (visitedTab >= 2) {
            if (visitedTab > 0) {
                step = currentTab - visitedTab;
                nextPrev(step)
            }
        }
    });

    $('#tab4').on('click', function (e) {
        e.preventDefault();
        currentTab = 3;
        if (visitedTab >= 3) {
            if (visitedTab > 0) {
                step = currentTab - visitedTab;
                nextPrev(step)
            }
        }
    });

    jQuery(function ($) {

        var locations = {
            'Americas': ['Anguilla:0', 'Antarctica:0', 'Antigua and Barbuda:0', 'Argentina:0', 'Aruba:0', 'Bahamas, The:0', 'Barbados:0', 'Belize:0', 'Bermuda:0', 'Bolivia:0', 'Brazil:0', 'Canada:0', 'Cayman Islands:0', 'Chile:0', 'Colombia:0', 'Costa Rica:0', 'Cuba:0', 'Curaçao:0', 'Dominica:0', 'Dominican Republic:0', 'Ecuador:0', 'El Salvador:0', 'Falkland Islands (Malvinas):0', 'French Guiana:0', 'Greenland:0', 'Grenada:0', 'Guadeloupe:0', 'Guatemala:0', 'Guyana:0', 'Haiti:0', 'Honduras:0', 'Jamaica:0', 'Martinique:0', 'Mexico:0', 'Montserrat:0', 'Nicaragua:0', 'Panama:0', 'Paraguay:0', 'Peru:0', 'Puerto Rico:0', 'Saint Kitts and Nevis:0', 'Saint Lucia:0', 'Saint Martin:0', 'Saint Pierre and Miquelon:0', 'Saint Vincent and the Grenadines:0', 'Saint-Barthelemy:0', 'South Georgia and South Sandwich Islands:0', 'Suriname:0', 'Trinidad and Tobago:0', 'Turks and Caicos Islands:0', 'Uruguay:0', 'USA:0', 'Venezuela:0', 'Virgin Islands:0', 'British:0', 'Virgin Islands:0', 'U.S.:0'],
            'East Asia / Oceania': ['American Samoa:0', 'Australia:0', 'Christmas Island:0', 'Cocos (Keeling) Islands:0', 'Cook Islands:0', 'Fiji:0', 'French Polynesia:0', 'Guam:0', 'Heard Island and McDonald Islands:0', 'Japan:0', 'Kiribati:0', 'Korea, North:0', 'Korea, South:0', 'Marshall Islands:0', 'Micronesia, Federated States of:0', 'Nauru:0', 'New Caledonia:0', 'New Zealand:0', 'Niue:0', 'Norfolk Island:0', 'Northern Mariana Islands:0', 'Palau:0', 'Papua New Guinea:0', 'Pitcairn Islands:0', 'Samoa:0', 'Solomon Islands:0', 'Tokelau:0', 'Tonga:0', 'Tuvalu:0', 'Vanuatu:0', 'Wallis and Futuna:0'],
            'Western and Central Europe': ['Aland Islands:0', 'Andorra:0', 'Austria:0', 'Belgium:0', 'Bouvet Island:0', 'British Indian Ocean Territory:0', 'Cyprus:0', 'Czech Republic:0', 'Denmark:0', 'Finland:0', 'France:0', 'Germany:0', 'Gibraltar:0', 'Greece:0', 'Guernsey:0', 'Holy See (Vatican City):0', 'Iceland:0', 'Ireland:0', 'Isle of Man:0', 'Italy:0', 'Jersey:0', 'Luxembourg:0', 'Monaco:0', 'Netherlands:0', 'Norway:0', 'Portugal:0', 'San Marino:0', 'Spain:0', 'Svalbard and Jan Mayen Islands:0', 'Sweden:0', 'Switzerland:0', 'United Kingdom:0'],
            'Eastern Europe / Central Asia / CIS': ['Afghanistan:0', 'Albania:0', 'Armenia:0', 'Azerbaijan:0', 'Belarus:0', 'Bosnia and Herzegovina:0', 'Bulgaria:0', 'Croatia:0', 'Estonia:0', 'Faroe Islands:0', 'Georgia:0', 'Hungary:0', 'Kazakhstan:0', 'Kyrgyzstan:0', 'Latvia:0', 'Liechtenstein:0', 'Lithuania:0', 'Macedonia:0', 'Malta:0', 'Moldova:0', 'Montenegro:0', 'Poland:0', 'Romania:0', 'Russia:0', 'Serbia:0', 'Slovakia:0', 'Slovenia:0', 'Tajikistan:0', 'Turkey:0', 'Turkmenistan:0', 'Ukraine:0', 'Uzbekistan:0'],
            'Middle East / North Africa': ['Algeria:0', 'Bahrain:0', 'Egypt:0', 'Iran:0', 'Iraq:0', 'Israel:0', 'Jordan:0', 'Kuwait:0', 'Lebanon:0', 'Libya:0', 'Morroco:0', 'Oman:2', 'Palestine:2', 'Qatar:2', 'Saudi Arabia:2', 'South Sudan:2', 'Sudan:2', 'Syria:2', 'Tunisia:2', 'United Arab Emirates:2', 'Western Sahara:2', 'Yemen:2'],
            'Sub-Saharan Africa': ['Angola:0', 'Benin:0', 'Botswana:0', 'Burkina Faso:0', 'Burundi:0', 'Cameroon:0', 'Cape Verde:0', 'Central African Republic:0', 'Chad:0', 'Comoros:0', 'Congo (Rep. of the Congo):0', 'Congo, Democratic Republic of the:0', 'Cote d Ivoire (Ivory Coast):0', 'Djibouti:0', 'Equatorial Guinea:0', 'Eritrea:0', 'Ethiopia:0', 'French Southern Territories:0', 'Gabon:0', 'Gambia, The:0', 'Ghana:0', 'Guinea:0', 'Guinea-Bissau:0', 'Kenya:0', 'Lesotho:0', 'Liberia:0', 'Madagascar:0', 'Malawi:0', 'Mali:0', 'Mauritania:0', 'Mauritius:0', 'Mayotte:0', 'Mozambique:0', 'Namibia:0', 'Niger:0', 'Nigeria:0', 'Reunion:0', 'Rwanda:0', 'Saint Helena:0', 'Sao Tome and Principe:0', 'Senegal:0', 'Seychelles:0', 'Sierra Leone:0', 'Somalia:0', 'South Africa:0', 'Swaziland:0', 'Tanzania:0', 'Togo:0', 'Uganda:0', 'Zambia:0', 'Zimbabwe:0'],
            'India': ['India:0'],
            'Greater China': ['China:0', 'Hong Kong:0', 'Macao:0', 'Mongolia:0', 'Taiwan:0'],
            'Southeast Asia': ['Bangladesh:0', 'Bhutan:0', 'Brunei:0', 'Cambodia:0', 'Indonesia:0', 'Laos:0', 'Malaysia:0', 'Maldives:0', 'Myanmar (ex-Burma):0', 'Nepal:0', 'Pakistan:0', 'Phillipines:0', 'Singapore:0', 'Sri Lanka (ex-Ceilan):0', 'Thailand:0', 'Timor Leste:0', 'Vietnam:0'],
        }

        var lcns = ['Anguilla:0', 'Antarctica:0', 'Antigua and Barbuda:0', 'Argentina:0', 'Aruba:0', 'Bahamas, The:0', 'Barbados:0', 'Belize:0', 'Bermuda:0', 'Bolivia:0', 'Brazil:0', 'Canada:0', 'Cayman Islands:0', 'Chile:0', 'Colombia:0', 'Costa Rica:0', 'Cuba:0', 'Curaçao:0', 'Dominica:0', 'Dominican Republic:0', 'Ecuador:0', 'El Salvador:0', 'Falkland Islands (Malvinas):0', 'French Guiana:0', 'Greenland:0', 'Grenada:0', 'Guadeloupe:0', 'Guatemala:0', 'Guyana:0', 'Haiti:0', 'Honduras:0', 'Jamaica:0', 'Martinique:0', 'Mexico:0', 'Montserrat:0', 'Nicaragua:0', 'Panama:0', 'Paraguay:0', 'Peru:0', 'Puerto Rico:0', 'Saint Kitts and Nevis:0', 'Saint Lucia:0', 'Saint Martin:0', 'Saint Pierre and Miquelon:0', 'Saint Vincent and the Grenadines:0', 'Saint-Barthelemy:0', 'South Georgia and South Sandwich Islands:0', 'Suriname:0', 'Trinidad and Tobago:0', 'Turks and Caicos Islands:0', 'Uruguay:0', 'USA:0', 'Venezuela:0', 'Virgin Islands:0', 'British:0', 'Virgin Islands:0', 'U.S.:0'];
        var $locations = $('#State');
        var html = $.map(lcns, function (lcn) {

            var optVal = lcn.split(':');
            return '<option value="' + optVal[1] + '">' + optVal[0] + '</option>'
        }).join('');
        $locations.html(html)




        $('#Region').on('change', function () {


            var country = $("#Region option:selected").text(), lcns = locations[country] || [];

            var html = $.map(lcns, function (lcn) {
                var optVal = lcn.split(':');

                return '<option value="' + optVal[1] + '">' + optVal[0] + '</option>'
            }).join('');
            $locations.html(html)
        });
    });





    //step 1
    $('input[type=radio][name=diligenceservices]').on('change', function () {

        sanitizeControl(this);
        saveResponse(1);
    });


    //step 2
    $('input[type=radio][name=screentype]').on('change', function () {
        sanitizeControl(this);
        saveResponse(2);
    });

    $('#Region').on('change', function () {
        sanitizeControl(this);
        saveResponse(2);

    });

    $('#State').on('change', function () {
        sanitizeControl(this);
        saveResponse(2);
    });

    $('input[type=radio][name=lawsuits]').on('change', function () {
        sanitizeControl(this);
        saveResponse(2);
    });

    $('input[type=radio][name=regulatedindustry]').on('change', function () {
        sanitizeControl(this);
        saveResponse(2);
    });

    //step 3
    $('input[type=radio][name=risklevel]').on('change', function () {
        sanitizeControl(this);
        saveResponse(3);
    });
    $('input[type=radio][name=financialrelationship]').on('change', function () {
        sanitizeControl(this);
        saveResponse(3);
    });
    $('input[type=radio][name=businessrelationship]').on('change', function () {
        sanitizeControl(this);
        saveResponse(3);
    });

    $('.button.nextBtn').on('click', function (e) {
        e.preventDefault();
        nextPrev(1);
    });

    $('.button.prevBtn').on('click', function (e) {
        e.preventDefault();
        nextPrev(-1);
    });

    $('.Due-Diligence-Form-send').on('click', function (e) {
        e.preventDefault();
        if (!document.querySelector('form#form767').reportValidity()) {            
            return false;
        }
        SendFormDataToEloqua();
    });

});

var visitedTab = 0; // Current tab is set to be the first tab (0)
var currentTab = 0; // Current tab is set to be the first tab (0)
var RFR = 0;
var PRR = 0;
var EPRR = 0;
var RR = 0;
var IDD = 0;

var responseList = [];
clearAll();

showTab(visitedTab); // Display the crurrent tab

function saveResponse(step) {


    var objResponse = new Object();
    if (step == 1) {
        objResponse.diligenceservices = $("input[name='diligenceservices']:checked").val();

        if (responseList.length >= step) {
            responseList[step - 1] = objResponse;
        }
        else {
            responseList.push(objResponse);
        }



    }
    if (step == 2) {
        objResponse.screentype = $("input[name='screentype']:checked").val();
        objResponse.Region = $("#Region").val();
        objResponse.State = $("#State").val();
        objResponse.lawsuits = $("input[name='lawsuits']:checked").val();
        objResponse.regulatedindustry = $("input[name='regulatedindustry']:checked").val();


        if (responseList.length >= step) {
            responseList[step - 1] = objResponse;
        }
        else {
            responseList.push(objResponse);
        }

    }

    if (step == 3) {
        objResponse.risklevel = $("input[name='risklevel']:checked").val();
        objResponse.financialrelationship = $("input[name='financialrelationship']:checked").val();
        objResponse.businessrelationship = $("input[name='businessrelationship']:checked").val();

        if (responseList.length >= step) {
            responseList[step - 1] = objResponse;
        }
        else {
            responseList.push(objResponse);
        }


    }
    updateProgressBar();
    enableDisableNextButton(step);
}

function updateProgressBar() {

    //toggleLoader();

    RFR = 0;
    PRR = 0;
    EPRR = 0;
    RR = 0;
    IDD = 0;

    $.each(responseList[0], function (index, item) {
        if (item == 1) {
            RFR += 13;
            PRR += 13;
        }
        else if (item == 2) {
            RFR += 13;
        }
        else if (item == 3) {
            RR += 13;
            RFR -= (RFR == 0 ? 0 : 13);
            PRR -= (PRR == 0 ? 0 : 13);
            EPRR -= (EPRR == 0 ? 0 : 13);
        }
        else if (item == 4) {
            RR += 13;
            EPRR += 13;
            PRR += 6.5; //changed from 13 to 6.5
        }
        else if (item == 5) {
            IDD += 100;//changed from 13 to 96

        }
        // do something with `item` (or `this` is also `item` if you like)
    });

    $.each(responseList[1], function (index, item) {


        if (item == 1) {

        }
        else if (item == 2) {
            RR += 13;
            PRR += 13;

        }
        else if (item == 3) {
            PRR += 13;
            EPRR += 13;
            RR += 13;
            RFR -= (RFR == 0 ? 0 : 13);
        }
        else if (item == 4) {
            RFR += 13;

        }
        //else if (item == 5) {
        //    IDD += 13;
        //}
        else if (item == 6) {
            PRR += 13;
            EPRR += 13;
            RR += 13;
            RFR -= (RFR == 0 ? 0 : 13);
        }
        else if (item == 7) {
            RFR += 13;
        }



        else if (item == 11) {

        }
        else if (item == 12) {


        }
        else if (item == 13) {
            RFR += 13;
            RR += 13;
            PRR -= (PRR == 0 ? 0 : 13);
        }
        else if (item == 14) {
            RR += 13;
            PRR -= (PRR == 0 ? 0 : 13);
        }
        else if (item == 15) {
            PRR -= (PRR == 0 ? 0 : 13);
            RR += 13;
            RFR -= (RFR == 0 ? 0 : 13);
        }
        else if (item == 16) {
            PRR += 13;
            RR += 13;

        }
        else if (item == 17) {
            RFR -= (RFR == 0 ? 0 : 13);
            RR += 6.5;
            PRR += 13
        }
        else if (item == 18) {
            PRR -= (PRR == 0 ? 0 : 13);
            RR += 13
        }
        else if (item == 19) {

        }



        // do something with `item` (or `this` is also `item` if you like)
    });
    $.each(responseList[2], function (index, item) {
        if (item == 1) {
            RFR += 13;
            PRR -= (PRR == 0 ? 0 : 13);
            RR -= (RR == 0 ? 0 : 13);
            EPRR -= (EPRR == 0 ? 0 : 13);
        }
        else if (item == 2) {
            PRR += 13;
            RFR -= (RFR == 0 ? 0 : 13);

        }
        else if (item == 3) {
            RR += 13;
            EPRR += 13;
            IDD += 13;
            RFR -= (RFR == 0 ? 0 : 13);
        }

        else if (item == 5) {
            RFR += 13;
            PRR -= (PRR == 0 ? 0 : 13);
            RR -= (RR == 0 ? 0 : 13);
            EPRR -= (EPRR == 0 ? 0 : 13);
        }
        else if (item == 6) {
            PRR += 13;
            RFR -= (RFR == 0 ? 0 : 13);
        }
        else if (item == 7) {
            RR += 13;
            EPRR += 13;
            IDD += 13;
            RFR -= (RFR == 0 ? 0 : 13);
        }
        else if (item == 8) {
            RFR += 13;
            PRR -= (PRR == 0 ? 0 : 13);
            RR -= (RR == 0 ? 0 : 13);
            EPRR -= (EPRR == 0 ? 0 : 13);
        }
        else if (item == 9) {
            PRR += 13;
            RR += 13;
            EPRR += 13;
            IDD += 13;
            RFR -= (RFR == 0 ? 0 : 13);
        }
        // do something with `item` (or `this` is also `item` if you like)
    });

    $('#redFlag').css('width', RFR + '%').attr('aria-valuenow', RFR);
    $('#publicRecord').css('width', PRR + '%').attr('aria-valuenow', PRR);
    $('#enhancedPublicRecord').css('width', EPRR + '%').attr('aria-valuenow', EPRR);
    $('#reputationalReview').css('width', RR + '%').attr('aria-valuenow', RR);
    $('#dueDiligence').css('width', IDD + '%').attr('aria-valuenow', IDD);

    // toggleLoader();

}

function removeItems(step) {

    if (responseList.length >= step) {
        responseList.pop();
    }
    //responseList.pop();
}

function showTab(n) {

    // This function will display the specified tab of the form...
    var x = document.getElementsByClassName("tab");

    for (var cnt = 0; cnt < x.length; cnt++) {
        if (cnt == n) {
            x[cnt].style.display = "block";
        }
        else {
            x[cnt].style.display = "none";
        }


    }

    //... and fix the Previous/Next buttons:
    if (n == 0) {
        document.getElementById("previewquestions").style.display = "none";
    } else {
        document.getElementById("previewquestions").style.display = "inline-block";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextquestions").innerHTML = "Submit";
    } else {
        document.getElementById("nextquestions").innerHTML = "Next";
    }
    //... and run a function that will display the correct step indicator:
    //activateTab(n + 1);

    navigateTab(n + 1);
    fixStepIndicator(n)
}

function activateTab(tab) {

    var t = 'tab_default_' + tab;
    $('.nav-tabs a[href="#' + t + '"]').tab('show');
};


function navigateTab(tab) {

    $('#tab1').removeClass('active');
    $('#tab2').removeClass('active');
    $('#tab3').removeClass('active');
    $('#tab4').removeClass('active');

    $('#tab_default_1').removeClass('active');
    $('#tab_default_2').removeClass('active');
    $('#tab_default_3').removeClass('active');
    $('#tab_default_4').removeClass('active');

    $('#tab_default_1').css('display', 'none');
    $('#tab_default_2').css('display', 'none');
    $('#tab_default_3').css('display', 'none');
    $('#tab_default_4').css('display', 'none');



    if (tab == 1) {

        $('#tab1').addClass('active');
        $('#tab_default_1').css('display', 'block');
        $('#tab_default_1').addClass('active');
    }
    else if (tab == 2) {

        $('#tab2').addClass('active');
        $('#tab_default_2').css('display', 'block');
        $('#tab_default_2').addClass('active');

    }
    else if (tab == 3) {

        $('#tab3').addClass('active');
        $('#tab_default_3').css('display', 'block');
        $('#tab_default_3').addClass('active');
    }
    else if (tab == 4) {

        $('#tab4').addClass('active');
        $('#tab_default_4').css('display', 'block');
        $('#tab_default_4').addClass('active');



        var obj = {
            'divRFR': RFR,
            'divPRR': PRR,
            'divEPRR': EPRR,
            'divRR': RR,
            'divIDD': IDD
        }

        var max = _.max(Object.keys(obj), function (o) {
            return obj[o];
        });


        $('.divRFR').hide();
        $('.divPRR').hide();
        $('.divEPRR').hide();
        $('.divRR').hide();
        $('.divIDD').hide();

        $('.' + max).show();

        $('#field9').first().val($('#' + max).find('span').text());

        var dueDeliganceText = '';
        if (max == 'divRFR') {
            dueDeliganceText = 'RFR';
        }
        if (max == 'divPRR') {
            dueDeliganceText = 'PRR';
        }
        if (max == 'divEPRR') {
            dueDeliganceText = 'EPRR';
        }
        if (max == 'divRR') {
            dueDeliganceText = 'RR';
        }
        if (max == 'divIDD') {
            dueDeliganceText = 'IDD';
        }
        $('#DueDiligenceReport').val(dueDeliganceText);
        //document.getElementById('DueDiligenceReport').value=;    

    }
};


function nextPrev(n) {

    $('html, body').animate({
        'scrollTop': $(".quiz-section").position().top
    });
    if (n > 0) {

        if (IDD == 100) {
            visitedTab = 2;
        }

        saveResponse(visitedTab + 1);
    }
    else if (n < 0) {

        for (var i = n; i < 0; i++) {
            //removeItems(visitedTab + 1);

            if (n == -1) {


                if (IDD == 100) {
                    while (responseList.length > 0) {
                        responseList.pop();
                        clearAll();
                    }


                }
                else {
                    removeItems(visitedTab + 1);
                    clearStep(visitedTab);
                    removeItems(visitedTab);
                    clearStep(visitedTab - 1);
                }

            }
            else {
                removeItems(Math.abs(i));
                clearStep(Math.abs(i))
            }


            //if (n == -2)
            //{
            //    clearSection2();
            //    clearSection3();
            //}
            //if (n == -1 && visitedTab==1) {

            //    clearSection2();

            //}
            //if (n == -1 && visitedTab == 2) {

            //    clearSection3();

            //}


            if (IDD == 100) {
                saveResponse(currentTab);
            }
            else {
                saveResponse(Math.abs(i) - 1);

            }

        }

    }



    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && !validate()) return false;
    // Hide the current tab:
    x[visitedTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    visitedTab = visitedTab + n;
    // if you have reached the end of the form...

    //if (visitedTab >= x.length) {
    //    // ... the form gets submitted:

    //    window.location.href = "https://www.kroll.com/en-us/what-we-do/compliance/screening-due-diligence#publicRecordReview";
    ////  document.getElementById("regForm").submit();
    //  return false;
    //}
    // Otherwise, display the correct tab:
    showTab(visitedTab);
}

function validateForm() {

    // This function deals with validation of the form fields
    var x, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[visitedTab].getElementsByTagName("input");
    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
        // If a field is empty...
        if (y[i].value == "") {
            // add an "invalid" class to the field:
            y[i].className += " invalid";
            // and set the current valid status to false
            valid = false;
        }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
        //document.getElementsByClassName("step")[visitedTab].className += " finish";
    }
    return valid; // return the valid status
}

function validate() {

    var valid = true;
    var controls = $(".tab.active :input");
    var select = $('select');

    $(controls).each(function () {

        var name = $(this).attr("name");


        if (name != undefined) {
            if ($("input:radio[name=" + name + "]:checked").length == 0) {
                valid = false;
                $(this).addClass('invalid');
                $(this).closest('ul').addClass('invalid');
            }
            else {

                $(this).closest('ul').removeClass('invalid');
            }
        }
    });

    $(select).each(function () {

        var val = $(this).val();

        if (val == 'select') {
            $(this).addClass('invalid');
            valid = false;
        }
        else {
            $(this).removeClass('invalid');
        }


    });


    return valid;



}
function sanitizeControl(obj) {

    $(obj).removeClass('invalid');
    $(obj).closest('ul').removeClass('invalid');


}


function fixStepIndicator(n) {

    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    //x[n].className += " active";
}

function clearSection1() {


    $("input[name='diligenceservices']").prop('checked', false);
    enableDisableNextButton(1);


}

function clearSection2() {


    $("input[name='screentype']").prop('checked', false);
    $("#Region").val();
    $("#State").val();
    $("input[name='lawsuits']").prop('checked', false);
    $("input[name='regulatedindustry']").prop('checked', false);

    enableDisableNextButton(2);



}

function clearSection3() {

    $("input[name='risklevel']").prop('checked', false);
    $("input[name='financialrelationship']").prop('checked', false);
    $("input[name='businessrelationship']").prop('checked', false);
    enableDisableNextButton(3);

}

function clearAll() {
    clearSection1();
    clearSection2();
    clearSection3();
}

function clearStep(step) {

    if (step == 3) {
        clearSection3();
    }
    if (step == 2) {
        clearSection2();
        clearSection3();
    }
    if (step <= 1) {
        clearAll();
    }


}

function toggleLoader() {

    $('.Loading').fadeToggle(2000);
}




function enableDisableNextButton(step) {

    var valid = true;
    var controls = $(".tab.active :input");
    var select = $('select');

    $(controls).each(function () {

        var name = $(this).attr("name");


        if (name != undefined) {
            if ($("input:radio[name=" + name + "]:checked").length == 0) {
                valid = false;

            }

        }
    });

    $(select).each(function () {

        var val = $(this).val();

        if (val == 'select') {

            valid = false;
        }



    });


    if (step == 1) {
        if (valid) {
            $('.step1').prop( "disabled", false );
            $('.step1').addClass('btnHover');


        }
        else {
            $('.step1').attr('disabled', 'disabled');
            $('.step1').removeClass('btnHover');
        }


    }
    if (step == 2) {
        if (valid) {
            $('.step2').prop( "disabled", false );
            $('.step2').addClass('btnHover');

        }
        else {
            $('.step2').attr('disabled', 'disabled');
            $('.step2').removeClass('btnHover');

        }

    }
    if (step == 3) {
        if (valid) {
            $('.step3').prop( "disabled", false );
            $('.step3').addClass('btnHover');

        }
        else {
            $('.step3').attr('disabled', 'disabled');
            $('.step3').removeClass('btnHover');

        }

    }

}
function SendFormDataToEloqua() {
    var $wizardForm = $('form#form767');
    $.post($wizardForm.attr('action'), $wizardForm.serialize())
        .done(function (data, textStatus) {
            var success = textStatus === 'success' && (data.indexOf('DefaultFormSubmitConfirmation') > 0 || data.indexOf('thank-you') > 0);
            $('.due-diligence-wizard-tool').hide();
            if (success) {
                $('.thankyou-wizard').show();
            }
            else {
                $('.error-wizard').show();
            }
        });
}

