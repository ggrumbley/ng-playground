/* File Created: mars 10, 2014 */

/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1-vsdoc.js" />
/// <reference path="~/content/scripts/lib/AlphaSystem/alphaSystem.js" >
/// <reference path="~/content/scripts/lib/AlphaSystem/ajaxHelper.js" >
/// <reference path="~/content/scripts/lib/AlphaSystem/common.js" >
/// <reference path="~/content/scripts/lib/AlphaSystem/alphaGrid.js" >
/// <reference path="~/content/scripts/lib/AlphaSystem/spinLoading.js" >
/// <reference path="~/content/scripts/lib/AlphaSystem/barrier.js" >
/// <reference path="~/content/scripts/lib/AlphaSystem/timezones.js" >
/// <reference path="~/content/scripts/lib/select2/select2.js" >
/// <reference path="~/content/scripts/models/enums.js" />
/// <reference path="~/content/scripts/context.js" />

$(function () {
    Fr.Alphasystem.Report.Web.Controls.PhotoUpload.init();
});

(function (window, context, undefined) {
    var _photoUpload = {
        init: function () {
            _data.init();
            _ui.init();
        },

        ui: {
            _grid: undefined,
            _spin: undefined,
            init: function () {
                _ui.initializeUpload(".image-upload")
            },

            initializeUpload: function (elements) {
                if(elements) {
                    $(elements).fileupload({
                        url: rootBase + "File/UploadFile",
                        dataType: 'json',
                        headers: {
                            Accept: "application/json"
                        },
                        accept: 'application/json',
                        done: function (e, data) {
                            var elem = $("#" + this.id);
                            elem.parents(".upload-div").removeClass("uploading-picture");
                            if (!data.result.IsError) {                                
                                if( window.angular ) {
                                    var ngElement = window.angular.element(this);
                                    var scope = ngElement.scope();
                                    if( scope.field ) scope.field.pictureUrl = data.result.Guid;
                                    else {
                                        if( scope.onFileUploaded ) {
                                            scope.onFileUploaded(ngElement.id, data.result.Guid);
                                        }
                                    }
                                } else {
                                    $("#" + this.id + "_Guid").val(data.result.Guid);
                                }
                                
                                elem.parents(".upload-div").addClass("has-picture");
                                if( !elem.attr("data-no-preview") )
                                    _ui.enablePreview(true, this, data.result.Guid);
                                $(this).trigger("uploaded", [data.result.Guid]);
                            } else {
                                alert(data.result.ErrorMessage);
                            }
                        }
                    }).on("change", function (e) {                        
                        if (isIE) {
                            if (e.target.value != null && e.target.value.length > 0)
                                $("#" + this.id).parents(".upload-div").addClass("uploading-picture");
                            //$(this).fileupload('send', { files: $(this) });
                        }
                        else {
                            if (e.target.files.length > 0)
                                $(this).parents(".upload-div").addClass("uploading-picture");
                            //$(this).fileupload('send', { files: e.target.files });
                        }
                    });
                }
            },

            enablePreview: function (enable, pictureButton, guid) {
                $(pictureButton).off("mouseover");
                _ui.hidePreview(pictureButton);

                if (enable) {
                    $(pictureButton).on("mouseover", function () {
                        _ui.showPreview(this, guid);
                    });

                    $(pictureButton).on("mousmouve", function() {
                        _ui.showPreview(this, guid);
                    })
                }
            },

            showPreview: function (pictureButton, guid) {
                if ($(pictureButton).data("hideTimer") != undefined) {
                    clearTimeout($(pictureButton).data("hideTimer"));
                    $(pictureButton).data("hideTimer", setTimeout(function () {
                        _ui.hidePreview(pictureButton);
                    }, 5000)); 
                    
                    return;
                }

                var d = $("<div />", { "class": "image-upload-preview" });
                var img = $("<img />", { "src": rootBase + "File/GetFile?guid=" + guid });
                var button = $("<input />", { "type": "button", "class": "action-button-delete" });
//                var text = $("<span />", {"class": "image-upload-preview-text"});
//                text.html("Delete");

                d.hide();
                $("#Master_Body").append(d);
                d.append(img);
                d.append(button);
                //d.append(text);
                d.draggable();

                img.on("load", function () {
                  var parent = $(pictureButton).parents(".upload-div");
                  var offset = parent.offset();
                  d.css({ "left": offset.left - parseFloat(d.css("width")) - 10  + $("#Master_Body").scrollLeft(), "top": offset.top - parseFloat(d.css("height")) + $("#Master_Body").scrollTop() });
                  d.show({ effect: "scale", direction: "horizontal", duration: "fast", easing: "swing" });
                });


                $(button).on("click", function () {
                    _data.deletePicture(guid, function () {
                        $(pictureButton).parents(".upload-div").removeClass("has-picture");
                        _ui.hidePreview();
                        _ui.enablePreview(false, pictureButton, guid);
                        /*
                        var newInput = $("<input />", { "type": "file", "id": pictureButton.id, "class": "image-upload" });

                        $(pictureButton).off("change");
                        $(pictureButton).fileupload("destroy");

                        var events = $(pictureButton).data('events');
                        if( events ) {
                            $.each(events, function(index, evt) {
                                $.each(evt, function(i, v) {
                                    newInput.bind(v.type, v.handler);
                                });
                            });
                        }

                        $(pictureButton).replaceWith(newInput);
                        _ui.initializeUpload(newInput);*/

                        if( window.angular ) {
                            var scope = window.angular.element("#" + pictureButton.id).scope();
                            if( scope.field ) scope.field.pictureUrl = "";
                        } else {
                            $("#" + pictureButton.id + "_Guid").val("");
                            $("#" + pictureButton.id).parent().find(".user-picture-upload-guid").val("");                            
                        }

                        $(pictureButton).trigger("deleted", []);                   
                    });
                });

                $(pictureButton).data("preview", d);
                $(pictureButton).data("hideTimer", setTimeout(function () {
                    _ui.hidePreview(pictureButton);
                }, 5000));
            },

            hidePreview: function (pictureButton) {
                var preview = $(pictureButton).data("preview");

                if (preview != undefined) {
                    clearTimeout($(pictureButton).data("hideTimer"));
                    preview.fadeOut("slow");

                    $(pictureButton).removeData("hideTimer");
                    $(pictureButton).removeData("preview");
                    $(preview).find("input").off("click");
                    $(preview).find("img").off("load");
                    $(preview).remove();
                }
            }
        },

        data: {
            init: function () {

            },

            deletePicture: function (guid, handler) {
                Fr.Alphasystem.Report.Web.ajaxHelper.post('File/DeleteFile', { guid: guid }, 300000)
                .done(function () {
                    handler();
                });
            }
        }
    };

    AlphaClass.registerNamespace('Fr.Alphasystem.Report.Web.Controls');
    window.Fr.Alphasystem.Report.Web.Controls.PhotoUpload = _photoUpload;

    var _data = Fr.Alphasystem.Report.Web.Controls.PhotoUpload.data;
    var _ui = Fr.Alphasystem.Report.Web.Controls.PhotoUpload.ui;
    var _i18n = Fr.Alphasystem.Report.Web.i18n;
})(window, Fr.Alphasystem.Report.Web.context);
