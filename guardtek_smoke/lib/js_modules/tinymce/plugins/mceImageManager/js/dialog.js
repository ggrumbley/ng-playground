tinyMCEPopup.requireLangPack();

var ImageManagerDialog = {
    /* TinyMCE Code */
    init: function () {
        var f = document.forms[0];

        // Get the selected contents as text and place it in the input
        //		f.someval.value = tinyMCEPopup.editor.selection.getContent({format : 'text'});
        //		f.somearg.value = tinyMCEPopup.getWindowArg('some_custom_arg');

        this.rootBase = tinyMCEPopup.getWindowArg('alphaContext').rootBase;
        this.initializeUpload("#upload-file");
    },

    insert: function () {
        this.saveFile(function (result) {
            if (result.IsError) {
                alert(result.ErrorMessage);
            } else {
                var root = window.location.pathname.split('/')[1];
                var content = "<img src='" + result.Url.replace("~", "/" + root) + "' border='0' />";


                tinyMCEPopup.editor.execCommand('mceInsertContent', false, content);
                tinyMCEPopup.close();
            }
        });

    },

    cancel: function () {
        if ($("#upload-file-guid").val().length > 0) {
            this.deleteFile(function () {
                tinyMCEPopup.close();
            });
        } else {
            tinyMCEPopup.close();
        }
    },
    /* End Of TinyMCE Code */

    /* User Code */

    initializeUpload: function (elements) {
        $(elements).fileupload({
            url: this.rootBase + "File/UploadFile",
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "X-FileTypes": "image"
            },
            accept: 'application/json',
            done: function (e, data) {
                if (!data.result.IsError) {
                    if ($("#upload-file-guid").val().length > 0) {
                        ImageManagerDialog.deleteFile(function () { });
                    }
                    $("#upload-file-guid").val(data.result.Guid);
                    $("#preview").removeClass("background-loading");
                    $("#preview")[0].src = ImageManagerDialog.rootBase + "/File/GetFile?guid=" + data.result.Guid;
                } else {
                    alert(data.result.ErrorMessage);
                }
            }
        }).on("change", function (e) {
            $("#preview").addClass("background-loading");
        }); ;

        $("#button-upload").on("click", function (e) {
            var file = $("#upload-file")[0];
            if (file.files && file.files.length > 0)
                $(this).fileupload('send', { files: file.files });
            else if (file.value && file.value.length > 0)
                $(this).fileupload('send', { files: $(file) });
        });
    },

    saveFile: function (handler) {
        var guid = $("#upload-file-guid").val();
        Fr.Alphasystem.Report.Web.ajaxHelper.post('File/SaveFile', { guid: guid, destination: "editor" })
                    .done(function (result) {
                        handler(result);
                    });
    },

    deleteFile: function (handler) {
        var guid = $("#upload-file-guid").val();
        Fr.Alphasystem.Report.Web.ajaxHelper.post('File/DeleteFile', { guid: guid })
        .done(function (result) {
            handler(result);
        });
    }
};

tinyMCEPopup.onInit.add(ImageManagerDialog.init, ImageManagerDialog);
