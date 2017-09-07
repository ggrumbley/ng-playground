/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1-vsdoc.js" />
/// <reference path="../lib/AlphaSystem/AlphaClass.js" />
/*
* File Created: avril 17, 2013
* Sébastien Blanchard
* Copyright 2013 Alphasystem S.A.S.
*/
(function (window, $, undefined) {
    var template = '<span class="loading"><div class="spinnerText">{{text}}</div></span>';

    var spinLoading = {
        build: function ($elem, options) {
            var $loading = $(template.replace('{{text}}', options.text));
            var spinner = new Spinner({ lines: 9, // The number of lines to draw
                length: 3, // The length of each line
                width: 4, // The line thickness
                radius: 5, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#FFF', // #rgb or #rrggbb
                speed: 1, // Rounds per second
                trail: 66, // Afterglow percentage
                shadow: true, // Whether to render a shadow
                hwaccel: true, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: 'auto', // Top position relative to parent in px
                left: 'auto' // Left position relative to parent in px 
            }).spin();
            $elem.data('spinLoading', $loading)
            $(spinner).data('elem', $elem);
            $loading.prepend(spinner.el);
            if (options.color === 'white')
                $loading.addClass('white');
            var regex = new RegExp(/\d+px/);
            var position = {};
            if (regex.test(options.top))
                position.top = options.top;
            if (regex.test(options.left))
                position.left = options.left;
            if (position != {})
                $loading.css(position);
            $elem.append($loading);
            return $elem;
        }
    };

    $.fn.spinLoading = function (arg) {
        this.each(function (i, elem) {
            var $elem = $(elem);
            // prevent multiple instantiation
            if ($elem.data('spinLoading')) { return; }
            spinLoading['build']($elem, arg || {});
        });

        return this; // maintain chaining
    };
} (window, jQuery));