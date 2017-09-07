angular.module('alpha.timepicker', [])
.directive('bootstrapTimepicker', ['$timeout', function ($timeout) {
    return {
        restrict: 'AE',
        template:
    "<div class='input-group timepicker-group input-append'>" +
    " <span class='input-group-addon'><i class='mdi mdi-clock'></i></span>" +
    " <input type='text' class='time-picker input-small' ng-model='jqTime' ng-disabled='disabled' ng-blur='onBlurTime()' />" +
    "</div>",
        scope: {
            time: '=ngModel',
            disabled: '=ngDisabled',
            timeFormat: '@'
        },
        link: function (scope, elem, attrs) {
            attrs.timeFormat = attrs.timeFormat || 'HH:mm';

            $(elem).find('input').timepicker({
                minuteStep: 1,
                template: 'dropdown',
                showSeconds: false,
                showMeridian: false,
                defaultTime: false,
                showInputs: true
            });

            var convertToAngular = function (time) {
                if (attrs.timeFormat === 'minutes') {
                    time = time.replace(/[^0-9\:]/g, '');

                    timeArray = time.split(':');

                    hour = timeArray[0] ? timeArray[0].toString() : timeArray.toString();
                    minute = timeArray[1] ? timeArray[1].toString() : '';

                    // idiot proofing
                    if (hour.length > 4) {
                        second = hour.substr(4, 2);
                    }
                    if (hour.length > 2) {
                        minute = hour.substr(2, 2);
                        hour = hour.substr(0, 2);
                    }
                    if (minute.length > 2) {
                        second = minute.substr(2, 2);
                        minute = minute.substr(0, 2);
                    }

                    hour = parseInt(hour, 10);
                    minute = parseInt(minute, 10);

                    if (isNaN(hour)) {
                        hour = 0;
                    }
                    if (isNaN(minute)) {
                        minute = 0;
                    }
                    return hour * 60 + minute;
                }
                return time;
            };

            var convertToJQuery = function (time) {
                if (attrs.timeFormat === 'minutes') {

                    var hour = Math.floor(time / 60);
                    var minute = Math.floor(time % 60);
                    return (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute);
                }
                return time;
            };

            scope.$watch('jqTime', function (newVal, oldVal) {
//              if (newVal && oldVal != newVal)
//                  scope.time = convertToAngular(newVal);
            });

            scope.$watch('time', function (newVal, oldVal) {
                if (newVal !== undefined) {
                    //if(!scope.jqTime)
                        scope.jqTime = convertToJQuery(newVal);

                    $timeout(function () {
                        $(elem).find('input').timepicker("setTime", scope.jqTime)
                    });
                }
            });

            scope.onBlurTime = function () {
                $timeout(function () {
                    scope.time = convertToAngular(scope.jqTime);
                });
            };

            scope.shouldDisable = function() {
                return angular.version.minor > 2;
            };
        }
    }
} ]);
