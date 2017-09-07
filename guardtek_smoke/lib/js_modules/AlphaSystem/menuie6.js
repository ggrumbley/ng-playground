/* File Created: février 5, 2014 */
$(function () {
    window.MenuIE6.init();
});

(function (window, $, undefined) {
    var _menuIE6 = {
        init: function () {
            $('.firstlevel li').on({
                mouseenter : function () {
                    $(this).addClass("menuItemHover");
                },
                mouseleave: function () {
                    $(this).removeClass("menuItemHover");
                }                
            });
            $('.secondlevel li').on({
                mouseenter : function () {
                    $(this).addClass("menuItemHover");
                },
                mouseleave: function () {
                    $(this).removeClass("menuItemHover");
                }                
            });
        }
    };

    window.MenuIE6 = _menuIE6;
})(window, jQuery);