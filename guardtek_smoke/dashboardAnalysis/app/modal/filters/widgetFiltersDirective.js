(function () {
    angular.module('dashboardAnalysisApp').directive('widgetFilters', function () {
        return {
            controller: 'widgetFiltersCtrl',
            controllerAs: 'vm',
            templateUrl: "widget-filters.html",
            bindToController: {
                filtersRelation: '@'
            },
            scope : true,
            replace: true
        };
    });
})();