(function (window, undefined) {
    var _private = {
        emptyGrid: function() {
            this._agData.$grid_container.empty();
            this._agData.$div_header = undefined;
            this._agData.$div_body = undefined;
        },
        removeRows: function() {
            this._agData.rows = [];
            if (this._agData.$tbody)
                this._agData.$tbody.empty();
        },
        resetHeader: function() {
            var _$div_header = this._agData.$div_header;
            var _$div_body = this._agData.$div_body;
            var _$header_table = _$div_header.children('table');
            var _$body_table = _$div_body.children('table');
            var _scrollBarWidth = _$div_body.innerWidth() - _$body_table.outerWidth();

            for (var i = 0, _$headerCells = _$header_table.children('thead').children('tr').children('th'), _$bodyCells = _$body_table.children('thead').children('tr').children('th'), ii = _$headerCells.length - 1; i <= ii; i++) {
                $(_$headerCells.get(i)).width($(_$bodyCells.get(i)).width() + ((i == ii) ? _scrollBarWidth : 0));
            }

            var _headerHeight = _$div_header.outerHeight() - _$header_table.children('thead').outerHeight() + _$body_table.children('thead').outerHeight();
            _$body_table.css({ marginTop: -_headerHeight });
        },
        buildTable: function(clazz, css) {
            var _$table = $('<table>');
            _$table.addClass('agv2-table');
            _$table.css({
                width: '100%'
            });
            return _$table;
        },
        buildTableHeader: function(columns, setWidth) {
            var _$thead = $('<thead>');
            var _$tr = $('<tr>');
            for (var i = 0, ii = columns.length; i < ii; i++) {
                var _column = columns[i];
                var _$th = $('<th>');
                if (setWidth && _column.width)
                    _$th.css('width', _column.width);
                if (_column.caption !== undefined)
                    _$th.text(_column.caption);
                _$tr.append(_$th);
            }
            _$thead.append(_$tr);
            return _$thead;
        },
        buildTableBody: function() {
            var _$tbody = $('<tbody>');
            return _$tbody;
        },
        buildTableBodyRow: function(data, columns, $tbody, agData) {
            var _$tr = $('<tr>');
            var _onRowClickable = agData.onRowClickable;
            var _onRowClick = agData.onRowClick;
			var _onRowCreated = agData.onRowCreated;
            if (_onRowClickable) {
                var _clickable = _onRowClickable.call(window, data);
                if (_clickable) {
                    _$tr.addClass('agv2-clickable');
                    if (_onRowClick)
                        _$tr.click({ data: data, onRowClick: _onRowClick }, this.onRowClick);
                }
            } else if (_onRowClick) {
                _$tr.addClass('agv2-clickable').click({ data: data, onRowClick: _onRowClick }, this.onRowClick);
            }
			if (_onRowCreated)
				_onRowCreated.call(window, data, _$tr);
            for (var i = 0, ii = columns.length; i < ii; i++) {
                var _column = columns[i];
                var _$td = $('<td>');
                if (_column.textAlign)
                    _$td.css('textAlign', _column.textAlign);
				if (typeof _column.onCellCreated === 'function')
					_column.onCellCreated.call(window, data, _$td);
                var _value = undefined;
                if (typeof _column.format === 'function') {
                    _value = _column.format.call(window, data);
                } else {
                    _value = data[_column.field];
                }
                if (_value !== undefined) {
					if (typeof _value === 'string')
						_$td.text(_value);
					else
						_$td.append(_value);
				}
                _$tr.append(_$td);
            }
            return _$tr;
        },
        onRowClick: function(event) {
            event.data.onRowClick.call(window, event.data.data);
        }
    };

    var _public = {
        setHeight: function(height) {
            var _$grid_container = this._agData.$grid_container;
            if (height) {
                this._agData.$grid_container.css('height', height);
                var _$div_body = this._agData.$div_body;
                if (_$div_body) {
                    var _$div_header = this._agData.$div_header;
                    var _$body_table = _$div_body.children('table');
                    _$div_body.css('height', _$grid_container.innerHeight() - _$div_header.outerHeight());
                    _private.resetHeader.call(this);
                }
            }
            return this;
        },
        addColumn: function(field, caption, width, textAlign, format, onCellCreated) {
            var _column = {
                field: undefined,
                caption: undefined,
                width: undefined,
                textAlign: undefined,
                format: undefined,
				onCellCreated: undefined
            };

            if (typeof field === 'string') {
                _column.field = field;
                _column.caption = caption;
                _column.width = width;
                _column.textAlign = textAlign;
                _column.format = format;
				_column.onCellCreated = onCellCreated;
            } else if (typeof field === 'object') {
                _column.field = field.field;
                _column.caption = field.caption;
                _column.width = field.width;
                _column.textAlign = field.textAlign;
                _column.format = field.format;
				_column.onCellCreated = field.onCellCreated;
            }

            this._agData.columns.push(_column);
            return this;
        },
        onRowClickable: function(callback) {
            this._agData.onRowClickable = (typeof callback === 'function') ? callback : undefined;
            return this;
        },
        onRowClick: function(callback) {
            this._agData.onRowClick = (typeof callback === 'function') ? callback : undefined;
            return this;
        },
		onRowCreated: function(callback) {
			this._agData.onRowCreated = (typeof callback === 'function') ? callback : undefined;
			return this;
		},
        realize: function() {
            _private.emptyGrid.call(this);
            if (this._agData.columns.length > 0) {
                var _$grid_container = this._agData.$grid_container;
                var _$div_header = this._agData.$div_header = $('<div>');
                var _$div_body = this._agData.$div_body = $('<div>').css({ overflowX: 'hidden', overflowY: 'auto' });
                var _$tbody = this._agData.$tbody = _private.buildTableBody();
                var _columns = this._agData.columns;
                var _rows = this._agData.rows;

                _$grid_container.append(_$div_header).append(_$div_body);

                var _$header_table = _private.buildTable();
                _$div_header.append(_$header_table);
                var _$body_table = _private.buildTable();
                _$div_body.append(_$body_table);
                _$header_table.append(_private.buildTableHeader(_columns, false));
                var _$body_header = _private.buildTableHeader(_columns, true);
                _$body_table.append(_$body_header).append(_$tbody);

				var _rowToAdd = [];
                for (var i = 0, ii = _rows.length; i < ii; i++) {
                    var _row = _rows[i];
                    _row.$tr = _private.buildTableBodyRow(_row.data, _columns, _$tbody, this._agData);
					_rowToAdd.push(_row.$tr);
                }
				if (_rowToAdd.length > 0)
					_$tbody.append(_rowToAdd);
                _private.resetHeader.call(this);
                _$div_body.css('height', _$grid_container.innerHeight() - _$div_header.outerHeight());
            }
            return this;
        },
        setDatasource: function(data) {
            _private.removeRows.call(this);
            this._agData.$grid_container.data("datasource", null);
            if (data && data.length) {
                this._agData.$grid_container.data("datasource", data);
                this.addDatasource(data);
            } else {
                var _$tbody = this._agData.$tbody;
                var _realized = !!_$tbody;
                if (_realized)
                    _private.resetHeader.call(this);
            }
            return this;
        },
        addDatasource: function(data) {
            if (data && data.length) {
                var _rows = this._agData.rows;
                var _$tbody = this._agData.$tbody;
                var _realized = !!_$tbody;
                var _columns = this._agData.columns;
				var _rowToAdd = [];
                for (var i = 0, ii = data.length; i < ii; i++) {
                    var _data = data[i];
                    if (typeof _data === 'object') {
                        var _row = {
                            data: _data,
                            $tr: _realized ? _private.buildTableBodyRow(_data, _columns, _$tbody, this._agData) : undefined
                        }
                        if (_realized)
                            _rowToAdd.push(_row.$tr);
                        _rows.push(_row);
                    }
                }				
				if (_rowToAdd.length > 0)
					_$tbody.append(_rowToAdd);
                if (_realized)
                    _private.resetHeader.call(this);
            }
            return this;
        }
    }

    var _alphaGridV2 = function(selector, width, height) {
        var _data = {
            columns: [],
            rows: [],
            onRowClickable: undefined,
            onRowClick: undefined,
			onRowCreated : undefined,
            $grid_container: $(selector).first(),
            $div_header: undefined,
            $div_body: undefined,
            $tbody: undefined
        };
        var _$grid_container = _data.$grid_container.addClass('agv2-container');
        var _css = {
            overflowX: 'auto',
            overflowY: 'hidden',
            height: 200
        }
        if (width)
            _css.width = width;
        if (height)
            _css.height = height;
        _$grid_container.css(_css);

        this._agData = _data;
        this.setHeight = _public.setHeight;
        this.addColumn = _public.addColumn;
        this.onRowClickable = _public.onRowClickable;
        this.onRowClick = _public.onRowClick;
		this.onRowCreated = _public.onRowCreated;
        this.realize = _public.realize;
        this.setDatasource = _public.setDatasource;
        this.addDatasource = _public.addDatasource;
    };

    window.AlphaGridV2 = _alphaGridV2;
})(window);
