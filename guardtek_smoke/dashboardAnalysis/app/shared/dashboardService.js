(function () {

angular.module('dashboardAnalysisApp')
.service('dashboardService', function() {

    var selectedWidget = null;
    var selectedWidgetGroup = null;
    var lists = null;

    this.setSelectedWidget = function(widget) {
        selectedWidget = widget;
    }

    this.getSelectedWidget = function() {
        return selectedWidget;
    }

    this.setSelectedWidgetGroup = function(widgetGroup) {
        selectedWidgetGroup = widgetGroup;
    }

    this.getSelectedWidgetGroup = function() {
        return selectedWidgetGroup;
    }

    this.setLists = function(listsToSet) {
        lists = listsToSet;
    }

    this.getLists = function() {
        return lists;
    }
});

})();