// ==UserScript==
// @name         generic demo with menu
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
    //Boxever settings
    const BOXEVER_CLIENT_KEY = "pqsSIOPAxhMC9zJLJSZNFURPNqALIFwd";
    const BOXEVER_POINT_OF_SALE = "spinshop.com";
    const BOXEVER_API_TARGET = `https://api.boxever.com/v1.2`;
    const BOXEVER_WEB_FLOW_TARGET = "https://d35vb5cccm4xzp.cloudfront.net";
    const BOXEVER_JS_LIB_SRC = 'https://d1mj578wat5n4o.cloudfront.net/boxever-1.4.1.min.js';


    unsafeWindow._boxever_settings = {
        client_key: BOXEVER_CLIENT_KEY,
        target: BOXEVER_API_TARGET,
        pointOfSale: BOXEVER_POINT_OF_SALE,
        cookie_domain: '',
        web_flow_target: BOXEVER_WEB_FLOW_TARGET,
    };


    loadBxLib();
    delayUntilBrowserIdIsAvailable(sendViewEvent);


    function loadBxLib(callback) {
        console.log('Boxever Tampermonkey script - loadBxLib');
        var scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.src = BOXEVER_JS_LIB_SRC;
        scriptElement.async = false;
        document.head.appendChild(scriptElement);
    }

    function sendViewEvent() {
        console.log('Boxever Tampermonkey script - sendViewEvent');
        var viewEvent = {
            "browser_id": Boxever.getID(),
            "channel": "WEB",
            "type": "VIEW",
            "language": "EN",
            "currency": "EUR",
            "page": unsafeWindow.location.pathname + unsafeWindow.location.search,
            "pos": BOXEVER_POINT_OF_SALE,
            "session_data": { "uri": unsafeWindow.location.pathname }
        };
        Boxever.eventCreate(viewEvent, function (data) { }, 'json');
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'success',
            title: 'Sent View Event to Sitecore CDP '
        })
    }

    function delayUntilBrowserIdIsAvailable(functionToDelay) {
        if (unsafeWindow.Boxever == null || unsafeWindow.Boxever == undefined || unsafeWindow.Boxever === "undefined" || unsafeWindow.Boxever.getID() === "anonymous") {
            const timeToWaitInMilliseconds = 300;
            console.log(`Boxever browserId is not yet available. Waiting ${timeToWaitInMilliseconds}ms before retrying.`);
            unsafeWindow.setTimeout(delayUntilBrowserIdIsAvailable, timeToWaitInMilliseconds, functionToDelay);
        } else {
            functionToDelay();
        }
    }




    GM_addStyle("/* Offside instances */.offside {    padding: 20px 0;    width: 200px;    background-color: #19a5a2;}/* Lists */ul {    clear: both;    margin: 0;    padding: 0 20px;}li {    list-style: none;    margin-left: 1em;}li {margin-bottom:0.5em} li > a{    text-decoration: none;    color: #fdf9f9;}/* Offside buttons */.offside-button {    width: 100%;    max-width: 350px;    padding: 10px;    margin: 0 auto 10px auto;    background: #FFE200;    color: #000;    text-align: center;    cursor: pointer;}.offside-button:hover {    background: #FFD900;}.site-overlay {    z-index: 1;    position: absolute;    top: 0;    right: 0;    bottom: 0;    left: 0;    background-color: #FFF;    visibility: hidden;    opacity: 0;    cursor: pointer;    -webkit-transition: visibility 0s ease, opacity .2s ease;    -moz-transition: visibility 0s ease, opacity .2s ease;    -o-transition: visibility 0s ease, opacity .2s ease;    transition: visibility 0s ease, opacity .2s ease;}/* Abstract icon class*/.icon {    display: block;    position: relative;    padding: 10px 0;    background-color: transparent;    background-image: none;    border: 1px solid transparent;}.icon .icon-bar {    display: block;    width: 22px;    height: 2px;    border-radius: 1px;    background-color: #313131;}.icon:hover .icon-bar {    background-color: #989898;}.icon:focus {    outline: 0;}/* Hamburger button */.icon--hamburger .icon-bar + .icon-bar {    margin-top: 4px;}/* Close button */.icon--cross {    padding: 20px;}.icon--cross > .icon-bar + .icon-bar {    -webkit-transform: rotate(45deg);    -ms-transform: rotate(45deg);    -o-transform: rotate(45deg);    transform: rotate(45deg);}.icon--cross > .icon-bar{    -webkit-transform: rotate(-45deg);    -ms-transform: rotate(-45deg);    -o-transform: rotate(-45deg);    transform: rotate(-45deg);    margin-top: -2px;}");
    function injectStylesheet(url) {
        $('head').append('<link rel="stylesheet" href="' + url + '" type="text/css" />');
    }
    injectStylesheet("https://cdn.jsdelivr.net/npm/offside-js@1.4.0/dist/offside.css");
    var htmlStr = "  <button style=\"display:none\" type=\"button\" id=\"my-button\">Offside toggle<\/button>  <nav id=\"my-menu\"> <img style=\"max-width: 85%; margin-bottom:1em;margin-left: 0.8em;\" src=\"https://sitecorecdn.azureedge.net/-/media/sitecoresite/images/global/logo/sitecore-logo.svg?la=en&hash=2134EC93C845A2DAC7C816F011AA5C52\" tabindex=\"-1\" alt=\"Sitecore Logo\"> <ul> <li id=\"browsingAsBtn\"><a  style=\"color:white\" href=\"#\">Currently browsing as<\/a><\/li>    <li id=\"startAsAnonBtn\"><a style=\"color:white\" href=\"#\">Start as Anon<\/a><\/li>   <li id=\"closeSessionBtn\"><a style=\"color:white\" href=\"#\">Close Session<\/a><\/li>    <li id=\"identifyBtn\" ><a style=\"color:white\" href=\"#\">Identify<\/a><\/li> <li id=\"sendEventBtn\" ><a style=\"color:white\" href=\"#\">Send Event<\/a><\/li> <li id=\"addDataExtBtn\" ><a style=\"color:white\" href=\"#\">Add Data Extension<\/a><\/li> <\/ul>  <\/nav>  <!-- Your Content -->  <div id=\"my-content-container\">    <\/div>";
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



    // CTRL+D = toggle menu
    function KeyPress(e) {
        var evtobj = unsafeWindow.event ? event : e
        if (evtobj.keyCode == 68 && evtobj.ctrlKey) {
            myOffside.toggle();
        }
    }
    document.onkeydown = KeyPress;

    // START menu button listners *********************************************

    $("#identifyBtn").click(async function () {

        // const { value: email } = await Swal.fire({
        //     input: 'email',
        //     inputLabel: 'Send an Identity Event',
        //     inputPlaceholder: 'Enter the email identifier',
        //     showCancelButton: true,
        //     html: `<input type="text" id="login" class="swal2-input" placeholder="Username">
        //             <input type="password" id="password" class="swal2-input" placeholder="Password">`,
        // })
        // if (email) {
        //     var identifyEvent = {
        //         "browser_id": Boxever.getID(),
        //         "channel": "WEB",
        //         "type": "IDENTITY",
        //         "language": "EN",
        //         "currency": "USD",
        //         "page": "CHEKOUT",
        //         "pos": BOXEVER_POINT_OF_SALE,
        //         "email": email,
        //         "firstname": "fname",
        //         "lastname": "lname"
        //     };
        //     Boxever.eventCreate(identifyEvent, function (data) { }, 'json');
        //     Swal.fire(`identified as: ${email}`)
        // }
        Swal.fire({
            title: 'Send Identity Event',
            html: `<input type="text" id="bxEmail" class="swal2-input" placeholder="email">
                <input type="text" id="bxFname" class="swal2-input" placeholder="first name">
                <input type="text" id="bxLname" class="swal2-input" placeholder="last name">`,
            confirmButtonText: 'Send Identity Event',
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                const email = Swal.getPopup().querySelector('#bxEmail').value;
                const fname = Swal.getPopup().querySelector('#bxFname').value
                const lname = Swal.getPopup().querySelector('#bxLname').value
                return { email: email, fname: fname, lname: lname }
            }
        }).then((result) => {
            const email = Swal.getPopup().querySelector('#bxEmail').value;
            const fname = Swal.getPopup().querySelector('#bxFname').value
            const lname = Swal.getPopup().querySelector('#bxLname').value
            var identifyEvent = {
                "browser_id": Boxever.getID(),
                "channel": "WEB",
                "type": "IDENTITY",
                "language": "EN",
                "currency": "USD",
                "page": "CHEKOUT",
                "pos": BOXEVER_POINT_OF_SALE,
                "email": email,
                "firstname": fname,
                "lastname": lname
            };
            Boxever.eventCreate(identifyEvent, function (data) { }, 'json');
            Swal.fire(`identified as: ${email}`)

        })

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
                const eventType = Swal.getPopup().querySelector('#eventType').value
                const kv1 = Swal.getPopup().querySelector('#kv1').value
                if (!eventType) {
                    Swal.showValidationMessage(`Please enter an event type`)
                }
                return { eventType: eventType, kv1: kv1 }
            }
        }).then((result) => {
            const kv1 = Swal.getPopup().querySelector('#kv1').value;
            const kv1_values = kv1.split(",");

            const kv2 = Swal.getPopup().querySelector('#kv2').value;
            const kv2_values = kv2.split(",");

            const kv3 = Swal.getPopup().querySelector('#kv3').value;
            const kv3_values = kv3.split(",");

            var bxEvent = {
                "browser_id": Boxever.getID(),
                "channel": "WEB",
                "type": result.value.eventType,
                "language": "EN",
                "currency": "EUR",
                "page": unsafeWindow.location.pathname + unsafeWindow.location.search,
                "pos": BOXEVER_POINT_OF_SALE,
                "session_data": { "uri": unsafeWindow.location.pathname }

            };
            if (kv1 != null && kv1 != undefined && kv1 != "undefeined") {
                bxEvent[kv1_values[0]] = kv1_values[1];
            }
            if (kv2 != null && kv2 != undefined && kv2 != "undefeined") {
                bxEvent[kv2_values[0]] = kv2_values[1];
            }
            if (kv3 != null && kv3 != undefined && kv3 != "undefeined") {
                bxEvent[kv3_values[0]] = kv3_values[1];
            }

            Boxever.eventCreate(bxEvent, function (data) { }, 'json');
            Swal.fire(`
                Sent ${result.value.eventType} event to Sitecore CDP
                `.trim())
        })

    });

    $("#browsingAsBtn").click(function () {

        var cdpProfileLink = 'https://app.boxever.com/#/guests/list?filter=customer&q=bid:' + unsafeWindow.Boxever.getID();
        unsafeWindow.open(cdpProfileLink, '_blank').focus();

        // Swal.fire({
        //     title: '<strong>Youre currently browsing as <u>Richard Flynn</u></strong>',
        //     icon: 'info',
        //     html:
        //         'ID <b>123456789</b>, ' +
        //         '<a id="cdpProfileRerirectBtn">CDP Profile</a> ',
        //     showCloseButton: true,
        //     showCancelButton: false,
        //     focusConfirm: false,
        //     confirmButtonText:
        //         '<i class="fa fa-thumbs-up"></i> OK',
        //     confirmButtonAriaLabel: 'Thumbs up, great!',
        //     cancelButtonText:
        //         '<i class="fa fa-thumbs-down"></i>',
        //     cancelButtonAriaLabel: 'Thumbs down'
        // })
        // function cdpProfileRedirect() {
        //     var cdpProfileLink = 'https://app.boxever.com/#/guests/list?filter=customer&q=bid:' + unsafeWindow.Boxever.getID();
        //     unsafeWindow.open(cdpProfileLink, '_blank').focus();
        // }
        // document.getElementById("cdpProfileRerirectBtn").addEventListener("click", cdpProfileRedirect, false);

    });

    $("#closeSessionBtn").click(function () {

        Swal.fire({
            title: 'Close session?',
            text: "This will end the ongoing CDP session...",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#19a5a2',
            cancelButtonColor: '#232323',
            confirmButtonText: 'Yes, close the session'
        }).then((result) => {
            if (result.isConfirmed) {
                //_boxeverq.push(function () {
                var closeSessionEvent = {
                    browser_id: Boxever.getID(),
                    channel: "WEB",
                    language: "EN",
                    currency: "EUR",
                    pos: BOXEVER_POINT_OF_SALE,
                    type: "FORCE_CLOSE",
                    _bx_extended_message: "1"
                };

                Boxever.eventCreate(closeSessionEvent, function (data) { }, 'json');
                // });
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
            confirmButtonColor: '#19a5a2',
            cancelButtonColor: '#232323',
            confirmButtonText: 'Yes, start a new anonymous session'
        }).then((result) => {
            if (result.isConfirmed) {
                //_boxeverq.push(function () {
                Boxever.reset();
                //});

                Swal.fire({
                    title: 'Reload the page to browse as the new anon user',
                    text: "You won't be able to revert this!",
                    //icon: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#19a5a2',
                    confirmButtonText: 'Reload page'
                }).then((result) => {
                    location.reload();
                })


            }
        })

    });

    // END menu button listners *********************************************

})();
