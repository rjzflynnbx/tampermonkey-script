// ==UserScript==
// @name Sitecore CDP base script
// @namespace http://tampermonkey.net/
// @version 0.2
// @description Generic Load Sitecore CDP Tampermonkey scripts
// @author Brian Bishop
// @match https://www.jaguarusa.com/*
// @grant  none
// ==/UserScript==

(function() {
    'use strict';
    //Sitecore CDP settings
    const SITECORECDP_CLIENT_KEY = "pqsHoMeZqwc3fXgLCQs1p21ImhAr6tPL";  // SpinHome tenant - do not change
    const SITECORECDP_POINT_OF_SALE = "StandardDemo"; //  do not change
    const SITECORECDP_API_TARGET = "https://api.boxever.com/v1.2"; //  do not change
    const SITECORECDP_WEB_FLOW_TARGET = "https://d35vb5cccm4xzp.cloudfront.net"; //  do not change
    const SITECORECDP_JS_LIB_SRC = "https://d1mj578wat5n4o.cloudfront.net/boxever-1.4.1.min.js"; //  do not change
    const SITECORECDP_COOKIE_DOMAIN = '.jaguarusa.com'; //replace TLD with your client/prospect
    const CURRENCY = "USD";

    //Script settings
    const ENABLE_KEYBOARD_SHORTCUTS = true;
    const SEND_VIEW_EVENT = true;


    window._boxever_settings = {
        client_key: SITECORECDP_CLIENT_KEY,
        target: SITECORECDP_API_TARGET,
        pointOfSale: SITECORECDP_POINT_OF_SALE,
        cookie_domain: SITECORECDP_COOKIE_DOMAIN,
        web_flow_target: SITECORECDP_WEB_FLOW_TARGET,
    };

    loadScCdpLib();
    if (SEND_VIEW_EVENT) {
        delayUntilBrowserIdIsAvailable(sendViewEvent);
    }

    function loadScCdpLib(callback) {
        console.log('Sitecore CDP Tampermonkey script - loadScCdpLib');
        var scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.src = SITECORECDP_JS_LIB_SRC;
        scriptElement.async = false;
        document.head.appendChild(scriptElement);
    }

    function sendViewEvent() {
        console.log('Sitecore CDP Tampermonkey script - sendViewEvent');
        var viewEvent = {
            "browser_id": Boxever.getID(),
            "channel": "WEB",
            "type": "VIEW",
            "language": "EN",
            "currency": CURRENCY,
            "page": window.location.pathname + window.location.search,
            "pos": SITECORECDP_POINT_OF_SALE,
            "session_data": {
                "uri": window.location.pathname
            }
        };
        Boxever.eventCreate(viewEvent, function(data) {}, 'json');
        console.log('view event');
    }

    function delayUntilBrowserIdIsAvailable(functionToDelay) {
        if (window.Boxever == null || window.Boxever == undefined || window.Boxever === "undefined" || window.Boxever.getID() === "anonymous") {
            const timeToWaitInMilliseconds = 300;
            console.log('Sitecore CDP browserId is not yet available. Waiting ${timeToWaitInMilliseconds}ms before retrying.');
            window.setTimeout(delayUntilBrowserIdIsAvailable, timeToWaitInMilliseconds, functionToDelay);
        } else {
            functionToDelay();
        }
    }


    //keyboard shortcuts
    function KeyPress(e) {
        var evtobj = window.event ? event : e
        // CTRL + C = Close session
        if (evtobj.keyCode == 67 && evtobj.ctrlKey) {
            if (confirm('CLOSE SESSION?')) {
                _boxeverq.push(function () {
                    var closeSessionEvent = {
                        browser_id: Boxever.getID(),
                        channel: "WEB",
                        language: "EN",
                        currency: "EUR",
                        pos: SITECORECDP_POINT_OF_SALE,
                        type: "FORCE_CLOSE",
                        _bx_extended_message: "1"
                    };

                    Boxever.eventCreate(closeSessionEvent, function (data) { }, 'json');
                });
            }
        }
        // CTRL + A = Start as anon
        if (evtobj.keyCode == 65 && evtobj.ctrlKey) {
            if (confirm('START AS ANONYMOUS?')) {
                _boxeverq.push(function () {
                    Boxever.reset();
                });
                location.reload();
            }
        }

        // CTRL + I send identity event
        if (evtobj.keyCode == 73 && evtobj.ctrlKey) {
            console.log('identity event begin');
            _boxeverq.push(function() {
                var identityEvent = {
                    "browser_id": Boxever.getID(),
                    "channel": "WEB",
                    "type": "IDENTITY",
                    "language": "EN",
                    "currency": CURRENCY,
                    "page": window.location.pathname,
                    "pos": SITECORECDP_POINT_OF_SALE,
                    "firstname": IDENTITY_FNAME,
                    "lastname": IDENTITY_LNAME,
                    "email" : IDENTITY_EMAIL,
                    "phoneNumber" : [IDENTITY_PHONE],
                    "identifiers": [{
                        "provider": IDENTITY_PROVIDER,
                        "id": IDENTITY_ID
                    }]
                };
                identityEvent = Boxever.addUTMParams(identityEvent);
                Boxever.eventCreate(identityEvent, function(data){}, 'json');
            });

        }
        // custom event 0
        if (evtobj.keyCode == 48 && evtobj.ctrlKey) {
            _boxeverq.push(function() {
                var customEvent = {
                    "browser_id": Boxever.getID(),
                    "channel": "WEB",
                    "type": "CE-0",
                    "language": "EN",
                    "page": window.location.pathname,
                    "pos": SITECORECDP_POINT_OF_SALE
                };
                customEvent = Boxever.addUTMParams(customEvent);
                Boxever.eventCreate(customEvent, function(data){}, 'json');
                console.log('trigger_ce_0');

            });
        }
        // custom event 1
        if (evtobj.keyCode == 49 && evtobj.ctrlKey) {
             _boxeverq.push(function() {
                var customEvent = {
                    "browser_id": Boxever.getID(),
                    "channel": "WEB",
                    "type": "CE-1",
                    "language": "EN",
                    "page": window.location.pathname,
                    "pos": SITECORECDP_POINT_OF_SALE
                };
                customEvent = Boxever.addUTMParams(customEvent);
                Boxever.eventCreate(customEvent, function(data){}, 'json');
            });
            console.log('trigger_ce_1');
        }
        // CTRL + 2 - custom event 2 - control-2 sends a personalized text message to IDENTITY_PHONE
        if (evtobj.keyCode == 50 && evtobj.ctrlKey) {
            _boxeverq.push(function() {
                var customEvent = {
                    "browser_id": Boxever.getID(),
                    "channel": "WEB",
                    "type": "CE-2",
                    "language": "EN",
                    "page": window.location.pathname,
                    "pos": SITECORECDP_POINT_OF_SALE
                };
                customEvent = Boxever.addUTMParams(customEvent);
                Boxever.eventCreate(customEvent, function(data){}, 'json');
                console.log('trigger_ce_2');
            });
        }

    }
    if (ENABLE_KEYBOARD_SHORTCUTS) {
        document.onkeydown = KeyPress;
    }

})();