/* File Created: juin 10, 2014 */
Array.prototype.contains = function (element) {
    if (typeof (element) === 'function') {
        for (var i = 0; i < this.length; i++) {
            if (element(this[i])) return true;
        }

        return false;
    } else {
        if ('Guid' in element || 'Id' in element || 'guid' in element || 'id' in element) {
            return this.contains(function (o) { return compare(element, o); });
        }
        return this.indexOf(element) > -1;
    }
};

var noop = function () { }

Array.prototype.Base_indexOf = Array.prototype.indexOf || noop;
Array.prototype.indexOf = function (predicate) {
    if (predicate == undefined || typeof (predicate) === 'function') {
        for (var i = 0; i < this.length; i++) {
            if (predicate == undefined || predicate(this[i])) return i;
        }
        return -1;
    } else {
        return this.Base_indexOf(predicate);
    }
};

Array.prototype.firstOrDefault = function (predicate) {
    var index = this.indexOf(predicate);
    if (index != -1) return this[index];
    else return null;
}

Array.prototype.where = function (predicate) {
    var r = [];
    for (var i = 0; i < this.length; i++) {
        if (predicate(this[i]))
            r.push(this[i]);
    };

    return r;
};

Array.prototype.remove = function (element) {
    for (var i = this.length - 1; i >= 0; i--) {
        if (compare(element, this[i])) {
            this.splice(i, 1);
        }
    }
};

Array.prototype.any = function (predicate) {
    return this.firstOrDefault(predicate) != null;
};

Array.prototype.each = function (action) {
    for (var i = 0; i < this.length; i++) {
        action(this[i]);
    };
};

Array.prototype.select = function (generator) {
    var newList = [];
    for (var i = 0; i < this.length; i++) {
        newList.push(generator(this[i], i));
    };

    return newList;
};


String.prototype.anyOf = function (stringList) {
    for (var i = 0; i < stringList.length; i++) {
        if (stringList[i] == this) return true;
    };

    return false;
};