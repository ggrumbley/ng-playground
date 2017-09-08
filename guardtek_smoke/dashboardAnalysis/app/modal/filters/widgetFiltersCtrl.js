(function () {

    angular.module('dashboardAnalysisApp')

    .controller('widgetFiltersCtrl', ['dashboardAnalysisDataService', 'codeService', 'dashboardService', 'filtersService',
     function (dashboardAnalysisDataService, codeService, dashboardService, filtersService) {
        var vm = this;

        var init = function () {
            vm.selectedWidget = dashboardService.getSelectedWidget();
        }

        vm.filterExists = function (andOr) {
            if (!vm.selectedWidget.Filter || !vm.selectedWidget.Filter.Expressions) {
                return null;
            }

            return _.find(vm.selectedWidget.Filter.Expressions, function (item) { return item.Relation === andOr; });
        }

        vm.removeExistingFilter = function (filter) {

            vm.selectedWidget.ExistingFilters = _.without(vm.selectedWidget.ExistingFilters, _.findWhere(vm.selectedWidget.ExistingFilters, {
                javascriptId: filter.javascriptId
            }));
        }

        vm.selectField = function (eventField, eventFieldName) {
            eventField.FieldName = eventFieldName;
            eventField.FieldValue = null;
            filtersService.setFieldValues(vm.selectedWidget, eventField);
        };

        vm.selectFieldValue = function (exp, fieldValue) {
            exp.fieldValueObject = fieldValue;

            if (exp.FieldType === "CustomList" && exp.CustomListId) {
                exp.FieldValue = exp.fieldValueObject.Name;
            }
            else if ((exp.FieldType === "Radio3" || exp.FieldType === "PredefinedList")) {
                exp.FieldValue = exp.fieldValueObject.Text;
            }
        }

        vm.selectFieldOperator = function (exp, operator) {
            exp.operator = operator;
            exp.FieldOperator = operator.QueryOperator;
        }

        vm.addFilter = function (andOr) {
            if (!vm.selectedWidget.Filter || !vm.selectedWidget.Filter.Expressions) {
                filtersService.initializeFilters(vm.selectedWidget);
            }

            vm.selectedWidget.Filter.Expressions.push({ Relation: andOr, FieldName: "", FieldOperator: "", FieldValue: "" });
        };

        vm.removeFilter = function (field) {
            vm.selectedWidget.Filter.Expressions.splice(vm.selectedWidget.Filter.Expressions.indexOf(field), 1);
        };

        init();
    }]);

})();