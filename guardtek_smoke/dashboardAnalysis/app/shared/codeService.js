(function () {

    angular.module('dashboardAnalysisApp')
    .service('codeService', ['dashboardAnalysisDataService', '$filter', function (dashboardAnalysisDataService, $filter) {

        var translate = $filter('translate');

        this.translate = function (str) {
            return translate(str);
        };

        //Get Codes 
        this.getDashboardCodes = dashboardAnalysisDataService.getDashboardCodes;

        this.getReportCategories = function (type, guardrooms) {
            return dashboardAnalysisDataService.getReportCategories(type, guardrooms);
        };

        this.getDataset = function (type, name, category, guardrooms) {
            return dashboardAnalysisDataService.getDataset(type, name, category, guardrooms);
        };

        this.getWidgetGroupGuardrooms = function (widgetGroup) {
            return dashboardAnalysisDataService.getGuardrooms(widgetGroup);
        };

        this.getAveragingCoefficientForTimeInterval = function (group, widget) {
            return dashboardAnalysisDataService.getAveragingCoefficientForTimeInterval(group, widget);
        };

        this.getComparisonData = function (group, widget) {
            return dashboardAnalysisDataService.getComparisonData(group, widget);
        };

        this.getNewGUID = function () {
            var d = new Date().getTime();

            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });

            return uuid;
        }

        this.getReportData = function (group, widget) {
            return dashboardAnalysisDataService.getReportData(group, widget);
        };

        this.graphColors = { 'green': ["#293F12", "#3D5F1C", "#527E25", "#70AE32", "#8FCD51", "#ADDA81", "#CCE8B0"],
            'blue': ["#0B335B", "#115292", "#1870C9", "#368FE7", "#6DADEE", "#A4CCF4"],
            'yellow': ["#f2891d", "#f2991d", "#f2a91d", "#C1900B", "#f2b91d", "#F4C33E", "#F7D578", "#FBE7B2"],
            'grey': ["#1B1E23", "#323841", "#505968", "#758195", "#97A1AF", "#BAC0CA"]
        };

        this.calculateAvgPct = function (group, widget) {
            if (widget.Statistics.Value === '$DashboardModule.Settings.Average') {
                this.getAveragingCoefficientForTimeInterval(group, widget).then(function (data) {
                    var coefficent = data;

                    widget.ReportData = _.each(widget.ReportData, function (data) {
                        data.value = data.value / coefficent;
                    });
                });
            }
            else if (widget.Statistics.Value === '$DashboardModule.Settings.Percentage') {
                widget.ReportData = _.each(widget.ReportData, function (data) {
                    data.value = data.value / (widget.total ? widget.total : 1) * 100;
                });
            }
        };

    } ]);

})();