/*
	xBreadcrumbs (Extended Breadcrums) jQuery Plugin
	© 2009 ajaxBlender.com
	For any questions please visit www.ajaxblender.com 
	or email us at support@ajaxblender.com
*/

;(function($){
	/*  Variables  */
	$.fn.xBreadcrumbs = function(settings){
		var element = $(this);
		var settings = $.extend({}, $.fn.xBreadcrumbs.defaults, settings);
    var items = [];
    var subitems = [];
    var current = null;

		function _init(){
      items = [{id: "home", name: "Home"}];      
    }

    function _render() {
      element.children().empty();
      for(i=0; i<items.length; i++)
      {
        var li = $('<li/>', {id: items[i].id});
        var title = $('<a/>', {href: "#"});

        if( items[i].id == "home" )
          title.addClass("home");
       
        element.append(li);
        li.append(title);
        
//        var li = element.append("<li><a href='#'"+(items[i].id =="home"?"class=home":"")+">"+ items[i].name +"</a></li>").item = items[i];
      }

      element.children('LI').mouseenter(function(){
        if($(this).hasClass('hover')){ return; }
                
        _hideAllSubLevels();
        if(!_subLevelExists(this.id)){ return; }

        var subLevel = $(this).children('UL');
        _showSubLevel(subLevel);
      });
            
      element.children('LI').mouseleave(function(){
          var subLevel = $(this).children('UL');
          _hideSubLevel(subLevel, false);
                
          if(settings.collapsible && !$(this).hasClass('current')){
            $(this).children('A').animate({width: settings.collapsedWidth}, 'fast');
          }
      });
		};
		
		function _hideAllSubLevels(){
			element.children('LI').children('UL').each(function(){
                $(this).hide();
                $(this).parent().removeClass('hover');
			});
		};
		
		function _showSubLevel(subLevel){
      subLevel.parent().addClass('hover');
      if($.browser && $.browser.msie){
        var pos = subLevel.parent().position();
        subLevel.css('left', parseInt(pos['left']));
      }
      if(settings.showSpeed != ''){ subLevel.fadeIn( settings.showSpeed ); } 
      else { subLevel.show(); }
		};

		function _hideSubLevel(subLevel){
      subLevel.parent().removeClass('hover');
      if(settings.hideSpeed != ''){ subLevel.fadeOut( settings.hideSpeed ); } 
      else { subLevel.hide(); }
		};

		function _subLevelExists(item){
      if( subitems.length > 0 && subitems[item.id] != null && subitems[item.id].length > 0 )
        return true;

      if( settings.subItemsNeeded != null )
      {
        subitems[item.id] = settings.subItemsNeeded(item.Id);
      }

			return ( subitems.length > 0 && subitems[item.id] != null && subitems[item.id].length > 0 );
		};
		
		//    Entry point
		_init();
    _render();
	};
	
	/*  Default Settings  */
	$.fn.xBreadcrumbs.defaults = {
		showSpeed:        'fast',
		hideSpeed:        '',
		collapsible:      false,
		collapsedWidth:   10,
    subitemsNeeded: null,
    itemClicked: null
	};
})(jQuery);