(function () {

 angular.module('dashboardAnalysisApp')
 .controller('dashboardAnalysisCtrl', ['webContext', '$timeout', 'dashboardAnalysisDataService', '_', '$uibModal', '$log', 'codeService', '$scope', 'dashboardService', 'filtersService',
     function (webContext, $timeout, dashboardAnalysisDataService, _, $uibModal, $log, codeService, $scope, dashboardService, filtersService) {
         var vm = this;

         var tempObject;
         var saveInProgress = false;
         var timeout = null;
         var tempGroup = null;

         vm.lists = {};
         vm.modal = {};
         vm.initializing = true;
         vm.noWidgetGroups = true;

         var initWidgets = function (data) {
             vm.lists.headerColors = _.where(data, { Type: 'HeaderColor' });
             vm.lists.backgroundColors = _.where(data, { Type: 'BackgroundColor' });
             vm.lists.graphColors = _.where(data, { Type: 'GraphColor' });
             vm.lists.icons = _.where(data, { Type: 'Icon' });
             vm.lists.graphs = _.where(data, { Type: 'Graph' });

             vm.lists.timePeriods = _.where(data, { Type: 'TimePeriod' });
             _.each(vm.lists.timePeriods, function (item) {
                 item.ValueTranslated = codeService.translate(item.Value);
             });

             vm.lists.dateRange = _.where(data, { Type: 'DateRange' });
             _.each(vm.lists.dateRange, function (item) {
                 item.ValueTranslated = codeService.translate(item.Value);
             });

             vm.lists.reportTypes = _.where(data, { Type: 'ReportType' });
             _.each(vm.lists.reportTypes, function (item) {
                 item.ValueTranslated = codeService.translate(item.Value);
             });

             vm.lists.statistics = _.where(data, { Type: 'Statistics' });
             _.each(vm.lists.statistics, function (item) {
                 item.ValueTranslated = codeService.translate(item.Value);
             });

             //Get Dashboard data after code tables are loaded
             dashboardAnalysisDataService.getDashboard().then(function (data) {
                 if (data) {
                     vm.dashboard = data;

                     if (!vm.dashboard.WidgetGroups || vm.dashboard.WidgetGroups.length === 0) {
                         vm.noWidgetGroups = true;
                     } else {
                         vm.noWidgetGroups = false;

                         _.each(vm.dashboard.WidgetGroups, function (group) {
                             group.widgetGroupOptions = getWidgetGroupOptions();
                         });
                     }

                     mapDashboardData().then(function () {
                         vm.initializing = false;
                     });
                 } else {
                     //if there is no dashboard, generate one for the user
                     saveDashboard(true);

                     vm.initializing = false;
                 }
             });
         };

         var init = function () {
             vm.initializing = true;
             codeService.getDashboardCodes().then(initWidgets);
         }

         vm.dashboard = {
             WidgetGroups: []
         };

         vm.activePage = 1;

         vm.getFromWidgetGroupTemplate = function () {
             return {
                 cols: 4,
                 rows: 2,
                 Widgets: [],
                 PageNo: vm.activePage,
                 Color: vm.lists.headerColors ? _.find(vm.lists.headerColors, { Value: 'grey' }) : null,
                 DateRange: vm.lists.dateRange ? vm.lists.dateRange[0] : null,
                 widgetGroupOptions: getWidgetGroupOptions(),
                 init: function () {
                     this.FK_Color = this.Color.Guid;
                     this.FK_DateRange = this.DateRange.Guid;
                     return this;
                 }
             }.init();
         };

         vm.getFromWidgetTemplate = function () {
             return {
                 chart: {
                     api: {}
                 },
                 Filter: {},
                 lists: {},
                 Color: vm.lists.backgroundColors ? _.find(vm.lists.backgroundColors, { Value: 'silver' }) : null,
                 GraphColor: vm.lists.graphColors ? _.find(vm.lists.graphColors, { Value: 'blue' }) : null,
                 Graph: _.find(vm.lists.graphs, function (graph) { return graph.Value === "BarChart"; }),
                 init: function () {
                     this.FK_Color = this.Color.Guid;
                     this.FK_GraphColor = this.GraphColor.Guid;
                     this.FK_Graph = this.Graph.Guid;
                     return this;
                 }
             }.init();
         };

         //Config
         vm.gridsterOptions = {
             gridType: 'fixed',
             fixedColWidth: 150,
             fixedRowHeight: 150,
             maxCols: 8,
             margin: 4,
             minItemRows: 2,
             minItemCols: 2,
             outerMargin: false,
             draggable: {
                 enabled: true,
                 ignoreContent: true,
                 dragHandleClass: 'drag-handler'
             },
             resizable: {
                 enabled: true,
                 stop: function (widgetGroup) {
                     widgetGroup.widgetGroupOptions.api.resize();
                 }
             }
         };

         var getWidgetGroupOptions = function () {
             return {
                 gridType: 'fit',
                 margin: 5,
                 mobileBreakpoint: 0,
                 outerMargin: true,
                 draggable: {
                     enabled: true,
                     stop: function (widget, $element) {
                         $element.gridster.options.api.resize();
                     }
                 },
                 resizable: {
                     enabled: true
                 },
                 itemResizeCallback: function (widget) {
                     $timeout(function () {
                         if (widget.chart && widget.chart.api && widget.chart.api.update) {
                             widget.chart.api.update();
                         }
                     },
                         200);
                 }
             }
         };

         var mapDashboardData = function () {
             return $timeout(function () {
                 _.forEach(vm.dashboard.WidgetGroups, function (group) {

                     group.Color = _.findWhere(vm.lists.headerColors, { Guid: group.FK_Color });
                     group.Icon = _.findWhere(vm.lists.icons, { Guid: group.FK_Icon });
                     group.DateRange = _.findWhere(vm.lists.dateRange, { Guid: group.FK_DateRange });
                     group.isInitializing = true;

                     codeService.getWidgetGroupGuardrooms(group.Guid).then(function (data) {
                         group.Guardrooms = data;

                         // no widgets no initialisation
                         if (!group.Widgets || group.Widgets.length === 0) {
                             group.isInitializing = false;
                         }

                         _.forEach(group.Widgets, function (widget) {
                             loadWidget(group, widget);
                         });
                     });
                 });
             }, 0);
         }

         var getMathOperatorStringFromEnumValue = function (enumValue) {
             var operatorMap = [];
             operatorMap[0] = "=";
             operatorMap[1] = "!=";
             operatorMap[2] = ">";
             operatorMap[3] = ">=";
             operatorMap[4] = "<";
             operatorMap[5] = "<=";

             return operatorMap[enumValue];
         }

         var getQueryOperatorStringFromMathOperatorValue = function (enumValue) {
             var operatorMap = {};
             operatorMap["="] = "$eq";
             operatorMap["!="] = "$ne";
             operatorMap[">"] = "$gt";
             operatorMap["<"] = "$lt";
             operatorMap[">="] = "$gte";
             operatorMap["<="] = "$lte";

             return operatorMap[enumValue];
         }

         var loadWidgetData = function (widgetGroup, widget) {

             widget.isInitializing = true;

             codeService.getReportData(widgetGroup, widget).then(function (data) {
                 widget.FiltersJson = data.Filter;
                 widget.ReportData = JSON.parse(data.ReportData);

                 if (widget.ReportData.length > 0) {
                     widget.total = _.reduce(widget.ReportData, function (memo, obj) { return memo + obj.value; }, 0);
                 }
                 else {
                     widget.total = 0;
                 };

                 setWidgetDataCore(widgetGroup, widget);
             });
         }

         var calculateItemWidth = function (widget) {
             var canvas = document.createElement('canvas');
             var ctx = canvas.getContext("2d");
             ctx.font = "12px Arial";
             return Math.max.apply(Math, widget.ReportData.map(function (o) { return ctx.measureText(o._id).width; }));
         };

         var setWidgetDataCore = function (widgetGroup, widget) {

             codeService.calculateAvgPct(widgetGroup, widget);

             if (widget.Graph && widget.Graph.Value === 'Data') {
                 codeService.getComparisonData(widgetGroup, widget).then(function (data) {
                     if (JSON.parse(data).length > 0) {
                         widget.comparisonTotal = _.reduce(JSON.parse(data), function (memo, obj) { return memo + obj.value; }, 0);
                     }
                 });
             }
             else {

                 var color = codeService.graphColors[widget.GraphColor.Value];
                 var isInPercent = (widget.Statistics.Value === '$DashboardModule.Settings.Percentage');
                 var maxItemWidth = calculateItemWidth(widget);

                 widget.chart.options = dashboardAnalysisDataService[widget.Graph.Value].options(
                         color,
                         isInPercent,
                         false,
                         maxItemWidth === -Infinity ? 0 : maxItemWidth,
                         widget.Settings.ShowLegend);

                 widget.chart.data = dashboardAnalysisDataService[widget.Graph.Value].data(widget.ReportData);
             }

             widget.isInitializing = false;

             var allWidgetsInGroupHaveInitialized = _.every(widgetGroup.Widgets,
                 function (wid) {
                     return !wid.isInitializing;
                 });

             if (allWidgetsInGroupHaveInitialized) {
                 widgetGroup.isInitializing = false;
             }
         }

         var setWidgetData = function (group, widget, data) {
             _.each(data, function (item) {
                 item.ValueTranslated = codeService.translate(item.Name);
             });

             widget.lists.datasets = data;
             widget.DatasetObj = _.findWhere(widget.lists.datasets, { Name: widget.Dataset });

             setWidgetDataCore(group, widget);
         };


         var loadWidget = function (group, widget) {
             widget.isInitializing = true;

             widget.Color = _.findWhere(vm.lists.backgroundColors, { Guid: widget.FK_Color });
             widget.GraphColor = _.findWhere(vm.lists.graphColors, { Guid: widget.FK_GraphColor });
             widget.Graph = _.findWhere(vm.lists.graphs, { Guid: widget.FK_Graph });
             widget.ReportType = _.findWhere(vm.lists.reportTypes, { Guid: widget.FK_ReportType });

             widget.lists = {};
             widget.Statistics = _.findWhere(vm.lists.statistics, { Guid: widget.FK_Statistics });
             widget.TimePeriod = _.findWhere(vm.lists.timePeriods, { Guid: widget.FK_TimePeriod });
             widget.ReportData = JSON.parse(widget.ReportData);

             if (widget.ReportData.length > 0) {
                 widget.total = _.reduce(widget.ReportData, function (memo, obj) { return memo + obj.value; }, 0);
             }

             if (widget.FiltersJson) {

                 var filters = JSON.parse(widget.FiltersJson).Filters;

                 var i = 0;

                 var uiFilters = _.map(filters, function (filter) {

                     var uiFilter = {
                         FieldName: filter.FieldName,
                         FieldValue: filter.FieldValue,
                         Relation: filter.FilterJoinType === 0 ? "AND" : "OR",
                         MathFieldOperator: getMathOperatorStringFromEnumValue(filter.Operator),
                         javascriptId: i   // add sintetic id for removal
                     };

                     i++;

                     return uiFilter;
                 });

                 widget.ExistingFilters = uiFilters;
             }

             // MongoDBQuery
             if (!widget.chart) {
                 widget.chart = { api: {} };
             }

             codeService.calculateAvgPct(group, widget);

             // replace begining of value to make it more human readible. Change this 'awesome' decision in the future. In all other places we use full code/value
             codeService.getReportCategories(widget.ReportType.Value.replace('$DashboardModule.Settings.', ''), group.Guardrooms).then(function (data) {
                 widget.lists.reportCategories = data;
                 widget.ReportCategory = _.findWhere(widget.lists.reportCategories, { Name: widget.ReportOnName });

                 if (!widget.ReportCategory && widget.ReportOnCategory) {
                     widget.ReportCategory = {};
                     widget.ReportCategory.Category = widget.ReportOnCategory;
                 }

                 codeService.getDataset(widget.ReportType.Value.replace('$DashboardModule.Settings.', ''),
                        widget.ReportCategory ? widget.ReportCategory.Name || '' : '',
                        widget.ReportCategory ? widget.ReportCategory.Category || '' : '',
                        group.Guardrooms)
                    .then(function (data) {
                        setWidgetData(group, widget, data);
                    });

             });
         }

         vm.selectWidgetGroup = function (widgetGroup) {
             vm.selectedWidgetGroup = widgetGroup;
         };

         vm.selectWidget = function (widget) {
             vm.selectedWidget = widget;
         };

         var setWidgetLayout = function () {
             tempObject = _.min(vm.selectedWidgetGroup.Widgets, function (widget) { return widget.rows; });
             vm.selectedWidget.rows = tempObject.rows;
             vm.selectedWidget.cols = tempObject.cols;
         };

         vm.openModal = function (url, ctrl) {

             var selectedWidget = angular.copy(vm.selectedWidget);
             var selectedWidgetGroup = angular.copy(vm.selectedWidgetGroup);

             dashboardService.setLists(vm.lists);
             dashboardService.setSelectedWidget(selectedWidget);
             dashboardService.setSelectedWidgetGroup(selectedWidgetGroup);

             vm.modal = $uibModal.open({
                 animation: true,
                 ariaLabelledBy: 'modal-title',
                 ariaDescribedBy: 'modal-body',
                 templateUrl: url,
                 controller: ctrl,
                 controllerAs: 'vm',
                 backdrop: 'static',
                 resolve: {
                     selectedWidgetGroup: function () {
                         return selectedWidgetGroup;
                     },
                     selectedWidget: function () {
                         return selectedWidget;
                     },
                     lists: function () {
                         return vm.lists;
                     },
                     filtersService: function () {
                         return filtersService;
                     }
                 }
             });

             return vm.modal.result;
         };

         var updateWidget = function (updatedWidget) {
             vm.selectedWidget = _.find(vm.selectedWidgetGroup.Widgets, function (widget) { return widget.Guid === updatedWidget.Guid; });

             _.each(Object.keys(vm.selectedWidget), function (key) {
                 vm.selectedWidget[key] = updatedWidget[key];
             });

             // retain already existing filter which where not removed
             if (vm.selectedWidget.ExistingFilters) {

                 vm.selectedWidget.Filter = vm.selectedWidget.Filter || {};
                 vm.selectedWidget.Filter.Expressions = vm.selectedWidget.Filter.Expressions || [];

                 for (var i = 0; i < vm.selectedWidget.ExistingFilters.length; i++) {
                     vm.selectedWidget.Filter.Expressions.push({
                         Relation: vm.selectedWidget.ExistingFilters[i].Relation,
                         FieldName: vm.selectedWidget.ExistingFilters[i].FieldName,
                         FieldOperator: getQueryOperatorStringFromMathOperatorValue(vm.selectedWidget.ExistingFilters[i].MathFieldOperator),
                         FieldValue: vm.selectedWidget.ExistingFilters[i].FieldValue
                     });
                 }
             }
         }

         var addWidget = function (widget) {
             widget.Guid = codeService.getNewGUID();

             vm.selectedWidget = widget;

             if (!vm.selectedWidgetGroup.Widgets) {
                 vm.selectedWidgetGroup.Widgets = [];
             }

             if (vm.selectedWidgetGroup.Widgets.length > 0) {
                 setWidgetLayout(vm.selectedWidgetGroup);
             }

             vm.selectedWidgetGroup.Widgets.push(vm.selectedWidget);
         }

         var updateWidgetGroup = function (widgetGroup) {
             vm.selectedWidgetGroup = _.find(vm.dashboard.WidgetGroups, function (group) { return group.Guid === widgetGroup.Guid; });

             _.each(Object.keys(vm.selectedWidgetGroup), function (key) {
                 vm.selectedWidgetGroup[key] = widgetGroup[key];
             });
         }

         var addWidgetGroup = function (widgetGroup) {
             widgetGroup.Guid = codeService.getNewGUID();

             vm.selectedWidgetGroup = widgetGroup;
             vm.dashboard.WidgetGroups.push(vm.selectedWidgetGroup);

             vm.noWidgetGroups = false;
         }

         vm.openWidgetSetting = function (widgetGroup, widget) {
             vm.selectWidgetGroup(widgetGroup);

             if (widget) {
                 vm.selectedWidget = widget;
             }
             else {
                 vm.selectedWidget = vm.getFromWidgetTemplate();
             }

             vm.selectedWidget.Settings = vm.selectedWidget.Settings || { ShowLegend: true };

             var promise = vm.openModal('dashboard-widget-settings.html', 'dashboardWidgetModalCtrl');

             promise.then(function (objects) {

                 if (objects.selectedWidget) {
                     if (objects.selectedWidget.Guid) {
                         updateWidget(objects.selectedWidget);
                     }
                     else {
                         addWidget(objects.selectedWidget);
                     }

                     loadWidgetData(vm.selectedWidgetGroup, vm.selectedWidget);
                 }

             }, function () {
                 // do nothing
             });
         };

         vm.openWidgetGroupSettings = function (widgetGroup, modalPage) {
             if (widgetGroup) {
                 vm.selectedWidgetGroup = widgetGroup;
             }
             else {
                 vm.selectedWidgetGroup = vm.getFromWidgetGroupTemplate();
             }

             vm.selectedWidgetGroup.modalPage = modalPage;
             var promise = vm.openModal('dashboard-widget-group-settings.html', 'dashboardWidgetGroupModalCtrl');

             promise.then(function (objects) {

                 if (objects.selectedWidgetGroup) {
                     if (objects.selectedWidgetGroup.Guid) {
                         updateWidgetGroup(objects.selectedWidgetGroup);
                     }
                     else {
                         addWidgetGroup(objects.selectedWidgetGroup);
                     }

                     if (vm.selectedWidgetGroup.Widgets && vm.selectedWidgetGroup.Widgets.length !== 0) {
                         vm.selectedWidgetGroup.isInitializing = true;

                         // update data for all widgets in the group
                         _.each(vm.selectedWidgetGroup.Widgets, function (widget) {
                             loadWidgetData(vm.selectedWidgetGroup, widget);
                         });
                     }
                 }

             }, function () {
                 // do nothing
             });
         };

         vm.duplicateWidgetGroup = function () {
             vm.selectedWidgetGroup.isMenuOpen = false;
             var group = angular.copy(vm.selectedWidgetGroup);
             group.Guid = codeService.getNewGUID();

             _.each(group.Widgets, function (widget) {
                 widget.Guid = codeService.getNewGUID();
             });

             vm.dashboard.WidgetGroups.push(group);
         }

         vm.deleteWidgetGroup = function () {
             var result = vm.openModal('widget-group-deletion-confirmation-modal.html', 'confirmationModalCtrl');

             result.then(function (isConfirmed) {
                 if (isConfirmed) {
                     vm.dashboard.WidgetGroups.splice(vm.dashboard.WidgetGroups.indexOf(vm.selectedWidgetGroup), 1);

                     if (vm.dashboard.WidgetGroups.length === 0) {
                         vm.noWidgetGroups = true;
                     }
                 }
             }, function () {
                 //do nothing
             });
         };

         vm.deleteWidget = function (widgetGroup, widget) {
             var result = vm.openModal('widget-deletion-confirmation-modal.html', 'confirmationModalCtrl');

             result.then(function (isConfirmed) {
                 if (isConfirmed) {
                     widgetGroup.Widgets.splice(widgetGroup.Widgets.indexOf(widget), 1);
                 }
             }, function () {
                 //do nothing
             });
         }

         //auto save 
         //todo : use dirty flag instead
         $scope.$watch(function () {
             return vm.dashboard.WidgetGroups.map(function (group) {
                tempGroup = {
                    Title: group.Title,
                    Color: group.FK_Color,
                    Icon: group.FK_Icon,
                    X: group.x,
                    Y: group.y,
                    Row: group.rows,
                    Col: group.cols,
                    DateRange: group.FK_DateRange, 
                    PageNo: group.PageNo
                };

                 tempGroup.Widgets = [];

                 _.each(group.Widgets, function (widget) {

                     var expressions = widget.Filter ? widget.Filter.Expressions : null;

                     tempGroup.Widgets.push({
                         X: widget.x,
                         Y: widget.y,
                         Row: widget.rows,
                         Col: widget.cols,
                         FK_ReportType: widget.FK_ReportType,
                         ReportOnName: widget.ReportOnName,
                         ReportOnCategory: widget.ReportOnCategory,
                         Dataset: widget.Dataset,
                         FK_Statistics: widget.FK_Statistics,
                         FK_Graph: widget.FK_Graph,
                         FK_Color: widget.FK_Color,
                         FK_GraphColor: widget.FK_GraphColor,
                         FK_TimePeriod: widget.FK_TimePeriod,
                         Filter : widget.Filter,
                         Expressions: expressions
                     });
                 });

                 return tempGroup;
             });
         }, function (newVal, oldVal) {
             if (!vm.initializing && !angular.equals(newVal, oldVal)) {
                 if (timeout) {
                     $timeout.cancel(timeout);
                 }

                 timeout = $timeout(saveDashboard, 1000);
             }
         }, true);

         var saveDashboard = function (initialize) {
             if (!saveInProgress) {

                 saveInProgress = true;

                 dashboardAnalysisDataService.saveDashboard(vm.dashboard).then(function (data) {
                     if (initialize) {
                         vm.dashboard = data;
                     }

                     saveInProgress = false;
                 });
             };
         };

         //PDF export
         vm.exportToPDF = function () {

             var svgElements = $("#container").find('svg');

             //replace all svgs with a temp canvas
             svgElements.each(function () {
                 var canvas, xml;

                 $("gridster a").hide();

                 canvas = document.createElement("canvas");
                 $(canvas).css('display', 'block');
                 canvas.className = "screenShotTempCanvas";
                 //convert SVG into a XML string
                 xml = (new XMLSerializer()).serializeToString(this);

                 // Removing the name space as IE throws an error
                 xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');
                 xml = xml.replace(/width=\"100%\"/, 'width=\"' + $(this).parents("gridster-item").css("width") + '\"');
                 xml = xml.replace(/width: 100%/, 'width:' + $(this).parents("gridster-item").css("width") + ';height:' + $(this).parents("gridster-item").css("height"));

                 //draw the SVG onto a canvas
                 canvg(canvas, xml);
                 $(canvas).insertAfter(this);
                 //hide the SVG element
                 $(this).attr('class', 'tempHide');
                 $(this).hide();
             });

             html2canvas($("#container"), {
                 onrendered: function (canvas) {

                     var pdf = new jsPDF('landscape', 'pt', 'A4');

                     for (var i = 0; i < Math.round(parseInt($("#container").css("width")) / 1200); i++) {

                         var srcImg = canvas;
                         var sX = 0;
                         var sY = 810 * i;
                         var sWidth = 1200;
                         var sHeight = 810;
                         var dX = 0;
                         var dY = 0;
                         var dWidth = 1200;
                         var dHeight = 810;

                         window.onePageCanvas = document.createElement("canvas");
                         onePageCanvas.setAttribute('width', 1200);
                         onePageCanvas.setAttribute('height', 810);
                         var ctx = onePageCanvas.getContext('2d');

                         ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);

                         // document.body.appendChild(canvas);
                         var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

                         var width = onePageCanvas.width;
                         var height = onePageCanvas.height;

                         //! If we're on anything other than the first page,
                         // add another page
                         if (i > 0) {
                             pdf.addPage(842, 595);
                         }
                         //! now we declare that we're working on that page
                         pdf.setPage(i + 1);
                         //! now we add content to that page!
                         pdf.addImage(canvasDataURL, 'PNG', 20, 20, (width * .62), (height * .62));

                     }
                     //! after the for loop is finished running, we save the pdf.
                     pdf.save('Report-' + new Date().toDateString() + '.pdf');
                     $("#container").find('.screenShotTempCanvas').remove();
                     $("#container").find('.tempHide').show().removeClass('tempHide');
                     $("gridster a").show();

                 }
             });

         };
         init(); //initialise dashboard and widgets
     } ]);

})();