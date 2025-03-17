// ==UserScript==
// @name         Novel Updates Filter Result by Country
// @namespace    https://github.com/TigorLazuardi/novel-updates-filter
// @include      https://www.novelupdates.com/genre/*
// @include      https://www.novelupdates.com/novelslisting/*
// @include      https://www.novelupdates.com/series-ranking/*
// @include      https://www.novelupdates.com/stag/*
// @include      https://www.novelupdates.com/series-finder/*
// @include      https://www.novelupdates.com/latest-series/*
// @include      https://www.novelupdates.com/viewlist/*
// @match        https://www.novelupdates.com/
// @version      1.2.2
// @description  Filters novel update results by country
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @homepageURL  https://github.com/TigorLazuardi/novel-updates-filter
// @supportURL   https://github.com/TigorLazuardi/novel-updates-filter
// @downloadURL  https://update.greasyfork.org/scripts/408524/Novel%20Updates%20Filter%20Result%20by%20Country.user.js
// @updateURL    https://update.greasyfork.org/scripts/408524/Novel%20Updates%20Filter%20Result%20by%20Country.meta.js
// ==/UserScript==

(function waitForPage() {
    if (document.readyState !== "complete") {
        console.log("Waiting for page to load...");
        return setTimeout(waitForPage, 500);
    }
    console.log("Page loaded. Running script...");

    const origins = {
        Korea: 'orgkr',
        China: 'orgcn',
        Japan: 'orgjp',
        Indonesia: 'orgid',
        Malaysia: 'orgmy',
        Filipino: 'orgfil',
        Thailand: 'orgth',
        Vietnam: 'orgvn',
    };

    const isMobile = /android|iphone/i.test(navigator.userAgent);
    const desktopHome = document.querySelector('.l-content table#myTable');
    const mobileHome = document.querySelector('.tbl_m_release');

    let injectLoc = document.querySelector(".search_sort") ||
                    document.querySelector("#rankfilter") ||
                    document.querySelector(".ucl_main") ||
                    desktopHome ||
                    mobileHome;

    console.log("Inject location:", injectLoc);

    if (!injectLoc) {
        console.warn("Inject location not found. Inserting filter at the top of the page.");
        injectLoc = document.body;
    }

    // Create filter area
    const filterArea = document.createElement('div');
    filterArea.style.margin = '25px 0';
    filterArea.style.backgroundColor = '#DAE8EC';
    filterArea.style.borderRadius = '10px';
    filterArea.style.border = '2px solid #B8CB99';
    filterArea.style.padding = '10px';

    const filterLabel = document.createElement('p');
    filterLabel.innerHTML = '<b>Blocklist :</b>';
    filterLabel.style.marginBottom = '0';

    const selections = document.createElement('div');
    selections.style.display = 'flex';
    selections.style.flexWrap = 'wrap';

    function setDisplay(selector, display) {
        const elements = document.querySelectorAll(selector);

        if (elements.length === 0) {
            console.warn("No elements found for selector:", selector);
            return;
        }

        elements.forEach((el) => {
            let parentRow = el.closest('tr');  // Get closest row or container
            if (!parentRow) {
                console.warn("No row found for element:", el);
                return;
            }
            parentRow.style.display = display ? '' : 'none';
        });
    }

    function toggleFilter() {
        const country = this.id;
        const className = `.${origins[country]}`;
        const prevState = GM_getValue(country, true);
        const newState = !prevState;

        console.log(`Toggling ${country}:`, newState);

        setDisplay(className, newState);
        this.style.backgroundColor = newState ? 'white' : '#F9F871';

        GM_setValue(country, newState);
    }

    // Create filter buttons
    for (const country in origins) {
        const show = GM_getValue(country, true);
        const item = document.createElement('div');
        const name = document.createElement('p');

        name.innerText = country;
        name.style.marginBottom = '0';

        item.appendChild(name);
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'center';
        item.style.minWidth = '80px';
        item.style.backgroundColor = show ? 'white' : '#F9F871';
        item.style.padding = '5px';
        item.style.margin = '5px';
        item.style.cursor = 'pointer';
        item.style.borderRadius = '10px';
        item.style.border = '2px solid #7c5262';
        item.id = country;
        item.addEventListener('click', toggleFilter);

        setDisplay(`.${origins[country]}`, show);
        selections.appendChild(item);
    }

    filterArea.appendChild(filterLabel);
    filterArea.appendChild(selections);

    // Insert the filter
    injectLoc.parentNode.insertBefore(filterArea, injectLoc.nextSibling);
})();
