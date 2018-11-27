
var headerShown = true; // I.e. whether the full screen banner is up


/**
 * Changes which "tab" is selected.
 * @param {string} navName The (optional) name of the nav
 * element to select. All others are unselected.
 */
function changeTab(navName) {

    'use strict';

    document.querySelectorAll('#mainNav > a').forEach((a) => {
        if (navName === a.getAttribute('href')) {
            a.classList.add('selected');
            a.focus();
        } else {
            a.classList.remove('selected');
            a.blur();
        }
    });

    document.querySelectorAll('main > section').forEach((category) => {
        if (navName === category.id) {
            category.classList.add('visible');
            category.setAttribute('aria-hidden', 'false');
        } else {
            category.classList.remove('visible');
            category.setAttribute('aria-hidden', 'true');
        }
    });

}


function toggleHeader() {

    'use strict';

    var header = document.getElementsByTagName('header')[0],
        title = header.getElementsByTagName('h1')[0];

    if (header.classList.contains('collapsed')) {
        changeTab(); // Removes the selections on the tabs
        header.classList.remove('collapsed');
        title.innerHTML = title.innerHTML.replace('<a href="#">', '');
        title.innerHTML = title.innerHTML.replace('</a>', '');
        headerShown = true;
    } else {
        title.innerHTML = '<a href="#">' + title.innerHTML + '</a>';
        header.classList.add('collapsed');
        headerShown = false;
    }

}


// Detect hash changes in quite a heavy handed way,
// then toggle header and/or change highlighted navigation
window.addEventListener('popstate', function (event) {

    'use strict';

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

    'use strict';

    var title = document.getElementsByTagName('h1')[0];

    // If page is loaded with a hash, load the correct tab:
    if (window.location.hash) {
        toggleHeader();
        changeTab(window.location.hash);
    }

    // Toggle the header if the title in the small nav bar is clicked
    title.onclick = function () {
        if (!headerShown) {
            window.location.hash = '';
        }
        return false;
    };

    // Scrolling down on homepage goes to first tab
    window.addEventListener('mousewheel', function (e) {
        if (e.wheelDeltaY < 0 && window.location.hash === '') {
            window.location.hash = document.querySelector('main > section').id;
        }
    }, false);

    // Async image (or anything) loading by swapping data-src string into src
    document.querySelectorAll('[data-src]').forEach(element => {
        element.setAttribute('src', element.getAttribute('data-src'));
    });

};
