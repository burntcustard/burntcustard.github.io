
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
            //a.classList.add('clicked');
            a.click(); // Argh flashy
            //a.focus();
        } else {
            a.classList.remove('clicked');
            a.classList.remove('observed');
            //a.blur();
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

    // // If page is loaded with a hash, load the correct tab:
    // if (window.location.hash) {
    //     toggleHeader();
    //     //changeTab(window.location.hash);
    // }
    //
    // // Toggle the header if the title in the small nav bar is clicked
    // document.getElementsByTagName('h1')[0].onclick = function () {
    //     if (!headerShown) {
    //         window.location.hash = '';
    //     }
    //     return false;
    // };
    //
    // // Scrolling down on homepage goes to first tab
    // window.addEventListener('wheel', event => {
    //     if (event.deltaY > 0 && window.location.hash === '') {
    //         window.location.hash = document.querySelector('main > section').id;
    //     }
    // }, false);
    //
    // // Async image (or anything) loading by swapping data-src string into src
    // document.querySelectorAll('[data-src]').forEach(element => {
    //     element.setAttribute('src', element.getAttribute('data-src'));
    // });
    //
    // // Set IDs of articles and related ARIA-labelledbys
    // document.querySelectorAll('section').forEach((category) => {
    //     category.querySelectorAll('article').forEach((article) => {
    //         var heading = article.querySelector('h2');
    //         if (heading && heading.innerHTML) {
    //             var id = strToId(category.id + '-' + heading.innerHTML);
    //             heading.id = id;
    //             article.setAttribute('aria-labelledby', id);
    //         }
    //     });
    // });
    //
    // // Add intersectionObservers for the categories
    //
    // // Links to sections on same page
    // //const secHeader = document.querySelector('.c-header--secondary');
    // var nav = document.querySelector('header > nav');
    //
    // var externalNavLinks = nav.querySelectorAll('a:not([href*="#"])');
    //
    // externalNavLinks.forEach(link => {
    //     link.classList.remove('clicked');
    //     link.onclick = function() {
    //         this.classList.add('clicked');
    //     }
    // });
    //
    // //const internalNavLinks = secHeader.querySelectorAll('a[href*="#"]');
    // var internalNavLinks = nav.querySelectorAll('a[href*="#"]');
    //
    // // Get the sections that match the links in the nav
    // var sections = [...internalNavLinks].map(
    //     link => document.getElementById(link.href.split("#").pop())
    // );
    //
    // console.log(sections);
    //
    // var observerConfig = {
    //     threshold: Array.from(Array(100), (x, i) => i * .01)
    // };
    //
    // var currentLinkObserver = new IntersectionObserver((entries) => {
    //     entries.forEach(entry => {
    //         let onscreenRatio = (entry.intersectionRatio * entry.target.scrollHeight) / window.innerHeight;
    //         if (onscreenRatio >= 0.5) {
    //             internalNavLinks.forEach(navLink => {
    //                 if (navLink.classList.contains('observed')) {
    //                     navLink.classList.remove('observed');
    //                     navLink.classList.remove('clicked');
    //                 }
    //             });
    //             let currentNavLink = nav.querySelector(`a[href="#${entry.target.id}"]`);
    //             currentNavLink.classList.add('observed');
    //         }
    //         // if (onscreenRatio < 0.5) {
    //         //     let currentNavLink = nav.querySelector('.observed');
    //         //     if (currentNavLink) {
    //         //         let currentNavLinkHref = currentNavLink.href.split("#").pop();
    //         //         let entryHref = entry.target.id;
    //         //         if (currentNavLinkHref === entryHref) {
    //         //             currentNavLink.classList.remove('observed');
    //         //         }
    //         //     }
    //         // }
    //     });
    //
    // }, observerConfig);
    //
    // sections.forEach(section => {
    //     if (section) {
    //         currentLinkObserver.observe(section);
    //     }
    // });

};
