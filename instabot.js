var webdriverio = require('webdriverio');
var options = { desiredCapabilities: { browserName: 'chrome' } };
var client = webdriverio.remote(options);
var settings = require('./settings.json');

init();

function init() {
  var browser = client
    .init()
    .url('https://www.instagram.com/accounts/login/');


  searchForText(login(browser), settings.instagram_accounts_to_be_liked);
  // login(browser)
  //     .call(searchForText)
  //     .call(openPhoto)
  //     .call(likePhoto)
  // .end();
}

function login(browser) {
  return browser
      .setValue('[name="username"] ', settings.instagram_account_username)
      .setValue('[name="password"] ', settings.instagram_account_password)
      .click('//button')
      .pause(settings.sleep_delay);
      // .getTitle().then(function(title) {
      //   console.log('Title is: ' + title);
      //   // outputs: "Title is: WebdriverIO (Software) at DuckDuckGo"
      // })
      // .end();
}

// function searchForText() {
//   return this
//     .setValue('//*[@id="react-root"]/section/nav/div/div/div/div[1]/input', '#вязание')
//     .waitForEnabled('//*[@id="react-root"]/section/nav/div/div/div/div[1]/div[2]/div[2]/div/a[1]', settings.sleep_delay)
//     .keys('\uE007')
//     // .click('//*[@id="react-root"]/section/nav/div/div/div/div[1]/div[2]/div[2]/div/a[1]')
//     .pause(settings.sleep_delay);
//   // .getTitle().then(function(title) {
//   //   console.log('Title is: ' + title);
//   //   // outputs: "Title is: WebdriverIO (Software) at DuckDuckGo"
//   // })
//   // .end();
// }

function searchForText(browser, arr) {
  if (arr.length) {
    browser
        .setValue('//*[@id="react-root"]/section/nav/div/div/div/div[1]/input', arr[0])
        .waitForEnabled('//*[@id="react-root"]/section/nav/div/div/div/div[1]/div[2]/div[2]/div/a[1]', settings.sleep_delay)
        .keys('\uE007')
        // .click('//*[@id="react-root"]/section/nav/div/div/div/div[1]/div[2]/div[2]/div/a[1]')
        .pause(settings.sleep_delay)
        .call(openPhoto)
        .then(function() {
          markPhotos(browser, 0, function() {
            searchForText(browser, arr.slice(1))
          });
        });
  } else {
    browser.end();
  }
}

function markPhotos(browser, tryCount, callback) {
  if (tryCount < settings.like_depth_per_user) {
    browser
        .call(likePhoto)
        .call(nextPhoto)
        .then(function() {
          markPhotos(browser, ++tryCount, callback);
        })
        .pause(settings.sleep_delay);
  } else {
    callback();
  }
}

function openPhoto() {
  return this
    .click('//*[@id="react-root"]/section/main/article/div/div[1]/div[1]/a[1]')
    .pause(settings.sleep_delay);
}

function likePhoto() {
  return this
    .doubleClick('/html/body/div[2]/div/div[2]/div/article/div[1]/div')
    .pause(settings.sleep_delay).then(function() {
        console.error('like!!!');
      });
}

function nextPhoto() {
  return this
      .click('.coreSpriteRightPaginationArrow')
      .pause(settings.sleep_delay);
}
