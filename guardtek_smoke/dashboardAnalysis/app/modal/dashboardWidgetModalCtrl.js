(function () {

    angular.module('dashboardAnalysisApp').controller('dashboardWidgetModalCtrl', function ($uibModalInstance, dashboardAnalysisDataService, codeService, selectedWidgetGroup, selectedWidget, lists, filtersService) {
        var vm = this;
        var maxItemLength = 5;

        vm.objects = {};

        vm.dataSetIsLoading = false;
        vm.categoriesAreLoading = false;

        vm.translate = function (str) {
            return codeService.translate(str);
        };

        vm.selectedWidgetGroup = selectedWidgetGroup;
        vm.selectedWidget = selectedWidget;
        vm.lists = lists;
        vm.selectedWidgetGroup.isMenuOpen = false;

        vm.widgetSteps = ['WidgetTheme',
                          'WidgetSetup',
                          'PreviewWidget',
                          'Filters'];

        var init = function () {
            vm.goToStep(0);

            setTimePeriodDefault();
            setTimePeriodsAvailability();
            setCalculationAvailability();
        }

        var getPreviewData = function () {
            var num = Math.random() * 50;
            return JSON.parse('[{ "_id": "A", "value": ' + num + '},{ "_id": "B", "value":' + (100 - num / 3) + '},{ "_id": "C", "value":' + (100 - num / 2) + '},{ "_id": "D", "value":' + (100 - num) + '},{ "_id": "E", "value":' + (100 - num / 5) + '},{ "_id": "F", "value":' + (100 - num / 6) + '}]');
        };

        vm.legendValueChanged = function(newValue) {
            vm.selectedWidget.Settings.ShowLegend = newValue;
            vm.setPreviewChartSettings();
        }

        vm.isTimePeriodEnabled = function () {
            return vm.selectedWidget && vm.selectedWidget.Statistics && ((vm.selectedWidget.Statistics.Value === '$DashboardModule.Settings.Average') || (vm.selectedWidget.Graph.Value === 'LineChart') || (vm.selectedWidget.Graph.Value === 'AreaChart'));
        };

        var setTimePeriodDefault = function () {
            if (vm.selectedWidget) {
                if (!vm.selectedWidget.TimePeriod && vm.isTimePeriodEnabled()) {
                    vm.selectedWidget.TimePeriod = _.find(vm.lists.timePeriods, function (item) { return item.enabled; });
                    vm.selectedWidget.FK_TimePeriod = vm.selectedWidget.TimePeriod ? vm.selectedWidget.TimePeriod.Guid : '';
                }
                else {
                    vm.selectedWidget.FK_TimePeriod = null;
                };
            }
        };

        var setTimePeriodsAvailability = function () {
            if (vm.lists && vm.lists.timePeriods) {
                _.each(vm.lists.timePeriods, function (item) {
                    item.enabled = ((item.Value === '$DashboardModule.Settings.Monthly' || item.Value === '$DashboardModule.Settings.Quarterly' || item.Value === '$DashboardModule.Settings.Weekly') && (vm.selectedWidgetGroup.DateRange.Value === '$DashboardModule.Settings.LastYear' || vm.selectedWidgetGroup.DateRange.Value === '$DashboardModule.Settings.CurrentYear')) ||
                                        ((item.Value === '$DashboardModule.Settings.Daily' || item.Value === '$DashboardModule.Settings.Weekly') && (vm.selectedWidgetGroup.DateRange.Value === '$DashboardModule.Settings.LastMonth' || vm.selectedWidgetGroup.DateRange.Value === '$DashboardModule.Settings.CurrentMonth')) ||
                                        (item.Value === '$DashboardModule.Settings.Daily' && (vm.selectedWidgetGroup.DateRange.Value === '$DashboardModule.Settings.LastWeek' || vm.selectedWidgetGroup.DateRange.Value === '$DashboardModule.Settings.CurrentWeek')) ||
                                        (item.Value === '$DashboardModule.Settings.Hourly' && (vm.selectedWidgetGroup.DateRange.Value === '$DashboardModule.Settings.Today' || vm.selectedWidgetGroup.DateRange.Value === '$DashboardModule.Settings.Yesterday'));
                });
            }
        }

        var setCalculationAvailability = function () {
            if (vm.selectedWidget) {

                _.each(vm.lists.statistics, function (statistics) {
                    if (statistics.Value === '$DashboardModule.Settings.Average' || statistics.Value === '$DashboardModule.Settings.Percentage') {
                        statistics.enabled = (vm.selectedWidget.Graph.Value !== 'Data');
                    }
                    else if (!vm.selectedWidget.DatasetObj) {
                        statistics.enabled = (statistics.Value === '$DashboardModule.Settings.Count');
                    }
                    else {
                        statistics.enabled = (statistics.Value === '$DashboardModule.Settings.Count' && (!vm.selectedWidget.DatasetObj || vm.selectedWidget.DatasetObj.Type !== 'Number')) ||
                                         (statistics.Value === '$DashboardModule.Settings.Sum' && vm.selectedWidget.DatasetObj && vm.selectedWidget.DatasetObj.Type === 'Number');
                    };

                });


                vm.selectedWidget.Statistics = _.find(vm.lists.statistics, function (item) { return item.Guid === vm.selectedWidget.FK_Statistics && item.enabled; });
                vm.selectedWidget.FK_Statistics = vm.selectedWidget.Statistics ? vm.selectedWidget.Statistics.Guid : null;
            };
        }

        vm.isGraphEnabled = function (graph) {
            return (graph.Value !== 'Map' && graph.Value !== 'LineChart' && graph.Value !== 'AreaChart');
        }

        vm.setPreviewChartSettings = function () {
            if (vm.selectedWidget.Graph && vm.selectedWidget.Graph.Value !== 'Data') {
                vm.previewChart.options = dashboardAnalysisDataService[vm.selectedWidget.Graph.Value].options(codeService.graphColors[vm.selectedWidget.GraphColor.Value], false, true, maxItemLength, vm.selectedWidget.Settings.ShowLegend);
                vm.previewChart.data = dashboardAnalysisDataService[vm.selectedWidget.Graph.Value].data(getPreviewData());
            }
        }

        var setWidgetChart = function () {
            if (!vm.previewChart) {
                vm.previewChart = {};
            }

            vm.setPreviewChartSettings();
        };

        if (vm.selectedWidget && vm.selectedWidget.Graph) {
            setWidgetChart();
        }

        //Code tables

        vm.graphTypeSupportsLegend = function () {
            return vm.selectedWidget.Graph.Value.toLowerCase() === 'PieChart'.toLowerCase() || vm.selectedWidget.Graph.Value.toLowerCase() === 'DonutChart'.toLowerCase();
        }

        vm.isDataLoading = function () {
            return vm.dataSetIsLoading || vm.categoriesAreLoading;
        };

        var getDatasetList = function () {
            vm.dataSetIsLoading = true;

            codeService.getDataset(vm.selectedWidget.ReportType.Value.replace('$DashboardModule.Settings.', ''), vm.selectedWidget.ReportCategory ? vm.selectedWidget.ReportCategory.Name || '' : '', vm.selectedWidget.ReportCategory ? vm.selectedWidget.ReportCategory.Category || '' : '', vm.selectedWidgetGroup.Guardrooms).then(function (data) {
                _.each(data, function (item) {
                    item.ValueTranslated = codeService.translate(item.Name);
                });

                vm.selectedWidget.lists.datasets = data;

                vm.dataSetIsLoading = false;
            });
        }

        var setWidgetTitle = function () {
            vm.selectedWidget.Title = vm.selectedWidget.Title || (vm.selectedWidget.ReportCategory ? vm.selectedWidget.ReportCategory.Name || vm.selectedWidget.ReportCategory.Category : vm.selectedWidget.ReportType.ValueTranslated); // vm.selectedWidget.Statistics?vm.selectedWidget.Statistics.ValueTranslated: '' + ' ' +
        }

        vm.selectReportType = function (reportType) {
            vm.selectedWidget.ReportType = reportType;

            vm.categoriesAreLoading = true;

            codeService.getReportCategories(vm.selectedWidget.ReportType.Value.replace('$DashboardModule.Settings.', ''), vm.selectedWidgetGroup.Guardrooms).then(function (data) {
                vm.selectedWidget.lists.reportCategories = data;

                vm.categoriesAreLoading = false;
            });

            vm.selectedWidget.ReportCategory = null;
            vm.selectedWidget.DatasetObj = null;
            vm.selectedWidget.Statistics = null;
            setCalculationAvailability();
            getDatasetList();

            vm.selectedWidget.Title = '';
            setWidgetTitle();
        }

        vm.selectReportCategory = function (category, reportCategory) {
            if (reportCategory) {
                vm.selectedWidget.ReportCategory = reportCategory;
            }
            else {
                vm.selectedWidget.ReportCategory = {};
                vm.selectedWidget.ReportCategory.Category = category;
                vm.selectedWidget.ReportOnName = null;
            }
            vm.selectedWidget.DatasetObj = null;
            getDatasetList();
            vm.selectedWidget.Statistics = null;
            setCalculationAvailability();

            vm.selectedWidget.Title = '';
            setWidgetTitle();
        }

        vm.selectReportDataset = function (dataset) {
            vm.selectedWidget.DatasetObj = dataset;
            vm.selectedWidget.Statistics = null;
            setCalculationAvailability();
        }

        vm.selectReportStatistics = function (statistics) {
            vm.selectedWidget.Statistics = statistics;
            setTimePeriodDefault();
        }


        //Widget Settings
        vm.setBackgroundColor = function (color) {
            vm.selectedWidget.Color = color;
            vm.selectedWidget.FK_Color = vm.selectedWidget.Color.Guid;
        };

        vm.setGraphColor = function (color) {
            vm.selectedWidget.GraphColor = color;
            vm.selectedWidget.FK_GraphColor = vm.selectedWidget.GraphColor.Guid;

            vm.setPreviewChartSettings();
        }

        vm.setWidgetGraph = function (graph) {
            vm.selectedWidget.Graph = graph;
            vm.selectedWidget.FK_Graph = vm.selectedWidget.Graph.Guid;
            setWidgetChart();
            setTimePeriodDefault();
            setCalculationAvailability();
        }

        vm.goToStep = function (index) {
            vm.widgetStepSelection = vm.widgetSteps[index];
        };

        vm.getCurrentStep = function () {
            return _.indexOf(vm.widgetSteps, vm.widgetStepSelection);
        };

        vm.setTimePeriod = function (timePeriod) {
            vm.selectedWidget.TimePeriod = timePeriod;
            vm.selectedWidget.FK_TimePeriod = vm.selectedWidget.TimePeriod.Guid;
        };


        //Filters
        vm.areFiltersLoading = function() {
            return filtersService.filtersLoading;
        }

        vm.filtersAvailable = function () {
            return filtersService.filtersAvailable;
        }

        vm.getFilters = function(index) {
            if (index === 3 && vm.selectedWidget.ReportType) {
                filtersService.setWidgetFilters(vm.selectedWidgetGroup, vm.selectedWidget);
            }
        };
   
        vm.widgetValid = function () {
            var themeStepIsValid = vm.selectedWidget.Color && vm.selectedWidget.Graph;

            return themeStepIsValid && vm.dataStepIsValid();
        }

        vm.dataStepIsValid = function() {
            return vm.selectedWidget.ReportType && vm.selectedWidget.Statistics;
        }

        //Modal buttons
        vm.ok = function () {
            if (vm.selectedWidget) {
                vm.selectedWidget.FK_ReportType = vm.selectedWidget.ReportType ? vm.selectedWidget.ReportType.Guid : '';
                vm.selectedWidget.ReportOnName = vm.selectedWidget.ReportCategory ? vm.selectedWidget.ReportCategory.Name : '';
                vm.selectedWidget.ReportOnCategory = vm.selectedWidget.ReportCategory ? vm.selectedWidget.ReportCategory.Category : '';
                vm.selectedWidget.Dataset = vm.selectedWidget.DatasetObj ? vm.selectedWidget.DatasetObj.Name : '';
                vm.selectedWidget.FK_Statistics = vm.selectedWidget.Statistics ? vm.selectedWidget.Statistics.Guid : '';
                vm.selectedWidget.FK_TimePeriod = vm.selectedWidget.TimePeriod ? vm.selectedWidget.TimePeriod.Guid : '';
            }

            vm.objects.selectedWidget = vm.selectedWidget && vm.widgetValid() ? vm.selectedWidget : null;

            $uibModalInstance.close(vm.objects);
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        init();
    });
})();