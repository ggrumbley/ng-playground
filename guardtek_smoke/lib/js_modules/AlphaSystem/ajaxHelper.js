/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1-vsdoc.js" />
/// <reference path="../JSON/json.js" />
/// <reference path="../../context.js" />
/// <reference path="alphaClass.js" />
/*
* File Created: avril 22, 2013
* Sébastien Blanchard
* Copyright 2013 Alphasystem S.A.S.
*/
$(function () {
    // Enable jQuery Ajax cache requests
    $.ajaxSetup({
        cache: true
    });
});

(function (window, $, undefined) {
    var _AjaxHelper = AlphaClass.create({
        querystringify: function(obj, sep, eq) {
            // https://gist.github.com/benbahrenburg/1130590
            sep = sep || "&";
            eq = eq || "=";
            var qs = [], key, escape = encodeURIComponent;
            for (key in obj){
                if (obj.hasOwnProperty(key) && typeof obj[key] !== "undefined") {
                    if( !!obj[key] && !!obj[key].toISOString )
                        qs.push(escape(key) + eq + escape(obj[key].toISOString()));
                    else
                        qs.push(escape(key) + eq + escape(String(obj[key])));
               }
            }
            return qs.join(sep);
        },
        post: function (url) {
            return this.post(url, undefined, undefined);
        },
        post: function (url, data) {
            return this.post(url, data, undefined);
        },
        post: function (url, data, timeout) {
            return this.sendRequest('post', url, data, timeout);
        },
        get: function (url) {
            return this.get(url, undefined, undefined);
        },
        get: function (url, data) {
            return this.get(url, data, undefined);
        },
        get: function (url, data, timeout) {
            return this.sendRequest('get', url, data, timeout);
        },
        sendRequest: function (verb, url, data, timeout) {
            var _that = this;
            if (!timeout)
                timeout = 30000;
            return $.ajax({
                type: verb,
                url: rootBase + url,
                contentType: "application/json, charset=UTF-8",
                data: verb==='get'?_that.querystringify(data) : JSON.stringify(data),
                dataType: "json",
                timeout: timeout,
                beforeSend: function (xhr) {
                    _that.authenticate(xhr);
                },
                error: function (xhr) {
                    if (xhr.status == 401)
                        window.location.href = rootBase + 'Home/LogOff?LoginMethod=' + Fr.Alphasystem.Report.Web.context.loginMethod();
                }
            });
        },
        authenticate: function (xhr) {
            if (Fr.Alphasystem.Report.Web.context)
                xhr.setRequestHeader("X-Authenticated-Token", Fr.Alphasystem.Report.Web.context.authToken());
        },
        postv3: function (url) {
            return this.postv3(url, undefined, undefined);
        },
        postv3: function (url, data) {
            return this.postv3(url, data, undefined);
        },
        postv3: function (url, data, timeout) {
            return this.sendRequestv3('post', url, data, timeout);
        },
        getv3: function (url) {
            return this.getv3(url, undefined, undefined);
        },
        getv3: function (url, data) {
            return this.getv3(url, data, undefined);
        },
        getv3: function (url, data, timeout) {
            return this.sendRequestv3('get', url, data, timeout);
        },
        sendRequestv3: function (verb, url, data, timeout) {
            var _that = this;
            if (!timeout)
                timeout = 30000;
            return $.ajax({
                type: verb,
                url: rootBase + url,
                contentType: "application/x-www-form-urlencoded, charset=UTF-8",
                data: $.param(data),
                dataType: "json",
                timeout: timeout
            });
        }
    });

    AlphaClass.registerNamespace('Fr.Alphasystem.Report.Web');
    window.Fr.Alphasystem.Report.Web.ajaxHelper = new _AjaxHelper();
})(window, jQuery);