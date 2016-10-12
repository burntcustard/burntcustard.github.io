var headerShown; // I.e. whether the full screen banner is up

/**
 * Changes which navigation buttons are selected.
 * @param {string} navName The name of the nav
 * element to select. All others are unselected.
 */
function changeTab(navName) {
  
  var navs = document.getElementById("mainNav");
  var selectedCategory = document.getElementById(navName+"-tab");
  
  // Buttons:
  [].forEach.call(navs.getElementsByTagName("a"), function (nav) {
    if (navName === nav.getAttribute("href")) {
      nav.classList.add("selected");
    } else {
      nav.classList.remove("selected");
    }
  });
  
  // Content:
  [].forEach.call(document.getElementsByClassName("category"), function (cat) {
    if ((navName+"-tab") === cat.id) {
      cat.classList.add("visible");
    } else {
      cat.classList.remove("visible");
    }
  });
  
}

function toggleHeader() {
  
  var header = document.getElementsByTagName("header")[0];
  var websiteDesc = document.getElementById("websiteDesc");
  
  if (header.classList.contains("collapsed")) {
    changeTab();
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
  console.log("popstate triggered with hash: " + hash)
  if (hash === '' || hash ==='#') {
    toggleHeader();
  } else {
    if (headerShown) {
      toggleHeader();
    }
    changeTab(hash);
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
