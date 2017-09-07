/**
 * Binds a TinyMCE widget to <textarea> elements.
 */
angular.module('ui.tinymce', [])
    .value('uiTinymceConfig', {})
    .directive('uiTinymce', ['uiTinymceConfig', function(uiTinymceConfig) {
        uiTinymceConfig = uiTinymceConfig || {};
        var generatedIds = 0;
        return {
            priority: 10,
            require: 'ngModel',
            link: function(scope, elm, attrs, ngModel) {
                var expression, options, tinyInstance,
                updateView = function() {
                    ngModel.$setViewValue(elm.val());
                    if (!scope.$root.$$phase) {
                        scope.$apply();
                    }
                };

                // generate an ID if not present
                if (!attrs.id) {
                    attrs.$set('id', 'uiTinymce' + generatedIds++);
                }

                if (attrs.uiTinymce) {
                    expression = scope.$eval(attrs.uiTinymce);
                } else {
                    expression = {};
                }

                if (attrs.ngDisabled) {
                    disabledExpression = scope.$eval(attrs.ngDisabled);
                } else {
                    disabledExpression = false;
                }

                // make config'ed setup method available
                if (expression.setup) {
                    var configSetup = expression.setup;
                    delete expression.setup;
                }

                options = {
                    // Update model when calling setContent (such as from the source editor popup)
                    setup: function(ed) {
                        var args;
                        ed.onInit.add(function(args) {
                            ngModel.$render();
                            ngModel.$setPristine();
                        });
                        // Update model on button click
                        ed.onExecCommand.add(function(e) {
                            ed.save();
                            updateView();
                        });
                        // Update model on keypress
                        ed.onKeyUp.add(function(e) {
                            ed.save();
                            updateView();
                        });
                        // Update model on change, i.e. copy/pasted text, plugins altering content
                        ed.onSetContent.add(function(e) {
                            if (!e.initial && ngModel.$viewValue !== e.content) {
                                ed.save();
                                updateView();
                            }
                        });
    //                    ed.on('blur', function(e) {
    //                        elm.blur();
    //                    });
    //                    // Update model when an object has been resized (table, image)
    //                    ed.on('ObjectResized', function(e) {
    //                        ed.save();
    //                        updateView();
    //                    });
                        if (configSetup) {
                            configSetup(ed);
                        }
                    },
                    mode: 'exact',
                    elements: attrs.id
                };
                // extend options with initial uiTinymceConfig and options from directive attribute value
                angular.extend(options, uiTinymceConfig, expression, {readonly: disabledExpression?1:0});
                setTimeout(function() {
                    tinymce.init(options);
                });

                ngModel.$render = function() {
                    if (!tinyInstance) {
                        tinyInstance = tinymce.get(attrs.id);
                    }
                    if (tinyInstance) {
                        tinyInstance.setContent(ngModel.$viewValue || '');
                    }
                };

                scope.$on('$destroy', function() {
                    if (!tinyInstance) {
                        tinyInstance = tinymce.get(attrs.id);
                    }
                    if (tinyInstance) {
                        tinyInstance.remove();
                        tinyInstance = null;
                    }
                });

                scope.$watch(attrs.ngDisabled, function(newValue, oldValue) {
                    if (!tinyInstance) {
                        tinyInstance = tinymce.get(attrs.id);
                    }
                    if (tinyInstance) {
                        tinyInstance.getBody().setAttribute('contenteditable', false);
                    }                    
                })
            }
        };
}]);