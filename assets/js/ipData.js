$.ajax({
    url: "https://api.ipify.org?format=json",
    success: function (response) {
        if (response) {
            $.ajax({
                url: "/api/duff/navigation/getipdata?res=" + response.ip,
                success: function (response) {
                    if (response.response) {

                        if (window.attachDemandBaseInBody) {
                            if (!checkAnalyticsDeclineCookie()) {
                                attachDemandBaseInBody();
                            }

                        }
                        if (window.attachRemarketingInBody) {
                            if (!checkAdvDeclineCookie()) {
                                attachRemarketingInBody();
                            }

                        }

                    }
                },
                failure: function (err) {
                    console.log(err.response);
                },
                error: function (err) {
                    console.log(err.response);
                }
            });
            if ($('#countryBanner').length <= 0) return;
            if (window.sessionStorage.isCountryBannerClosed) return;
            $.ajax({
                url: "/api/duff/navigation/banner?res=" + response.ip + '&settingItem=' + $('#countryBanner').attr('data-context-Setting'),
                success: function (response) {
                    if (response.isCountryValid) {
                        $('#countryBanner .country-link').attr('href', response.Url);
                        $('#countryBanner .country-text').text(response.country);
                        $('#countryBanner').removeClass('sm-hide')
                        var countryBannerHeight = $('#countryBanner').height();
                        var heroMarginTopForCountryBanner = countryBannerHeight + parseInt($('main.Wrapper').css('margin-top'));
                        $('header.HeaderV2').css('top', countryBannerHeight + 'px');
                        $('main.Wrapper').css('margin-top', heroMarginTopForCountryBanner + 'px');
                        $('.MobileNav').css('top', countryBannerHeight + 60 + 'px')
                        $(document).on('click', '#countryBanner .close', function () {
                            $('#countryBanner').addClass('sm-hide');
                            $('header.HeaderV2').css('top', '');
                            $('main.Wrapper').css('margin-top', '');
                            $('.MobileNav').css('top', '');
                            window.sessionStorage.isCountryBannerClosed = true;
                        })
                    }

                },
                failure: function (err) {
                    console.log(err.response);
                },
                error: function (err) {
                    console.log(err.response);
                }
            });


        }
    },
    failure: function (err) {
        console.log(err);
    },
    error: function (err) {
        console.log(err);
    }
});
