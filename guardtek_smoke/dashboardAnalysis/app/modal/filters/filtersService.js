(function () {

    angular.module('dashboardAnalysisApp')
    .service('filtersService', ['dashboardAnalysisDataService', 'codeService', function (dashboardAnalysisDataService, codeService) {

        var that = this;

        this.filtersLoading = false;
        this.filtersAvailable = false;

        this.initializeFilters = function (widget) {
            widget.Filter = widget.Filter || {};
            widget.Filter.Expressions = widget.Filter.Expressions || [];
        }

        this.setFieldValues = function (widget, item) {
            var field = _.findWhere(widget.fields, { FieldName: item.FieldName });

            if (field) {
                item.Category = field.Category;
                item.FieldName = field.FieldName;
                item.FieldType = field.FieldType;
                item.CustomListId = field.CustomListId;
                item.Operators = _.each(field.Operators, function (item) { item.Text = codeService.translate(item.Text); });
                item.EventFieldItems = field.EventFieldItems;
                item.CustomListItems = field.CustomListItems;
                item.operator = _.findWhere(item.Operators, { QueryOperator: item.FieldOperator, FieldType: item.FieldType });

                if (item.FieldType === "CustomList" && item.CustomListId) {
                    item.fieldValueObject = _.findWhere(item.CustomListItems, { Name: item.FieldValue });
                }
                else if (item.FieldType === "Radio3" || item.FieldType === "PredefinedList") {
                    item.fieldValueObject = _.findWhere(item.EventFieldItems, { Text: item.FieldValue });
                }
                else if (item.FieldType === "Number") {
                    item.FieldValue = parseFloat(item.FieldValue);
                }
            }

            return item;
        };

        this.setWidgetFilters = function (widgetGroup, widget) {

            this.filtersLoading = true;

            var type = widget.ReportType.Value.replace('$DashboardModule.Settings.', '');
            var name = widget.ReportCategory ? widget.ReportCategory.Name || '' : '';
            var category = widget.ReportCategory ? widget.ReportCategory.Category || '' : '';
            var dataset = widget.DatasetObj && widget.DatasetObj.Category ? widget.DatasetObj.Name : '';
            var guardrooms = widgetGroup.Guardrooms;

            dashboardAnalysisDataService.getDashboardFilters(type, name, category, dataset, guardrooms).then(function (result) {

                if (result && result.length > 0) {
                    that.filtersAvailable = true;
                } else {
                    that.filtersAvailable = false;
                }

                widget.fields = result;

                that.initializeFilters(widget);

                if (!widget.Filter.Expressions) {
                    widget.Filter.Expressions = [];
                    if (widget.FiltersJson) {
                        widget.Filter.Expressions = JSON.parse(widget.FiltersJson);
                    }
                }
                else {
                    widget.Filter.Expressions = widget.Filter.Expressions.filter(function (exp) { return (exp.FieldValue || exp.FieldValue === "0") && exp.FieldOperator && exp.FieldName; });
                    widget.Filter.Expressions = _.reject(widget.Filter.Expressions, function (exp) { return !_.findWhere(widget.fields, { FieldName: exp.FieldName }); });

                }

                var orConditions = _.where(widget.Filter.Expressions, { Relation: "OR" });
                var andConditions = _.where(widget.Filter.Expressions, { Relation: "AND" });

                if (orConditions.length === 0) {
                    widget.Filter.Expressions.push({ Relation: 'OR', FieldName: "", FieldOperator: "", FieldValue: "" });
                }

                if (andConditions.length === 0) {
                    widget.Filter.Expressions.push({ Relation: 'AND', FieldName: "", FieldOperator: "", FieldValue: "" });
                }

                widget.Filter.Expressions = _.map(widget.Filter.Expressions, function(expresion) {
                    return that.setFieldValues(widget, expresion);
                });

                that.filtersLoading = false;
            });
        };


    } ]);

})();