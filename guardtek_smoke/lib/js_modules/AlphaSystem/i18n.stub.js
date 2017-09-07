/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1-vsdoc.js" />
/// <reference path="alphaClass.js" />
/// <reference path="common.js" />
/// <reference path="../jQuery-globalize/globalize.js" />
/*
* File Created: June 02 2014
* Abderraouf El Gasser
* Copyright 2014 Alphasystem S.A.S.
*/
(function (window, $, undefined) {
    var _I18n = AlphaClass.create({
        init: function (locale, companyId) {
            this.setLocale(locale);
            this.setCompanyId(companyId);
        },
        sleepWhile: function (interval, condition) {

        },
        translate: function (str, encodeHtml) {
            encodeHtml = typeof encodeHtml !== 'undefined' ? encodeHtml : true;
            if (encodeHtml)
                return $.htmlEncode(str);
            return str;
        },
        setCompanyId: function (companyId) {

        },
        setLocale: function (locale) {

        },
        registerTranslationHandler: function (ctx, handler) {
            handler.call(ctx);
        },
        translationChanged: function () {

        },
        translateStaticElements: function () {

        }
    });
    AlphaClass.registerNamespace('Fr.Alphasystem.Report.Web');
    window.Fr.Alphasystem.Report.Web.i18n = new _I18n();
})(window, jQuery)