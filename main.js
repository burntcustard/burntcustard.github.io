
var headerShown = true; // I.e. whether the full screen banner is up


/**
 * Changes which "tab" is selected.
 * @param {string} navName The (optional) name of the nav
 * element to select. All others are unselected.
 */
function changeTab(navName) {

    'use strict';

    var main = document.getElementsByTagName('main')[0];

    console.log(navName);

    if (navName === undefined || navName === '') {
        main.scrollTo(0, 0);
    }

    document.querySelectorAll('#mainNav > a').forEach((a) => {
        if (navName === a.getAttribute('href')) {
            a.classList.add('selected');
            a.focus();
        } else {
            a.classList.remove('selected');
            a.blur();
        }
    });

    var foundVisible = false;
    main.querySelectorAll('section').forEach((category, index) => {
        if (navName === category.id) {
            //category.classList.add('visible');
            category.setAttribute('aria-hidden', 'false');
            category.style.transform = 'translate(0)';
            foundVisible = true;
        } else {
            category.classList.remove('visible');
            //category.setAttribute('aria-hidden', 'true');
            if (!foundVisible) {
                category.style.transform = 'translate(-100%)';
            } else {
                category.style.transform = 'translate(100%)';
            }
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


function strToId(string) {
    return string.replace(/\W/g, '-').toLowerCase();
}


window.onload = function () {

    'use strict';

    // If page is loaded with a hash, load the correct tab:
    if (window.location.hash) {
        toggleHeader();
        changeTab(window.location.hash);
    }

    // Toggle the header if the title in the small nav bar is clicked
    document.getElementsByTagName('h1')[0].onclick = function () {
        if (!headerShown) {
            window.location.hash = '';
        }
        return false;
    };

    // Scrolling down on homepage goes to first tab
    window.addEventListener('wheel', event => {
        console.log(event.deltaY);
        if (event.deltaY > 0 && window.location.hash === '') {
            window.location.hash = document.querySelector('main > section').id;
        }
    }, false);

    // Async image (or anything) loading by swapping data-src string into src
    document.querySelectorAll('[data-src]').forEach(element => {
        element.setAttribute('src', element.getAttribute('data-src'));
    });

    // Set ARIA-labelledbys
    document.querySelectorAll('section > article').forEach((article) => {
        var heading = article.querySelector('h2');
        if (heading && heading.innerHTML) {
            var id = strToId(heading.innerHTML);
            heading.id = id;
            article.setAttribute('aria-labelledby', id);
        }
    });


};
