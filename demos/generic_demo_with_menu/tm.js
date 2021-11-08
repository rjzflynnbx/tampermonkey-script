// ==UserScript==
// @name         offside js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.littlewoodsireland.ie/*
// @match        https://www.vail.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/offside-js@1.4.0/dist/offside.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11

// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle("/* Offside instances */.offside {    padding: 20px 0;    width: 200px;    background-color: #FFE200;}/* Lists */ul {    clear: both;    margin: 0;    padding: 0 20px;}li {    list-style: none;    margin-left: 1em;}li > a{    text-decoration: none;    color: #000;}/* Offside buttons */.offside-button {    width: 100%;    max-width: 350px;    padding: 10px;    margin: 0 auto 10px auto;    background: #FFE200;    color: #000;    text-align: center;    cursor: pointer;}.offside-button:hover {    background: #FFD900;}.site-overlay {    z-index: 1;    position: absolute;    top: 0;    right: 0;    bottom: 0;    left: 0;    background-color: #FFF;    visibility: hidden;    opacity: 0;    cursor: pointer;    -webkit-transition: visibility 0s ease, opacity .2s ease;    -moz-transition: visibility 0s ease, opacity .2s ease;    -o-transition: visibility 0s ease, opacity .2s ease;    transition: visibility 0s ease, opacity .2s ease;}/* Abstract icon class*/.icon {    display: block;    position: relative;    padding: 10px 0;    background-color: transparent;    background-image: none;    border: 1px solid transparent;}.icon .icon-bar {    display: block;    width: 22px;    height: 2px;    border-radius: 1px;    background-color: #313131;}.icon:hover .icon-bar {    background-color: #989898;}.icon:focus {    outline: 0;}/* Hamburger button */.icon--hamburger .icon-bar + .icon-bar {    margin-top: 4px;}/* Close button */.icon--cross {    padding: 20px;}.icon--cross > .icon-bar + .icon-bar {    -webkit-transform: rotate(45deg);    -ms-transform: rotate(45deg);    -o-transform: rotate(45deg);    transform: rotate(45deg);}.icon--cross > .icon-bar{    -webkit-transform: rotate(-45deg);    -ms-transform: rotate(-45deg);    -o-transform: rotate(-45deg);    transform: rotate(-45deg);    margin-top: -2px;}");
    function injectStylesheet(url) {
        $('head').append('<link rel="stylesheet" href="' + url + '" type="text/css" />');
    }
    injectStylesheet("https://cdn.jsdelivr.net/npm/offside-js@1.4.0/dist/offside.css");
    var htmlStr = "  <button style=\"display:none\" type=\"button\" id=\"my-button\">Offside toggle<\/button>  <nav id=\"my-menu\">  <ul> <li id=\"browsingAsBtn\"><a href=\"#\">Currently browsing as<\/a><\/li>    <li id=\"startAsAnonBtn\"><a href=\"#\">Start as Anon<\/a><\/li>   <li id=\"closeSessionBtn\"><a href=\"#\">Close Session<\/a><\/li>    <li id=\"identifyBtn\" ><a href=\"#\">Identify<\/a><\/li> <li id=\"sendEventBtn\" ><a href=\"#\">Send Event<\/a><\/li> <li id=\"addDataExtBtn\" ><a href=\"#\">Add Data Extension<\/a><\/li> <\/ul>  <\/nav>  <!-- Your Content -->  <div id=\"my-content-container\">    <\/div>";
    var element = document.getElementsByTagName("body")[0];
    element.insertAdjacentHTML('afterbegin', htmlStr);


    var myOffside = offside('#my-menu', {

        // Global offside options: affect all offside instances
        slidingElementsSelector: '#my-content-container', // String: Sliding elements selectors ('#foo, #bar')
        disableCss3dTransforms: false,                    // Disable CSS 3d Transforms support (for testing purposes)
        debug: true,                                      // Boolean: If true, print errors in console

        // Offside instance options: affect only this offside instance
        buttonsSelector: '#my-button, .another-button',   // String: Offside toggle buttons selectors ('#foo, #bar')
        slidingSide: 'right',                             // String: Offside element pushed on left or right
        init: function () { },                               // Function: After init callback
        beforeOpen: function () { },                         // Function: Before open callback
        afterOpen: function () { },                          // Function: After open callback
        beforeClose: function () { },                        // Function: Before close callback
        afterClose: function () { },                         // Function: After close callback

    });

    function KeyPress(e) {
        var evtobj = window.event ? event : e

        if (evtobj.keyCode == 68 && evtobj.ctrlKey) {
            // if (confirm('toggle?')) {
            myOffside.toggle();
            // }
        }
    }
    document.onkeydown = KeyPress;


    $("#identifyBtn").click(async function () {

        const { value: url } = await Swal.fire({
            input: 'email',
            inputLabel: 'Send an Identity Event',
            inputPlaceholder: 'Enter the email identifier',
            showCancelButton: true,
        })

        if (url) {
            Swal.fire(`Entered email identifier: ${url}`)
        }

    });

    $("#addDataExtBtn").click(async function () {

        Swal.fire({
            title: 'Add Data Extension',
            html: `<input type="text" id="eventType" class="swal2-input" placeholder="Data Extension Name">
            <input type="text" id="dataExtKey" class="swal2-input" placeholder="data extension key">
            <input type="text" id="kv1" class="swal2-input" placeholder="key,value">
            <input type="text" id="kv2" class="swal2-input" placeholder="key,value">
            <input type="text" id="kv3" class="swal2-input" placeholder="key,value">
            <input type="text" id="kv4" class="swal2-input" placeholder="key,value">
            <input type="text" id="kv5" class="swal2-input" placeholder="key,value">`,
            confirmButtonText: 'Add Data Extension',
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                const login = Swal.getPopup().querySelector('#login').value
                const password = Swal.getPopup().querySelector('#password').value
                if (!login || !password) {
                    Swal.showValidationMessage(`Please enter login and password`)
                }
                return { login: login, password: password }
            }
        }).then((result) => {
            Swal.fire(`
              Login: ${result.value.login}
              Password: ${result.value.password}
            `.trim())
        })

    });

    $("#sendEventBtn").click(async function () {

        Swal.fire({
            title: 'Send CDP Event',
            html: `<input type="text" id="eventType" class="swal2-input" placeholder="eventType">
            <input type="text" id="kv1" class="swal2-input" placeholder="key,value">
            <input type="text" id="kv2" class="swal2-input" placeholder="key,value">
            <input type="text" id="kv3" class="swal2-input" placeholder="key,value">`,
            confirmButtonText: 'Send Event',
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                const login = Swal.getPopup().querySelector('#login').value
                const password = Swal.getPopup().querySelector('#password').value
                if (!login || !password) {
                    Swal.showValidationMessage(`Please enter login and password`)
                }
                return { login: login, password: password }
            }
        }).then((result) => {
            Swal.fire(`
              Login: ${result.value.login}
              Password: ${result.value.password}
            `.trim())
        })

    });

    $("#browsingAsBtn").click(function () {



        Swal.fire({
            title: '<strong>Youre currently browsing as <u>Richard Flynn</u></strong>',
            icon: 'info',
            html:
                'ID <b>123456789</b>, ' +
                '<a id="cdpProfileRerirectBtn">CDP Profile</a> ',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText:
                '<i class="fa fa-thumbs-up"></i> OK',
            confirmButtonAriaLabel: 'Thumbs up, great!',
            cancelButtonText:
                '<i class="fa fa-thumbs-down"></i>',
            cancelButtonAriaLabel: 'Thumbs down'
        })
        function cdpProfileRedirect() {
            var cdpProfileLink = 'https://app.boxever.com/#/guests/list?filter=customer&q=bid:bidhere'; //Boxever.getID();
            window.open(cdpProfileLink, '_blank').focus();
        }
        document.getElementById("cdpProfileRerirectBtn").addEventListener("click", cdpProfileRedirect, false);

    });

    $("#closeSessionBtn").click(function () {

        Swal.fire({
            title: 'Close session?',
            text: "This will end the ongoing CDP session...",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, close the session'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Session Closed!',
                    'Your session has been closed.',
                    'success'
                )
            }
        })

    });

    $("#startAsAnonBtn").click(function () {

        Swal.fire({
            title: 'Start a new anonymous session?',
            text: "This will reload the page...",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, start a new anonymous session'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })

    });



})();
