(function () {
    angular.module('dashboardAnalysisApp').directive('dashboardAnalysis', function () {
        return {
            controller: 'dashboardAnalysisCtrl',
            controllerAs: 'vm',
            templateUrl: "app/view.html"
        };
    });
})();