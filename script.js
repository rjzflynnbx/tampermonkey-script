// ==UserScript==
// @name         Generic Load Boxever Tampermonkey script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Generic Load Boxever Tampermonkey scripts
// @author       Richard Flynn
// @match        http://example.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';


    const CLIENT_KEY_ENUM = {
        PARTNER_SANDBOX: "psfu6uh05hsr9c34rptlr06dn864cqrx",
        BOXEVER_LABS_SPINAIR: "wjtc2eog1lvueo72kts3mn1ean0nentz"
    }

    //Boxever settings
    const BOXEVER_CLIENT_KEY = "";
    const BOXEVER_POINT_OF_SALE = "";
    const BOXEVER_API_TARGET = `https://api.boxever.com/v1.2`;
    const BOXEVER_WEB_FLOW_TARGET = "https://d35vb5cccm4xzp.cloudfront.net";
    const BOXEVER_JS_LIB_SRC = 'https://d1mj578wat5n4o.cloudfront.net/boxever-1.4.1.min.js';

    //Script settings
    const ENABLE_KEYBOARD_SHORTCUTS = true;
    const SEND_VIEW_EVENT = true;

    window._boxever_settings = {
        client_key: BOXEVER_CLIENT_KEY,
        target: BOXEVER_API_TARGET,
        pointOfSale: BOXEVER_POINT_OF_SALE,
        cookie_domain: '',
        web_flow_target: BOXEVER_WEB_FLOW_TARGET,
    };


    loadBxLib();
    if (SEND_VIEW_EVENT) {
        delayUntilBrowserIdIsAvailable(sendViewEvent);
    }

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
            "page": window.location.pathname + window.location.search,
            "pos": BOXEVER_POINT_OF_SALE,
            "session_data": { "uri": window.location.pathname }
        };
        Boxever.eventCreate(viewEvent, function (data) { }, 'json');
    }

    function delayUntilBrowserIdIsAvailable(functionToDelay) {
        if (window.Boxever == null || window.Boxever == undefined || window.Boxever === "undefined" || window.Boxever.getID() === "anonymous") {
            const timeToWaitInMilliseconds = 300;
            console.log(`Boxever browserId is not yet available. Waiting ${timeToWaitInMilliseconds}ms before retrying.`);
            window.setTimeout(delayUntilBrowserIdIsAvailable, timeToWaitInMilliseconds, functionToDelay);
        } else {
            functionToDelay();
        }
    }





    //keyboard shortcuts
    function KeyPress(e) {
        var evtobj = window.event ? event : e


        // CTRL + C  = Close session
        if (evtobj.keyCode == 67 && evtobj.ctrlKey) {
            if (confirm('CLOSE SESSION?')) {
                _boxeverq.push(function () {
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
                });
            }


        }
        //  CTRL + A  = Start as anon
        if (evtobj.keyCode == 65 && evtobj.ctrlKey) {
            if (confirm('START AS ANONYMOUS?')) {
                _boxeverq.push(function () {
                    Boxever.reset();
                });
                location.reload();
            }
        }
    }
    if (ENABLE_KEYBOARD_SHORTCUTS) {
        document.onkeydown = KeyPress;
    }
})();


