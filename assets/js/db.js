// Analytics 
var ANALYTICS_COOKIE_NAME = "hasConsentForAnalytics";
var ANALYTICS_COOKIE_TIMEOUT = 33696000000;
var ANALYTICS_DECLINE_COOKIE_NAME = 'hasNoConsentForAnalytics';

// Analytics
function addAnalyticsCookie() {
  if (!checkAnalyticsCookie()) {
    var date = new Date();
    date.setTime(date.getTime() + ANALYTICS_COOKIE_TIMEOUT);
    document.cookie =
    ANALYTICS_COOKIE_NAME + "=true;expires=" + date.toGMTString() + "; Secure; path=/";
  }
}

// Analytics
function setAnalyticsDeclineCookie () {
  var date = new Date()
  date.setTime(date.getTime() + ANALYTICS_COOKIE_TIMEOUT)
  document.cookie = ANALYTICS_DECLINE_COOKIE_NAME + '=true;expires=' + date.toGMTString() + '; Secure; path=/'
}

// Analytics
function removeAnalyticsCookie() {
  document.cookie =
  ANALYTICS_COOKIE_NAME + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; path=/;";
}

// Analytics
function removeAnalyticsDeclineCookie() {
  document.cookie =
  ANALYTICS_DECLINE_COOKIE_NAME + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; path=/;";
}

// Analytics
var attachDemandBaseInBody = function() {
    dbt();
    dbs();
}

// Analytics
function checkAnalyticsCookie() {
  if (document.cookie.indexOf(ANALYTICS_COOKIE_NAME + "=true") > -1) {
    return true;
  } else {
    return false;
  }
}

// Analytics
function checkAnalyticsDeclineCookie() {
  if (document.cookie.indexOf(ANALYTICS_DECLINE_COOKIE_NAME + "=true") > -1) {
    return true;
  } else {
    return false;
  }
}

// Analytics
function dbt() {
  if (document.querySelector('html').classList.contains('dbtriggered')) return;
  (function (d, b, a, s, e) {
      var t = b.createElement(a),
          fs = b.getElementsByTagName(a)[0]; t.async = 1; t.id = e; t.src = s;
      fs.parentNode.insertBefore(t, fs);        
  })(window, document, 'script', 'https://tag.demandbase.com/FDwiyD6L.min.js', 'demandbase_js_lib');
  document.querySelector('html').classList.add('dbtriggered');
}

function dbs() {
    if (window.Demandbase) {
        $.ajax('/api/duff/contact/current', {
            success: function (e) {
                var currentContactId = e.id
                jQuery.ajax("/api/duff/demandbase/getdata", {
                    type: "POST",
                    data: {
                        currentContact: currentContactId,                        
                        data: JSON.stringify(Demandbase.IP.CompanyProfile),
                    }
                })
            }
        })
    } else {
        setTimeout(dbs, 2000)
    }
}

// Analytics
function checkHasConsentForAnalyticsCookie() {
  var result = $("#onetrust-consent-sdk .ot-sdk-column")
  .find("h3.ot-cat-header:contains('Analytics Cookies')")
  .closest(".ot-desc-cntr")
  .find("input[type=checkbox]")
  .attr("aria-checked") || $("#onetrust-consent-sdk .ot-sdk-column")
  .find("h3:contains('Analytics Cookies')")
  .closest(".category-item")
  .find("input[type=checkbox]")
  .attr("aria-checked");

    if (result === "false") {
        if (!checkAnalyticsDeclineCookie()) {
          setAnalyticsDeclineCookie ();
        }
        return false;
    } else if (result === "true") {
        return true;
    } else {
        return false
    }
}

$(window).on('load', function() {

  // Analytics
  if (checkAnalyticsCookie()) {
    attachDemandBaseInBody();
  }

  $(document).on('click', '#onetrust-reject-all-handler', function () {

    // Analytics
    setAnalyticsDeclineCookie();
});

  $(document).on(
    "click",
    "#onetrust-accept-btn-handler, #accept-recommended-btn-handler, .save-preference-btn-handler",
    function() {

      // Analytics
      if (checkHasConsentForAnalyticsCookie()) {
        if (checkAnalyticsDeclineCookie()) {
          removeAnalyticsDeclineCookie();
        }
        addAnalyticsCookie();
        attachDemandBaseInBody();
      } else {
        if (checkAnalyticsCookie()) {
            removeAnalyticsCookie();
        }
      }
    }
  );
});
