/*jslint browser:true */

var headerShown = true; // I.e. whether the full screen banner is up


/**
 * Changes which "tab" is selected.
 * @param {string} navName The (optional) name of the nav
 * element to select. All others are unselected.
 */
function changeTab(navName) {

  var navs = document.getElementById("mainNav");
  var navAnchors = navs.getElementsByTagName("a");
  var categories = document.getElementsByClassName("category");

  // Buttons:
  [].forEach.call(navAnchors, function (nav) {
    if (navName === nav.getAttribute("href")) {
      nav.classList.add("selected");
      nav.focus();
    } else {
      nav.classList.remove("selected");
      nav.blur();
    }
  });

  // Content:
  [].forEach.call(categories, function (cat) {
    if ((navName + "-tab") === cat.id) {
      cat.classList.add("visible");
    } else {
      cat.classList.remove("visible");
    }
  });

}


function toggleHeader() {

  var header = document.getElementsByTagName("header")[0];
  var title = header.getElementsByTagName("h1")[0];
  var websiteDesc = document.getElementById("websiteDesc");

  if (header.classList.contains("collapsed")) {
    changeTab(); // Removes the selections on the tabs
    header.classList.remove("collapsed");
    title.innerHTML = title.innerHTML.replace('<a href="#">', '');
    title.innerHTML = title.innerHTML.replace("</a>", '');
    headerShown = true;
  } else {
    title.innerHTML = '<a href="#">' + title.innerHTML + '</a>';
    header.classList.add("collapsed");
    headerShown = false;
  }

}


// Detect hash changes in quite a heavy handed way,
// then toggle header and/or change highlighted navigation
window.addEventListener('popstate', function(event) {
  var hash = window.location.hash;
  if (hash === '' || hash === '#') {
    toggleHeader();
  } else {
    if (headerShown) {
      toggleHeader();
    }
    changeTab(hash);
  }
});


window.onload = function () {

  var title = document.getElementsByTagName("h1")[0];

  // If page is loaded with a hash, load the correct tab:
  if (window.location.hash) {
    toggleHeader();
    changeTab(window.location.hash);
  }

  title.onclick = function() {
    if (!headerShown) {
      window.location.hash = '';
    }
  };

  // Scrolling down on homepage goes to first tab
  window.addEventListener("mousewheel", function (e) {
    if (e.wheelDeltaY < 0 && window.location.hash === '') {
      window.location.hash = "#about";
    }
  }, false);

};
