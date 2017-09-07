var simpletable = (function () {
    "use strict";
    /* File Created: janvier 22, 2014 */
    /*jslint vars: true */

    return function (options) {
        var instance = {
            initialize: function (options) {
                this.options = options;
            },
            clear: function() {
                this.options.container.find(".simple-table").remove();
            },

            draw: function (data) {
                var that = this;
                var table = $("<table />", { cellpadding: 0, cellspacing: 0, border: 0, "class": "simple-table" });
                var head = $("<thead />");
                var headLine = $("<tr />");

                head.appendTo(table);
                headLine.appendTo(head);

                for (var i = 0; i < data.columns.length; i++) {
                    var c = $("<th />")
                    if (typeof data.columns[i].title === "function") {
                        var content = data.columns[i].title(data.columns[i]);
                        content.appendTo(c);
                    }
                    else {
                        c.html(data.columns[i].title);
                    }
                    c.appendTo(headLine);
                }

                var body = $("<tbody />");
                body.appendTo(table);

                for (var i = 0; i < data.rows.length; i++) {
                    var row = data.rows[i];
                    var r = $("<tr />");
                    r.appendTo(body);
                    if (that.options.select) {
                        var index = i;
                        r.click((function (row, handler) {
                            return function (e) {
                                handler(row);
                            };
                        })(row, that.options.select));
                    }

                    for (var j = 0; j < data.columns.length; j++) {
                        var c = $("<td />")
                        var cData = row[data.columns[j].id];
                        if (cData == undefined || cData == null) {
                            c.html("&nbsp;");
                        } else if (typeof cData === "function") {
                            var d = cData(row, data.columns[j]);
                            d.appendTo(c);
                        } else {
                            c.html(cData);
                        }
                        c.appendTo(r);
                    }
                }

                this.clear();
                table.appendTo(that.options.container);
            }            
        };

        instance.initialize(options);
        return instance;
    };
} ());