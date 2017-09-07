/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1-vsdoc.js" />
/*
* File Created: mars 4, 2013
* Sébastien Blanchard
* Copyright 2013 Alphasystem S.A.S.
*/

var AlphaClass = (function () {
    var DONT_ENUMS = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
        IS_DONTENUM_BUGGY = (function () {
            for (var p in { toString: 1 }) {
                if (p === 'toString') return false;
            }
            return true;
        })();
    function subclass() { };
    function create() {
        var _parent = null,
            _properties = Array.prototype.slice.call(arguments, 0);
        if (Object.isFunction(_properties[0]))
            _parent = _properties.shift();
        function _class() {
            this.initialize.apply(this, arguments);
        };
        _class.superclass = _parent;
        Object.extend(_class, AlphaClass.Methods);
        if (_parent) {
            subclass.prototype = _parent.prototype;
            _class.prototype = new subclass;
        }
        for (var i = 0, length = _properties.length; i < length; i++)
            _class.implements(_properties[i]);
        if (!_class.prototype.initialize)
            _class.prototype.initialize = function () { };
        _class.prototype.constructor = _class;
        return _class;
    }
    function implements(source) {
        var ancestor = this.superclass && this.superclass.prototype,
            _properties = Object.keys(source);

        if (IS_DONTENUM_BUGGY) {
            if (source.toString != Object.prototype.toString)
                _properties.push("toString");
            if (source.valueOf != Object.prototype.valueOf)
                _properties.push("valueOf");
        }

        for (var i = 0, length = _properties.length; i < length; i++) {
            var property = _properties[i], value = source[property];
            if (ancestor && Object.isFunction(value) && value.argumentNames()[0] == "$super") {
                var method = value;
                value = (function (m) {
                    return function () { return ancestor[m].apply(this, arguments); };
                })(property).wrap(method);

                value.valueOf = (function (method) {
                    return function () { return method.valueOf.call(method); };
                })(method);

                value.toString = (function (method) {
                    return function () { return method.toString.call(method); };
                })(method);
            }
            this.prototype[property] = value;
        }

        return this;
    }
    function registerNamespace(namespace) {
        if (Object.isString(namespace)) {
            var _namespace = namespace.split('.');
            if (!window[_namespace[0]]) 
                window[_namespace[0]] = {};
            var strFullNamespace = _namespace[0];
            for(var i = 1; i < _namespace.length; i++)
            {
                strFullNamespace += "." + _namespace[i];
                eval("if(!window." + strFullNamespace + ")window." + strFullNamespace + "={};");
            }
       }
    }
    return {
        create: create,
        registerNamespace: registerNamespace,
        Methods: {
            implements: implements
        }
    };
})();

(function() {
  var _toString = Object.prototype.toString,
      _hasOwnProperty = Object.prototype.hasOwnProperty,
      NULL_TYPE = 'Null',
      UNDEFINED_TYPE = 'Undefined',
      BOOLEAN_TYPE = 'Boolean',
      NUMBER_TYPE = 'Number',
      STRING_TYPE = 'String',
      OBJECT_TYPE = 'Object',
      FUNCTION_CLASS = '[object Function]',
      BOOLEAN_CLASS = '[object Boolean]',
      NUMBER_CLASS = '[object Number]',
      STRING_CLASS = '[object String]',
      ARRAY_CLASS = '[object Array]',
      DATE_CLASS = '[object Date]';
  var DONT_ENUMS = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
  var IS_DONTENUM_BUGGY = (function(){
    for (var p in { toString: 1 }) {
      if (p === 'toString') return false;
    }
    return true;
  })();

  function Type(o) {
    switch(o) {
      case null: return NULL_TYPE;
      case (void 0): return UNDEFINED_TYPE;
    }
    var type = typeof o;
    switch(type) {
      case 'boolean': return BOOLEAN_TYPE;
      case 'number':  return NUMBER_TYPE;
      case 'string':  return STRING_TYPE;
    }
    return OBJECT_TYPE;
  }

  function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
  }

  function keys(object) {
    if (Type(object) !== OBJECT_TYPE) { throw new TypeError(); }
    var results = [];
    for (var property in object) {
      if (_hasOwnProperty.call(object, property))
        results.push(property);
    }
    if (IS_DONTENUM_BUGGY) {
      for (var i = 0; property = DONT_ENUMS[i]; i++) {
        if (_hasOwnProperty.call(object, property))
          results.push(property);
      }
    }
    return results;
  }

  function clone(object) {
    return extend({ }, object);
  }

  function isArray(object) {
    return _toString.call(object) === ARRAY_CLASS;
  }

  var hasNativeIsArray = (typeof Array.isArray == 'function')
    && Array.isArray([]) && !Array.isArray({});

  if (hasNativeIsArray) {
    isArray = Array.isArray;
  }

  function isFunction(object) {
    return _toString.call(object) === FUNCTION_CLASS;
  }

  function isString(object) {
    return _toString.call(object) === STRING_CLASS;
  }

  function isNumber(object) {
    return _toString.call(object) === NUMBER_CLASS;
  }

  function isDate(object) {
    return _toString.call(object) === DATE_CLASS;
  }

  function isUndefined(object) {
    return typeof object === "undefined";
  }

  extend(Object, {
    extend:        extend,
    keys:          Object.keys || keys,
    clone:         clone,
    isArray:       isArray,
    isFunction:    isFunction,
    isString:      isString,
    isNumber:      isNumber,
    isDate:        isDate,
    isUndefined:   isUndefined
  });
})();

Object.extend(Function.prototype, (function () {
    var slice = Array.prototype.slice;

    function update(array, args) {
        var arrayLength = array.length, length = args.length;
        while (length--) array[arrayLength + length] = args[length];
        return array;
    }

    function argumentNames() {
        var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
      .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
      .replace(/\s+/g, '').split(',');
        return names.length == 1 && !names[0] ? [] : names;
    }

    function merge(array, args) {
        array = slice.call(array, 0);
        return update(array, args);
    }

    function bind(context) {
        if (arguments.length < 2 && Object.isUndefined(arguments[0]))
            return this;

        if (!Object.isFunction(this))
            throw new TypeError("The object is not callable.");

        var nop = function () { };
        var __method = this, args = slice.call(arguments, 1);

        var bound = function () {
            var a = merge(args, arguments), c = context;
            var c = this instanceof bound ? this : context;
            return __method.apply(c, a);
        };

        nop.prototype = this.prototype;
        bound.prototype = new nop();

        return bound;
    }

    function wrap(wrapper) {
        var __method = this;
        return function () {
            var a = update([__method.bind(this)], arguments);
            return wrapper.apply(this, a);
        }
    }

    var extensions = {
        argumentNames: argumentNames,
        wrap: wrap
    };

    if (!Function.prototype.bind)
        extensions.bind = bind;

    return extensions;
})());