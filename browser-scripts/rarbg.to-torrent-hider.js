// ==UserScript==
// @name         rarbg torrent hider/remover
// @namespace    https://github.com/rroller/home
// @version      0.2
// @description  Removes torrents from the list of torrents (hide things you don't want to see)
// @author       rroller
// @match        https://rarbg.to/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const yearRegex = /(\d{4})/;
    const table = document.getElementsByClassName("lista2t");
    const blacklistCopy = getBlacklist();
    const tokens = ["korsub", "dvdscr", "screener", "stuttershit"];
    const trs = table ? table[0].getElementsByTagName("tr") : [];

    function getBlacklist() {
        const blacklist = JSON.parse(localStorage.getItem("blacklist"));
        if (!blacklist) {
            return {};
        }
        return blacklist;
    }

    function blacklistItem(item) {
        const blacklist = getBlacklist();
        blacklist[item]=true;
        localStorage.setItem('blacklist', JSON.stringify(blacklist));
        getBlacklist();
    }

    function isBlacklisted(blacklistCopy, title) {
        for (let key in blacklistCopy) {
            if (title.startsWith(key)) {
                return true;
            }
        }

        return false;
    }

    function getTitleFromRow(tr) {
        const tds = tr.getElementsByTagName("td");
        const a = tds[2].getElementsByTagName("a")[0];
        if (a && a.text) {
            return a.text.toLowerCase();
        }
        return null;
    }

    function getBlackListTitle(title) {
        for (let i=0;i<tokens.length;i++) {
            let token = tokens[i];

            const idx = title.toLowerCase().indexOf(token);
            if (idx > 1) {
                return title.substring(0, idx + token.length);
            }
        }

        const matched = title.match(yearRegex);
        if (matched && matched.length && matched.index > 0) {
            return title.substring(0, matched.index+4);
        }
        return title;
    }

    function recalc() {
        let trs = [];
        if (table) {
            trs = table[0].getElementsByTagName("tr");
        }
        for (let i = trs.length - 1; i >= 0; i--) {
            const tr = trs[i];
            const title = getTitleFromRow(tr);
            if (isBlacklisted(blacklistCopy, title)) {
                tr.remove();
            }
        }
    }

    for (let i = trs.length - 1; i >= 0; i--) {
        const tr = trs[i];
        const newtd = document.createElement('td');
        tr.appendChild(newtd);
        tr.insertBefore( newtd, tr.firstChild );

        if (i===0) {
            newtd.classList.add('header6');
            newtd.innerHTML = "Remove";
            continue;
        } else {
            newtd.innerHTML = "x";
        }

        const title = getTitleFromRow(tr);

        if (isBlacklisted(blacklistCopy, title)) {
            tr.remove();
        } else {
            newtd.title = title;
            newtd.addEventListener('click', function(e){
                let titleTruncated = getBlackListTitle(e.target.title);
                console.log(titleTruncated);
                titleTruncated = prompt(e.target.title, titleTruncated);

                if (titleTruncated) {
                    blacklistItem(titleTruncated.toLowerCase());
                    e.target.parentNode.remove();
                    recalc(); // this is not working
                }
            });
        }
    }
})();
