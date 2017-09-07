"use strict";
/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1-vsdoc.js" />
/// <reference path="../../lib/AlphaSystem/alphaSystem.js" >
/// <reference path="../../lib/context.js" >
/// <reference path="../../lib/AlphaSystem/i18n.js" >
/*
* File Created: juillet 04, 2013
* Sébastien Blanchard
* Copyright 2013 Alphasystem S.A.S.
*/
// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

(function ($) {
  /*
  * $.import_js() helper (for javascript importing within javascript).
  */
  var import_js_imported = [];

  $.extend(true,
  {
    import_js: function (script) {
      var found = false;
      for (var i = 0; i < import_js_imported.length; i++)
        if (import_js_imported[i] == script) {
          found = true;
          break;
        }
      if (found == false) {
        $("head").append('<script type="text/javascript" src="' + script + '"></script>');
        import_js_imported.push(script);
      }
    }
  });

  $.extend(true,
  {
    getScrollbarWidth: function() {
      var outer = document.createElement("div");
      outer.style.visibility = "hidden";
      outer.style.width = "100px";
      document.body.appendChild(outer);
    
      var widthNoScroll = outer.offsetWidth;
      // force scrollbars
      outer.style.overflow = "scroll";
    
      // add innerdiv
      var inner = document.createElement("div");
      inner.style.width = "100%";
      outer.appendChild(inner);        
    
      var widthWithScroll = inner.offsetWidth;
    
      // remove divs
      outer.parentNode.removeChild(outer);
    
      return widthNoScroll - widthWithScroll;
    }
  });

  $.extend(true,
  {
    jsonDateToDate: function(msJsonDate) {       
        if (msJsonDate == null || msJsonDate == undefined)
            return msJsonDate

        if( new RegExp("/Date\\(-?\\d+\\)/").test(msJsonDate) ) {
            var date = new Date(parseInt(/-?\d+/.exec(msJsonDate)[0]));
            return (date);
        }

        return new Date(msJsonDate);
    },
    //Creates a date which is not converted to system timezone
    //This is used for dates like birthdays, or date form values where you don't want any conversion
    jsonDateToRawDate: function (msJsonDate) {
        if(!msJsonDate) return null;
        var d = $.jsonDateToDate(msJsonDate);
        var raw = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
        return(raw);
    },
    jsonDateToMoment: function(msJsonDate) {
        if( new RegExp("/Date\\(-?\\d+\\)/").test(msJsonDate) ) {
            var milliseconds = parseInt(/-?\d+/.exec(msJsonDate)[0]);
            var m = moment('1970-01-01 00:00:00');
            m.add(milliseconds);
            return m;
        }

        return moment(msJsonDate);
    },
    jsonDateToUtcMoment: function(msJsonDate) {
        if( new RegExp("/Date\\(-?\\d+\\)/").test(msJsonDate) ) {
            var milliseconds = parseInt(/-?\d+/.exec(msJsonDate)[0]);
            var m = moment.tz('1970-01-01 00:00:00', 'UTC');
            m.add(milliseconds);
            return m;
        }

        return moment.tz(msJsonDate, 'UTC');
    },
    jsonDateToLocalMoment: function(msJsonDate) {
        var context = Fr.Alphasystem.Report.Web.context;
        var moment = $.jsonDateToUtcMoment(msJsonDate); 
        if( !context || !moment ) return '';   
        return moment.clone().tz(context.timezone());   
    },
    formatMoment: function (momentValue, format) {
        var context = Fr.Alphasystem.Report.Web.context;
        if( !context || !moment || !momentValue ) return '';
        if( !momentValue._isAMomentObject ) momentValue = this.jsonDateToMoment(momentValue);       
        
        if (format === "#d") format = context.dateFormat().toUpperCase();
        if (format === "#t") format = context.timeFormat();
        if (format === "#dt") format = context.dateFormat().toUpperCase() + ' ' + context.timeFormat();
        if (format === "#dtns") format = context.dateFormat().toUpperCase() + ' ' + context.timeFormat().replace(':ss', ''); //for the logbook when they don't want seconds
        //if( format === "relative") return $filter('fromNowString')(momentValue);
        
        return momentValue.format(format.replace(' tt', 'a'));
    },

    formatUtcMoment: function (momentValue, format) {
        var context = Fr.Alphasystem.Report.Web.context;

        if( !context || !moment || !momentValue ) return '';
        
        if( !momentValue._isAMomentObject ) momentValue = this.jsonDateToUtcMoment(momentValue);

        momentValue = momentValue.clone().tz(context.timezone() );
                
        return this.formatMoment(momentValue, format)
    },

    browserLocalDatetoSiteLocalDate: function(browserLocalDate) {
        var t = browserLocalDate;
        var context = Fr.Alphasystem.Report.Web.context;

        if( !context || !moment || !browserLocalDate ) return browserLocalDate;

        return moment.tz([t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds(), t.getMilliseconds()], context.timezone()).toDate();
    },

    datePad: function(num) {
        var r = String(num);
            if ( r.length === 1 ) {
                r = '0' + r;
            }
            return r;
    },
    toISOString: function(date) {
   
        var retStr = date.getUTCFullYear()
                + '-' + $.datePad( date.getUTCMonth() + 1 )
                + '-' + $.datePad( date.getUTCDate() )
                + 'T' + $.datePad( date.getUTCHours() )
                + ':' + $.datePad( date.getUTCMinutes() )
                + ':' + $.datePad( date.getUTCSeconds() )
                + '.' + String( (date.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
                + 'Z';
                
                return retStr;
                
    },
    newLocalDate: function() {
        var _d = new Date();
        return new Date(_d.valueOf() + (_d.getTimezoneOffset() * 60000) + (Fr.Alphasystem.Report.Web.context.timeZoneDelta() * 60000));
    },

    toLocal: function(date) {
        var _d = new Date();
        return new Date(date.valueOf() + (date.getTimezoneOffset() * 60000) + (Fr.Alphasystem.Report.Web.context.timeZoneDelta() * 60000));
        //return new Date(date.valueOf() + (Fr.Alphasystem.Report.Web.context.timeZoneDelta() * 60000));
    },

    toUtc: function(date) {
        return !!date ? new Date(date.valueOf() - (date.getTimezoneOffset() * 60000) - (Fr.Alphasystem.Report.Web.context.timeZoneDelta() * 60000)) : date;
    },

    toSiteUtc : function(date) {
        return new Date(date.valueOf() - (date.getTimezoneOffset() * 60000) - (Fr.Alphasystem.Report.Web.context.timeZoneDelta() * 60000));
    },
    
    localToUtc: function(date) {
        return new Date(date.valueOf() - (Fr.Alphasystem.Report.Web.context.timeZoneDelta() * 60000));
    },

    calendarDateFromMoment: function(moment, showTime) {
        return showTime ? moment.calendar() :
            moment.calendar(null, {sameDay: '[Today]', nextDay: '[Tomorrow]', nextWeek: 'dddd', lastDay: ['Yesterday'], lastWeek: '[Last] dddd'});
    }
  });

  $.extend(true,
  {
    htmlEncode: function(string) {       
        return $('<div/>').text(string).html();
    }
  });

  $.extend(true,  {
    getSpin: function() {
        var opts = {
            lines: 11, // The number of lines to draw
            length: 4, // The length of each line
            width: 4, // The line thickness
            radius: 10, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 1.2, // Rounds per second
            trail: 70, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'custom-spinner', // The CSS class to assign to the spinner
            zIndex: 2e9 // The z-index (defaults to 2000000000)
        };
        
        return new Spinner(opts);
    }
  });
})(jQuery);

String.prototype.ToDateTimeString = function() {
    return moment.tz(this, Fr.Alphasystem.Report.Web.context.timezone()).format('L LTS');
}

String.prototype.ToDateString = function () {
    return moment.tz(this, Fr.Alphasystem.Report.Web.context.timezone()).format('L');
}

String.prototype.ToTimeString = function () {
    return moment.tz(this, Fr.Alphasystem.Report.Web.context.timezone()).format('LTS');
}


Date.prototype.ToDateTimeString = function() {    
    return this.ToDateString() + ' ' + this.ToTimeString();
}

Date.prototype.ToDateString = function () {
     return Globalize.format(this, 'd');
}

Date.prototype.ToTimeString = function () {
    return Globalize.format(this, 'T');
}

Date.prototype.toParseableString = function () {
    //http://stackoverflow.com/questions/12288893/javascript-date-tostring-formatting
    var d1 = this;

    var curr_year = d1.getFullYear();

    var curr_month = d1.getMonth() + 1; //Months are zero based
    if (curr_month < 10)
        curr_month = "0" + curr_month;

    var curr_date = d1.getDate();
    if (curr_date < 10)
        curr_date = "0" + curr_date;

    var curr_hour = d1.getHours();
    if (curr_hour < 10)
        curr_hour = "0" + curr_hour;

    var curr_min = d1.getMinutes();
    if (curr_min < 10)
        curr_min = "0" + curr_min;

    var curr_sec = d1.getSeconds();
    if (curr_sec < 10)
        curr_sec = "0" + curr_sec;

    var newtimestamp = curr_year + "-" + curr_month + "-" + curr_date + " " + curr_hour + ":" + curr_min + ":" + curr_sec;

    return newtimestamp;
};

//http://stackoverflow.com/questions/19999388/check-if-user-is-using-ie-with-jquery
function msieversion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
    {
        return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));

    }
    return -1;
}

function compare(thisObject, otherObject) {
    if (thisObject == undefined || otherObject == undefined) return false;

    if ('Guid' in otherObject && 'Guid' in thisObject) {
        return thisObject.Guid == otherObject.Guid;
    } else if ('Id' in otherObject && 'Id' in thisObject) {
        return thisObject.Id == otherObject.Id;
    } else if ('guid' in otherObject && 'guid' in thisObject) {
        return thisObject.guid == otherObject.guid;
    } else if ('id' in otherObject && 'id' in thisObject) {
        return thisObject.id == otherObject.id;
    } else {
        return thisObject == otherObject;
    }
};


function distanceFormat(value, isMetric) {
    var _formattedDistance;
    var _distance = parseFloat(value);
    if (isNaN(_distance))
        return value;
    if (_distance < 1) {
        if (isMetric == false) {
            _formattedDistance = '' + Math.round(_distance * 5280) + ' ' + 'ft';
        }
        else {
            _formattedDistance = '' + Math.round(_distance * 1000) + ' ' + 'm';
        }
    }
    else if (_distance < 100) {
        if (isMetric == false) {
            _formattedDistance = '' + _distance.toFixed(1) + ' ' + 'mi';
        }
        else {
            _formattedDistance = '' + _distance.toFixed(1) + ' ' + 'km';
        }
    }
    else {
        if (isMetric == false) {
            _formattedDistance = '' + Math.round(_distance) + ' ' + 'mi';
        }
        else {
            _formattedDistance = '' + Math.round(_distance) + ' ' + 'km';
        }
    }
    return _formattedDistance;
}

function durationFormat(value) {
    var _duration = parseInt(value);
    if (isNaN(_duration))
        return value;
    return window.UiLibrary.humanize(value);
}
