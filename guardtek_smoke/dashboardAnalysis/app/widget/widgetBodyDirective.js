(function() {
    angular.module('dashboardAnalysisApp').directive('widgetBody', function() {
        return {
            scope: {
                widget: '=',
                action: '&'
            },
            templateUrl: "widget-body.html"
        }
   });
})();