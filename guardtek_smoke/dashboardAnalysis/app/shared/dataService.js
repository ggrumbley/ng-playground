angular.module('dashboardAnalysisApp')
.factory('dashboardAnalysisDataService', ['ajaxService', function (ajaxService) {
    return {

        getCustomers: function() {
             return ajaxService.get('dashboardAnalysis/GetCustomers', {});
        },

        getSites: function() {
             return ajaxService.get('dashboardAnalysis/GetSites', {});
        },

        getLocations: function() {
             return ajaxService.get('dashboardAnalysis/GetLocations', {});
        },

        getGuardrooms: function(dashboardGroup) {
             return ajaxService.get('dashboardAnalysis/GetGuardrooms', { dashboardGroup: dashboardGroup || '' });
        },

        getDataset: function(type, name, category, guardrooms) {
             return ajaxService.post('dashboardAnalysis/GetDataset', { type: type, name: name, category: category, guardrooms: guardrooms });
        },

        getDashboardCodes: function() {
             return ajaxService.get('dashboardAnalysis/GetDashboardCodes', {});
        },

        getReportCategories: function(type, guardrooms) {
             return ajaxService.post('dashboardAnalysis/GetReportCategories', { type: type, guardrooms: guardrooms });
        },

        getDashboard: function() {
             return ajaxService.get('dashboardAnalysis/GetDashboard', {});
        },

        saveDashboard: function (dashboard) {
            return ajaxService.post('dashboardAnalysis/SaveDashboard', { dashboard: dashboard });
        },

        getDashboardFilters: function (type, name, category, dataset, guardrooms) {
            return ajaxService.post('dashboardAnalysis/GetDashboardFilters', { type: type, name: name, category: category, dataset: dataset, guardrooms: guardrooms });
        },

        getAveragingCoefficientForTimeInterval: function(group, widget) {
             return ajaxService.post('dashboardAnalysis/GetAveragingCoefficientForTimeInterval', { group: group, widget: widget });
         },

        getComparisonData: function(group, widget) {
             return ajaxService.post('dashboardAnalysis/GetComparisonData', { group: group, widget: widget });
         },

        getReportData: function(group, widget) {
             return ajaxService.post('dashboardAnalysis/GetReportData', { group: group, widget: widget });
         },

        LineChart: {
            options: lineChartOptions,
            data: lineChartData
        },

        BarChart: {
            options: discreteBarChartOptions,
            data: discreteBarChartData
        },

        PieChart: {
            options: pieChartOptions,
            data: pieChartData
        },

        DonutChart: {
            options: donutChartOptions,
            data: donutChartData
        },

        MultiBarHorizontalChart: {
            options: multiBarHorizontalChartOptions,
            data: multiBarHorizontalChartData
        }
    };


    /**
    *  Data & Options Generators
    */

    function getChartBaseOptions(chartType, isPercentage) {
        var chartOptions = {
            chart : {
                type: chartType,
                noData: 'Widget has no data', //todo: add translations
                x: function (d) { return d._id; },
                y: function (d) { return d.value; },
                valueFormat: function (d) {
                    return d.toFixed(2) + (isPercentage ? "%" : "");
                },
                deepWatchBuster : Math.random() // change this parameter to ensure that widget is redrawn every time
            }
        }

        return chartOptions;
    }

    function lineChartOptions(colors, isPercentage, preview, maxItemLength, showLegend) {

        var options = getChartBaseOptions('lineChart', isPercentage);

        options.chart.margin = {
            top: 40,
            right: 20,
            bottom: 40,
            left: 55
        };

        options.chart.useInteractiveGuideline = false;

        options.chart.xAxis = {
            axisLabelDistance: -5
        };

        options.chart.yAxis = {
            tickFormat: function(d) {
                return d3.format('.02f')(d);
            },
            axisLabelDistance: -10
        };

        options.chart.showLegend = false;

        return options;
    }

    function lineChartData(data) {
        return [
            {
                values: data ? data : []
            }
        ];
    }


    function discreteBarChartOptions(colors, isPercentage, preview, maxItemLength, showLegend) {

        var options = getChartBaseOptions('discreteBarChart', isPercentage);

        options.chart.margin = {
            top: 10,
            right: 50,
            bottom: preview ? 20 : (maxItemLength / 2 + 10),
            left: preview ? 20 : (maxItemLength / 4 + 10)
        };

        options.chart.color = function(d, i) {
            return (d.data && d.data.color) || colors[i % colors.length];
        };

        options.chart.showValues = true;
        options.chart.duration = 500;

        options.chart.xAxis = {
            axisLabelDistance: -1,
            rotateLabels: -25
        };

        options.chart.yAxis = {
            axisLabelDistance: -10
        };

        return options;
    }

    function discreteBarChartData(data) {
        return [
            {
                key: "Cumulative Return",
                values: data ? data : []
            }
        ];
    }

    function pieChartOptions(colors, isPercentage, preview, maxItemLength, showLegend) {

        var options = getChartBaseOptions('pieChart', isPercentage);

        options.chart.margin = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };

        options.chart.color = function (d, i) {
            return (d.data && d.data.color) || colors[i % colors.length];
        };
       
        options.chart.duration = 500;
        options.chart.showLegend = showLegend;
        options.chart.legendPosition = 'right';

        options.chart.showLabels = true;
        options.chart.labelsOutside = false;
        options.chart.labelType = isPercentage ? "percent" : "value";

        return options;
    }

    function pieChartData(data) {
        return data ? data : [];
    }

    function donutChartOptions(colors, isPercentage, preview, maxItemLength, showLegend) {

        var options = getChartBaseOptions('pieChart', isPercentage);

        options.chart.donut = true;
        options.chart.showLabels = false;

        options.chart.color = function (d, i) {
            return (d.data && d.data.color) || colors[i % colors.length];
        };

        options.chart.pie = {
            startAngle: function(d) { return d.startAngle - Math.PI },
            endAngle: function(d) { return d.endAngle - Math.PI }
        };

        options.chart.duration = 500;
        options.chart.showLegend = showLegend;

        options.chart.labelsOutside = false;
        options.chart.showLabels = true;
        options.chart.labelType = isPercentage ? "percent" : "value";

        options.chart.margin = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };

        options.chart.legendPosition = 'right';

        return options;
    }

    function donutChartData(data) {
        return data ? data : [];
    }

    function multiBarHorizontalChartOptions(colors, isPercentage, preview, maxItemLength, showLegend) {

        var options = getChartBaseOptions('multiBarHorizontalChart', isPercentage);

        options.chart.color = function(d, i) {
            return (d.data && d.data.color) || colors[i % colors.length];
        };

        options.chart.margin = {
            top: 10,
            right: 30,
            bottom: preview ? 20 : 40,
            left: preview ? 20 : (maxItemLength + 10)
        };

        options.chart.showControls = false;
        options.chart.showValues = true;
        options.chart.duration = 500;
        options.chart.showLegend = false;

        return options;
    }

    function multiBarHorizontalChartData(data) {
        return [{ key: "", values: data ? data : [] }];
    }

}]);
