/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1-vsdoc.js" />
/// <reference path="../../lib/AlphaSystem/alphaSystem.js" >
/// <reference path="../../lib/AlphaSystem/common.js" >
/*
* File Created: september 05, 2013
* Abderraouf El Gasser
* Copyright 2013 Alphasystem S.A.S.
*/
(function (window) {
    var _barrier = AlphaClass.create({
        initialize: function (numberOfLevels, handler) {
            var _this = this;
            this._numberOfLevels = numberOfLevels;
            this._initValue = numberOfLevels;
            this._handler = handler;
        },

        reach: function () {
            if (this._numberOfLevels > 0)
                this._numberOfLevels--;
            if( this._numberOfLevels == 0 )
                this._handler();
        },

        reset: function() {
            this._numberOfLevels = this._initValue;
        }
    });

    AlphaClass.registerNamespace('Fr.Alphasystem.Report.Algorithms');
    window.Fr.Alphasystem.Report.Algorithms.Barrier = _barrier;
})(window);