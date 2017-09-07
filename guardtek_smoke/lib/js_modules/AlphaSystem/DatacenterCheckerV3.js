/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1-vsdoc.js" />
/// <reference path="../JSON/json.js" />
/// <reference path="../../context.js" />
/*
* File Created: avril 22, 2013
* Sébastien Blanchard
* Copyright 2013 Alphasystem S.A.S.
*/
$(function () {
    window.DatacenterChecker.init();
});

(function (window, $, undefined) {
    var _DatacenterChecker = {
        init : function () {
            if (window.datacenter) {
                window.DatacenterChecker.registerDatacenterConnection(window.datacenter.hasConnection);
            } else {
                window.DatacenterChecker.registerDatacenterConnection(false);
            }
        },
        getQueryStringParams : function (sParam) {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++)
            {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == sParam)
                {
                    return sParameterName[1];
                }
            }
        },
        registerDatacenterConnection: function(value) {
            if (value != true)
                value = false;
            Fr.Alphasystem.Report.Web.ajaxHelper.post('Admin/RegisterDatacenterConnection', {
                    hasConnection: value, screenSize: screen.width + "x" + screen.height
                }).done(function (result) {
                    setTimeout(function() {
                        var redirect = window.DatacenterChecker.getQueryStringParams('redirect');
                        if (redirect == undefined) {
                            redirect = "Default.aspx";
                        }
                        window.top.location = redirect;
                    }, 1000);
            });
        }
    };
    window.DatacenterChecker = _DatacenterChecker;
})(window, jQuery);