/* File Created: février 7, 2014 */
var globalTinymceOptions = {};

$(function () {
    globalTinymceOptions = {
        alphaContext: {
            rootBase: rootBase,
            culture: culture,
            companyId: companyId,
            authToken: authToken,
            guardroomId: guardroomId,
            loginMethod: loginMethod,
            hierarchyNodeGuid: hierarchyNodeGuid,
            timeZoneDelta: timeZoneDelta,
            userId: userId,
			isMetric: isMetric
        },
        culture: culture,

        // Location of TinyMCE script
        script_url : rootBase + 'content/scripts/lib/tinymce/tiny_mce.js',
        editor_encoding: "raw",
        encoding: "xml",
        relative_urls: false,
        remove_script_host: true,
        statusbar : false,

        // General options
        theme : "advanced",
        plugins : "aspnetSpell, mceImageManager,style,table,inlinepopups,insertdatetime,preview,searchreplace,contextmenu,paste,fullscreen,noneditable,visualchars,xhtmlxtras",

        // Theme options
        theme_advanced_buttons1 : "aspnetSpell,pasteword,pastetext,|,bold,italic,underline,|,justifyleft,justifycenter,justifyright,justifyfull,|,undo,redo,|,bullist,numlist,image",
        theme_advanced_buttons2 : "tablecontrols,|,forecolor,backcolor,fontsizeselect",
        theme_advanced_buttons3 : "",
        theme_advanced_buttons4 : "",
        //                theme_advanced_buttons1 : "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
        //                theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
        //                theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
        //                theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",


        theme_advanced_toolbar_location : "top",
        theme_advanced_toolbar_align : "left",
        theme_advanced_statusbar_location : "bottom",
        theme_advanced_resizing : true,

        // Example content CSS (should be your site CSS)
        content_css : "",

        // Drop lists for link/image/media/template dialogs
        external_link_list_url : "lists/link_list.js",
        external_image_list_url : "lists/image_list.js",
        media_external_list_url : "lists/media_list.js",

        extended_valid_elements: "img[!src|border:0|alt|title|width|height|style]a[name|href|target|title|onclick]",

        setup: function(ed) {
            var args;
            // Update model on button click
            ed.onExecCommand.add(function(e) {
                tinyMCE.triggerSave(true, true);
            });
            // Update model on keypress
            ed.onKeyUp.add(function(e) {
                tinyMCE.triggerSave(true, true);
            });
            // Update model on change, i.e. copy/pasted text, plugins altering content
            ed.onSetContent.add(function(e) {
                if (!e.initial) {
                   tinyMCE.triggerSave(true, true);
                }
            });
        }
    };
    window.LayoutManager.init();
});


(function (window, $, undefined) {
    var _LayoutManager = {
        _menu: undefined,
        _body: undefined,
        _telerikPostBackFunction: undefined,

        init : function () {
            this._menu = $(".header");
            this._body = $("#Master_Body");
            this.wireEvents();
            this.setupEditors();
            this.setupValidators();
            this.overrideTelerikPopups();
            this.overrideTelerikBuggyFunctions();
            this.redraw();
            this.overrideHistoryAPIWhenBlocked();
        },

        radAjaxManager_OnResponseEnd: function(sender, eventArgs) {
            console.log("radAjaxManager_OnResponseEnd invoked");
            LayoutManager.init();
        },
        
        redraw: function() {
//            $("input[type='image']").each(function() {
//                var that = this;
//                if( that.src.indexOf("write.gif") >= 0 ) LayoutManager.replaceButton(that, "action-button-edit");
//                if( that.src.indexOf("button-view.gif") >= 0 ) LayoutManager.replaceButton(that, "action-button-details");
//                if( that.src.indexOf("mail.gif") >= 0 ) LayoutManager.replaceButton(that, "action-button-notifications");
//                if( that.src.indexOf("button-delete.png") >= 0 || that.src.indexOf("Trash.ico") >= 0 ) LayoutManager.replaceButton(that, "action-button-delete");
//                if( that.src.indexOf("validation_on.png") >= 0 ) LayoutManager.replaceButton(that, "action-button-active");
//                if( that.src.indexOf("validation_off.png") >= 0 ) LayoutManager.replaceButton(that, "action-button-inactive");
//                if( that.src.indexOf("button-view.png") >= 0 ) LayoutManager.replaceButton(that, "action-button-details");
//            });
        },

        replaceButton: function(button, buttonClass) {
            var span = $("<span/>", {"class" : "image-button-small " + buttonClass});            
            span.on("click", function() {
                button.click();
            });
            
            var cemetery = $(button).parents("form").find(".cemetery");

            if( cemetery.length == 0) {
                cemetery = $("<div />", {"class": "cemetery"});
                cemetery.hide();
                $(button).parents("form").append(cemetery);
            }

            $(button).replaceWith(span);
            cemetery.append(button);
        },
        statusbar : false,

        wireEvents: function() {
            $(document).on("change", "input [type='text']", function() {
                if( $(this).val() ) $(this).addClass("has-info");
                else $(this).removeClass("has-info");
            })

        },

        overrideTelerikPopups: function() {
            if(this._BaseGetRadWindow) return;

            this._BaseGetRadWindow = GetRadWindow;
            GetRadWindow = this.GetRadWindowOverride;
            document.CloseDialog = UiLibrary.closeDialog;
        },

        overrideTelerikBuggyFunctions: function() {
            var telerikLocationRape = function() {
                if( window.$telerik ) {
                    var telerikLoc = window.$telerik.getLocation;
                    window.$telerik.getLocation = function(elem) {
                        if( !elem.document ) elem.document = document; // This is the bug, elem.document is null on some browsers
                        return telerikLoc(elem);
                    };
                } else {
                    var that = this;
                    setTimeout(function() { telerikLocationRape()}, 1000);
                }
            };

            var treeviewScrollEventRape = function() {
                if( window.RadTreeView && window.RadTreeView.prototype && window.RadTreeView.prototype.Scroll ) {
                    var telerikScroll = window.RadTreeView.prototype.Scroll;
                    window.RadTreeView.prototype.Scroll = function() {
                        try {
                            var that = this;
                            var res = telerikScroll.apply(that);                    
                            document.getElementById(this.ClientID + "_scroll").value = 0;

                            return res;
                        } catch(ex) { return null; }
                    };
                } else {
                    var that = this;
                    setTimeout(function() { treeviewScrollEventRape()}, 1000);
                }
            };

            telerikLocationRape();
            treeviewScrollEventRape();
        },

        GetRadWindowOverride: function() {
            var radWindow = LayoutManager._BaseGetRadWindow();
            if( radWindow != null ) return radWindow;

            return {
                Close: function(arg) {
                    if( window.frameElement != null ) 
                        window.frameElement.ownerDocument.CloseDialog(this.Argument, arg);
                    else
                        UiLibrary.closeDialog(this.Argument, arg);
                },
                SetSize: function(width, height) {
                    //TODO: Implement something useful
                },                
                MoveTo: function(x, y) {
                    //TODO: Implement something useful
                }
            };
        },

        setupEditorsBackup: function() {
            // Exemple d'utilisation contenant toutes les options possibles pour les barres d'outils de l'éditeur
            $('textarea.tinymce').tinymce({
                // Location of TinyMCE script
                script_url : rootBase + 'content/scripts/lib/tinymce/tiny_mce.js',
                encoding : "xml",

                // General options
                theme : "advanced",
                plugins : "pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",

                // Theme options
                theme_advanced_buttons1 : "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
                theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
                theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
                theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
                theme_advanced_toolbar_location : "top",
                theme_advanced_toolbar_align : "left",
                theme_advanced_statusbar_location : "bottom",
                theme_advanced_resizing : true,

                // Example content CSS (should be your site CSS)
                content_css : "css/content.css",

                // Drop lists for link/image/media/template dialogs
                template_external_list_url : "lists/template_list.js",
                external_link_list_url : "lists/link_list.js",
                external_image_list_url : "lists/image_list.js",
                media_external_list_url : "lists/media_list.js",

                // Replace values for the template plugin
                template_replace_values : {
                        username : "Some User",
                        staffid : "991234"
                }
            });         
        },

        setupEditors: function() {
            var editors = $('textarea.tinymce');

            if( editors.length > 0 ) {
                editors.tinymce(globalTinymceOptions);

                /*
                // Update model on button click
                editors.onExecCommand.add(function(e) {
                    this.save();                    
                });
                // Update model on keypress
                editors.onKeyUp.add(function(e) {
                    this.save();                    
                });
                // Update model on change, i.e. copy/pasted text, plugins altering content
                editors.onSetContent.add(function(e) {
                    if (!e.initial) {
                        this.save();
                    }
                });  
                */        

                this.overridePostback();
            }
        },

        overridePostback: function() {
            try {
                if( tinyMCE && tinyMCE.triggerSave ) {
                    var __super_triggerSave = tinyMCE.triggerSave;
                    tinyMCE.triggerSave = function() {
                        __super_triggerSave.apply(this, arguments);
                        //LayoutManager.encodeEditorContents();
                    }
                }
            } 
            catch (e) {}
            try {
            if( __doPostBack ) {
                var __super_doPostBack = __doPostBack;
                __doPostBack = function() {
                    tinyMCE.triggerSave(true, true);
                    __super_doPostBack.apply(this, arguments);
                }
            }
            }
            catch (e) {}
            try {

            if( WebForm_DoPostBackWithOptions ) {
                var __super_WebForm_DoPostBackWithOptions = WebForm_DoPostBackWithOptions;
                WebForm_DoPostBackWithOptions = function() {
                    tinyMCE.triggerSave(true, true);
                    __super_WebForm_DoPostBackWithOptions.apply(this, arguments);
                }
            }
            }
            catch (e) {}
        },

        validateTinyMCE: function(sender, args) {
            var isValid = false;            
            var editor = null;

            for (var i = 0; i < tinyMCE.editors.length; i++) {
                if( tinyMCE.editors[i].id == sender.id ) {
                    editor = tinyMCE.editors[i];
                    break;
                }
            }

            if( editor != null ) {
                var value = editor.getContent();
                if (value == "") {
                    args.IsValid = false;
                }
                else {
                    //Check for space tag
                    if (value == "<p>&nbsp;</p>") {
                        //Clear TinyMCE
                        editor.execCommand('mceSetContent', false, "");
                        args.IsValid = false;
                    }
                    else {
                        args.IsValid = true;
                    }
                }
            } else {
                args.IsValid = true;
            }
        },

        setupValidators: function() {
            if( !window.Page_Validators ) return;
            
            for (var i = 0; i < window.Page_Validators.length; i++) {
                if( !window.Page_Validators[i].baseEvaluationFunction ) {
                    // Create a new property and assign the original evaluation function to it
                    window.Page_Validators[i].baseEvaluationFunction = window.Page_Validators[i].evaluationfunction;
             
                    // Set our own validation function
                    window.Page_Validators[i].evaluationfunction = this.evaluateField;
                }
            }            
        },

        evaluateField: function(validator) {
            // Run the original validation function
            var isvalid = validator.baseEvaluationFunction(validator);
         
            // Handle the result
            if (isvalid) {
                LayoutManager.clearError(validator);
            } else {
                LayoutManager.setError(validator);
            }
         
            // Return result
            return isvalid;
        },

        clearError: function(validator) {            
            var controltovalidate = $("#" + validator.controltovalidate);
            $("#" + validator.id + "-help-block").remove();
            if( controltovalidate.parent().find(".help-block").length == 0 ) {
                controltovalidate.parents(".form-group").removeClass("has-error");
            }
        },

        setError: function(validator) {
            if( $("#" + validator.id + "-help-block").length > 0 ) return; // Error already in place

            $("#" + validator.controltovalidate).parents(".form-group").addClass("has-error");
            var msg = $("<div />", {"for": validator.controltovalidate, "class": "help-block", "id": validator.id + "-help-block"});
            msg.html(validator.errormessage);
            msg.appendTo($("#" + validator.controltovalidate).parent());
            $(validator).hide();
            $("#" + validator.controltovalidate).focus();
        },        



        windowResized: function() {
            if( LayoutManager._menu == null || LayoutManager._menu.length == 0 )
                LayoutManager._body.css("height", document.body.clientHeight + 'px');
            else
                LayoutManager._body.css("height", (document.body.clientHeight - (LayoutManager._menu.get(0).clientHeight - LayoutManager._menu.get(0).clientTop)) + 'px');
        },

        setToogle: function(checkboxElement, yesText, noText, disabled, autoPostback) {   
            if( checkboxElement.parent().find(".btn-group").length > 0 ) return;

            var group = $("<div />", {"class": "btn-group btn-toggle"});
            var yes = $("<span />", {"class":"btn btn-xs btn-primary"});
            var no = $("<span />", {"class":"btn btn-xs btn-primary"});
            var chk = checkboxElement;

            yes.text(yesText);
            no.text(noText);
            chk.hide();

            if( chk.hasClass('disabled') ) {
                group.addClass('disabled');
            }

            if( chk.prop('checked')) {
                yes.addClass('active');
            } else {
                no.addClass('active');
            }

            if (!disabled) {
                yes.off('click').on('click', function() {
                    yes.addClass('active');
                    no.removeClass('active');
                    if( autoPostback ) {
                        chk.click();
                    } else {
                        chk.prop('checked', true);    
                    }
                });

                no.off('click').on('click', function() {
                    no.addClass('active');
                    yes.removeClass('active');
                    if( autoPostback ) {
                        chk.click();
                    } else {
                        chk.prop('checked', false);    
                    }
                });
            }

            group.append(yes);
            group.append(no);
            chk.parent().append(group);
        },
        setClientToggle: function(checkboxElement, yesText, noText, disabled, callback) {   
            if( checkboxElement.parent().find(".btn-group").length > 0 ) return;

            var group = $("<div />", {"class": "btn-group btn-toggle"});
            var yes = $("<span />", {"class":"btn btn-xs btn-primary"});
            var no = $("<span />", {"class":"btn btn-xs btn-primary"});
            var chk = checkboxElement;
         
            yes.text(yesText);
            no.text(noText);
            chk.hide();

            if( chk.hasClass('disabled') ) {
                group.addClass('disabled');
            }

            if( chk.prop('checked')) {
                yes.addClass('active');
            } else {
                no.addClass('active');
            }

            if (!disabled) {
                yes.off('click').on('click', function() {
                    yes.addClass('active');
                    no.removeClass('active');
                    if( callback ) {
                        callback(true);
                    } 
                        chk.prop('checked', true);    
                       console.log(chk);
                });

                no.off('click').on('click', function() {
                    no.addClass('active');
                    yes.removeClass('active');
                    if( callback ) {
                        callback(false);
                    }
                        chk.prop('checked', false);     
                    
                });
            }

            group.append(yes);
            group.append(no);
            chk.parent().append(group);
        },
        overrideHistoryAPIWhenBlocked: function() {
            if( window.history && window.history.replaceState ) {
                var url = window.location.href;
                try {
                    window.history.replaceState(null, '', url);
                }
                catch (e) {
                    if( console && console.log )
                        console.log('Attempting to replace history API');
                    // The replaceState (and pushState) methods fail on IE when the value "NoNavButtons" is set to 1 in the registry at [HKEY_CURRENT_USER\Software\Policies\Microsoft\Internet Explorer\Restrictions]
                    // So we just silently disable them
                    window.history.pushState = function(state, title, url) {};
                    window.history.replaceState = function(state, title, url) {};
                    window.history._disabled = true;
                }
            }
        }
    };

    window.LayoutManager = _LayoutManager;
})(window, jQuery);