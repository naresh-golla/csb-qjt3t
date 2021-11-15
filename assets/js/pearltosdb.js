var searchObj = {};
if (window.location.search) {
    window.location.search
        .substring(1)
        .split("&")
        .forEach(function (item) { (searchObj[item.split("=")[0]] = item.split("=")[1]) });
}

if (searchObj.sitecore || searchObj.eloqua) {
  // Edit here for actual query params names
    if (searchObj.eloqua) {
        $.ajax({
            url: "/api/duff/contact/current", // Edit here for URL
            success: function (data) {
                $.ajax({
                    type: "POST",
                    url: "/api/duff/contact/identify", // Edit here for URL
                    data: {
                        Sitecoreid: data.id, // Edit here post data
                        eloquaid: searchObj.eloqua, // Edit here post data
                    },
                    success: function (response) {
                        console.log(response); // Edit here for success message for default URL
                    },
                    error: function (error) {
                        console.log("default sitecore db api failed", error); // Edit here for error message
                    },
                });
                if (searchObj.sitecore && data.id !== searchObj.sitecore) {
                    $.ajax({
                        type: "POST",
                        url: "/api/duff/contact/identify", // Edit here for url
                        data: {
                            Sitecoreid: searchObj.sitecore, // Edit here post data
                            eloquaid: searchObj.eloqua, // Edit here post data
                        },
                        success: function (response) {
                            console.log(response); // Edit here for success message for URL when contact id didnot match
                        },
                        error: function (error) {
                            console.log("URl 2 failed when contact id didnot matched", error); // Edit here for error message
                        },
                    });
                }
            },
            error: function (error) {
                console.log("current api failed", error); // Edit here for error message
            },
        });
    }
  
}
$(document).ready(function () {
    $(document).on('click', '.web-cross-domain', function (event) {
        event.preventDefault();
        var element = $(this)
        if (sessionStorage.ciii) {
            openUrlForCrossTracking(element)
        } else {
            $.ajax({
                type: 'POST',
                url: "/api/duff/contact/getcrossdomainparams", // Edit here for URL
                success: function (data) {
                    sessionStorage.ciii = JSON.stringify(data)
                    openUrlForCrossTracking(element)
                },
                error: function (error) {
                    console.log("api failed", error); // Edit here for error message
                },
            })
        }
    })
})

function openUrlForCrossTracking(element) {
    var ciii = JSON.parse(JSON.parse(sessionStorage.ciii))
    window.open($(element).attr('href') + '?cdci=' + ciii.cdci + '&cdii=' + ciii.cdii, '_blank')
}
