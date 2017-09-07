/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1-vsdoc.js" />
/// <reference path="alphaClass.js" />
/// <reference path="common.js" />
/// <reference path="../jQuery-globalize/globalize.js" />
/*
* File Created: mars 8, 2013
* Sébastien Blanchard
* Copyright 2013 Alphasystem S.A.S.
*/
(function (window, $, undefined) {
    var _I18n = AlphaClass.create({
        _translationHandlers: [],
        _LocaleLoading: false,
        _LocaleLoaded: false,
        _CompanyLoaded: false,
        init: function (locale, companyId) {
            this.setLocale(locale);
            this.setCompanyId(companyId);
        },
        reload: function (locale, companyId) {
            if( this._LocaleLoading ) return;
            this._LocaleLoaded = false;
            this._CompanyLoaded = false;

            this.setLocale(locale);
            this.setCompanyId(companyId);
        },
        sleepWhile: function (interval, condition) {
            if (condition.call(condition))
                setTimeout('Fr.Alphasystem.Report.Web.i18n.sleepWhile(' + interval + ', ' + condition + ')', interval)
        },
        translate: function (str, encodeHtml) {
            encodeHtml = typeof encodeHtml !== 'undefined' ? encodeHtml : true;
            if (encodeHtml)
                return $.htmlEncode(Globalize.localize(str) || str);
            return Globalize.localize(str) || str;
        },
        setCompanyId: function (companyId) {
            var _that = this;
            if (!companyId)
                return;
            if (_that._CompanyLoaded)
                return;
            if (!_that._LocaleLoaded)
                setTimeout('Fr.Alphasystem.Report.Web.i18n.setCompanyId(\'' + companyId + '\')', 1000);
            else {
                //console.log('setCompanyId translation loading');
                $.getJSON(rootBase + 'Localization.axd?v=1.1&culture=' + Fr.Alphasystem.Report.Web.context.locale() + '&companyId=' + companyId).done(function (translations) {
                    //console.log('setCompanyId translation loaded');
                    Globalize.addCultureInfo(Fr.Alphasystem.Report.Web.context.locale(), { messages: translations });
                    //console.log('setCompanyId translation Changed');
                    _that._CompanyLoaded = true;
                    _that.translationChanged();
                });
            }
            //Globalize.addCultureInfo(Fr.Alphasystem.Report.Web.context.locale(), { messages: AlphaTemp['Localization_' + Fr.Alphasystem.Report.Web.context.locale().replace(new RegExp('-', 'g'), '_')] }); // TO REMOVE FOR PRODUCTION
        },
        setLocale: function (locale) {
            var _that = this;
            if (!locale)
                return;
            if (_that._LocaleLoading || _that._LocaleLoaded)
                return;
            _that._LocaleLoaded = false;
            _that._LocaleLoading = true;
            //console.log('setLocale loading');
            $.getJSON(rootBase + 'Localization.axd?v=1.2&culture=' + locale).done(function (translations) {
                //console.log('setLocale translation loaded');
                Globalize.addCultureInfo(locale, { messages: translations });
                _that._LocaleLoaded = true;
                if (!Fr.Alphasystem.Report.Web.context.companyId()) {
                    //console.log('setLocale translation Changed');
                    _that.translationChanged();
                }
            });
            Globalize.culture(locale);
            //Globalize.addCultureInfo(locale, { messages: AlphaTemp['Localization_' + locale.replace(new RegExp('-', 'g'), '_')] }); // TO REMOVE FOR PRODUCTION
        },
        registerTranslationHandler: function (ctx, handler) {
            var _that = this;
            if( Object.isFunction(handler) ) {
                _that._translationHandlers.push({ context: ctx, handler: handler });
                if( this._hasTranslationChanged ) {
                    handler.call(ctx);
                }             
            }
        },
        translationChanged: function () {
            var _that = this;
            this._hasTranslationChanged = true;
            //Fr.Alphasystem.Report.Web.app.trigger('TranslationChanged');
            _that.translateStaticElements();
            $(_that._translationHandlers).each(function () {
                if (Object.isFunction(this.handler))
                    this.handler.call(this.context);
            });
        },
        translateStaticElements: function () {
            var _that = this;
            $('.translate').each(function (idx, element) {
                var $element = $(element);
                if ($element.attr('data-translate-attr'))
                    $element.attr($element.attr('data-translate-attr'), _that.translate($element.attr('data-translate-key')));
                else
                    $element.text(_that.translate($element.attr('data-translate-key')));
            });
        }
    });
    AlphaClass.registerNamespace('Fr.Alphasystem.Report.Web');
    window.Fr.Alphasystem.Report.Web.i18n = new _I18n();
})(window, jQuery);