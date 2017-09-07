/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1-vsdoc.js" />
/// <reference path="../../lib/AlphaSystem/alphaSystem.js" >
/// <reference path="../../lib/AlphaSystem/ajaxHelper.js" >
/// <reference path="../../lib/AlphaSystem/common.js" >
/// <reference path="../../lib/jQuery-jqGrid/jquery.jqGrid.src.js" >

/*
* File Created: august 30, 2013
* Abderraouf El Gasser
* Copyright 2013 Alphasystem S.A.S.
*/
(function (window, context, undefined) {
    var _alphaGrid = AlphaClass.create({
        initialize: function (/*jQueryObject*/gridElement, /*int*/width, /*int*/height, /*bool*/multiselect, /*bool*/showPager) {
            var _this = this;
            this._gridControl = gridElement;
            this._built = false;
            this._width = this._calculateSize(width, gridElement.parent().width());
            this._height = this._calculateSize(height, gridElement.parent().height());
            this._multiselect = multiselect;
            this._showPager = showPager;
            this._columns = [];
            this._dataSource = [];
            this._selectedRows = [];
            this._selectedRow = undefined;
        },

        addColumn: function (id, header, options) {
            this._columns[this._columns.length] = { Id: id, Header: header, Options: options };
        },

        column: function (id) {
            for (var i = 0; i < this._columns.length; i++) {
                if (this._columns[i].Id == id) return this._columns[i];
            }

            return null;
        },

        rebuild: function () {
            this._built = false;
        },

        setDataSource: function ( /*IEnumerable<Object>*/dataSource) {
            if (!this._built) this._buildGrid();

            this._dataSource = dataSource;
            this._selectedRows = [];

            this._gridControl.jqGrid('clearGridData', false);
            if (dataSource.length == 0) return;

            this.refresh();
        },

        datasource: function () {
            return this._dataSource;
        },

        refresh: function () {
            var lineCount = this._gridControl.jqGrid('getDataIDs').length;
            if (lineCount > 0 && this._dataSource.length != lineCount) {
                this._gridControl.jqGrid('clearGridData', false);
            }

            this._gridControl.jqGrid('setGridParam', { data: this._dataSource });
            this._gridControl.trigger('reloadGrid');
        },

        selectedRows: function () {
            return this._selectedRows;
        },

        selectedRow: function () {
            return this._selectedRow;
        },

        selectRow: function (row) {
            this._gridControl.setSelection(row.rowId);
        },

        invalidate: function () {
            this._beginLoading();
        },

        onCommand: function (handler) {
            this._gridControl.on("Command", handler);
        },

        onIsCommandEnabled: function (handler) {
            this._gridControl.on("CommandEnabled", handler);
        },

        onCellDoubleClicked: function (handler) {
            this._gridControl.on("CellDoubleClicked", handler);
        },

        onRowSelected: function (handler) {
            this._gridControl.on("RowSelected", handler);
        },

        onRowDeselected: function (handler) {
            this._gridControl.on("RowDeselected", handler);
        },

        onRowsSelected: function (handler) {
            this._gridControl.on("RowsSelected", handler);
        },

        onAfterInsertRow: function (handler) {
            this._gridControl.on("AfterInsertRow", handler);
        },

        onLoad: function (handler) {
            this._gridControl.on("OnLoad", handler);
        },

        editRow: function (rowId, handler) {
            var _this = this;
            this._gridControl.jqGrid('editRow', rowId);
            this._gridControl.on("keyup", "TD[role='gridcell'] .editable", {}, function (e) {
                if (e.which == 13) {
                    e.preventDefault();
                    _this._endEditRow(rowId);
                }
            });

            this._gridControl.on("RowDeselected.internal", function () {
                _this._endEditRow(rowId);
            });

            this._gridControl.on("jqGridInlineAfterSaveRow", function (e, rowId, response, newData, o) {
                handler(rowId, _this._dataSource[rowId - 1], newData);
            });
        },

        findRow: function (filter) {
            for (var i = 0; i < this.datasource().length; i++) {
                filter.forEach(function (item, index, obj) {
                    if (this.datasource()[i][index] == item)
                        return { rowId: i, row: this.datasource()[i] };
                }, this);
            }

            return null;
        },

        /// Private methods

        _endEditRow: function (rowId) {
            this._gridControl.off("keyup", "TD[role='gridcell'] .editable");
            this._gridControl.jqGrid('saveRow', rowId, undefined, 'clientArray');
            this._gridControl.off("jqGridInlineAfterSaveRow");
            this._gridControl.off("RowDeselected.internal");
        },

        _beginLoading: function () {
            //this.setDataSource([]);
            $("#load_" + this._gridControl.get(0).id).show();
        },

        _endLoading: function () {
            $("#load_" + this._gridControl.get(0).id).hide();
            this._gridControl.trigger('OnLoad');
        },

        _buildGrid: function () {
            var colNames = [];
            var colModel = [];

            for (var i = 0; i < this._columns.length; i++) {
                var c = this._columns[i];
                colNames[i] = c.Header;
                var m = { name: c.Id, index: c.Id, sortable: false }; //TODO: modifier le mapping entre la datasource et les rowId avant de réactiver le sortable

                if (c.Options != undefined) {
                    if (c.Options.width != undefined) {
                        m.width = this._calculateSize(c.Options.width, this._width);
                    }
                    //if (c.Options.sortable != undefined) m.sortable = c.Options.sortable;                    
                    if (c.Options.visible != undefined) m.hidden = !c.Options.visible;
                    if (c.Options.align != undefined) m.align = c.Options.align;
                    if (c.Options.editable != undefined) m.editable = c.Options.editable;

                    if (c.Options.type != undefined) {
                        switch (c.Options.type) {
                            case Fr.Alphasystem.Report.Web.Controls.AlphaGrid.ColumnTypes.Date:
                                m.formatter = "date";
                                break;

                            case Fr.Alphasystem.Report.Web.Controls.AlphaGrid.ColumnTypes.Integer:
                                m.formatter = "integer";
                                break;

                            case Fr.Alphasystem.Report.Web.Controls.AlphaGrid.ColumnTypes.LinkButton:
                                m.formatter = "link";
                                break;
                        }
                    }

                    if (c.Options.formatter != undefined) m.formatter = c.Options.formatter;
                    if (c.Options.formatoptions != undefined) m.formatoptions = c.Options.formatoptions;
                }

                colModel[i] = m;
            }

            var _this = this;
            //this._gridControl.empty();

            if (this._gridControl.parent().find("#" + this._gridControl.id + "_pager").length == 0) {
                $("<div id='" + this._gridControl.id + "_pager'></div>").insertAfter(this._gridControl);
            }


            var p = this._gridControl.jqGrid({
                datatype: "jsonstring",
                //width: this._width,
                autowidth: true,
                height: this._height == "auto" ? undefined : this._height,
                multiselect: this._multiselect,
                colNames: colNames,
                colModel: colModel,
                rowTotal: 1000000,
                rowNum: 1000000,
                onSelectRow: function (rowId, status, e) { _this._OnRowSelected(rowId, status, e); },
                ondblClickRow: function (rowId, status, e) { _this._OnCellDoubleClicked(rowId, status, e); },
                afterInsertRow: function (rowId, rowData, rowElem) { _this._OnAfterInsertRow(rowId, rowData); },
                pager: this._showPager ? ("#" + this._gridControl.id + "_pager") : undefined,
                gridComplete: function () {
                    _this._setupActions();
                    _this._endLoading();
                }

            })

            if (this._showPager)
                p.navGrid("#" + this._gridControl.id + "_pager", { edit: false, add: false, del: false, refresh: false });

            this._gridControl.on("click", "TD[role='gridcell'] A", {}, function (e) {
                e.preventDefault();

                var rowId = $(this).parents("TR[role='row']").get(0).rowIndex;
                var cellIndex = $(this).parent("TD[role='gridcell']").get(0).cellIndex - (_this._multiselect ? 1 : 0);
                var column = _this._columns[cellIndex]
                var row = _this._dataSource[rowId - 1];

                var command = "";
                if ($(this).attr("isCommand") === "true")
                    command = $(this).attr("key");
                else
                    command = column.Id;

                _this._gridControl.trigger('Command', [this, { command: command, rowId: rowId, rowIndex: rowId - 1, columnIndex: cellIndex, column: column, row: row}]);
            });

            this._built = true;
        },

        _calculateSize: function (value, relativeToMaxSize) {
            if (typeof value === "string") {
                if (value == "auto") return value;
                if (value.charAt(value.length - 1) == "%")
                    return this._calculateSize(parseInt(value.replace("%", "")) / 100.0, relativeToMaxSize);
                else
                    return this._calculateSize(parseInt(value), relativeToMaxSize);
            }
            else {
                if (value < 1)
                    return value * relativeToMaxSize;
                else
                    return value;
            }
        },

        _OnAfterInsertRow: function (rowId, rowData) {
            this._gridControl.trigger('AfterInsertRow', [this, { rowId: rowId, data: rowData}]);
        },

        _OnRowSelected: function (rowId, status, e) {
            if (status) {
                this._gridControl.trigger('RowSelected', [this, { rowId: rowId, row: this._dataSource[rowId - 1]}]);
                this._selectedRow = { rowId: rowId, row: this._dataSource[rowId - 1] };
            } else {
                this._gridControl.trigger('RowDeselected', [this, { rowId: rowId, row: this._dataSource[rowId - 1]}]);
                this._selectedRow = undefined;
            }

            if (this._multiselect) {
                if (status == true)
                    this._selectedRows[this._selectedRows.length] = { rowId: rowId, row: this._dataSource[rowId - 1] };
                else {
                    for (var i = this._selectedRows.length - 1; i >= 0; i--) {
                        if (this._selectedRows[i].rowId == rowId)
                            this._selectedRows.splice(i, 1);
                    }
                }

                this._gridControl.trigger('RowsSelected', [this, this._selectedRows]);
            }
        },

        _OnCellDoubleClicked: function (rowId, rowIndex, columnIndex, e) {
            this._gridControl.trigger('CellDoubleClicked', [this, { rowId: rowId, rowIndex: rowIndex - 1, columnIndex: columnIndex - 1, column: this._columns[columnIndex - 1], row: this._dataSource[rowId - 1]}]);
        },

        _setupActions: function () {
            var _this = this;

            var actions = this._gridControl.find("TD[role='gridcell'] A");
            actions.each(function (index) {
                var rowId = $(this).parents("TR[role='row']").get(0).rowIndex;
                var ids = _this._gridControl.jqGrid('getDataIDs');

                var row = _this._dataSource[rowId - 1];
                var cellIndex = $(this).parent("TD[role='gridcell']").get(0).cellIndex - (_this._multiselect ? 1 : 0);
                var column = _this._columns[cellIndex]

                var result = { command: column.Id, row: row, enabled: false };
                _this._gridControl.trigger("CommandEnabled", [result]);
                if (!result.enabled) {
                    $(this).replaceWith("<span>" + $(this).text() + "</span>");
                }
            });

            for (var i = 0; i < this._columns.length; i++) {
                var cOptions = this._columns[i].Options;

                if (cOptions != undefined && cOptions.type == Fr.Alphasystem.Report.Web.Controls.AlphaGrid.ColumnTypes.Command) {
                    if (cOptions.commands != undefined) {
                        var ids = _this._gridControl.jqGrid('getDataIDs');
                        for (var j = 0; j < ids.length; j++) {
                            var first = true;
                            var cell = this._gridControl.find("TR[role='row'][id='" + ids[j] + "']").find("TD[role='gridcell']").get(i + (this._multiselect ? 1 : 0));
                            for (var k = 0; k < cOptions.commands.length; k++) {
                                var result = { command: cOptions.commands[k].id, row: this._dataSource[ids[j] - 1], enabled: false };
                                _this._gridControl.trigger("CommandEnabled", [result]);
                                if (result.enabled) {
                                    var link = $("<a></a>").attr("href", "#")
                                                            .attr("key", cOptions.commands[k].id)
                                                            .attr("isCommand", "true")
                                                            .addClass('btn')
                                                            .addClass('btn-default')
                                                            .addClass('btn-sm')
                                                            .text(cOptions.commands[k].text)

                                    if (first) {
                                        $(cell).empty();
                                        first = false;
                                    }
                                    $(cell).append(link);
                                    $(cell).append("&nbsp;");
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    AlphaClass.registerNamespace('Fr.Alphasystem.Report.Web.Controls');
    window.Fr.Alphasystem.Report.Web.Controls.AlphaGrid = _alphaGrid;

    window.Fr.Alphasystem.Report.Web.Controls.AlphaGrid.ColumnTypes = {
        Text: "text",
        Integer: "integer",
        LinkButton: "link",
        Date: "date",
        Command: "command"
    };

})(window, Fr.Alphasystem.Report.Web.context);