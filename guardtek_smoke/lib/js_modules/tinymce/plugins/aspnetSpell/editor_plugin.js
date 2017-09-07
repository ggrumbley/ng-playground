/*
* aspnetSpell - TinyMCE Plugin - v0.2.4
* http://www.aspnetspell.com/
* Copyright (c) 2014 RTM Soft; Licensed MIT
* Based on work from https://github.com/badsyntax/jquery-spellchecker
*/

(function () {

    tinymce.create('tinymce.plugins.aspnetSpell', {

        getInfo: function () {
            return {
                longname: 'aspnet Spellchecker',
                author: 'Abderraouf El Gasser',
                authorurl: 'http://www.rtmsoft.com',
                infourl: '', //'https://github.com/badsyntax/jquery-spellchecker',
                version: '0.0.1'
            };
        },

        init: function (ed, url) {
            this.editor = ed;
            ed.addCommand('mceaspnetSpellCheck', $.proxy(this, '_onCheck'));

            ed.addButton('aspnetSpell', {
                title: 'aspnetSpell.desc',
                cmd: 'mceaspnetSpellCheck'
            });
        },

        _onCheck: function () {
            var t = this;
            t.createSpellchecker();
            t.spellchecker.CheckInWindow();
        },

        toggleEditor: function (disabled, editable) {
            $.each(this.editor.theme.toolbarGroup.controls, function (i, controls) {
                $.each(controls.controls, function (c, control) {
                    (!/aspnetspellchecker/.test(control.id)) && control.setDisabled(disabled);
                });
            });
            this.editor.getBody().setAttribute('contenteditable', editable);
        },

        disableEditor: function () {
            this.toggleEditor(true, false);
        },

        enableEditor: function () {
            this.toggleEditor(false, true);
        },

        createSpellchecker: function () {

            var t = this;
            var ed = t.editor;

            t.spellchecker = new LiveSpellInstance();
            t.spellchecker.Fields = t.editor.id + "_ifr";
            t.spellchecker.ServerModel = "aspx";
            t.spellchecker.UserInterfaceLanguage = ed.getParam("culture").split("-")[0];
            t.spellchecker.Language = t.getLanguageName(ed.getParam("culture"));
            t.spellchecker.CustomOpener = function (url) {
                viewDetailModal(url, 490, 315, function () { ed.setProgressState(0); return false; });
            }
            t.spellchecker.CustomOpenerClose = function () {
                if (UiLibrary.closeDialog()) {
                    return;
                }

                var mgr = undefined;
                try {
                    if (GetRadWindowManager)
                        mgr = GetRadWindowManager();
                } catch (ex) { }

                if (mgr) {
                    mgr.CloseActiveWindow();
                } else {
                    var win = undefined;

                    try {
                        if (GetRadWindow) win = GetRadWindow();
                    } catch (ex2) {

                    }

                    if (win) {
                        win.Close();
                    } else {
                        if (window.frameElement != null)
                            window.frameElement.ownerDocument.CloseDialog();
                        else
                            UiLibrary.closeDialog();
                    }
                }


                t.spellchecker = null;
            }

            t.spellchecker.onDialogOpen = function () {
                ed.setProgressState(1);
            };
            t.spellchecker.onDialogComplete = function () {
                ed.setProgressState(0);
                ed.setContent(ed.getContent());
            };
        },

        getLanguageName: function (culture) {
            switch (culture) {
                case "da-DK": return "Dansk";

                case "de":
                case "de-CH":
                case "de-DE":
                case "de-LU": return "Deutsch";


                case "en-AU": return "English (Australia)";
                case "en-CA": return "English (Canada)";
                case "en-GB": return "English (UK)";
                case "en-US": return "English (USA)";

                case "es":
                case "es-AR":
                case "es-ES":
                case "es-MX":
                case "es-PA": return "Espanol";

                case "fr":
                case "fr-BE":
                case "fr-CA":
                case "fr-CH":
                case "fr-FR":
                case "fr-LU": return "Francais";

                case "it":
                case "it-CH":
                case "it-IT": return "Italiano";

                case "nl":
                case "nl-BE":
                case "nl-NL": return "Nederlands";

                case "pt":
                case "pt-PT": return "Portugues";

                case "sv-SE": return "Svenska";

                case "ms-MY": return "Bahasa Malaysia";

                case "nn-NO": return "Norwegian";

                case "pl":
                case "tr":
                case "ur-PK":
                case "yo-NG":
                case "el":
                case "en":
                case "en-029":
                case "en-KE": return "English (International)";
            }
        }
    });

    // Register plugin
    tinymce.PluginManager.add('aspnetSpell', tinymce.plugins.aspnetSpell);
})();