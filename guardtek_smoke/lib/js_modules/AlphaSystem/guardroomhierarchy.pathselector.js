/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1-vsdoc.js" />
/// <reference path="../../lib/AlphaSystem/alphaSystem.js" >
/// <reference path="../../lib/AlphaSystem/ajaxHelper.js" >
/// <reference path="../../lib/AlphaSystem/common.js" >
/// <reference path="../../models/enums.js" />
/*
* File Created: august 28, 2013
* Abderraouf El Gasser
* Copyright 2013 Alphasystem S.A.S.
*/

(function (window, context, undefined) {
    var _guardroomPathSelector = AlphaClass.create({
        initialize: function (/*string*/input, /*string*/companyId, /*string*/currentNodeGuid, /*Func<Event, string, bool>*/pathChanged) {
            var _this = this;            
            this._companyId = companyId;
            this._currentPath = undefined,
            this._currentNode = undefined,

            this._pathSelectorControl = $(input).pathSelector(
                function (/*string*/path, /*string[]*/tree, /*Action<List<Option>>*/callbackWhenDone) {
                    if (tree.length > 0) {
                        _this._getChildren(path, tree, callbackWhenDone);
                    } else {
                        _this._getRoots(callbackWhenDone);
                    }
                });

            $(input).on("valueChanged", null, {}, function (event, newNode) {
                //TODO: Handle cancel path change
                if (_this._currentNode != newNode.nodeValue) {
                    pathChanged(event, newNode.nodeValue);

                    _this._currentNode = newNode.nodeValue;
                    _this._currentPath = newNode.path;
                }
            });

            if (currentNodeGuid != null && currentNodeGuid != undefined && currentNodeGuid != "")
                this.setCurrentNode(currentNodeGuid);
        },

        setCurrentNode: function (nodeGuid) {
            var _this = this;
           // if (this._currentNode == nodeGuid) return;
            this._currentNode = nodeGuid;
            if (nodeGuid == null || nodeGuid == undefined || nodeGuid == "") {
                _this._getCustomers(function (customers) { $(_this._pathSelectorControl).pathSelector("parts", customers); });
            } else {
                this._getPathFromGuid(nodeGuid, function (nodes) {
                    $(_this._pathSelectorControl).pathSelector("parts", nodes);
                });
            }
        },

        setCurrentCompany: function (companyId) {
            this._companyId = companyId;
            $(this._pathSelectorControl).pathSelector("parts", [])
        },

        currentNode: function () {
            return this._currentNode;
        },

        _getPathFromGuid: function (/*string*/guid, callbackWhenDone) {
            var _this = this;
            if (this._companyId == undefined || guid == undefined) callbackWhenDone([]);
            else {
                Fr.Alphasystem.Report.Web.ajaxHelper.post('Guardroom/GetPath', { nodeGuid: guid, companyId: this._companyId })
                                                .done(function (result) {
                                                    callbackWhenDone(_this._toPathSelectorOptions(result));
                                                });
            }
        },

        _getChildren: /*void*/function (/*string*/path, /*string[]*/tree, /*Action<List<Option>>*/callbackWhenDone) {
            var _this = this;
            Fr.Alphasystem.Report.Web.ajaxHelper.post('Guardroom/GetNodeChildren', { nodeGuid: tree[tree.length - 1], companyId: this._companyId })
                                                .done(function (result) {
                                                    callbackWhenDone(_this._toPathSelectorOptions(result));
                                                });
        },

        _getRoots: /*void*/function (/*Action<List<Option>>*/callbackWhenDone) {
            var _this = this;
            if (this._companyId == undefined) callbackWhenDone([]);
            else {
                Fr.Alphasystem.Report.Web.ajaxHelper.post('Guardroom/GetRoots', { companyId: this._companyId })
                                                .done(function (result) {
                                                    callbackWhenDone(_this._toPathSelectorOptions(result));
                                                });
            }
        },

        _toPathSelectorOptions: /*PathSelector.Option[]*/function (/*IList<HierarchyNodeForPathSelection>*/nodes) {
            var options = [];
            if (nodes instanceof Array && nodes.length) {
                for (var i = 0; i < nodes.length; i++) {
                    options[i] = { value: nodes[i].Guid, label: nodes[i].Name };
                }
            }

            return options;
        }
    });

    AlphaClass.registerNamespace('Fr.Alphasystem.Report.Web.Controls');
    window.Fr.Alphasystem.Report.Web.Controls.GuardroomPathSelector = _guardroomPathSelector;
})(window, Fr.Alphasystem.Report.Web.context);