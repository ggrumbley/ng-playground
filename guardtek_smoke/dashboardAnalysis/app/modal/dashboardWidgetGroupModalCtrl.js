(function () {

    angular.module('dashboardAnalysisApp').controller('dashboardWidgetGroupModalCtrl', 
    function($uibModalInstance, dashboardAnalysisDataService, codeService, selectedWidgetGroup, lists) {

        var vm = this;

        vm.objects = {};

        vm.lists = lists;
        vm.widgetGroupSettingsLoading = false;

        vm.translate = function (str) {
            return codeService.translate(str);
        };

        vm.themePageName = 'theme';
        vm.dataSettingsPageName = 'data-settings';

        vm.selectedWidgetGroup = selectedWidgetGroup;

        vm.selectedWidgetGroup.isMenuOpen = false;
        
        var init = function() {
            vm.widgetGroupSettingsLoading = true;

            getCustomers().then(function () {
                getSites().then(function () {
                    getLocations().then(function () {
                        getGuardrooms().then(function () {
                            assignParent('Locations', 'Guardrooms');
                            assignParent('Sites', 'Locations');
                            assignParent('Customers', 'Sites');

                            vm.widgetGroupSettingsLoading = false;
                        });
                    });
                });
            });
        }

        vm.setHeaderIcon = function (icon) {
            vm.selectedWidgetGroup.Icon = icon;
            vm.selectedWidgetGroup.FK_Icon = vm.selectedWidgetGroup.Icon.Guid;
        };

        vm.setHeaderColor = function (color) {
            vm.selectedWidgetGroup.Color = color;
            vm.selectedWidgetGroup.FK_Color = vm.selectedWidgetGroup.Color.Guid;
        };

        vm.selectDateRange = function (date) {
            vm.selectedWidgetGroup.DateRange = date;
        }

        vm.widgetGroupValid = function () {
            return vm.dataStepIsValid() && vm.themeStepIsValid();
        }

        vm.dataStepIsValid = function() {
            return vm.selectedWidgetGroup.Guardrooms && vm.selectedWidgetGroup.Guardrooms.length > 0 && vm.selectedWidgetGroup.DateRange;
        }

        vm.themeStepIsValid = function() {
            return vm.selectedWidgetGroup.Color;
        }

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        vm.ok = function () {
            vm.selectedWidgetGroup.FK_DateRange = vm.selectedWidgetGroup.DateRange ? vm.selectedWidgetGroup.DateRange.Guid : '';
            vm.selectedWidgetGroup.FK_Color = vm.selectedWidgetGroup.Color ? vm.selectedWidgetGroup.Color.Guid : '';
            vm.selectedWidgetGroup.FK_GraphColor = vm.selectedWidgetGroup.GraphColor ? vm.selectedWidgetGroup.GraphColor.Guid : '';
            vm.selectedWidgetGroup.FK_Icon = vm.selectedWidgetGroup.Icon ? vm.selectedWidgetGroup.Icon.Guid : '';
            vm.selectedWidgetGroup.LastModificationDateUtc = new Date();

            vm.objects.selectedWidgetGroup = vm.selectedWidgetGroup;

            $uibModalInstance.close(vm.objects);
        };

        var getGuardrooms = function () {
            return dashboardAnalysisDataService.getGuardrooms().then(function (data) {
                vm.GuardroomsList = data;
                _.each(vm.GuardroomsList, function (guardroom) {
                    if (vm.selectedWidgetGroup.Guardrooms) {
                        guardroom.checked = false;
                        var listItem = _.find(vm.selectedWidgetGroup.Guardrooms, function (item) { return item.Value === guardroom.Value; });
                        if (listItem) {
                            guardroom.checked = true;
                        }
                    }
                    else {
                        guardroom.checked = true;
                    }
                });

                if (!vm.selectedWidgetGroup.Guardrooms) {
                    assignModel('Guardrooms');
                }
            });
        };

        var getLocations = function () {
            return dashboardAnalysisDataService.getLocations().then(function (data) {
                vm.LocationsList = data;
            });
        };

        var getSites = function () {
            return dashboardAnalysisDataService.getSites().then(function (data) {
                vm.SitesList = data;
            });
        };

        var getCustomers = function () {
            return dashboardAnalysisDataService.getCustomers().then(function (data) {
                vm.CustomersList = data;
            });
        };

        var assignModel = function (string) {
            vm.selectedWidgetGroup[string] = _.filter(vm[string + 'List'], function (item) { return item.checked === true; });
        };

        var assignChild = function (parentList, childList) {
            _.each(vm[childList + 'List'], function (item) { item.checked = false; });

            _.each(vm.selectedWidgetGroup[parentList], function (model) {
                _.each(vm[childList + 'List'], function (item) {
                    if (model.Value === item.ParentId) {
                        item.checked = true;
                    }
                });
            });

            assignModel(childList);
        };

        var assignParent = function (parentList, childList) {
            _.each(vm[parentList + 'List'], function (item) { item.checked = false; });

            _.each(vm.selectedWidgetGroup[childList], function (model) {
                _.each(vm[parentList + 'List'], function (item) {
                    if (item.Value === model.ParentId) {
                        item.checked = true;
                    }
                });
            });
            assignModel(parentList);
        };

        vm.customersChanged = function () {
            assignModel('Customers');
            assignChild('Customers', 'Sites');
            assignChild('Sites', 'Locations');
            assignChild('Locations', 'Guardrooms');
        };

        vm.sitesChanged = function () {
            assignModel('Sites');
            assignParent('Customers', 'Sites');
            assignChild('Sites', 'Locations');
            assignChild('Locations', 'Guardrooms');
        };

        vm.locationsChanged = function () {
            assignModel('Locations');
            assignParent('Sites', 'Locations');
            assignParent('Customers', 'Sites');
            assignChild('Locations', 'Guardrooms');
        };

        vm.guardroomsChanged = function () {
            assignModel('Guardrooms');
            assignParent('Locations', 'Guardrooms');
            assignParent('Sites', 'Locations');
            assignParent('Customers', 'Sites');
        };

        init();
    });

})();