// ==UserScript==
// @name         UnShitterflyIt
// @namespace    https://github.com/runraid/home
// @version      0.1
// @description  Skips ads on adf.ly and ridirectly you directly to the download.
// @author       runraid
// @match        http://adf.ly/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const meta = document.querySelector("meta[property='og:url']");
    console.log(meta);
    if (meta && meta.content) {
       window.location =  meta.content;
    }
})();
