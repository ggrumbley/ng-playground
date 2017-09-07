angular
  .module("as.ui", ["mgcrea.ngStrap", "ui.bootstrap"])
  .directive("asDownloadForm", [
    "$window",
    function($window) {
      return {
        restrict: "A",
        scope: {
          downloadAction: "@",
          downloadSection: "=",
          downloadType: "=",
          argsAsJson: "=",
          downloadEndedProbe: "="
        },
        templateUrl:
          $window.rootBase +
          "content/angular-apps/default/tpl/downloadForm.tpl.html"
      };
    }
  ])
  .directive("asOptionsClass", function($parse) {
    //http://stackoverflow.com/questions/15264051/how-to-use-ng-class-in-select-with-ng-options
    return {
      require: "select",
      link: function(scope, elem, attrs, ngSelect) {
        // get the source for the items array that populates the select.
        var optionsSourceStr = attrs.ngOptions.split(" ").pop(),
          // use $parse to get a function from the options-class attribute
          // that you can use to evaluate later.
          getOptionsClass = $parse(attrs.optionsClass);

        scope.$watch(optionsSourceStr, function(items) {
          // when the options source changes loop through its items.
          angular.forEach(items, function(item, index) {
            // evaluate against the item to get a mapping object for
            // for your classes.
            var classes = getOptionsClass(item),
              // also get the option you're going to need. This can be found
              // by looking for the option with the appropriate index in the
              // value attribute.
              option = elem.find("option[value=" + index + "]");

            // now loop through the key/value pairs in the mapping object
            // and apply the classes that evaluated to be truthy.
            angular.forEach(classes, function(add, className) {
              if (add) {
                angular.element(option).addClass(className);
              }
            });
          });
        });
      }
    };
  })
  .directive("asDatePicker", [
    "$timeout",
    "$window",
    "$filter",
    "$injector",
    function($timeout, $window, $filter, $injector) {
      return {
        restrict: "A",
        scope: {
          dateValue: "=",
          minDate: "=",
          maxDate: "=",
          disabled: "="
        },
        template:
          '<div class="input-group date-picker-group">' +
          '<input type="text" ng-disabled="disabled" class="date-picker form-control" datepicker-append-to-body="true" uib-datepicker-popup="{{dateOptions.dateFormat}}" datepicker-popup="{{dateOptions.dateFormat}}" ng-model="dateValue" is-open="opened" min-date="dateOptions.minDate" max-date="dateOptions.maxDate" datepicker-options="dateOptions" ng-keyup="changeDate($event)"/>' +
          '<span class="input-group-btn">' +
          '<button type="button" class="btn btn-default" ng-click="toggleCalendar()" ng-disabled="{{disabled}}"><i class="image-button-small action-button-calendar" style="color:#75bc26;"></i></button>' +
          "</span>" +
          "</div>",
        controller: function($scope, $element, $attrs, $transclude) {
          var translate = $filter("translate");
          $scope._webContext = $injector.get("webContext");
          $scope.toggleCalendar = function() {
            $timeout(function() {
              $scope.opened = true;
            });
          };

          var datepickerPopupConfig = null;
          var datepickerConfig = null;
          if (angular.version.minor > 2) {
            datepickerPopupConfig = $injector.get("uibDatepickerPopupConfig");
            datepickerConfig = $injector.get("uibDatepickerConfig");
          } else {
            datepickerPopupConfig = $injector.get("datepickerPopupConfig");
            datepickerConfig = $injector.get("datepickerConfig");
          }

          $scope._webContext.load.then(function(result) {
            datepickerPopupConfig.currentText = translate(
              "$Global.Calendar.Today"
            );
            datepickerPopupConfig.clearText = translate("$Global.Button.Clear");
            datepickerPopupConfig.closeText = translate("$Global.Button.Close");
            datepickerPopupConfig.datepickerPopup = window.dateFormat;
            datepickerConfig.startingDay = 1;
            $scope._webContext = result;
          });
        },
        compile: function(element, attributes) {
          var today = new Date();
          if (!attributes.dateFormat) {
            attributes.dateFormat = window.dateFormat;
          }
          attributes.minDate = !attributes.minDate
            ? new Date(
                today.getFullYear() - 5,
                today.getMonth(),
                today.getDate()
              )
            : attributes.minDate;
          attributes.maxDate = !attributes.maxDate
            ? new Date(
                today.getFullYear() + 5,
                today.getMonth(),
                today.getDate()
              )
            : attributes.maxDate;

          return {
            post: function(scope, elem, attrs) {
              scope.dateOptions = {
                dateFormat: attrs.dateFormat,
                minDate: attrs.minDate,
                maxDate: attrs.maxDate,
                "year-format": "'yy'",
                "starting-day": 1
              };
              scope.changeDate = function(e) {
                var res = "";
                var val = "";
                var firstSeparator = 1;
                var secondSeparator = 3;
                if (
                  e.which != 8 &&
                  e.which != 16 &&
                  e.which != 37 &&
                  e.which != 39 &&
                  e.which != 46 &&
                  e.which != 36
                ) {
                  if (
                    scope._webContext.context.dateFormat().toLowerCase() ==
                      "yyyy-mm-dd" ||
                    scope._webContext.context.dateFormat().toLowerCase() ==
                      "yyyy.mm.dd" ||
                    scope._webContext.context.dateFormat().toLowerCase() ==
                      "yyyy/mm/dd"
                  ) {
                    firstSeparator = 3;
                    secondSeparator = 5;
                  }
                  if (scope._webContext.context.dateSeparator() == "/")
                    val = e.target.value.replace(/\//g, "");
                  else if (scope._webContext.context.dateSeparator() == ".")
                    val = e.target.value.replace(/\./g, "");
                  else if (scope._webContext.context.dateSeparator() == "-")
                    val = e.target.value.replace(/\-/g, "");
                  var j = 0;
                  for (var i = 0; i < val.length; ++i) {
                    res += val[i];
                    if (i == firstSeparator || i == secondSeparator) {
                      res += scope._webContext.context.dateSeparator();
                    }
                  }
                  e.target.value = res;
                }
              };
            }
          };
        }
      };
    }
  ])
  .directive("asUiLoading", [
    "$timeout",
    function($timeout) {
      return {
        restrict: "A",
        compile: function(tElement, tAttrs) {
          if (window.Blob) {
            tElement.addClass("as-ui-widget-loading");
            tElement.append(angular.element("<div />"));
            tElement.append(angular.element("<div />"));
            tElement.append(angular.element("<div />"));
            tElement.append(angular.element("<div />"));
            tElement.append(angular.element("<div />"));
          } else {
            //display animated gif if the browser is old
            tElement.append(
              angular.element(
                '<img src="' + window.rootBase + '/img/loading.gif"/>'
              )
            );
          }
        }
      };
    }
  ])
  .directive("button", function() {
    return {
      restrict: "E",
      compile: function(element, attributes) {
        element.addClass("btn");
        element.addClass("btn-default");
        element.addClass("btn-sm");

        if (
          !attributes.type ||
          (attributes.type === "submit" &&
            !attributes.isSubmit &&
            attributes.isSubmit !== "")
        ) {
          element.attr("type", "button");
        }
      }
    };
  })
  .directive("tfFormField", function() {
    return {
      restrict: "A",
      transclude: true,
      scope: { title: "@", tfFormField: "@" },
      template:
        '<div class="form-group">' +
        '<label class="control-label col-sm-4">{{title||tfFormField}}</label>' +
        '<div ng-transclude class="col-sm-8 control-value"></div>' +
        "</div>"
    };
  })
  .directive("tfFileUpload", function() {
    return {
      restrict: "A",
      scope: {
        id: "@",
        serverHandler: "@"
      },
      template:
        '<input type="file" tf-watch-file ng-model="als.selection.filename" id="{{id}}"/>',
      link: function(scope, elem, attrs) {
        elem.fileupload({
          autoUpload: false,
          replaceFileInput: false,

          url: scope.serverHandler,
          dataType: "json",
          headers: {
            Accept: "application/json"
          },
          accept: "application/json",
          done: function(e, data) {
            var result = data.result.Status || data.result;
            if (!result.IsError) {
              if (instance.onSuccessCallback) {
                instance.onSuccessCallback(data.result);
              }

              $(this).trigger("uploaded", [data.result]);
            } else if (instance.onErrorCallback) {
              instance.onErrorCallback(data.result.ErrorMessage);
            }
          },
          fail: function(e, data) {
            if (instance.onErrorCallback) {
              instance.onErrorCallback(data.errorThrown);
            }
          }
        });
      }
    };
  })
  .directive("asAction", function() {
    var getStyleRules = function(selector, stylesheet) {
      var sheets =
        typeof stylesheet !== "undefined" ? [stylesheet] : document.styleSheets;
      for (var i = 0, l = sheets.length; i < l; i++) {
        var rules = sheets[i].rules || sheets[i].cssRules;
        if (!rules) {
          continue;
        }
        var ruleSet = _.filter(rules, function(r) {
          return r.selectorText && r.selectorText.indexOf(selector) !== -1;
        });
        if (ruleSet && ruleSet.length > 0) return ruleSet;
      }
      return null;
    };

    return {
      restrict: "AE",
      compile: function(element, attributes) {
        var className =
          "action-button-" + (attributes.asAction || attributes.type);
        var rules = getStyleRules("." + className + "::before");

        if (
          rules &&
          rules.length > 0 &&
          rules[0].selectorText.indexOf(".mdi-") !== -1
        ) {
          element.addClass("image-button-mdi");
        } else {
          element.addClass("image-button-small");
        }

        element.addClass(className);
      }
    };
  })
  .directive("asMoveItemAction", function() {
    return {
      restrict: "AE",
      templateUrl: "asMoveitemAction.html", // The template has to be include in the main page where it's used from /Content/scripts/settings-inspections/directives/asMoveitemAction.html
      scope: {
        index: "=",
        list: "="
      },
      controller: function($scope) {
        $scope.moveUp = function() {
          moveUp($scope.list, $scope.index);
        };

        $scope.moveDown = function() {
          moveDown($scope.list, $scope.index);
        };

        function moveUp(list, index) {
          if (index > 0) {
            var tmp = list[index];
            list[index] = list[index - 1];
            list[index - 1] = tmp;
          }
        }

        function moveDown(list, index) {
          if (index < list.length - 1) {
            var tmp = list[index];
            list[index] = list[index + 1];
            list[index + 1] = tmp;
          }
        }
      }
    };
  })
  .directive("selectTwo", [
    "$window",
    function($window) {
      return {
        restrict: "A",
        scope: {
          data: "=",
          callback: "&"
        },
        link: function(scope, el, attrs) {
          $window
            .$("#" + attrs.id)
            .select2({
              multiple: true,
              query: function(query) {
                query.callback(scope.data);
              }
            })
            .on("change", function(e) {
              scope.callback({ selectedValues: e.val });
            });
        }
      };
    }
  ])
  .directive("asYesNo", [
    function() {
      return {
        restrict: "E,A",
        replace: true,
        scope: {
          value: "=",
          uncheckable: "@",
          ngDisabled: "=",
          noText: "@",
          yesText: "@",
          onChange: "&",
          yesCssClass: "@",
          noCssClass: "@",
          yesValue: "@",
          noValue: "@"
        },
        template: function(tElement, tAttrs) {
          var uncheckable = tAttrs.uncheckable === "true" ? "uncheckable" : "";

          var yes = tAttrs.yesValue ? "'" + tAttrs.yesValue + "'" : true;
          var no = tAttrs.noValue ? "'" + tAttrs.noValue + "'" : false;

          var template =
            '<div class="btn-group btn-group-yes-no" ng-class="{disabled : ngDisabled}">' +
            '<label active-class="{{yesCssClass}}" ng-click="click(' +
            yes +
            ')" class="btn btn-primary" ng-model="value" uib-btn-radio="' +
            yes +
            '" btn-radio="' +
            yes +
            '" ' +
            uncheckable +
            " ng-disabled=\"ngDisabled\">{{yesText===undefined ? ('$Global.Text.Yes' | translate) : (yesText | translate)}}</label>" +
            '<label active-class="{{noCssClass}}" ng-click="click(' +
            no +
            ')" class="btn btn-primary" ng-model="value" uib-btn-radio="' +
            no +
            '" btn-radio="' +
            no +
            '" ' +
            uncheckable +
            " ng-disabled=\"ngDisabled\">{{noText===undefined ? ('$Global.Text.No' | translate) : (noText | translate)}}</label>" +
            "</div>";
          return template;
        },
        link: function(scope, element, attrs) {
          scope.click = function(value) {
            scope.value = value;
            scope.onChange({ value: value });
          };
        }
      };
    }
  ])
  .directive("asPassFailAbsent", function($compile) {
    var normalTemplate =
      '<div class="btn-group" ng-class="{disabled : ngDisabled}">' +
      '<label class="btn btn-primary" ng-model="value" btn-radio="0" ng-disabled="ngDisabled" >{{"$Global.Text.Pass" | translate}}</label>' +
      '<label class="btn btn-primary" ng-model="value" btn-radio="1" ng-disabled="ngDisabled" >{{"$Global.Text.Fail" | translate}}</label>' +
      '<label class="btn btn-primary" ng-model="value" btn-radio="2" ng-disabled="ngDisabled" >{{"$Global.Text.Absent" | translate}}</label>' +
      "</div>";

    var uncheckableTemplate =
      '<div class="btn-group" ng-class="{disabled : ngDisabled}">' +
      '<label class="btn btn-primary" ng-model="value" btn-radio="0" uncheckable ng-disabled="ngDisabled">{{"$Global.Text.Pass" | translate}}</label>' +
      '<label class="btn btn-primary" ng-model="value" btn-radio="1" uncheckable ng-disabled="ngDisabled">{{"$Global.Text.Fail" | translate}}</label>' +
      '<label class="btn btn-primary" ng-model="value" btn-radio="2" uncheckable ng-disabled="ngDisabled">{{"$Global.Text.Absent" | translate}}</label>' +
      "</div>";

    var getTemplate = function(uncheckable) {
      if (uncheckable === "true") return uncheckableTemplate;
      else return normalTemplate;
    };

    return {
      restrict: "E,A",
      replace: true,
      scope: {
        value: "=",
        uncheckable: "@",
        ngDisabled: "="
      },
      link: function(scope, element, attrs) {
        var isUncheckable = scope.uncheckable || "true";
        element.html(getTemplate(isUncheckable));
        $compile(element.contents())(scope);
      }
    };
  })
  .directive("asConfirmClick", [
    "$filter",
    "$window",
    function($filter, $window) {
      return {
        scope: {
          asConfirmClick: "=",
          asConfirmedClick: "&",
          disabled: "="
        },
        link: function(scope, element, attr) {
          var translate = $filter("translate");
          var clickAction = scope.asConfirmedClick;

          scope.$watch(
            function() {
              return scope.disabled;
            },
            function(newVal, oldVal) {
              if (newVal === true) element.unbind("click");
              else element.bind("click", runAction);
            }
          );

          function runAction(event) {
            if (
              $window.confirm(
                scope.asConfirmClick ||
                  translate("$Global.Text.ConfirmDeleteItem")
              )
            ) {
              scope.$eval(clickAction);
            }
          }
        }
      };
    }
  ])
  .directive("asDateInlineField", [
    function() {
      return {
        restrict: "A",
        scope: {
          dateValue: "=",
          edit: "="
        },
        templateUrl:
          window.rootBase +
          "content/angular-apps/default/tpl/dateInlineField.tpl.html",
        link: function(scope, elem, attrs) {
          scope.opened = false;
        }
      };
    }
  ])
  .directive("asYesNoInlineField", [
    function() {
      return {
        restrict: "A",
        scope: {
          value: "=",
          edit: "=",
          uncheckable: "@"
        },
        templateUrl:
          window.rootBase +
          "content/angular-apps/default/tpl/yesNoInlineField.tpl.html"
      };
    }
  ])
  .directive("asProgressBar", [
    "$window",
    function($window) {
      return {
        restrict: "A",
        require: "ngModel",
        replace: true,
        scope: {
          showPercentage: "=",
          colorThreshold: "@",
          color: "@"
        },
        templateUrl:
          $window.rootBase +
          "Content/angular-apps/default/tpl/progressBar.tpl.html",
        link: function(scope, elem, attrs, ngModelCtrl) {
          ngModelCtrl.$formatters.push(getProgressBarValue);
          ngModelCtrl.$parsers.push(getProgressBarValue);

          ngModelCtrl.$render = function() {
            $(".progressBar", elem).width(ngModelCtrl.$viewValue + "%");
            if (scope.colorThreshold !== undefined) {
              var threshold = parseInt(scope.colorThreshold);
              if (angular.isNumber(threshold)) {
                if (ngModelCtrl.$viewValue < threshold)
                  $(".progressBar", elem).css("background-color", "red");
                else {
                  $(".progressBar", elem).css("background-color", "#75bc26");
                }
              }
            } else {
              if (scope.color !== undefined)
                $(".progressBar", elem).css("background-color", scope.color);
            }
            scope.percentage = ngModelCtrl.$viewValue + "%";
          };

          function getProgressBarValue(value) {
            if (!value || parseInt(value) === NaN || parseInt(value) < 0)
              return 0;
            else return value > 100 ? 100 : value;
          }
        }
      };
    }
  ])
  .directive("asSectionHeader", [
    function() {
      return {
        restrict: "A",
        transclude: true,
        template: '<div class="reportTitle"><span ng-transclude></span></div>',
        link: function(scope, elem, attrs) {}
      };
    }
  ])
  .directive("asSignature", [
    "$window",
    "$filter",
    function($window, $filter) {
      return {
        restrict: "EA",
        scope: {
          signatureData: "=",
          width: "@",
          height: "@"
        },
        link: function(scope, elem, attrs) {
          var translate = $filter("translate");
          var canvasId = "canvas" + scope.$id;
          var sketchId = "sketch" + scope.$id;
          var $sketchpad = angular.element(
            '<div id="' +
              sketchId +
              '" style="width:' +
              scope.width +
              "px;height:" +
              scope.height +
              'px;border:solid 1px #aaaaaa;background-color:#eeeeee;"></div>'
          );
          var $toolbar = angular.element(
            '<div id="toolbar' + sketchId + '" class="signature-toolbar"></div>'
          );
          $toolbar.append(
            angular
              .element(
                '<button class="btn btn-default btn-small"><span class="mdi mdi-eraser"></span></button>'
              )
              .on("click", function(e) {
                e.preventDefault();
                clear();
              })
          );
          $toolbar.append(
            angular
              .element(
                '<button class="btn btn-default btn-small"><span class="mdi mdi-undo"></span></button>'
              )
              .on("click", function(e) {
                e.preventDefault();
                undo();
              })
          );
          $toolbar.append(
            angular
              .element(
                '<button class="btn btn-default btn-small"><span class="mdi mdi-redo"></span></button>'
              )
              .on("click", function(e) {
                e.preventDefault();
                redo();
              })
          );
          var $canvas = angular.element(
            '<canvas id="' + canvasId + '" style="display:none;"></canvas>'
          );
          elem.append($toolbar);
          elem.append($sketchpad);
          elem.append($canvas);
          var sketchpad = $window.Raphael.sketchpad(sketchId, {
            width: scope.width,
            height: scope.height,
            editing: true
          });
          var paper = sketchpad.paper();
          var canvas = elem.find("#" + canvasId)[0];
          var context = canvas.getContext("2d");
          canvas.width = scope.width;
          canvas.height = scope.height;

          sketchpad.change(onSketchDataChange);

          function clear() {
            sketchpad.clear();
          }

          function undo() {
            sketchpad.undo();
          }

          function redo() {
            sketchpad.redo();
          }

          function onSketchDataChange() {
            $window.canvg(canvasId, paper.toSVG());
            context.drawImage(canvas, 0, 0);

            if (window.Blob) {
              //keep this case for reference, but it will only work on browsers >= ie10
              canvas.toBlob(function(blob) {
                scope.$apply(function() {
                  scope.signatureData = blob;
                });
              });
            } else {
              scope.$apply(function() {
                var data = canvas
                  .toDataURL()
                  .replace(/^data:image\/(png|jpg);base64,/, "");
                scope.signatureData = data;
              });
            }
          }
        }
      };
    }
  ])
  .directive("asSketchpad", [
    "$window",
    "$filter",
    function($window, $filter) {
      return {
        restrict: "EA",
        scope: {
          backgroundImage: "=",
          sketchData: "="
        },
        link: function(scope, elem, attrs) {
          var translate = $filter("translate");
          var sketchId = "sketch" + scope.$id;
          var canvasId = "canvas" + scope.$id;
          var tempCanvasId = "tempCanvas" + scope.$id;
          var $sketchpad = angular.element(
            '<div id="' +
              sketchId +
              '" style="background-image:url(\'' +
              scope.backgroundImage +
              "');background-repeat:no-repeat;\"></div>"
          );
          var $imageLoader = angular.element(
            '<img id="imageLoader' +
              scope.$id +
              '" src="' +
              scope.backgroundImage +
              '" style="display:none;"/>'
          );
          var $canvas = angular.element(
            '<canvas id="' + canvasId + '" style="display:none;"></canvas>'
          );
          var $tempCanvas = angular.element(
            '<canvas id="' + tempCanvasId + '" style="display:none;"></canvas>'
          );
          var $toolbar = angular.element(
            '<div id="toolbar' +
              sketchId +
              '" class="imagecanvas-toolbar"></div>'
          );
          elem.append($toolbar);
          elem.append($sketchpad);
          elem.append($imageLoader);
          elem.append($canvas);
          elem.append($tempCanvas);

          var imageElement = elem.find("#imageLoader" + scope.$id);

          //make sure all the images are loaded so the sketchpad dimensions are right
          imageElement.bind("load", function() {
            var image = new Image();
            image.src = scope.backgroundImage;

            var sketchpad = $window.Raphael.sketchpad(sketchId, {
              width: image.width,
              height: image.height,
              editing: true
            });
            $toolbar.append(
              angular
                .element(
                  '<button class="btn btn-default btn-small"><span class="mdi mdi-eraser"></span></button>'
                )
                .on("click", function(e) {
                  e.preventDefault();
                  clear();
                })
            );
            $toolbar.append(
              angular
                .element(
                  '<button class="btn btn-default btn-small"><span class="mdi mdi-undo"></span></button>'
                )
                .on("click", function(e) {
                  e.preventDefault();
                  undo();
                })
            );
            $toolbar.append(
              angular
                .element(
                  '<button class="btn btn-default btn-small"><span class="mdi mdi-redo"></span></button>'
                )
                .on("click", function(e) {
                  e.preventDefault();
                  redo();
                })
            );
            var paper = sketchpad.paper();
            var canvas = elem.find("#" + canvasId)[0];
            canvas.width = image.width;
            canvas.height = image.height;
            var tempCanvas = elem.find("#" + tempCanvasId)[0];
            var ctx = canvas.getContext("2d");
            sketchpad.change(onSketchDataChange);

            function clear() {
              sketchpad.clear();
            }

            function undo() {
              sketchpad.undo();
            }

            function redo() {
              sketchpad.redo();
            }

            function onSketchDataChange() {
              $window.canvg(tempCanvasId, paper.toSVG());
              ctx.drawImage(image, 0, 0);
              ctx.drawImage(tempCanvas, 0, 0);
              if (window.Blob) {
                //keep this case for reference, but it will only work on browsers >= ie10
                canvas.toBlob(function(blob) {
                  scope.$apply(function() {
                    scope.sketchData = blob;
                  });
                });
              } else {
                scope.$apply(function() {
                  var data = canvas
                    .toDataURL()
                    .replace(/^data:image\/(png|jpg);base64,/, "");
                  scope.sketchData = data;
                });
              }
            }
          });
        }
      };
    }
  ])
  .directive("asTagList", [
    "$timeout",
    function($timeout) {
      var link = function($scope, iElm, iAttrs) {
        var render = function() {
          $timeout(function() {
            var list = iElm.find(".select2-choices");
            var items = list.find(".select2-search-choice");

            // Remove deleted items
            for (var i = items.length - 1; i >= 0; i--) {
              var item = items[i];
              var found = false;
              for (var j = $scope.tags.length - 1; j >= 0; j--) {
                if ($scope.tags[j].id === item.id) {
                  found = true;
                  break;
                }
              }

              if (!found) {
                var t = angular.element(item);
                t.off("click");
                t.remove();
              }
            }

            // Add new items
            for (var i = 0; i < $scope.tags.length; i++) {
              var newItem = $scope.tags[i];
              if (iElm.find("#" + newItem.id).length == 0) {
                var tag = angular.element("<li />", {
                  class: "select2-search-choice",
                  id: newItem.id
                });
                var label = angular.element("<div />").text(newItem.text);
                var close = angular.element("<a />", {
                  href: "#",
                  class: "select2-search-choice-close",
                  tabindex: "-1",
                  id: newItem.id
                });

                tag.append(label);
                tag.append(close);
                list.append(tag);

                close.off("click").on(
                  "click",
                  (function(obj, dom, closeButton) {
                    return function() {
                      for (var idx = $scope.tags.length - 1; idx >= 0; idx--) {
                        var t = $scope.tags[idx];
                        if (t.id === obj.id) {
                          $scope.tags.splice(idx, 1);
                          if ($scope.deleteItem) {
                            $timeout(function() {
                              $scope.deleteItem({ item: obj });
                            });
                          }
                          closeButton.off("click");
                          dom.remove();
                        }
                      }
                    };
                  })(newItem, tag, close)
                );
              }
            }
          });
        };

        $scope.$watchCollection("tags", function(newVal) {
          render();
        });

        $timeout(function() {
          render();
        });
      };

      return {
        restrict: "A",
        scope: {
          tags: "=",
          deleteItem: "&"
        },
        compile: function(tElement, tAttrs) {
          tElement
            .addClass("select2-container")
            .addClass("select2-container-multi");

          var choices = angular.element("<ul />", { class: "select2-choices" });
          tElement.append(choices);

          if (tAttrs.placeholder) {
            var placeholder = angular.element("<div />", {
              class: "select2-placeholder"
            });
            placeholder.text(tAttrs.placeholder);
            choices.append(placeholder);
          }

          return link;
        }
      };
    }
  ])
  .factory("asDialogs", [
    "$timeout",
    "$filter",
    "$modal",
    function($timeout, $filter, $modal) {
      var showNotification = function(
        isError,
        message,
        linkText,
        linkHandler,
        isSticky
      ) {
        var translate = $filter("translate");
        if (isSticky === undefined) isSticky = false;

        if (!$.gritter) {
          console.log("Gritter plugin is not installed/loaded");
          if (isError) {
            alert(translate("$Global.Text.Error") + ":\n" + translate(message));
          } else {
            alert(translate(message));
          }

          return;
        }

        angular.extend($.gritter.options, { position: "bottom-center" });

        if (isError) {
          if (!linkHandler && !linkText && typeof message !== "string") {
            linkHandler = message;
            message = undefined;
          }

          message = message || "$Global.Text.Error";
        }

        if (linkHandler) {
          linkText = linkText || "$Global.Text.MoreDetails";
          if (typeof linkHandler === "string") {
            linkHandler = (function(msg) {
              return function() {
                alert(msg);
              };
            })(linkHandler);
          }
        }

        var content =
          '<span class="icon icon-' +
          (isError ? "alert" : "check") +
          '" /><span class="gritter-message">' +
          translate(message) +
          "</span>";
        if (linkHandler)
          content += '<a href="" class="link">' + translate(linkText) + "</a>";

        $.gritter.add({
          text: content,
          sticky: isSticky,
          time: 8000,
          class_name: isError ? "gritter-error" : "gritter-success",
          after_open: function(elem) {
            if (linkHandler) {
              elem
                .find(".link")
                .off("click")
                .on("click", function(e) {
                  e.preventDefault();
                  linkHandler();
                  return false;
                });
            }
          }
        });
      };

      return {
        showError: function(errorObject, linkText, linkHandler) {
          var HTTP_STATUS_TIMEOUT = 504;

          var translate = $filter("translate");
          $timeout(function() {
            console.debug(errorObject);
            errorObject = errorObject || { statusText: "" };
            var isSticky = false;

            //certain errors are more like tips on how to fix the error, we want the user to have to acknowledge this message instead of fading out automatically
            if (errorObject.statusText !== "") {
              if (errorObject.statusText === "Precondition Failed")
                isSticky = true;
            }

            if (
              typeof errorObject === "string" ||
              typeof errorObject === "function"
            ) {
              showNotification(
                true,
                errorObject,
                linkText,
                linkHandler,
                isSticky
              );
            } else if (
              errorObject.status &&
              errorObject.status != HTTP_STATUS_TIMEOUT &&
              errorObject.responseText
            ) {
              reg = /<title>((.|[\r\n])*)<\/title>/.exec(
                errorObject.responseText
              );
              regMessage = /{"message":"([^"]+)"}/.exec(
                errorObject.responseText
              );

              if (reg && reg.length > 0) {
                msg = reg[1].replace(/[\r\n]/g, "");
                msg = $("<textarea />")
                  .html(msg)
                  .text();
                var statusText = errorObject.statusText;

                if (msg.length < 100) {
                  showNotification(true, msg, linkText, linkHandler, isSticky);
                } else {
                  showNotification(
                    true,
                    msg.substring(0, 20) + "...",
                    translate("Global.Text.MoreDetails"),
                    function() {
                      var id = Math.random();
                      var detail = $modal({
                        title: "",
                        content: msg,
                        show: true,
                        prefixEvent: "" + id
                      });
                      detail.$scope.$on(id + ".hide", function() {
                        if (linkHandler) linkHandler();
                      });
                    },
                    isSticky
                  );
                }
              } else if (regMessage && regMessage.length > 0)
                showNotification(
                  true,
                  translate("$Global.Text.Error") + ": " + regMessage[1],
                  linkText,
                  linkHandler,
                  isSticky
                );
              else {
                if (errorObject.statusText) {
                  showNotification(
                    true,
                    errorObject.statusText,
                    linkText,
                    linkHandler,
                    isSticky
                  );
                } else {
                  showNotification(
                    true,
                    "$Global.Text.Error",
                    linkText,
                    linkHandler,
                    isSticky
                  );
                }
              }
            } else if (errorObject.statusText) {
              showNotification(
                true,
                errorObject.statusText,
                linkText,
                linkHandler,
                isSticky
              );
            } else {
              showNotification(
                true,
                "$Global.Text.Error",
                linkText,
                linkHandler,
                isSticky
              );
            }
          });
        },

        showSuccess: function(message, linkText, linkHandler) {
          var translate = $filter("translate");
          $timeout(function() {
            message =
              message !== undefined
                ? message
                : translate("$Global.Text.Success");
            showNotification(false, message, linkText, linkHandler);
          });
        }
      };
    }
  ])
  .directive("bingContainer", [
    "$timeout",
    "webContext",
    function($timeout, webContext) {
      // Runs during compile
      return {
        scope: {
          position: "=",
          readOnly: "=",
          getAddress: "&",
          isInherited: "=",
          viewMode: "@",
          noUi: "=",
          zoom: "=",
          waitUntilLoaded: "=",
          geofenceZone: "=",
          path: "=",
          locations: "=",
          apiStore: "&",
          fullScreen: "="
        },
        restrict: "AE",
        transclude: true,
        template:
          '<div style="height:100%;position:relative">' +
          '<div style="height:100%;width:100%;">' +
          '   <div class="bing-container" style="height:100%;"></div>' +
          '	<div style="display: inline-block; vertical-align: top"><span as-action="set-gps-position" ng-click="mapAddress()" ng-if="!readOnly"></span></div>' +
          "</div>" +
          "<div ng-transclude></div>" +
          "</div>",
        controller: [
          "$scope",
          "$q",
          function($scope, $q) {
            var self = this;
            var _mapInstance = undefined;
            var _loadedModules = {};

            var mapLoadedDeferred = $q.defer();
            $scope.$promise = mapLoadedDeferred.promise;

            if (!!$scope.uiFeatures) {
              $scope.noUi = $scope.uiFeatures.length == 0;
            }

            if ($scope.$parent.setBingApiInstance) {
              $scope.$parent.setBingApiInstance({
                /**
            * Returns the bounds of the current view
            * @returns {LocationRect} @see https://msdn.microsoft.com/en-us/library/gg427621.aspx
            */
                getBounds: function() {
                  return _mapInstance.getBounds();
                },
                /**
            * Return the boundaries of the current view as a rectangle
            * @returns {{top, right, bottom, left}}
            */
                getBoundsRect: function() {
                  return _mapInstance.getBoundsRect();
                },

                openInfoBox: function(layerName, location) {
                  var index = _mapInstance.infobox.getLocationIndex(
                    layerName,
                    location
                  );
                  _mapInstance.infobox.showInfoBox(index, layerName);
                },

                closeInfoBox: function(layerName, location) {
                  _mapInstance.infobox.hideInfobox();
                }
              });
            }

            self.renderMapLayer = function(
              layerName,
              data,
              ensureVisible,
              clustered,
              clusterIcons,
              zIndex
            ) {
              if (!_mapInstance || !_loadedModules["themes"]) return;
              if (
                $scope.bingOptions.enableClustering &&
                _loadedModules["clusters"]
              ) {
                _mapInstance.addClusteredPushpins(
                  data,
                  layerName,
                  _.defaults(clusterIcons, $scope.bingOptions.clusterIcons),
                  ensureVisible,
                  zIndex
                );
              } else {
                _mapInstance.addPushpins(data, layerName, ensureVisible);
              }
            };

            self.toogleVisibility = function(layerName, visible) {
              if (visible) _mapInstance.show(layerName);
              else _mapInstance.hide(layerName);
            };

            self.toogleClustering = function(layerName, enableCluster) {
              _mapInstance.toogleClustering(layerName, enableCluster);
            };

            self.onModuleLoaded = function(fn) {
              $scope.$promise.then(null, null, fn);
            };

            var setPosition = function(loc) {
              _mapInstance.clear("locationPoint");
              if (loc) {
                var _pushpin = new _mapInstance.type.Pushpin();
                _pushpin.Location = new _mapInstance.type.Location(
                  loc.Latitude,
                  loc.Longitude
                );
                _pushpin.Actions = [];
                _pushpin.Icon = loc.LocationIcon
                  ? _mapInstance.icons[loc.LocationIcon]
                  : _mapInstance.icons.buildingIcon;
                _pushpin.HasInfobox = false;

                if (loc.LocationDescription && !$scope.noUi) {
                  _pushpin.Description =
                    '<span class="pushpin-description">' +
                    loc.LocationDescription +
                    "</span>";
                  _pushpin.HasInfobox = true;
                }

                _mapInstance.addPushpins([_pushpin], "locationPoint", true);
              }
            };

            var setGeofence = function(zone) {
              _mapInstance.addPolygon(zone.GeoFenceLocations || [], "geofence");
            };

            var setPath = function(path) {
              _mapInstance.clear("locationPoint");
              if (path) {
                var pins = _.map(path, function(loc) {
                  var _pushpin = new _mapInstance.type.Pushpin(
                    undefined,
                    new _mapInstance.type.Location(loc.Latitude, loc.Longitude),
                    undefined,
                    undefined,
                    loc.LocationDescription && !$scope.noUi
                      ? '<span class="pushpin-description">' +
                        loc.LocationDescription +
                        "</span>"
                      : undefined,
                    [],
                    loc.LocationIcon
                      ? _mapInstance.icons[loc.LocationIcon]
                      : _mapInstance.icons.buildingIcon,
                    loc.LocationDescription && !$scope.noUi
                  );

                  return _pushpin;
                });

                _mapInstance.addPushpins(pins, "locationPoint", true);
              }
            };

            $scope.mapAddress = function() {
              $scope.getAddress().then(function(addressObject) {
                if (addressObject != undefined) {
                  var a = [];
                  if (addressObject.StreetNumber)
                    a.push(addressObject.StreetNumber);
                  if (addressObject.StreetName)
                    a.push(addressObject.StreetName);
                  if (addressObject.City) a.push(addressObject.City);
                  if (addressObject.State) a.push(addressObject.State);
                  if (addressObject.ZipCode) a.push(addressObject.ZipCode);
                  if (addressObject.Country) a.push(addressObject.Country);

                  _mapInstance.findAddress(a.join(", "), function(loc) {
                    if (loc) {
                      $timeout(function() {
                        $scope.position.Latitude = loc.latitude;
                        $scope.position.Longitude = loc.longitude;
                        setPosition($scope.position);
                      });
                    }
                  });
                }
              });
            };

            var setWatchCount = 0;
            var setWatchers = function(module) {
              if (setWatchCount == 0) {
                $scope.$watch(
                  function() {
                    return $scope.position
                      ? "" +
                        $scope.position.Latitude +
                        $scope.position.Longitude +
                        $scope.position.LocationIcon
                      : "";
                  },
                  function(newValue, oldvalue) {
                    if (newValue && newValue != oldvalue) {
                      setPosition($scope.position);
                      // Disabled because it cracks the autozoom feature of bingMaps library and make basd zooming in Loneworker page
                      //							if ($scope.zoom) {
                      //								setTimeout(function () {
                      //									_mapInstance.setZoom($scope.zoom);
                      //								}, 10);
                      //							}
                    }
                  }
                );

                $scope.$watch(
                  "geofenceZone",
                  function(newValue, oldValue) {
                    if (
                      newValue &&
                      (!oldValue || newValue.Id !== oldValue.Id)
                    ) {
                      /* Find a better diff test */
                      setGeofence(newValue);
                    }
                  },
                  true
                );

                $scope.$watch("zoom", function(newValue, oldvalue) {
                  if (newValue && (!oldvalue || newValue != oldvalue)) {
                    _mapInstance.setZoom(newValue);
                  }
                });

                $scope.$watch("noUi", function(newValue, oldvalue) {
                  if (newValue != oldvalue) {
                    createMap();
                  }
                });
                $scope.$watchCollection("uiFeatures", function(
                  newValue,
                  oldvalue
                ) {
                  if (newValue != oldvalue) {
                    createMap();
                  }
                });
                /*
            $scope.$watch('path', function (newValue, oldValue) {
            if (newValue) { // Find a better diff test
            setPath(newValue);
            }
            }, true);
            */

                if (!$scope.bingOptions.enableClustering) {
                  $scope.$watchCollection("locations", function(newValue) {
                    _mapInstance.clear("locations");
                    if (newValue) {
                      _mapInstance.addPushpins(newValue, "locations");
                    }
                  });
                }

                $scope.$watch("viewMode", function(newValue) {
                  if (_mapInstance && newValue) {
                    _mapInstance.setMapType(getMapType(newValue));
                  }
                });
                setWatchCount++;
              }

              if ($scope.bingOptions.enableClustering && module == "clusters") {
                $scope.$watchCollection("locations", function(newValue) {
                  _mapInstance.clear("locations");
                  if (newValue) {
                    _mapInstance.addClusteredPushpins(
                      newValue,
                      "locations",
                      $scope.bingOptions.clusterIcon
                    );
                  }
                });
              }
            };

            var getMapType = function(viewMode) {
              viewMode = viewMode || "aerial";
              switch (viewMode) {
                case "auto":
                  return Microsoft.Maps.MapTypeId.auto;
                case "birdseye":
                  return Microsoft.Maps.MapTypeId.birdseye;
                case "road":
                  return Microsoft.Maps.MapTypeId.road;
                default:
                  return Microsoft.Maps.MapTypeId.aerial;
              }
            };

            var createMap = function() {
              if (_mapInstance) _mapInstance.destroy();
              _mapInstance = window.GeoLocationFactory.getNew();
              _mapInstance.init({
                mapLayer: $scope.mapLayerDomId,
                mode:
                  $scope.isInherited || $scope.readOnly
                    ? "display"
                    : "pointEdit",
                mapType: getMapType($scope.viewMode),
                showBreadcrumb: false,
                showUi: !$scope.noUi,
                uiFeatures: ($scope.bingOptions || {}).uiFeatures,
                enableClustering: $scope.bingOptions.enableClustering,
                userMouseDownHandler: function(e) {
                  var loc = _mapInstance.map.tryPixelToLocation(
                    new Microsoft.Maps.Point(e.getX(), e.getY())
                  );
                  if (loc && $scope.position) {
                    $timeout(function() {
                      $scope.position.Latitude = loc.latitude;
                      $scope.position.Longitude = loc.longitude;
                      setPosition($scope.position);
                    });
                  }
                },
                mapLoadedHandler: function(module) {
                  $timeout(function() {
                    if ($scope.position) setPosition($scope.position);
                    if ($scope.zoom) _mapInstance.setZoom($scope.zoom);
                    if ($scope.geofenceZone) setGeofence($scope.geofenceZone);
                    if (
                      $scope.locations &&
                      !$scope.bingOptions.enableClustering
                    )
                      _mapInstance.addPushpins($scope.locations, "locations");
                    if (
                      $scope.locations &&
                      $scope.bingOptions.enableClustering &&
                      module == "clusters"
                    )
                      _mapInstance.addClusteredPushpins(
                        $scope.locations,
                        "locations",
                        $scope.bingOptions.clusterIcon
                      );
                    if ($scope.bingOptions.moduleLoaded)
                      $scope.bingOptions.moduleLoaded.notify(module);

                    _loadedModules[module] = true;
                    mapLoadedDeferred.notify(module);
                    setWatchers(module);
                  }, 200);
                }
              });
            };

            $scope.$watch("mapCreateReady", function(newValue, oldValue) {
              if (newValue) createMap();
            });
          }
        ],
        compile: function(element, attributes) {
          return function link($scope, iElm, iAttrs, controller) {
            var self = this;
            webContext.loadMap().then(function() {
              if (!window.GeoLocationFactory) {
                throw "Bing Map helper script hasn't been loaded!";
                return;
              }

              var bingOptions = {};
              if (attributes["bingContainer"]) {
                bingOptions = $scope.$parent.$eval(attributes["bingContainer"]);
              }
              $scope.bingOptions = bingOptions;

              angular.element(iElm).css({ height: "100%" });
              var mapLayer = iElm.find(".bing-container");
              if (!mapLayer[0].id) {
                mapLayer[0].id =
                  "bingContainer-" + Math.round(Math.random() * 1000000);
              }

              $scope.mapLayerDomId = mapLayer[0].id;
              if (!!attributes.fullScreen) {
                angular.element(window).on("resize", function() {
                  var newHeight =
                    angular.element(window).height() -
                    angular.element("#" + $scope.mapLayerDomId).offset().top -
                    30;
                  angular.element("#" + $scope.mapLayerDomId).height(newHeight);
                });
                $timeout(function() {
                  angular.element(window).resize();
                });
              }

              $scope.mapCreateReady = false;
              var createMap = function() {
                $scope.mapCreateReady = true;
              };

              var checkDomReady = function() {
                if (mapLayer.parents(".modal").parent().length > 0) {
                  createMap();
                } else {
                  $timeout(checkDomReady, 100);
                }
              };

              if (mapLayer.parents(".modal").length) {
                //We are in a modal popup, let's wait to be included in the DOM
                $timeout(checkDomReady, 100);
              } else if ($scope.waitUntilLoaded) {
                //We are instructed to wait until a promise resolves, so wait
                $scope.waitUntilLoaded.then(createMap);
              } else {
                createMap();
              }
            });
          };
        }
      };
    }
  ])
  .directive("bingMapLayer", [
    "webContext",
    function(webContext) {
      return {
        restrict: "EA",
        scope: {
          name: "@",
          clusterIcon: "@",
          clusterIconWithText: "@",
          clusterIconAnchorX: "@",
          clusterIconAnchorY: "@",
          clusterIconWithTextAnchorX: "@",
          clusterIconWithTextAnchorY: "@",
          zIndex: "@",
          locations: "=",
          clustered: "=",
          ensureVisible: "=",
          showLayer: "="
        },
        require: "^^bingContainer",
        link: function(scope, element, attrs, bingCtrl) {
          webContext.loadMap().then(function() {
            var zIndex = scope.zIndex || 0;
            var clusterIcons = {
              icon: scope.clusterIcon,
              iconWithText: scope.clusterIconWithText,
              iconAnchor:
                scope.clusterIconAnchorX && scope.clusterIconAnchorY
                  ? { x: scope.clusterIconAnchorX, y: scope.clusterIconAnchorY }
                  : undefined,
              iconWithTextAnchor:
                scope.clusterIconWithTextAnchorX &&
                scope.clusterIconWithTextAnchorY
                  ? {
                      x: scope.clusterIconWithTextAnchorX,
                      y: scope.clusterIconWithTextAnchorY
                    }
                  : undefined
            };
            scope.$watchCollection("locations", function(newValue) {
              bingCtrl.renderMapLayer(
                scope.name,
                newValue,
                !!scope.ensureVisible,
                scope.clustered,
                clusterIcons,
                zIndex
              );
              bingCtrl.toogleVisibility(scope.name, scope.showLayer);
              bingCtrl.toogleClustering(scope.name, scope.clustered);
            });

            scope.$watch("showLayer", function(newValue) {
              bingCtrl.toogleVisibility(scope.name, newValue);
            });

            scope.$watch("clustered", function(newValue) {
              bingCtrl.toogleClustering(scope.name, newValue);
            });

            bingCtrl.onModuleLoaded(function(module) {
              bingCtrl.toogleVisibility(scope.name, scope.showLayer);
              bingCtrl.toogleClustering(scope.name, scope.clustered);
            });
          });
        }
      };
    }
  ])
  .directive("asFixCrappyIeSelect", function() {
    return {
      restrict: "A",
      scope: {
        options: "=asFixCrappyIeSelect"
      },
      controller: [
        "$scope",
        "$element",
        function($scope, $element) {
          $scope.$watch("options", function() {
            $element.css("width", "auto").css("width", "");
          });
        }
      ]
    };
  })
  .directive("tfUiSortColumn", [
    "$timeout",
    "$window",
    "$filter",
    "webContext",
    "datepickerPopupConfig",
    function($timeout, $window, $filter, webContext, datepickerPopupConfig) {
      return {
        restrict: "A",
        scope: {
          sortContext: "="
        },
        compile: function(element, attrs) {
          var el = angular.element(element);
          el.addClass("sort-column");

          return {
            post: function(scope, elem, attrs) {
              el.on("click", function() {
                $timeout(function() {
                  if (scope.sortContext === attrs.tfUiSortColumn)
                    scope.sortContext = "-" + attrs.tfUiSortColumn;
                  else scope.sortContext = attrs.tfUiSortColumn;
                });
              });

              scope.$watch("sortContext", function(val) {
                if (val === attrs.tfUiSortColumn)
                  el.removeClass("sorted-desc").addClass("sorted-asc");
                else if (val === "-" + attrs.tfUiSortColumn)
                  el.removeClass("sorted-asc").addClass("sorted-desc");
                else el.removeClass("sorted-asc").removeClass("sorted-desc");
              });

              if (attrs.isDefaultSort === "true") {
                scope.sortContext =
                  attrs.defaultSortOrder + attrs.tfUiSortColumn;
              }
            }
          };
        }
      };
    }
  ])
  .factory("modalPopup", [
    "$modal",
    "$q",
    function($modal, $q) {
      var _windowId = 0;
      return function(content) {
        var id = ++_windowId;
        var defer = $q.defer();

        angular.extend(content, { show: true, prefixEvent: "" + id });

        var detail = $modal(content);
        detail.$scope.$on(id + ".hide", function() {
          defer.resolve();
        });

        return defer.promise;
      };
    }
  ])
  .directive("asMedia", [
    "ajaxService",
    "$sce",
    function(ajaxService, $sce) {
      return {
        scope: {
          field: "=",
          root: "="
        },
        template:
          "<div>" +
          '<div ng-if="field.Value.PictureUrl"><img ng-src="{{root}}{{field.Value.PictureUrl}}" border="0" style="max-width:320px; max-height: 240px"></div>' +
          '<video ng-if="field.Value.AwsVideo && videoUrl" id="v_player" style="position:relative; width:300px; height:150px;" controls ng-src="{{videoUrl}}">Your browser does not support HTML5 video</video>' +
          "</div>",
        link: function($scope, iElm, iAttrs, controller) {
          if ($scope.field.Value && $scope.field.Value.AwsVideo) {
            ajaxService
              .post("Amazon/GetPreSignedVideoUrl", {
                key: $scope.field.Value.AwsVideo
              })
              .then(function(result) {
                $scope.videoUrl = $sce.trustAsResourceUrl(result);
              });
          }
        }
      };
    }
  ])
  .directive("ngClick", [
    function() {
      return {
        compile: function(element, attrs) {
          element.css({ cursor: "pointer" });
        }
      };
    }
  ])
  .directive("resizeHeight", [
    "$window",
    function($window) {
      return function(scope, elem, attr) {
        var w = angular.element($window);
        var offset = parseInt(attr["offsetFromBottom"]);
        scope.$watch(
          function() {
            return { h: w.height() };
          },
          function(newValue) {
            var e = angular.element(elem);
            e.css({ height: newValue.h - elem.offset().top - offset + "px" });
          },
          true
        );

        w.bind("resize", function() {
          scope.$apply();
        });
      };
    }
  ])
  .directive("resizeWidth", [
    "$window",
    function($window) {
      return function(scope, elem, attr) {
        var w = angular.element($window);
        var offset = parseInt(attr["offsetFromRight"]);
        scope.$watch(
          function() {
            return { w: w.width() };
          },
          function(newValue) {
            var e = angular.element(elem);
            e.css({ width: newValue.w - elem.offset().left - offset + "px" });
          },
          true
        );

        w.bind("resize", function() {
          scope.$apply();
        });
      };
    }
  ])
  .directive("tfWatchFile", [
    function() {
      return {
        restrict: "A",
        require: "ngModel",
        compile: function(tElm, tAttrs) {
          return function(scope, elem, attr, controller) {
            console.log({ elem: elem, attr: attr });

            if (
              elem[0].tagName.toUpperCase() === "INPUT" &&
              attr.type.toUpperCase() === "FILE"
            ) {
              elem.bind("change", function() {
                if (scope.$$phase || scope.$root.$$phase) {
                  return;
                }
                scope.$apply(function() {
                  var path = elem.val();
                  path = path.substring(
                    path.indexOf("fakepath\\") + "fakepath\\".length
                  );
                  controller.$setViewValue(path);
                });
              });
            }
          };
        }
      };
    }
  ])
  .factory("Flash", [
    "$rootScope",
    "$timeout",
    function($rootScope, $timeout) {
      $rootScope.alerts = [];
      $rootScope.closeAlert = function(index) {
        $rootScope.alerts.splice(index, 1);
      };

      return {
        show: function(type, message, clear, stay) {
          if (clear) this.clear();
          stay = typeof stay !== "undefined" ? stay : false;
          $rootScope.alerts.push({ type: type, msg: message });
          if (!stay) {
            $timeout(function() {
              $rootScope.alerts.splice(0, 1);
            }, 4000);
          }
        },
        clear: function() {
          $rootScope.alerts = [];
        }
      };
    }
  ])
  .directive("tfMonthSelect", [
    "$window",
    function($window) {
      return {
        restrict: "A",
        scope: {
          monthModel: "="
        },
        templateUrl:
          $window.rootBase +
          "content/angular-apps/default/tpl/monthSelect.tpl.html"
      };
    }
  ])
  .directive("tfDaySelect", [
    "$window",
    function($window) {
      return {
        restrict: "A",
        scope: {
          dayModel: "="
        },
        link: function(scope, elem, attr) {
          scope.days = new Array(31);
          for (var i = 0, ii = scope.days.length; i < ii; i++) {
            scope.days[i] = i.toString();
          }
        },
        templateUrl:
          $window.rootBase +
          "content/angular-apps/default/tpl/daySelect.tpl.html"
      };
    }
  ])
  .directive("tfOrdinalSelect", [
    "$window",
    function($window) {
      return {
        scope: {
          ordinalModel: "="
        },
        restrict: "A",
        templateUrl:
          $window.rootBase +
          "content/angular-apps/default/tpl/ordinalSelect.tpl.html"
      };
    }
  ])
  .directive("tfWeekdaySelect", [
    "$window",
    function($window) {
      return {
        restrict: "A",
        scope: {
          weekdayModel: "="
        },
        templateUrl:
          $window.rootBase +
          "content/angular-apps/default/tpl/weekdaySelect.tpl.html"
      };
    }
  ])
  .factory("loading", [
    function() {
      return function(target, prop) {
        var setProgressState = function(obj, stateProperty, stateValue) {
          obj[stateProperty] = stateValue;
        };

        return {
          set: _.partial(setProgressState, target, prop, true),
          unset: _.partial(setProgressState, target, prop, false)
        };
      };
    }
  ])
  .filter("debug", [
    function() {
      return function(text) {
        return '<pre style="text-align: left">' + text + "</pre>";
      };
    }
  ])
  .directive("stretchHeight", [
    "$window",
    function($window) {
      return function(scope, elem, attr) {
        var ticking = false;
        var element = angular.element(elem);

        var resize = function(e) {
          var height = window.innerHeight - element.offset().top;

          element.css({ height: height });
          ticking = false;
        };

        var optimizedHandler = function(e) {
          if (!ticking) {
            window.requestAnimationFrame(_.partial(resize, e));
          }
          ticking = true;
        };

        window.addEventListener(
          "resize",
          window.requestAnimationFrame ? optimizedHandler : resize
        );
        resize();
      };
    }
  ]);
