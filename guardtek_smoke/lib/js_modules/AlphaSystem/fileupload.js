(function (window, context, undefined) {
    var _fileUpload = {
    	create: function(uiElement, serverHandlerUrl) {
		    var _instance = {
		    	_uiElement: uiElement,
                onSuccessCallback: undefined,
                onErrorCallback: undefined,

	            sendFile: function(onSuccessCallback, onErrorCallback) {
	                this.onSuccessCallback = onSuccessCallback;
                    this.onErrorCallback = onErrorCallback;

                    if (this._uiElement[0].files && this._uiElement[0].files.length > 0) {
                        this._uiElement.fileupload('send', { files: this._uiElement[0].files });
                    }
                    else if (this._uiElement[0].value != null && this._uiElement[0].value.length > 0) {
                        this._uiElement.fileupload('send', { files: this._uiElement });
                    } else if( onErrorCallback ) {
                        onErrorCallback("No file selected");
                    }
	            },

	            deleteFile: function (guid, handler) {
	                Fr.Alphasystem.Report.Web.ajaxHelper.post('File/DeleteFile', { guid: guid }, 300000)
	                .done(function () {
	                    handler();
	                });
	            }
		    };


	        var init = function (uiElement, instance) {
                if(uiElement) {
                    $(uiElement).fileupload({
                        autoUpload: false,
                        replaceFileInput: false,

                        url: window.rootBase + serverHandlerUrl,
                        dataType: 'json',
                        headers: {
                            Accept: "application/json"                            
                        },
                        accept: 'application/json',
                        done: function (e, data) {                            
                            var result = data.result.Status || data.result;
                            if (!result.IsError) {
                                if( instance.onSuccessCallback ) {
                                    instance.onSuccessCallback(data.result);
                                }
                                
                                $(this).trigger("uploaded", [data.result]);
                            } else if( instance.onErrorCallback ) {
                                instance.onErrorCallback(data.result.ErrorMessage);
                            }
                        },
                        fail: function(e, data) {
                            if( instance.onErrorCallback ) {
                                instance.onErrorCallback(data.errorThrown);
                            }  
                        }
                    });
                }
            };

            init(uiElement, _instance);
		    return _instance;
    	}
    };

    AlphaClass.registerNamespace('Fr.Alphasystem.Report.Web.Controls');
    window.Fr.Alphasystem.Report.Web.Controls.FileUpload = _fileUpload;

    var _data = Fr.Alphasystem.Report.Web.Controls.FileUpload.data;
    var _ui = Fr.Alphasystem.Report.Web.Controls.FileUpload.ui;
    var _i18n = Fr.Alphasystem.Report.Web.i18n;
})(window, Fr.Alphasystem.Report.Web.context);
