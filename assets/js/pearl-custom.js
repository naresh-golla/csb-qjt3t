var pearlMyContentUrl = "https://client-qa.duffandphelps.com/my-content";
var pearlApiUrl = "https://client-qa-api.duffandphelps.com/api/v1";
function isIE() {
  var isIE = navigator.userAgent.indexOf("MSIE") > -1;
  var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
  var isEdge = navigator.userAgent.indexOf('Edge') > -1;
  return isIE || isIE11 || isEdge;
}
var accessSettings = new Pearl.B2CSettings({
  provider: "b2clogin.com",
  workflow: "Redirect",
  tenant: 'qausdpb2c',
  policies: {
    signin: "B2C_1_pearl_signup_signin",
    signup: "B2C_1_pearl_signup",
    signinSignup: "B2C_1_pearl_signup_signin",
    changePassword: "B2C_1_pearl_password_reset",
    editProfile: "B2C_1_pearl_edit_profile",
  },
  audience: "portal-api",
  client: "52931399-0553-4f15-aa2d-6cfc9da8c1b6",
  scopes: ["full"],
});
checkTokenValid();

var bookmarkClient = new Pearl.BookmarkClient(
  pearlApiUrl,
  accessSettings
);



Pearl.ConcurrencyAuthenticator.initializeWindow(accessSettings);

$(document).ready(function () {
  document.addEventListener('click', function (event) {
    if ($('.showToolTip').length > 0) {
      if (event.target !== $('.showToolTip')[0]) {
        $($('.showToolTip')[0]).removeClass('add-width');
        $($('.showToolTip')[0]).removeClass('showToolTip');
      }
    }
  }, true)
  addHandlerForBookmarkIconClick();
  // checkTokenValid();
  if (Pearl.ConcurrencyAuthenticator.hasToken(accessSettings.audience)) {
    getBookmark().then(function (bookmarks) {
      updateBookmarkToTiles(bookmarks);
    });
    addUserToNav();
  }
  $('.logout').on('click', function () {
    if (Pearl) {
      Pearl.ConcurrencyAuthenticator.logout(accessSettings)
    }
  })
  if ($('.bookmark-side-popup').length > 0) {
    sessionStorage.insightPageVisited ? '' : bookmarkBarAutoSlideInAndOut();
  }

});

function checkPearlToken() {
  checkTokenValid();
  return Pearl.ConcurrencyAuthenticator.getToken(accessSettings);
}

function getBookmark() {
  return bookmarkClient.get();
}

function updateBookmarkToTiles(bookmarkArray) {
  bookmarkArray.forEach(function (bookmark) {
    $("[data-item-id=" + bookmark.id + "]").addClass("bookmarked");
  });
}

function addHandlerForBookmarkIconClick() {
  $("[data-bookmark-icon]").on('click mouseenter', function () {
    var bookmarkArticle = $(this).closest("article")[0];

    // if (Pearl.ConcurrencyAuthenticator.hasToken(accessSettings.audience)) {
    //       if ($(bookmarkArticle).hasClass("bookmarked")) {
    //           deleteBookmark($(bookmarkArticle).attr("data-item-id"));
    //           return;
    //     }
    //   addBookmark(bookmarkArticle);
    // } else {
    // loginPearl(true, bookmarkArticle)
    if ($(bookmarkArticle).hasClass('showToolTip')) {
      $(bookmarkArticle).removeClass('showToolTip');
      $(bookmarkArticle).removeClass('add-width');
      return
    }
    showBookmarkTooltip(bookmarkArticle);
    // }
  });
  $('.bookmark-side-popup').length > 0 ? attachHandlerForPopupBookmarkIcon() : ''
}

function loginPearl(type, flagToAddBookmark, bookmarkArticle) {
  flagToAddBookmark = flagToAddBookmark || false;
  bookmarkArticle = bookmarkArticle || null;
  if (bookmarkArticle) {
    addBookmarkToStorage(bookmarkArticle);
  }
  localStorage.setItem('loginInProgressKey', 'loginInProgress');
  if (accessSettings.workflowType === 'Popup') {
    if (window.newWindow) {
      if (!window.newWindow.opener) {
        window.newWindow = openNewTabForLogin();
      } else { }
    } else {
      window.newWindow = openNewTabForLogin();
    }
  }
  if (type === 'signup') {
    Pearl.ConcurrencyAuthenticator.signup(accessSettings).subscribe(
      function () {
        checkTokenValid();
        if (Pearl.ConcurrencyAuthenticator.hasToken(accessSettings.audience)) {
          if (flagToAddBookmark) {
            addBookmark(bookmarkArticle);
          }
          $.ajax({
            url: "/api/duff/contact/current",
            success: function (data) {
              window.location.href = pearlMyContentUrl + "?sitecore-user=" + data.id;
            },
            failure: function (data) {
              window.location.href = pearlMyContentUrl;
            }
          })
          getBookmark().then(function (bookmarks) {
            updateBookmarkToTiles(bookmarks);
          });
        } else {
          // window ? window.close(): '';
        }
      },
      function (error) {
        // window ? window.close(): '';
      }
    );
  }

  if (type === 'login') {
    Pearl.ConcurrencyAuthenticator.login(accessSettings).subscribe(
      function () {
        checkTokenValid();
        if (Pearl.ConcurrencyAuthenticator.hasToken(accessSettings.audience)) {
          if (flagToAddBookmark) {
            addBookmark(bookmarkArticle);
          }
          $.ajax({
            url: "/api/duff/contact/current",
            success: function (data) {
              window.location.href = pearlMyContentUrl + "?sitecore-user=" + data.id;
            },
            failure: function (data) {
              window.location.href = pearlMyContentUrl;
            }
          })
          getBookmark().then(function (bookmarks) {
            updateBookmarkToTiles(bookmarks);
          });
        } else {
          // window ? window.close(): '';
        }
      },
      function (error) {
        // window ? window.close(): '';
      }
    );
  }
}

function deleteBookmark(id) {
  checkTokenValid();
  if (Pearl.ConcurrencyAuthenticator.hasToken(accessSettings.audience)) {
    bookmarkClient.remove([id]).then(function () {
      $("[data-item-id=" + id + "]").removeClass("bookmarked");
      console.log("bookmark removed");
    });
  }
}

function addBookmark(bookmarkArticle) {
  checkTokenValid();
  if (Pearl.ConcurrencyAuthenticator.hasToken(accessSettings.audience)) {
    bookmarkClient
      .write([{
        id: $(bookmarkArticle).attr("data-item-id") || '',
        imageUrl: $(bookmarkArticle).find("[data-card-image]").attr("data-card-image") ? (location.origin + $(bookmarkArticle).find("[data-card-image]").attr("data-card-image")) : '',
        linkUrl: $(bookmarkArticle).find("[data-card-url]").attr("target") === '_blank' ? $(bookmarkArticle).find("[data-card-url]").attr("href") : location.origin + $(bookmarkArticle).find("[data-card-url]").attr("href") || '#',
        title: $(bookmarkArticle).find("[data-card-title]").text().trim() || '',
        type: $(bookmarkArticle).attr("data-card-type") || $(bookmarkArticle).attr("data-card-subtype") || '',
        description: $(bookmarkArticle).find("[data-card-description]").text().trim() || '',
        // subType: $(bookmarkArticle).attr("data-card-subtype") || '',
        date: $(bookmarkArticle).find("[data-card-date]").attr("data-card-date") || '',
        location: $(bookmarkArticle).find("[data-card-location]").attr("data-card-location") || '',
        // subtitle: $(bookmarkArticle).find("[data-card-subtitle]").text().trim() || '',
        profilesiteinterest: $(bookmarkArticle).attr('data-siteinterest'),
        profileindustry: $(bookmarkArticle).attr('data-industry'),
        profileservice: $(bookmarkArticle).attr('data-service'),
        CaseStudyImage1: $(bookmarkArticle).find("[data-card-caseStudyImage1]").attr("data-card-caseStudyImage1") ? (location.origin + $(bookmarkArticle).find("[data-card-caseStudyImage1]").attr("data-card-caseStudyImage1")) : '',
        CaseStudyImage2: $(bookmarkArticle).find("[data-card-caseStudyImage2]").attr("data-card-caseStudyImage2") ? (location.origin + $(bookmarkArticle).find("[data-card-caseStudyImage2]").attr("data-card-caseStudyImage2")) : '',
        CaseStudyImage3: $(bookmarkArticle).find("[data-card-caseStudyImage3]").attr("data-card-caseStudyImage3") ? (location.origin + $(bookmarkArticle).find("[data-card-caseStudyImage3]").attr("data-card-caseStudyImage3")) : '',
        CaseStudyDescription1: $(bookmarkArticle).find("[data-card-caseStudyDescription1]").attr("data-card-caseStudyDescription1") || '',
        CaseStudyDescription2: $(bookmarkArticle).find("[data-card-caseStudyDescription2]").attr("data-card-caseStudyDescription2") || '',
        CaseStudyDescription3: $(bookmarkArticle).find("[data-card-caseStudyDescription3]").attr("data-card-caseStudyDescription3") || '',
        Category: $(bookmarkArticle).find("[data-card-category]").attr("data-card-category") || $(bookmarkArticle).find("[data-card-subtitle]").text().trim() || ''
      }])
      .then(function () {
        var bookmarkId = $(bookmarkArticle).attr("data-item-id");
        $("[data-item-id=" + bookmarkId + "]").addClass("bookmarked");
        //$.ajax({            
        //    url: 'bookmark-url?' + $(bookmarkArticle).find("[data-card-url]").attr("target") === '_blank' ? $(bookmarkArticle).find("[data-card-url]").attr("href") : location.href + $(bookmarkArticle).find("[data-card-url]").attr("href") || '#'
        //})
      });
  }

}

function addBookmarkToStorage(bookmarkArticle) {
  localStorage.bookmarkToAdd = JSON.stringify({
    id: $(bookmarkArticle).attr("data-item-id") || '',
    imageUrl: $(bookmarkArticle).find("[data-card-image]").attr("data-card-image") ? (location.origin + $(bookmarkArticle).find("[data-card-image]").attr("data-card-image")) : '',
    linkUrl: $(bookmarkArticle).find("[data-card-url]").attr("target") === '_blank' ? $(bookmarkArticle).find("[data-card-url]").attr("href") : location.origin + $(bookmarkArticle).find("[data-card-url]").attr("href") || '#',
    title: $(bookmarkArticle).find("[data-card-title]").text().trim() || '',
    type: $(bookmarkArticle).attr("data-card-type") || $(bookmarkArticle).attr("data-card-subtype") || '',
    description: $(bookmarkArticle).find("[data-card-description]").text().trim() || '',
    // subType: $(bookmarkArticle).attr("data-card-subtype") || '',
    date: $(bookmarkArticle).find("[data-card-date]").attr("data-card-date") || '',
    location: $(bookmarkArticle).find("[data-card-location]").attr("data-card-location") || '',
    // subtitle: $(bookmarkArticle).find("[data-card-subtitle]").text().trim() || '',
    profilesiteinterest: $(bookmarkArticle).attr('data-siteinterest'),
    profileindustry: $(bookmarkArticle).attr('data-industry'),
    profileservice: $(bookmarkArticle).attr('data-service'),
    CaseStudyImage1: $(bookmarkArticle).find("[data-card-caseStudyImage1]").text().trim() || '',
    CaseStudyImage2: $(bookmarkArticle).find("[data-card-caseStudyImage2]").text().trim() || '',
    CaseStudyImage3: $(bookmarkArticle).find("[data-card-caseStudyImage3]").text().trim() || '',
    CaseStudyDescription1: $(bookmarkArticle).find("[data-card-caseStudyDescription1]").text().trim() || '',
    CaseStudyDescription2: $(bookmarkArticle).find("[data-card-caseStudyDescription2]").text().trim() || '',
    CaseStudyDescription3: $(bookmarkArticle).find("[data-card-caseStudyDescription3]").text().trim() || '',
    Category: $(bookmarkArticle).find("[data-card-category]").attr("data-card-category") || $(bookmarkArticle).find("[data-card-subtitle]").text().trim() || ''
  })

}

function openNewTabForLogin() {
  var pearlWindow = window.open("", "_blank");
  pearlWindow.document.write('<div style="width: 500px; max-width:90%;transform: translate(-50%, -50%); left: 50%; top: 50%; position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center"><div style="border: 16px solid #f6f6f7;border-radius: 50%;border-top: 16px solid #13b5ea;width: 150px;height: 150px;animation: spin 2s linear infinite;display: -ms-flexbox;display: flex;margin: auto;"></div><p style="font-size: 20px; color: rgba(70,86,97); text-align: center;line-height: 1.667;letter-spacing: 0.5px;">Please wait. Redirecting you to Duff & Phelps login.</p><div><style>@keyframes spin { 0% {transform: rotate(0)}100% {transform: rotate(360deg)}}</style>');
  return pearlWindow;
}
//$('.pearl-login').on('click', function (e) {
//    e.preventDefault();
//    loginPearl('login');
//});

function setleftofToolTip(bookmarkArticle) {
  var thresholdDistance = 20;
  var leftOffsetOfBookmarkIcon = $(bookmarkArticle).find('[data-bookmark-icon] svg').offset().left;
  var rightOffsetOfBookmarkIcon = $(window).width() - leftOffsetOfBookmarkIcon - ($(window).width() > 1516 ? ($(window).width() - 1516) / 2 : 0)
  var leftOffsetOfBookmarkArticle = $(bookmarkArticle).offset().left;
  var lengthOfBookmarkToolTip = $(bookmarkArticle).find('[data-bookmark-tooltip]').outerWidth();
  var widthOfBookmarkIcon = $(bookmarkArticle).find('[data-bookmark-icon] svg').outerWidth();
  var currentLeftOfToolTip = (leftOffsetOfBookmarkIcon + (widthOfBookmarkIcon / 2)) - leftOffsetOfBookmarkArticle - (lengthOfBookmarkToolTip / 2);
  if ((leftOffsetOfBookmarkIcon + (widthOfBookmarkIcon / 2)) < (lengthOfBookmarkToolTip / 2)) {
    currentLeftOfToolTip = currentLeftOfToolTip + ((lengthOfBookmarkToolTip / 2) - (leftOffsetOfBookmarkIcon + (widthOfBookmarkIcon / 2))) + thresholdDistance;
  }
  if ((rightOffsetOfBookmarkIcon + (widthOfBookmarkIcon / 2)) < (lengthOfBookmarkToolTip / 2)) {
    currentLeftOfToolTip = currentLeftOfToolTip - ((lengthOfBookmarkToolTip / 2) - (rightOffsetOfBookmarkIcon + (widthOfBookmarkIcon / 2))) - thresholdDistance;
  }
  $(bookmarkArticle).find('[data-bookmark-tooltip]').css('left', currentLeftOfToolTip);
}

function showBookmarkTooltip(bookmarkArticle) {
  $('.showToolTip').each(function (index, element) {
    $(element).removeClass('showToolTip');
    $(element).removeClass('add-width');
  });
  $(bookmarkArticle).addClass('add-width');
  addTextToTooltip(bookmarkArticle);
  attatchHandledForBookmarkToolTip(bookmarkArticle);
  setleftofToolTip(bookmarkArticle);
  if ($(bookmarkArticle).hasClass('socialBookmarkIconArticle')) {
    $(bookmarkArticle).find('[data-bookmark-tooltip]').css('bottom', parseInt(('-' + ($(bookmarkArticle).find('[data-bookmark-tooltip]').outerHeight() + 19))));
  } else {
    $(bookmarkArticle).find('[data-bookmark-tooltip]').css('bottom', parseInt(('-' + $(bookmarkArticle).find('[data-bookmark-tooltip]').outerHeight())));
  }
  $(bookmarkArticle).addClass('showToolTip');

}

function addTextToTooltip(bookmarkArticle) {
  // checkTokenValid();
  if (Pearl.ConcurrencyAuthenticator.hasToken(accessSettings.audience)) {
    if ($(bookmarkArticle).hasClass('bookmarked')) {
      $(bookmarkArticle).find('[data-bookmark-tooltip]').html(' <a href="#" class="u-blue-4 removeBookmark">Remove bookmark</a> or <a href="#" class="u-blue-4 view-content">view My Content</a> <span class="close-bookmark">×</span>')
    } else {
      $(bookmarkArticle).find('[data-bookmark-tooltip]').html(' <a href="#" class="u-blue-4 bookmark-item">Bookmark this page</a> or <a href="#" class="u-blue-4 view-content">view My Content</a> <span class="close-bookmark">×</span>')
    }

  } else {
    $(bookmarkArticle).find('[data-bookmark-tooltip]').html(' <a href="#" class="u-blue-4 signin">Sign in</a> or <a href="#" class="u-blue-4 signup">Create an account</a> to bookmark <span class="close-bookmark">×</span>')
  }

}

function attatchHandledForBookmarkToolTip(bookmarkArticle) {
  $(bookmarkArticle).find('.signin').on('click', function (event) {
    event.preventDefault();
    loginPearl('login', true, bookmarkArticle)
    $(bookmarkArticle).removeClass('showToolTip');
    $(bookmarkArticle).removeClass('add-width');
  });
  $(bookmarkArticle).find('.signup').on('click', function (event) {
    event.preventDefault();
    loginPearl('signup', true, bookmarkArticle)
    $(bookmarkArticle).removeClass('showToolTip');
    $(bookmarkArticle).removeClass('add-width');
  });
  $(bookmarkArticle).find('.removeBookmark').on('click', function (event) {
    event.preventDefault();
    deleteBookmark($(bookmarkArticle).attr("data-item-id"));
    $(bookmarkArticle).removeClass('showToolTip');
    $(bookmarkArticle).removeClass('add-width');
  });
  $(bookmarkArticle).find('.bookmark-item').on('click', function (event) {
    event.preventDefault();
    addBookmark(bookmarkArticle);
    $(bookmarkArticle).removeClass('showToolTip');
    $(bookmarkArticle).removeClass('add-width');
  });
  $(bookmarkArticle).find('.view-content').on('click', function (event) {
    event.preventDefault();
    window.location.href = pearlMyContentUrl;
    $(bookmarkArticle).removeClass('showToolTip');
    $(bookmarkArticle).removeClass('add-width');
  });
  $(bookmarkArticle).find('.close-bookmark').on('click', function (event) {
    event.preventDefault();
    $(bookmarkArticle).removeClass('showToolTip');
    $(bookmarkArticle).removeClass('add-width');
  });

}

function checkTokenValid() {
  if (!localStorage.getItem('ccy.b2c.access_token.portal-api')) {
    return true;
  }
  if (new Date() < new Date(new Pearl.JwtToken(localStorage.getItem('ccy.b2c.access_token.portal-api')).exp * 1000)) {
    return true;
  } else {
    removeToken()
    removeUserInfo();
    return true;
  }
}

function removeToken() {
  localStorage.removeItem('ccy.b2c.access_token.portal-api');
}

function addUserToNav() {
  var given_name = Pearl.ConcurrencyAuthenticator.getJwtToken(accessSettings.audience).given_name;
  var family_name = Pearl.ConcurrencyAuthenticator.getJwtToken(accessSettings.audience).family_name;
  $('.user-info .user-name').text('Hi ' + (given_name ? given_name : 'There'))
  $('.user-info .user-initials').text((given_name ? given_name.substr(0, 1) : '') + (family_name ? family_name.substr(0, 1) : ''))
  $('html').addClass('loggedIn');
}
function removeUserInfo() {
  $('html').removeClass('loggedIn');
}
function attachHandlerForPopupBookmarkIcon() {
  var timeout;
  $(".bookmark-side-popup").on('mouseenter', function () {
    clearTimeout(timeout);
    $('.bookmark-side-popup').addClass('bookmark-show-side-popup')
  })
  $(".bookmark-side-popup").on('mouseleave', function () {
    timeout = setTimeout(function () { $('.bookmark-side-popup').removeClass('bookmark-show-side-popup') }, 1000)
  })
  var slideBookmarkArticle = $('.bookmark-side-popup').closest("article")[0];
  $(slideBookmarkArticle).find('.popup-signin').on('click', function (event) {
    event.preventDefault();
    loginPearl('login', true, slideBookmarkArticle)
  });
  $(slideBookmarkArticle).find('.popup-signup').on('click', function (event) {
    event.preventDefault();
    loginPearl('signup', true, slideBookmarkArticle)
  });

  $(slideBookmarkArticle).on('click', function () { $(slideBookmarkArticle).hasClass('bookmarked') ? deleteBookmark($(slideBookmarkArticle).attr("data-item-id")) : addBookmark(slideBookmarkArticle) })
  setPopupSlidePosition();
}

function bookmarkBarAutoSlideInAndOut() {
  setTimeout(function () {
    $('.bookmark-side-popup').addClass('bookmark-show-side-popup')

  }, 2000)
  setTimeout(function () {
    $('.bookmark-side-popup').removeClass('bookmark-show-side-popup')
  }, 12000)
  sessionStorage.insightPageVisited = true;
}

function setPopupSlidePosition() {
  var slidePopupThreshold = 55;
  var bookmarkPopupHeight = $('.bookmark-side-popup').outerHeight();
  var articleBodyHeight = ($('.ArticleDetail .ArticleDetail-main').outerHeight() || $('.ArticleDetail .CaseStudiesDetail-main').outerHeight() || 0);
  var bodyElement = $('.ArticleDetail .EventDetail-main').length > 0 ? $('.ArticleDetail .EventDetail-main') : $('.ArticleDetail .ArticleDetail-main').last();
  var thresh = ($('.ArticleDetail .ArticleDetail-main').outerHeight() || $('.ArticleDetail .CaseStudiesDetail-main').outerHeight() || 0) + ($('.ArticleDetail-main').siblings('.DownloadPDF').length > 0 ? $('.ArticleDetail-main').siblings('.DownloadPDF').outerHeight() : 0) + ($('.video-module').length > 0 ? $('.video-module').outerHeight() : 0) + ($('.cf.container.u-mt-6').length > 0 ? $('.cf.container.u-mt-6').outerHeight() : 0) + ($(bodyElement).length > 0 ? $(bodyElement).outerHeight() : 0) + $('header.Header').outerHeight() - 266 - $('.socialBookmarkIconArticle').outerHeight() - slidePopupThreshold;
  popupScrollTrigger(thresh, slidePopupThreshold, bookmarkPopupHeight, articleBodyHeight, bodyElement);
  $(window).on('scroll', function () {
    popupScrollTrigger(thresh, slidePopupThreshold, bookmarkPopupHeight, articleBodyHeight, bodyElement)
  })
}

function popupScrollTrigger(thresh, slidePopupThreshold, bookmarkPopupHeight, articleBodyHeight, bodyElement) {

  var thresh = ($('.ArticleDetail .ArticleDetail-main').outerHeight() || $('.ArticleDetail .CaseStudiesDetail-main').outerHeight() || 0)
    + ($('.ArticleDetail-main').siblings('.DownloadPDF').length > 0 ? Array.prototype.slice.call($('.ArticleDetail-main').siblings('.DownloadPDF')).reduce(function (total, element) { return total + $(element).outerHeight() }, 0) : 0)
    + ($('.video-module').length > 0 ? Array.prototype.slice.call($('.video-module')).reduce(function (total, element) { return total + $(element).outerHeight() }, 0) : 0)
    + ($('.About-wrapper').length > 0 ? Array.prototype.slice.call($('.About-wrapper')).reduce(function (total, element) { return total + $(element).outerHeight() }, 0) : 0)
    + ($('.cf.container.u-mt-6').length > 0 ? Array.prototype.slice.call($('.cf.container.u-mt-6')).reduce(function (total, element) { return total + $(element).outerHeight() }, 0) : 0)
    + (($(bodyElement).find('.bookmark-side-popup').length > 0 ? 0 : $(bodyElement).outerHeight()) || 0)
    + $('header.Header').outerHeight()
    - 266
    - $('.bookmark-side-popup').outerHeight();
  // console.log(thresh)
  if (window.pageYOffset >= thresh) {
    $('.bookmark-side-popup').css({ 'top': 266 - (window.pageYOffset - thresh) })
  } else {
    $('.bookmark-side-popup').css({ 'top': 266 })
  }

}
