
var ADV_COOKIE_NAME = "hasConsentForAdvertisement";
var ADV_COOKIE_TIMEOUT = 33696000000;
var ADV_DECLINE_COOKIE_NAME = 'hasNoConsentForAdvertisement';

function addAdvCookie() {
  if (!checkAdvertisementCookie()) {
    var date = new Date();
    date.setTime(date.getTime() + ADV_COOKIE_TIMEOUT);
    document.cookie =
      ADV_COOKIE_NAME + "=true;expires=" + date.toGMTString() + "; Secure; path=/";
  }
}

function setAdvDeclineCookie () {
  var date = new Date()
  date.setTime(date.getTime() + ADV_COOKIE_TIMEOUT)
  document.cookie = ADV_DECLINE_COOKIE_NAME + '=true;expires=' + date.toGMTString() + '; Secure; path=/'
}

function removeAdvCookie() {
  document.cookie =
    ADV_COOKIE_NAME + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; path=/;";
}

function removeAdvDeclineCookie() {
  document.cookie =
  ADV_DECLINE_COOKIE_NAME + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; path=/;";
}

function attachRemarketingInBody() {
  if (document.querySelector('html').classList.contains('remarketingtriggered')) return;
    $('body').prepend('<!-- Global site tag (gtag.js) - Google Ads: 958425954 --> \n\
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-958425954"><\/script>\n\
<script>\n\
  window.dataLayer = window.dataLayer || [];\n\
  function gtag(){dataLayer.push(arguments);}\n\
  gtag("js", new Date());\n\
  gtag("config", "AW-958425954");\n\
<\/script>\n\
<script type="text/javascript"> _linkedin_partner_id = "709683"; window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []; window._linkedin_data_partner_ids.push(_linkedin_partner_id); <\/script>\n\
<script type="text/javascript"> (function(){var s = document.getElementsByTagName("script")[0]; var b = document.createElement("script"); b.type = "text/javascript";b.async = true; b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js"; s.parentNode.insertBefore(b, s);})(); <\/script>\n\
<noscript> <img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=709683&fmt=gif" /> <\/noscript>\n\
<!-- Twitter universal website tag code -->\n\
<script>\n\
!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);\n\
},s.version="1.1",s.queue=[],u=t.createElement(n),u.async=!0,u.src="//static.ads-twitter.com/uwt.js",\n\
a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,"script");\n\
// Insert Twitter Pixel ID and Standard Event data below\n\
twq("init","o2q1x");\n\
twq("track","PageView");\n\
<\/script>\n\
<!-- End Twitter universal website tag code -->');
document.querySelector('html').classList.add('remarketingtriggered');
}

function checkAdvertisementCookie() {
  if (document.cookie.indexOf(ADV_COOKIE_NAME + "=true") > -1) {
    return true;
  } else {
    return false;
  }
}

function checkAdvDeclineCookie() {
  if (document.cookie.indexOf(ADV_DECLINE_COOKIE_NAME + "=true") > -1) {
    return true;
  } else {
    return false;
  }
}

function checkHasConsentForAdvertisementCookie() {
  var result = $("#onetrust-consent-sdk .ot-sdk-column")
  .find("h3.ot-cat-header:contains('Advertising Cookies')")
  .closest(".ot-desc-cntr")
  .find("input[type=checkbox]")
  .attr("aria-checked") || $("#onetrust-consent-sdk .ot-sdk-column")
  .find("h3:contains('Advertising Cookies')")
  .closest(".category-item")
  .find("input[type=checkbox]")
  .attr("aria-checked");

    if (result === "false") {
        if (!checkAdvDeclineCookie()) {
          setAdvDeclineCookie ();
        }
        return false;
    } else if (result === "true") {
        return true;
    } else {
        return false
    }
}

$(window).on('load', function() {
  if (checkAdvertisementCookie()) {
    attachRemarketingInBody();
  }

  $(document).on('click', '#onetrust-reject-all-handler', function () {
    setAdvDeclineCookie();
});

  $(document).on(
    "click",
    "#onetrust-accept-btn-handler, #accept-recommended-btn-handler, .save-preference-btn-handler",
    function() {
      if (checkHasConsentForAdvertisementCookie()) {
        if (checkAdvDeclineCookie()) {
          removeAdvDeclineCookie();
        }
        addAdvCookie();
        attachRemarketingInBody();
      } else {
        if (checkAdvertisementCookie()) {
            removeAdvCookie();
        }
      }
    }
  );
});
