/* File Created: février 7, 2014 */
$(function () {
    window.NotificationBar.init($('.notification-bar'));
});

(function (window, $, undefined) {
    var _NotificationBar = {
        _bar : undefined,
        _configuration: undefined,
        _timeoutId: undefined,
        init : function (bar) {
            var that = this;
            this._bar = bar;

            if( window.notificationConfiguration ) {
                that._configuration = window.notificationConfiguration;
            } else {
                Fr.Alphasystem.Report.Web.ajaxHelper.post("Platform/GetNotificationConfiguration").success(function (config) {
                    that._configuration = config;
                });
            }

            this.autoCheck();
        },
        checkForNotifications : function () {
            var _that = this;
            var context = Fr.Alphasystem.Report.Web.context;

            var loadNotifications = function(data) {
                var _counter = 0;
                var _notificationButton;
                var _notify;
                var _hasChanges = false;
                                
                if( !data ) return; //Nothing returned from the server, keep the previous state

                for (var _i = 0; _i < data.length; _i++) {
                    _counter += data[_i].Value;
                    _notificationButton = _that._bar.find('.notification-singleitem a.' + _that.getNotificationType(data[_i].Type)).parent();
                    _notify = _notificationButton.children('.notify');
                    if (data[_i].Value > 0) {
                        if (_notify.length == 0) {
                            _notify = $('<span class="notify pngfix"></span>');
                            _notificationButton.append(_notify);
                        } 

                        _hasChanges |= (data[_i].Value != parseInt(_notify.text()));

                        _notify.text(data[_i].Value);
                        _notificationButton.fadeIn();
                   }
                    else {
                        _notificationButton.fadeOut();
                        if (_notify.length > 0)
                            _notify.remove();
                    }
                }
                if (_counter > 0) {
                    _that._bar.show('0', function() { $(this).animate({ right: '0px' }, 500); });
                    if( _hasChanges && _that._configuration && _that._configuration.PlaySound ) {
                        _that._bar.find(".soundplayer").remove();
                        var player = $("<div>", { "class": "soundplayer" });
                        _that._bar.append(player);
                        player.get(0).innerHTML = "<EMBED id='alert' src='" + window.rootBase + "/Resources/Sound/type.wav' width='0' height='0' autostart='true' />";                      
                    }
                }
                else
                    _that._bar.animate({right:'-66px'}, 500, function() { $(this).hide(); });
            };

            if( window.notificationList ) {
                var data = window.notificationList;
                window.notificationList = undefined;
                if( data.length == 0) {
                    console.debug("Embedded notifications are empty");
                    setTimeout(function() {NotificationBar.autoCheck();}, 5000);
                } else {
                    loadNotifications(data);
                }
            } else {
                Fr.Alphasystem.Report.Web.ajaxHelper.post("Platform/GetNotifications", {guardroomId: context.guardroomId(), loggedGuardroom: context.loggedGuardroomId()})
                    .success(loadNotifications)
                    .error(function () {
                        console.debug("Platform/GetNotifications" + " error");
                        window.notificationErrorCount = (window.notificationErrorCount||0) + 1;
                        if( window.notificationErrorCount < 5 )
                            setTimeout(function() {NotificationBar.autoCheck();}, 5000);
                    });

            }
        },
        autoCheck : function () {
            NotificationBar.checkForNotifications();
            if( NotificationBar._timeoutId ) clearTimeout(NotificationBar._timeoutId);
            NotificationBar._timeoutId = setTimeout(function() {
                NotificationBar.autoCheck();
            }, 3 * 1000 * 60);
        },
        getNotificationType : function (typeValue) {
            var _type = "unknown";

            switch (typeValue) {
                case 0:
                    _type = "assistance";
                    break;
                case 1:
                    _type = "phone";
                    break;
                case 2:
                    _type = "incident";
                    break;
                case 3:
                    _type = "report";
                    break;
                case 4:
                    _type = "shift";
                    break;
                case 5:
                    _type = "tour";
                    break;
                case 6:
                    _type = "visitor";
                    break;
                case 7:
                    _type = "key";
                    break;
                case 8:
                    _type = "post";
                    break;
                case 9:
                    _type = "break";
                    break;
                case 10:
                    _type = "xray";
                    break;
                case 11:
                    _type = "training";
                    break;
                case 12:
                    _type = "message";
                    break;
                case 13:
                    _type = "unreadpostorder";
                    break;
                case 14:
                    _type = "reqpostorder";
                    break;
                case 17:
                    _type = "airport";
                    break;
            }
            return _type;
        }
    };

    window.NotificationBar = _NotificationBar;
})(window, jQuery);