/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1-vsdoc.js" />
/// <reference path="../lib/AlphaSystem/AlphaClass.js" />
/// <reference path="../lib/AlphaSystem/ajaxHelper.js">
/*
* File Created: août 8, 2013
* Sébastien Blanchard
* Copyright 2013 Alphasystem S.A.S.
*/
(function (window, undefined) {
    var _SessionExpiration = AlphaClass.create({
        pollingInterval: 60000,
        expirationMinutes: 5,
        warningMinutes: 2,
        intervalId: undefined,
        lastActivity: undefined,
        initialize: function () {
            this.lastActivity = new Date();
            this.setInterval();
        },
        setInterval: function () {
            this.intervalId = setInterval('Fr.Alphasystem.Report.Web.sessionExpiration.interval()', this.pollingInterval);
        },
        clearInterval: function () {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        },
        pingServer: function () {
            Fr.Alphasystem.Report.Web.ajaxHelper.post(rootBase + 'Home/Ping').done(function () {

            }).fail(function () {
                
            });
        }
    });

    AlphaClass.registerNamespace('Fr.Alphasystem.Report.Web');
    window.Fr.Alphasystem.Report.Web.sessionExpiration = new _SessionExpiration();
})(window);