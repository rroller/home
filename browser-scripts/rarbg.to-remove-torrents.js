// ==UserScript==
// @name         rarbg torrent hider/remover
// @namespace    https://github.com/runraid/home
// @version      0.1
// @description  Removes torrents from the list of torrents (hide things you don't want to see)
// @author       runraid
// @match        https://rarbg.to/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function getBlacklist() {
        var blacklist = JSON.parse(localStorage.getItem("blacklist"));
        if (!blacklist) {
            blacklist = {};
        }
        return blacklist;
    }

    function blacklistItem(item) {
        var blacklist = getBlacklist();
        blacklist[item]=true;
        localStorage.setItem('blacklist', JSON.stringify(blacklist));
        getBlacklist();
    }

    var table = document.getElementsByClassName("lista2t");
    var trs = [];
    if (table) {
        trs = table[0].getElementsByTagName("tr");
    }

    var blacklistCopy = getBlacklist();

    for (var i = trs.length - 1; i >= 0; i--) {
        var tr = trs[i];
        var newtd = document.createElement('td');
        tr.appendChild(newtd);
        tr.insertBefore( newtd, tr.firstChild );

        if (i===0) {
            newtd.classList.add('header6');
            newtd.innerHTML = "Remove";
            continue;
        } else {
            newtd.innerHTML = "x";
        }

        var tds = tr.getElementsByTagName("td");
        var a = tds[2].getElementsByTagName("a")[0];
        var title = a.text.toLowerCase();

        if (blacklistCopy[title]) {
            tr.remove();
        } else {
            newtd.title = title;
            newtd.addEventListener('click', function(e){
                blacklistItem(e.target.title);
                e.target.parentNode.remove();
            });
        }
    }
})();

