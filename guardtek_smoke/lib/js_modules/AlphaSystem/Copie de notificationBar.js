/* File Created: février 7, 2014 */
$(function () {
    window.NotificationBar.init($('.notification-bar'));
});

(function (window, $, undefined) {
    var _NotificationBar = {
        _bar : undefined,
        init : function (bar) {
            this._bar = bar;
            this.autoCheck();
        },
        checkForNotifications : function () {
            var _that = this;
            Fr.Alphasystem.Report.Web.ajaxHelper.post("Platform/GetNotifications").success(function (data) {
                var _counter = 0;
                var _notificationButton;
                var _notify;
                for (var _i = 0; _i < data.length; _i++) {
                    _counter += data[_i].Value;
                    _notificationButton = _that._bar.find('.notification-singleitem a.' + _that.getNotificationType(data[_i].Type)).parent();
                    _notify = _notificationButton.children('.notify');
                    if (data[_i].Value > 0) {
                        if (_notify.length == 0) {
                            _notify = $('<span class="notify pngfix"></span>');
                            _notificationButton.append(_notify);
                        }
                        _notify.text(data[_i].Value);
                        _notificationButton.fadeIn();
                   }
                    else {
                        _notificationButton.fadeOut();
                        if (_notify.length > 0)
                            _notify.remove();
                    }
                }
                if (_counter > 0)
                    _that._bar.show('0', function () { $(this).animate({top:'0px'}, 500);})
                else
                    _that._bar.animate({top:'-76px'}, 500, function() { $(this).hide(); });
            }).error(function () {
                console.debug("Platform/GetNotifications" + " error");
            });
        },
        autoCheck : function () {
            NotificationBar.checkForNotifications()
            setTimeout(function() {
                NotificationBar.autoCheck();
            }, 1000*60)
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
            }
            return _type;
        }
    };

    window.NotificationBar = _NotificationBar;
})(window, jQuery);