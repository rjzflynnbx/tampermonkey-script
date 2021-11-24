// ==UserScript==
// @name         generic demo with menu
// @namespace    https://www.tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.example.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/offside-js@1.4.0/dist/offside.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11

// ==/UserScript==

(function () {
    'use strict';


    // Client keys (do not change)
    const PARTNER_SANDBOX_CLIENT_KEY = "psfu6uh05hsr9c34rptlr06dn864cqrx"
    const SPINSHOP_CLIENT_KEY = "pqsSIOPAxhMC9zJLJSZNFURPNqALIFwd"

    // Points of sale (do not change)
    const PARTNER_SANDBOX_DEFAULT_POS = "pos-demo";
    const SPINSHOP_DEFAULT_POS = "spinshop.com";

    // Start Demo Settings -----------------------------------------------------------------------------------------------
    const BOXEVER_CLIENT_KEY = PARTNER_SANDBOX_CLIENT_KEY;
    const BOXEVER_POINT_OF_SALE = PARTNER_SANDBOX_DEFAULT_POS;
    const SHOW_TOAST_ON_PAGE_VIEW_EVENT = true;
    // End Demo Settings -------------------------------------------------------------------------------------------------



    //Boxever settings
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

        if (SHOW_TOAST_ON_PAGE_VIEW_EVENT) {
            Toast.fire({
                icon: 'success',
                title: 'Sent VIEW Event to Sitecore CDP '
            })
        }

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
    var htmlStr = "  <button style=\"display:none\" type=\"button\" id=\"my-button\">Offside toggle<\/button>  <nav id=\"my-menu\"> <img style=\"max-width: 85%; margin-bottom:1em;margin-left: 0.8em;\" src=\"https://sitecorecdn.azureedge.net/-/media/sitecoresite/images/global/logo/sitecore-logo.svg?la=en&hash=2134EC93C845A2DAC7C816F011AA5C52\" tabindex=\"-1\" alt=\"Sitecore Logo\"> <ul> <li id=\"browsingAsBtn\"> <a  style=\"color:white\" href=\"#\">CDP Guest Profile<\/a><\/li>    <li id=\"startAsAnonBtn\"><a style=\"color:white\" href=\"#\">Start as Anon<\/a><\/li>   <li id=\"closeSessionBtn\"><a style=\"color:white\" href=\"#\">Close Session<\/a><\/li>    <li id=\"identifyBtn\" ><a style=\"color:white\" href=\"#\">Identify<\/a><\/li> <li id=\"sendEventBtn\" ><a style=\"color:white\" href=\"#\">Send Event<\/a><\/li> <li id=\"addDataExtBtn\" ><a style=\"color:white\" href=\"#\">Add Data Extension<\/a><\/li> <li id=\"removeDataExtBtn\" ><a style=\"color:white\" href=\"#\">Remove Data Extension<\/a><\/li> <\/ul>  <\/nav>  <!-- Your Content -->  <div id=\"my-content-container\">    <\/div>";
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

    function isv2DataModel() {
        if (BOXEVER_CLIENT_KEY === PARTNER_SANDBOX_CLIENT_KEY) {
            return true;
        }
        return false;
    }

    // START menu button listners *********************************************
    $("#identifyBtn").click(async function () {

        Swal.fire({
            title: 'Send Identity Event',
            html: `<input type="text" id="bxEmail" class="swal2-input" placeholder="email">
                <input type="text" id="bxFname" class="swal2-input" placeholder="first name">
                <input type="text" id="bxLname" class="swal2-input" placeholder="last name">`,
            confirmButtonText: 'Send Identity Event',
            confirmButtonColor: '#19a5a2',
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
            const fname = Swal.getPopup().querySelector('#bxFname').value;
            const lname = Swal.getPopup().querySelector('#bxLname').value;

            if (email != null && email != undefined && email != "undefined" && email != "") {

                var identifyEvent = {};
                if (isv2DataModel()) {
                    identifyEvent = {
                        "browser_id": Boxever.getID(),
                        "channel": "WEB",
                        "type": "IDENTITY",
                        "language": "EN",
                        "currency": "USD",
                        "page": "CHEKOUT",
                        "pos": BOXEVER_POINT_OF_SALE,
                        "email": email,
                        "firstname": fname,
                        "lastname": lname,
                        "identifiers": [{
                            "provider": "BXEMAIL",
                            "id": email
                        }]
                    };
                } else {
                    identifyEvent = {
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
                }

                Boxever.eventCreate(identifyEvent, function (data) { }, 'json');
                Swal.fire(`identified as: ${email}`)
            }
        })
    });

    $("#addDataExtBtn").click(async function () {

        Swal.fire({
            title: 'Add Data Extension',
            html: `<input type="text" id="dataExtName" class="swal2-input" placeholder="Data Extension Name">
                <input type="text" id="dataExtKey" class="swal2-input" placeholder="data extension key">
                <input type="text" id="_kv1" class="swal2-input" placeholder="key,value">
                <input type="text" id="_kv2" class="swal2-input" placeholder="key,value">
                <input type="text" id="_kv3" class="swal2-input" placeholder="key,value">
                `,
            confirmButtonText: 'Add Data Extension',
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {


            }
        }).then((result) => {

            var dataExtName = Swal.getPopup().querySelector('#dataExtName').value;
            var dataExtKey = Swal.getPopup().querySelector('#dataExtKey').value;

            const kv1 = Swal.getPopup().querySelector('#_kv1').value.trim();
            const kv1_values = kv1.split(",");

            const kv2 = Swal.getPopup().querySelector('#_kv2').value.trim();
            const kv2_values = kv2.split(",");

            const kv3 = Swal.getPopup().querySelector('#_kv3').value.trim();
            const kv3_values = kv3.split(",");

            Boxever.browserShow(Boxever.getID(), 0, function (response) {
                var guestRef = response.customer.ref;

                var dataObj = {};
                if (kv1 != null && kv1 != undefined && kv1 != "undefeined") {
                    dataObj[kv1_values[0]] = kv1_values[1];
                }
                if (kv2 != null && kv2 != undefined && kv2 != "undefeined") {
                    dataObj[kv2_values[0]] = kv2_values[1];
                }
                if (kv3 != null && kv3 != undefined && kv3 != "undefeined") {
                    dataObj[kv3_values[0]] = kv3_values[1];
                }

                fetch('https://w1x491x7ik.execute-api.eu-west-1.amazonaws.com/default/createDataExtension', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            "guestRef": guestRef,
                            "dataExtensionName": dataExtName,
                            "dataExtensionKey": dataExtKey,
                            "clientKey": unsafeWindow._boxever_settings.client_key,
                            "data": dataObj
                        }
                    )
                }).then(res => res.json())
                    .then(res => {
                        console.log("welllll " + res.success);
                        if(res.success == true){
                            Swal.fire(
                                'Data Extension Created',
                                '',
                                'success'
                              )
                        } else {
                            Swal.fire(
                                'Error Creating Data Extension ask Richard Flynn why...',
                                '',
                                'error'
                              )
                        }
                    });

            }, 'json');

            //alert(dataExtName);
        })

    });

    $("#removeDataExtBtn").click(async function () {

        Swal.fire({
            title: 'Remove Data Extension',
            html: `<input type="text" id="dataExtName" class="swal2-input" placeholder="Data Extension Name">
                <input type="text" id="dataExtRef" class="swal2-input" placeholder="data extension Ref">
                `,
            confirmButtonText: 'Remove Data Extension',
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {


            }
        }).then((result) => {

            var dataExtName = Swal.getPopup().querySelector('#dataExtName').value;
            var dataExtRef = Swal.getPopup().querySelector('#dataExtRef').value;

            Boxever.browserShow(Boxever.getID(), 0, function (response) {
                var guestRef = response.customer.ref;

                fetch('https://w1x491x7ik.execute-api.eu-west-1.amazonaws.com/default/createDataExtension', {
                    method: 'delete',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            "guestRef": guestRef,
                            "dataExtensionName": dataExtName,
                            "dataExtensionRef": dataExtRef,
                            "clientKey": unsafeWindow._boxever_settings.client_key
                        }
                    )
                }).then(res => res.json())
                .then(res => {
                    console.log("welllll " + res.success);
                    if(res.success == true){
                        Swal.fire(
                            'Data Extension Removed',
                            '',
                            'success'
                          )
                    } else {
                        Swal.fire(
                            'Error Removing Data Extension ask Richard Flynn why...',
                            '',
                            'error'
                          )
                    }
                });

            }, 'json');

            //alert(dataExtName);
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
            confirmButtonColor: '#19a5a2',
            preConfirm: () => {
                const eventType = Swal.getPopup().querySelector('#eventType').value
                const kv1 = Swal.getPopup().querySelector('#kv1').value
                if (!eventType) {
                    Swal.showValidationMessage(`Please enter an event type`)
                }
                return { eventType: eventType, kv1: kv1 }
            }
        }).then((result) => {
            const kv1 = Swal.getPopup().querySelector('#kv1').value.trim();
            const kv1_values = kv1.split(",");

            const kv2 = Swal.getPopup().querySelector('#kv2').value.trim();
            const kv2_values = kv2.split(",");

            const kv3 = Swal.getPopup().querySelector('#kv3').value.trim();
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


    });

    $("#closeSessionBtn").click(function () {

        Swal.fire({
            title: 'Close session?',
            text: "This will end the ongoing CDP session...",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#19a5a2',
            // cancelButtonColor: '#232323',
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
            //text: "This will reload the page...",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#19a5a2',
            // cancelButtonColor: '#232323',
            confirmButtonText: 'Yes, start a new anonymous session'
        }).then((result) => {
            if (result.isConfirmed) {
                //_boxeverq.push(function () {
                Boxever.reset();
                //});

                Swal.fire({
                    title: 'Reload the page to browse as the new anon user',
                    text: "",
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
