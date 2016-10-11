var headerShown; // I.e. whether the full screen banner is up

/**
 * Changes which navigation buttons are selected.
 * @param {string} navName The name of the nav
 * element to select. All others are unselected.
 */
function changeNav(navName) {
  var navs = document.getElementById("mainNav");
  [].forEach.call(navs.getElementsByTagName("a"), function (nav) {
    //console.log("Hash is: " + hash + ", nav is: " + nav);
    if (navName === nav.getAttribute("href")) {
      nav.classList.add("selected");
    } else {
      nav.classList.remove("selected");
    }
  });
}

function toggleHeader() {
  
  var header = document.getElementsByTagName("header")[0];
  var websiteDesc = document.getElementById("websiteDesc");
  
  if (header.classList.contains("collapsed")) {
    changeNav();
    header.classList.remove("collapsed");
    websiteDesc.classList.remove("hidden");
    headerShown = true;
  } else {
    header.classList.add("collapsed");
    websiteDesc.classList.add("hidden");
    headerShown = false;
  }
  
}

// Detect hash changes in quite a heavy handed way,
// then toggle header and/or change highlighted navigation
window.addEventListener('popstate', function(event) {
  var hash = window.location.hash;
  if (hash === '' || hash ==='#') {
    toggleHeader();
  } else {
    if (headerShown) {
      toggleHeader();
    }
    changeNav(hash);
  }
});

window.onload = function() {

  var navs = document.getElementById("mainNav");
  var hash = window.location.hash.substr(1);
  var websiteName = document.getElementsByTagName("h1")[0];
  
  headerShown = true;
  
  websiteName.onclick = function() {
    // If it's not on the homepage:
    if (window.location.hash !== '') {
      window.location.hash = '';
    }
  };
  
  // Crazy scrolling experiment:
  window.addEventListener("mousewheel", function (e) {
    hash = window.location.hash.substr(1);
    if (e.wheelDeltaY < 0 && hash === '') {
      navs.getElementsByTagName("a")[0].click();
    }
  }, false);

};
