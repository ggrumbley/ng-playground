angular
  .module("asutils", ["as.ui"])
  .factory("webContext", [
    "$q",
    "$window",
    function($q, $window) {
      var context = {};
      var defer = $q.defer();
      var deferConstants = $q.defer();
      var deferConstantLoaded = $q.defer();
      var deferModels = $q.defer();
      var deferContext = $q.defer();
      var deferUiLib = $q.defer();
      var deferTranslations = $q.defer();
      var deferMaps = $q.defer();
      var deferMapLoaded = $q.defer();

      var tryResolveTranslations = function() {
        //console.log('tryResolveTranslations == ' + (!!$window.Fr.Alphasystem.Report.Web.i18n));
        if ($window.Fr.Alphasystem.Report.Web.i18n) {
          $window.Fr.Alphasystem.Report.Web.i18n.registerTranslationHandler(
            null,
            function() {
              deferTranslations.resolve($window.Fr.Alphasystem.Report.Web.i18n);
            }
          );
        } else {
          setTimeout(tryResolveTranslations, 1000);
        }
      };

      var tryResolveConstants = function() {
        //console.log('tryResolveConstants == ' + (!!$window.Fr.Alphasystem.Report.Web.Constants));
        if ($window.Fr.Alphasystem.Report.Web.Constants) {
          deferConstants.resolve($window.Fr.Alphasystem.Report.Web.Constants);
        } else {
          setTimeout(tryResolveConstants, 1000);
        }
      };

      var tryResolveModels = function() {
        //console.log('tryResolveModels == ' + (!!$window.Fr.Alphasystem.Report.Web.Models));
        if ($window.Fr.Alphasystem.Report.Web.Models) {
          deferModels.resolve($window.Fr.Alphasystem.Report.Web.Models);
        } else {
          setTimeout(tryResolveModels, 1000);
        }
      };

      var tryResolveContext = function() {
        //console.log('tryResolveContext == ' + (!!$window.Fr.Alphasystem.Report.Web.context));
        if ($window.Fr.Alphasystem.Report.Web.context) {
          deferContext.resolve($window.Fr.Alphasystem.Report.Web.context);
        } else {
          setTimeout(tryResolveContext, 1000);
        }
      };

      var tryResolveUiLib = function() {
        //console.log('tryResolveUiLib == ' + (!!$window.UiLibrary));
        if ($window.UiLibrary) {
          deferUiLib.resolve($window.UiLibrary);
        } else {
          setTimeout(tryResolveUiLib, 1000);
        }
      };

      var tryResolveMaps = function() {
        //console.log('tryResolveMaps == ' + (!!$window.geoLocation));
        if ($window.geoLocation) {
          deferMaps.resolve($window.geoLocation);
        } else {
          setTimeout(tryResolveMaps, 1000);
        }
      };

      tryResolveModels();
      tryResolveContext();
      tryResolveUiLib();
      tryResolveTranslations();
      context = {
        load: defer.promise,
        loadMap: function() {
          tryResolveMaps();

          deferMaps.promise.then(function() {
            context.geolocation = $window.geoLocation;
            deferMapLoaded.resolve(context.geolocation);
          });

          return deferMapLoaded.promise;
        },
        loadTimezones: function() {
          tryResolveConstants();

          deferConstants.promise.then(function() {
            context.constants = $window.Fr.Alphasystem.Report.Web.Constants;
            deferConstantLoaded.resolve(context.constants.Timezones);
          });

          return deferConstantLoaded.promise;
        }
      };

      $q
        .all([
          deferModels.promise,
          deferContext.promise,
          deferUiLib.promise,
          deferTranslations.promise
        ]) //deferConstants.promise,
        .then(function(results) {
          context.models = $window.Fr.Alphasystem.Report.Web.Models;
          context.context = $window.Fr.Alphasystem.Report.Web.context;
          context.uiLibrary = $window.UiLibrary;
          context.translations = $window.Fr.Alphasystem.Report.Web.i18n;
          defer.resolve(context);
        });

      return context;
    }
  ])
  .service("ajaxService", [
    "$timeout",
    "$q",
    "asDialogs",
    "$window",
    "$rootScope",
    function($timeout, $q, asDialogs, $window, $rootScope, $http) {
      return {
        _lastError: undefined,
        _lastErrorTime: undefined,
        query: function(request, url, params, timeout, isLongPoll) {
          var self = this;
          timeout = timeout || 300000;
          var defer = $q.defer();

          $window.Fr.Alphasystem.Report.Web.ajaxHelper
            [request](url, params, timeout)
            .done(function(data) {
              if (data && data.IsServerResponse && !data.Success) {
                asDialogs.showError(data.Message);
              }
              defer.resolve(data);
            })
            .fail(function(er) {
              if (
                er.readyState === 4 &&
                er.status === 200 &&
                er.statusText === "OK" &&
                !er.responseText
              ) {
                defer.resolve(undefined);
              } else {
                var dt = new Date();
                if (
                  !er ||
                  (!er.statusText && er != self._lastError) ||
                  (er.statusText && er.statusText != self._lastError) ||
                  dt - self._lastErrorTime > 2000
                )
                  (er || {})._showError = true;

                self._lastError = !er ? er : er.statusText || er;
                self._lastErrorTime = dt;

                $timeout(function() {
                  if (!isLongPoll) {
                    if (!er || er._showError) asDialogs.showError(er);
                  }

                  //TODO: Handles long polls timeouts automatically here by retrying the request and resolving the promise only when it works
                  defer.reject(er);
                });
              }
            });

          return defer.promise;
        },

        post: function(url, params, timeout, isLongPoll) {
          return this.query("post", url, params, timeout, isLongPoll);
        },
        get: function(url, params, timeout, isLongPoll) {
          return this.query("get", url, params, timeout, isLongPoll);
        }
      };
    }
  ])
  .service("timezoneService", [
    "$timeout",
    "$q",
    "$window",
    function($timeout, $q, $window) {
      return {
        getList: function() {
          var defer = $q.defer();

          var tryResolve = function() {
            if (
              $window.Fr.Alphasystem.Report.Web.Constants &&
              $window.Fr.Alphasystem.Report.Web.Constants.Timezones
            ) {
              defer.resolve(
                $window.Fr.Alphasystem.Report.Web.Constants.Timezones
              );
            } else {
              $timeout(tryResolve, 100);
            }
          };

          tryResolve();

          return defer.promise;
        }
      };
    }
  ])
  .service("select2QueryFunc", [
    function() {
      return function(
        datasource,
        pageSize,
        predicate /*Function*/,
        partialPredicate
      ) {
        return function(q) {
          var results = _.filter(datasource, function(e) {
            if (predicate && !partialPredicate) {
              return predicate(e);
            } else {
              var partial =
                q.term == "" ||
                e.text.toUpperCase().indexOf(q.term.toUpperCase()) >= 0;
              if (predicate && partial && partialPredicate) {
                partial &= predicate(e);
              }

              return partial;
            }
          });

          if (pageSize > 0) {
            q.callback({
              results: results.slice(
                (q.page - 1) * pageSize,
                q.page * pageSize
              ),
              more: results.length >= q.page * pageSize
            });
          } else {
            q.callback({ results: results, more: false });
          }
        };
      };
    }
  ])
  .service("groupedSelect2QueryFunc", [
    function() {
      return function(
        datasource,
        pageSize,
        groupField,
        predicate /*Function*/,
        partialPredicate
      ) {
        var groupResultsImpl = function(results) {
          var groups = _.uniq(
            _.map(results, function(item) {
              return item[groupField];
            })
          );

          var groupedResult = _.map(groups, function(g) {
            return {
              text: g,
              children: _.filter(results, function(r) {
                return r[groupField] === g;
              })
            };
          });

          return groupedResult;
        };

        return function(q) {
          var results = _.filter(datasource, function(e) {
            if (predicate && !partialPredicate) {
              return predicate(e);
            } else {
              var partial =
                q.term == "" ||
                e.text.toUpperCase().indexOf(q.term.toUpperCase()) >= 0;
              if (predicate && partial && partialPredicate) {
                partial &= predicate(e);
              }

              return partial;
            }
          });

          if (pageSize > 0) {
            q.callback({
              results: groupResultsImpl(
                results.slice((q.page - 1) * pageSize, q.page * pageSize)
              ),
              more: results.length >= q.page * pageSize
            });
          } else {
            q.callback({ results: groupResultsImpl(results), more: false });
          }
        };
      };
    }
  ])
  .service("select2AsyncQueryFunc", [
    function() {
      return function(
        ajaxSource,
        pageSize,
        predicate /*Function*/,
        partialPredicate
      ) {
        var parseResult = function(query, result) {
          var data = !!result.Data ? result.Data : result;
          var results = _.filter(data, function(e) {
            if (predicate && !partialPredicate) {
              return predicate(e);
            } else {
              var partial =
                query.term == "" ||
                e.text.toUpperCase().indexOf(query.term.toUpperCase()) >= 0;
              if (predicate && partial && partialPredicate) {
                partial &= predicate(e);
              }

              return partial;
            }
          });

          if (pageSize > 0) {
            query.callback({
              results: results.slice(
                (query.page - 1) * pageSize,
                query.page * pageSize
              ),
              more:
                result.HasMore ||
                result.TotalLength >= query.page * pageSize ||
                result.length >= query.page * pageSize
            });
          } else {
            query.callback({ results: results, more: false });
          }
        };

        return function(query) {
          ajaxSource(pageSize, query.page, query.term).then(function(result) {
            parseResult(query, result);
          });
        };
      };
    }
  ])
  .factory("asLocation", function() {
    return {
      parseQueryString: function(querystring) {
        querystring = querystring || "";
        if (querystring.length > 1) querystring = querystring.substring(1);
        if ((querystring.length = 0 || querystring.indexOf("=") < 0)) return {};

        querystring = decodeURIComponent(querystring);
        var parts = querystring.split("&");
        var searchObject = {};

        _.each(parts, function(part) {
          var keyValue = part.split("=");
          searchObject[keyValue[0]] = keyValue[1];
        });

        return searchObject;
      },

      joinQueryString: function(params) {
        var str = _.reduce(
          _.map(
            _.filter(_.keys(params), function(key) {
              return params[key] != undefined;
            }),
            function(key) {
              return key + "=" + encodeURIComponent(params[key]);
            }
          ),
          function(total, item) {
            return total + (total.length > 0 ? "&" : "") + item;
          },
          ""
        );

        return str;
      },

      search: function() {
        return this.parseQueryString(document.location.search);
      },

      hash: function(hashObject) {
        var params = this.parseQueryString(document.location.hash);
        if (hashObject) {
          params = angular.extend(params, hashObject);
          document.location.hash = this.joinQueryString(params);
        }
      },

      path: function() {
        return document.location.pathname;
      }
    };
  })
  .filter("resolveUrl", function($window) {
    return function(url) {
      if (!$window.rootBase || !url) return url;
      return url.replace("~/", $window.rootBase);
    };
  })
  .filter("resolveToAbsoluteUrl", [
    "$filter",
    "$window",
    function($filter, $window) {
      return function(url) {
        return (
          $window.location.protocol +
          "//" +
          $window.location.host +
          $filter("resolveUrl")(url)
        );
      };
    }
  ])
  .filter("jsonDateToSemester", function($window) {
    return function(val) {
      var d = $window.$.jsonDateToDate(val);
      return (
        $window.Fr.Alphasystem.Report.Web.i18n.translate(
          "Training_Module_Semester"
        ) +
        " " +
        (d.getUTCMonth() < 6 ? "1 " : "2 ") +
        d.getUTCFullYear()
      );
    };
  })
  .filter("translate", [
    "$window",
    "$q",
    function($window, $q) {
      return function(text, prefix, allowDefer) {
        if (!text) return text;

        var doTranslate = function(wordToTranslate) {
          var newWord = $window.Fr.Alphasystem.Report.Web.i18n.translate(
            wordToTranslate
          );
          if (newWord === word) return undefined;
          return newWord;
        };

        var word;
        if (prefix && typeof prefix === "string") text = prefix + text;
        if (
          $window.Fr &&
          $window.Fr.Alphasystem &&
          $window.Fr.Alphasystem.Report &&
          $window.Fr.Alphasystem.Report.Web &&
          $window.Fr.Alphasystem.Report.Web.i18n
        ) {
          var toTranslate = text.replace(/\./g, "_").replace("$", "");
          word = toTranslate;
          word = doTranslate(toTranslate);

          if (!word && allowDefer) {
            var defer = $q.defer();
            $window.Fr.Alphasystem.Report.Web.i18n.registerTranslationHandler(
              null,
              function() {
                word = doTranslate(toTranslate);
                defer.resolve(word || text);
              }
            );
            return defer.promise;
          }
        } else {
          word = text.replace(/\./g, "_").replace("$", "#");
          word = $(word).text();
        }

        return word || text;
      };
    }
  ])
  .filter("translateMaybeLater", [
    "$window",
    "$q",
    "$filter",
    function($window, $q, $filter) {
      return function(text, prefix) {
        return $q.when($filter("translate")(text, prefix));
      };
    }
  ])
  .filter("dbNonUtcToDate", function($window) {
    //for fields like birthdate in EmployeeData which are not UTC
    return function(val, defaultVal) {
      if (val !== null) {
        var mdate = $window
          .moment($.jsonDateToDate(val))
          .format(
            $window.Fr.Alphasystem.Report.Web.context.dateFormat().toUpperCase()
          );
        var nullMDate = $window
          .moment([1, 0, 1])
          .format(
            $window.Fr.Alphasystem.Report.Web.context.dateFormat().toUpperCase()
          );
        if (mdate !== nullMDate) {
          return mdate;
        }
      }
      return defaultVal !== undefined ? defaultVal : "";
    };
  })
  .filter("dbUtcToDate", function($window) {
    //use this for UTC DateTime fields in the database
    return function(val, defaultVal) {
      if (val !== null) {
        var mdate = $window
          .moment($.jsonDateToDate(val))
          .tz($window.timezone)
          .format(
            $window.Fr.Alphasystem.Report.Web.context.dateFormat().toUpperCase()
          );
        var nullMDate = $window
          .moment([1, 0, 1])
          .format(
            $window.Fr.Alphasystem.Report.Web.context.dateFormat().toUpperCase()
          );
        if (mdate !== nullMDate) {
          return mdate;
        }
      }
      return defaultVal !== undefined ? defaultVal : "";
    };
  })
  //These date filers need to go away eventually, there are too many and they are not described well
  //Do not use toShortDateString since it doesn't handle daylight savings time. Use formatUtcMoment
  .filter("toShortDateString", [
    "$filter",
    function($filter) {
      return function(date) {
        var formatFunc = $filter("formatUtcMoment");
        return formatFunc(date, "#d");
      };
    }
  ])
  .filter("toFullDateString", [
    "$filter",
    function($filter) {
      return function(date) {
        var formatFunc = $filter("formatUtcMoment");
        return formatFunc(date, "#dt");
      };
    }
  ])
  .filter("toTimeString2", [
    "$filter",
    function($filter) {
      return function(date) {
        var formatFunc = $filter("formatUtcMoment");
        return formatFunc(date, "#t");
      };
    }
  ])
  .filter("toTimeString", function() {
    return function(date) {
      if (!date) return "";

      var localDate;
      if (typeof date === "number") {
        localDate = new Date(1970, 1, 1, 0, 0, date);
      } else {
        date = $.jsonDateToDate(date);
        localDate = $.toLocal(date);
      }
      return localDate.format(
        localDate.format(Fr.Alphasystem.Report.Web.context.timeFormat())
      );
    };
  })
  .filter("jsonDateToDate", function() {
    return function(item) {
      if (item) {
        return item.ToDateTimeString(); //  $.toLocal($.jsonDateToDate(item));
      } else return null;
    };
  })
  .filter("jsonDateToDateOrig", function() {
    return function(item) {
      if (item) {
        return $.jsonDateToDate(item);
      } else return null;
    };
  })
  .filter("jsonDateToShortDateString", function() {
    return function(item) {
      if (item) {
        var date = item.ToDateTimeString().split(" ")[0];
        return date; //  $.toLocal($.jsonDateToDate(item));
      } else return null;
    };
  })
  .filter("fromJsonDate", function() {
    return function(item) {
      if (item) {
        return $.toLocal($.jsonDateToDate(item));
      } else return null;
    };
  })
  .filter("fromNowString", [
    "$filter",
    function($filter) {
      return function(date) {
        if (date) {
          date = $filter("msJsonUtcDateToLocalMoment")(date);
          if (window.moment($.toLocal(new Date())).diff(date, "hours") < 24)
            return window.moment(date).calendar();
          else return window.moment(date).from($.toLocal(new Date()));
        } else return null;
      };
    }
  ])
  .filter("nullableDateToShortDate", function() {
    return function(val) {
      if (val instanceof Date) {
        return val.format(Fr.Alphasystem.Report.Web.context.dateFormat());
      } else {
        return val;
      }
    };
  })
  .filter("durationString", function($filter) {
    return function(str) {
      var translate = $filter("translate");

      if (str || str === 0) {
        var dur = window.moment.duration(str);

        if (dur.asMinutes() > 60) {
          var res = [];
          if (dur.asDays() > 1)
            res.push(
              Math.floor(dur.asDays()) + " " + translate("$Global.Text.Day")
            );

          if (dur.asMinutes() > 60)
            res.push(dur.hours() + translate("$Global.Text.Hour"));

          res.push(dur.minutes() + translate("$Global.Text.Minute"));

          return _.reduce(res, function(total, item) {
            return (total ? total + " " : "") + item;
          });

          /*
          return dur.hours()
          + ' '
          + translate('$Global.Text.Hour')
          + ', '
          + dur.minutes()
          + ' '
          + translate('$Global.Text.Minute');
          */
        } else {
          return dur.humanize();
        }
      }

      return "";
    };
  })
  .filter("booleanToText", function($filter) {
    return function(value) {
      return $filter(
        "translate"
      )(value ? "$Global.Text.Yes" : "$Global.Text.No");
    };
  })
  .filter("gpsLocationString", function() {
    var getSexagesimalString = function(value) {
      value = Math.abs(value);

      var _degree = Math.floor(value);
      value -= _degree;
      value *= 60;

      var _minute = Math.floor(value);
      value -= _minute;
      value *= 60;

      var _second = Math.round(value * 100) / 100;
      return _degree + "\xB0 " + _minute + "' " + _second.toFixed(2);
    };
    return function(location) {
      if (!location) return "";

      var lat = location.latitude || location.Latitude;
      var lon = location.longitude || location.Longitude;

      var _latSuffix = lat >= 0 ? "N" : "S";
      var _longSuffix = lon >= 0 ? "E" : "W";
      return (
        getSexagesimalString(lat) +
        " " +
        _latSuffix +
        ", " +
        getSexagesimalString(lon) +
        " " +
        _longSuffix
      );
    };
  })
  .filter("minutesToHoursMinutes", function() {
    return function(val, showSeconds) {
      var minus = false;
      if (val < 0) {
        minus = true;
        val = Math.abs(val);
      }

      var duration = window.moment.duration({ minutes: val });
      var days = duration.days().toString();
      var hours = duration.hours().toString();
      var minutes = duration.minutes().toString();
      var seconds = showSeconds ? duration.seconds().toString() : undefined;

      var paddedValueOrEmpty = function(value, separator) {
        return value ? separator + (value < 10 ? "0" + value : value) : "";
      };

      return (
        (minus ? "-" : "") +
        (days > 0 ? days + "." : "") +
        paddedValueOrEmpty(hours, days > 0 ? " " : "") +
        paddedValueOrEmpty(minutes, ":") +
        paddedValueOrEmpty(seconds, ":")
      );
    };
  })
  .filter("msJsonDateToMoment", function() {
    return function(msJsonDate) {
      return $.jsonDateToMoment(msJsonDate);
    };
  })
  .filter("msJsonDateToUtcMoment", function() {
    return function(msJsonDate) {
      return $.jsonDateToUtcMoment(msJsonDate);
    };
  })
  .filter("msJsonUtcDateToLocalMoment", [
    "webContext",
    "$filter",
    function(webContext, $filter) {
      return function(momentValue, timezone) {
        if (!webContext.context || !moment || !momentValue) return "";

        if (!momentValue._isAMomentObject)
          momentValue = $filter("msJsonDateToUtcMoment")(momentValue);

        if (!timezone)
          momentValue = momentValue.clone().tz(webContext.context.timezone());
        else momentValue = momentValue.clone().tz(timezone);

        return momentValue;
      };
    }
  ])
  .filter("localMomentToUtc", function() {
    return function(localMoment) {
      return localMoment.clone().tz("UTC");
    };
  })
  .filter("formatMoment", [
    "webContext",
    "$filter",
    function(webContext, $filter) {
      return function(momentValue, format) {
        if (!webContext.context || !moment || !momentValue) return "";

        if (!momentValue._isAMomentObject)
          momentValue = $filter("msJsonDateToMoment")(momentValue);

        if (format === undefined) format = "#d";

        if (format === "#d")
          format = webContext.context.dateFormat().toUpperCase();
        if (format === "#t") format = webContext.context.timeFormat();
        if (format === "#dt")
          format =
            webContext.context.dateFormat().toUpperCase() +
            " " +
            webContext.context.timeFormat();
        if (format === "relative") return $filter("fromNowString")(momentValue);
        if (format === "#c")
          return $filter("localMomentToCalendarString")(momentValue, false);
        if (format === "#ct")
          return $filter("localMomentToCalendarString")(momentValue, true);

        return momentValue.format(format.replace(" tt", " a"));
      };
    }
  ])
  .filter("formatUtcMoment", [
    "webContext",
    "$filter",
    function(webContext, $filter) {
      return function(momentValue, format, timezone) {
        if (!webContext.context || !moment || !momentValue) return "";
        return $filter("formatMoment")(
          $filter("msJsonUtcDateToLocalMoment")(momentValue, timezone),
          format
        );
      };
    }
  ])
  .filter("localMomentToCalendarString", [
    "webContext",
    "$filter",
    function(webContext, $filter) {
      return function(momentValue, showTime) {
        if (!moment || !momentValue) return "";
        var names = _.map(
          [
            "$Global.Calendar.Today",
            "$Global.Calendar.Tomorrow",
            "$Global.Calendar.Yesterday"
          ],
          $filter("translate")
        );
        return showTime
          ? moment.calendar()
          : momentValue.calendar(null, {
              sameDay: "[" + names[0] + "]",
              nextDay: "[" + names[1] + "]",
              nextWeek: "dddd",
              lastDay: "[" + names[2] + "]",
              lastWeek: "ddd ll",
              sameElse: "ddd ll"
            });
      };
    }
  ])
  .filter("elapsedMinutes", [
    "webContext",
    "$filter",
    function(webContext, $filter) {
      return function(momentValue) {
        if (!webContext.context || !moment || !momentValue) return -1;
        momentValue = $filter("msJsonUtcDateToLocalMoment")(
          momentValue,
          webContext.context.timezone()
        );
        var now = moment.tz(webContext.context.timezone());
        return moment.duration(now.diff(momentValue)).asMinutes();
      };
    }
  ])
  .filter("secondsToTime", [
    function() {
      return function(seconds) {
        var hours = Math.round(seconds / 3600);
        seconds = seconds % 3600;
        var minutes = Math.round(seconds / 60);
        seconds = Math.round(seconds % 60);

        return (
          (hours < 10 ? "0" : "") +
          hours +
          ":" +
          (minutes < 10 ? "0" : "") +
          minutes +
          ":" +
          (seconds < 10 ? "0" : "") +
          seconds
        );
      };
    }
  ])
  .filter("displayAsRelativeToNow", [
    function() {
      return function(date) {
        return moment(date).fromNow();
      };
    }
  ])
  .filter("fromBrowserToSiteDate", function() {
    return function(date) {
      return $.browserLocalDatetoSiteLocalDate(date);
    };
  })
  .filter("toMomentAsString", function() {
    return function(moment, targetMoment) {
      return targetMoment.from(moment);
    };
  })
  .factory("isModernBrowser", function() {
    var getInternetExplorerVersion = function getInternetExplorerVersion() {
      var rv = -1; // Return value assumes failure.
      if (navigator.appName == "Microsoft Internet Explorer") {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
        if (re.exec(ua) != null) rv = parseFloat(RegExp.$1);
      }
      return rv;
    };

    return function() {
      var ver = getInternetExplorerVersion();
      return ver == -1 || ver >= 10.0;
    };
  })
  .factory("exportCSV", [
    function() {
      return function exportCSV(data, columns, filename) {
        window.ExportLibrary.exportCSV(
          filename,
          columns,
          data,
          undefined,
          undefined
        );
      };
    }
  ])
  .filter("rebaseUrl", [
    "$window",
    function($window) {
      return function(url) {
        if (/~\//.test(url)) {
          return url.replace("~/", $window.rootBase);
        }

        var interval = null;
        url = url.replace(/\/\//g, "");
        for (var i = 0; i < url.length; i++) {
          var sub = url.substring(0, i).replace("/", "\\/");

          if (!interval) {
            if (new RegExp(".+" + sub).test($window.rootBase)) {
              interval = url.substring(0, i);
            }
          } else {
            if (new RegExp(".+" + sub + ".*").test($window.rootBase)) {
              interval = url.substring(0, i);
            } else {
              return $window.rootBase + url.substring(i - 1);
            }
          }
        }

        return $window.rootBase + url;
      };
    }
  ])
  .filter("addAuthToken", [
    "webContext",
    function(webContext) {
      return function(url) {
        if (webContext.context && webContext.context.authToken()) {
          if (/.+[?].+/.test(url)) {
            url = url + "&";
          } else {
            url = url + "?";
          }

          url =
            url + "token=" + encodeURIComponent(webContext.context.authToken());
        }

        return url;
      };
    }
  ])
  .filter("formatWith", [
    function() {
      return function(format) {
        var reg = /\{(\d+)\}/g;
        var res = reg.exec(format);
        var result = format;
        while (res != null) {
          var argIndex = parseInt(res[1]) + 1;
          if (argIndex < arguments.length)
            result = result.replace(res[0], arguments[argIndex]);
          else return "Argument " + res[0] + " not defined";

          res = reg.exec(format);
        }
        return result;
      };
    }
  ])
  .filter("paginate", [
    function() {
      return function(array, pageNumber, pageSize) {
        var result = [];
        pageNumber = Math.max((pageNumber || 1) - 1, 0);
        pageSize = pageSize || 10;
        var start = pageNumber * pageSize;
        var end = Math.min(start + pageSize, array.length);
        for (var i = start; i < end; i++) {
          result.push(array[i]);
        }
        return result;
      };
    }
  ])
  .service("sessionStorage", [
    "$window",
    function($window) {
      var storageFactory = $window.UiLibrary.store();
      return storageFactory;
    }
  ])
  .service("tfUtils", [
    "$q",
    "$timeout",
    function($q, $timeout) {
      return {
        runLater: function(func, arg) {
          var _defer = $q.defer();

          $timeout(function() {
            var success = false;
            var result = undefined;
            try {
              result = func(arg);
              success = true;
            } catch (e) {
              result = e;
              success = false;
            }

            if (success) _defer.resolve(result);
            else _defer.reject(result);
          });

          return _defer.promise;
        },
        createWebWorkerShim: function(func) {
          var worker = {
            _defer: undefined,
            inShim: true,
            notify: function(val) {
              _defer.notify(val);
            },
            complete: function(val) {
              _defer.resolve(val);
            },
            run: function(arg) {
              _defer = $q.defer();

              $timeout(function() {
                var success = false;
                var result = undefined;
                try {
                  result = func(arg);
                  success = true;
                } catch (e) {
                  result = e;
                  success = false;
                }

                if (success) complete(result);
                else _defer.reject(result);
              });

              return _defer.promise;
            }
          };

          return worker;
        }
      };
    }
  ])
  .factory("_", [
    "$window",
    function($window) {
      return $window._;
    }
  ])
  .service("logbookDetailViewer", [
    "$window",
    "asDialogs",
    function($window, asDialogs) {
      return {
        show: function(reportType, reportId) {
          switch (reportType) {
            case "EventOccurrence":
              $window.viewDetail(
                $window.rootBase +
                  "/Consultation/EventDetail.aspx?control=CtrlEventDetail&id=" +
                  reportId,
                700,
                580
              );
              break;

            case "Round":
              $window.viewDetail(
                $window.rootBase +
                  "/Consultation/EventDetail.aspx?control=CtrlRoundDetail&id=" +
                  reportId,
                700,
                580
              );
              break;

            case "RoundIncident":
              $window.viewDetail(
                $window.rootBase +
                  "/Consultation/EventDetail.aspx?control=CtrlIncidentDetail&id=" +
                  reportId,
                700,
                580
              );
              break;

            default:
              asDialogs.showError("Report Type Unknown: " + reportType);
          }
        }
      };
    }
  ])
  .filter("formatDistance", [
    function() {
      return function(distance, isMetric) {
        return distanceFormat(distance, isMetric);
      };
    }
  ])
  .service("DateTimeConverter", [
    "$window",
    "webContext",
    function($window, webContext) {
      var service = {};
      var _2digitsNumber = function(number) {
        if (number >= 0 && number < 10) return "0" + number;
        else if (number < 0 && number > -10) return "-0" + Math.abs(number);
        else return "" + number;
      };

      var datePartsToIsoString = function(dateValue, timeValue, treatAsUtc) {
        var dateString =
          dateValue.getFullYear() +
          "-" +
          _2digitsNumber(dateValue.getMonth() + 1) +
          "-" +
          _2digitsNumber(dateValue.getDate());
        var timeString =
          typeof timeValue === "string"
            ? timeValue
            : _2digitsNumber(timeValue.getHours()) +
              ":" +
              _2digitsNumber(timeValue.getMinutes());
        var timezoneOffset = webContext.context.timeZoneDelta();
        var timezoneString =
          timezoneOffset === 0 || treatAsUtc
            ? "Z"
            : (timezoneOffset > 0 ? "+" : "") +
              _2digitsNumber(timezoneOffset / 60) +
              _2digitsNumber(timezoneOffset % 60);
        var isoDate = dateString + "T" + timeString + timezoneString;
        return isoDate;
      };

      service.GetLocalDateFromDatePickers = function(
        datePickerValue,
        timePickerValue
      ) {
        var isoDate = datePartsToIsoString(datePickerValue, timePickerValue);
        var m = moment.tz(isoDate, webContext.context.timezone()).toDate();
        console.log("GetLocalDateFromDatePickers", {
          isoDate: isoDate,
          moment: m,
          timezone: webContext.context.timezone()
        });
        return m;
      };

      service.FromUtcToLocal = function(utcDate) {
        var isoDate = datePartsToIsoString(utcDate, utcDate, true);
        var m = moment
          .tz(isoDate, "UTC")
          .tz(webContext.context.timezone())
          .toDate();
        console.log("FromUtcToLocal", {
          isoDate: isoDate,
          moment: m,
          timezone: webContext.context.timezone()
        });
        return m;
      };

      service.ComputerTimeToLocal = function(computerDate) {
        var m = moment(computerDate.toISOString())
          .tz(webContext.context.timezone())
          .toDate();
        console.log("ComputerTimeToLocal", {
          isoDate: computerDate.toISOString(),
          moment: m,
          timezone: webContext.context.timezone()
        });

        return m;
      };

      return service;
    }
  ]);
