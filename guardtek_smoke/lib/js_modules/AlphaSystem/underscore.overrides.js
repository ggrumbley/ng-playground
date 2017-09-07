if (_) {
    _.mixin({
        /// Fills dest with items from src, replacing all items of dest.
        /// @returns dest
        fill: function(dest, src) { 
            if( dest === src ) return;
            dest.splice(0, dest.length);
            _.each(src, function(item) { dest.push(item); });
            return dest;
        },
        pipe: function() {
            var chain = arguments;
            return function(a) {
                for(var i= 0, len=chain.length; i<len; i++) {
                    if( !!chain[i] ) {
                        if( typeof chain[i] === "function")
                            a = chain[i](a);
                        else
                            a = chain[i];
                    }
                }
                return a;
            }
        },
        true: function() {
            return true;
        },
        false: function() {
            return false;
        },
        in: function(array, value)  { return _.indexOf(array, value) >= 0; },
        filler: function (dest, map, src) {_.fill(dest, _.map(src, map || _.identity)); return dest; },
        buildFiller: function (dest, map) { return _.partial(_.filler, dest, map || _.identity); },
        adder: function (dest, map, src) {_.each(src, function(i) { dest.push((map || _.identity)(i));}); return dest; },
        appender: function (dest, map, src) {dest.push((map||_.identity)(src)); return src;},
        buildAppender: function (dest, map) { return _.partial(_.appender, dest, map || _.identity); },
        tapToConsole: function(obj) { console.log(obj); return obj;}
    });
}