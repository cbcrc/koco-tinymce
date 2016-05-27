(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'tinymce-plugin-factory', 'tinymce-dialog-result-handler', 'koco-dialoger'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('tinymce-plugin-factory'), require('tinymce-dialog-result-handler'), require('koco-dialoger'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.tinymcePluginFactory, global.tinymceDialogResultHandler, global.kocoDialoger);
        global.tinymceDialogFactory = mod.exports;
    }
})(this, function (exports, _tinymcePluginFactory, _tinymceDialogResultHandler, _kocoDialoger) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _tinymcePluginFactory2 = _interopRequireDefault(_tinymcePluginFactory);

    var _tinymceDialogResultHandler2 = _interopRequireDefault(_tinymceDialogResultHandler);

    var _kocoDialoger2 = _interopRequireDefault(_kocoDialoger);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    exports.default = {
        createMcePlugin: createMcePlugin
    };


    //Pour simplifier l'implémentation, on assume que le caller
    //ne garde pas de référence à pluginConfig.
    function createMcePlugin(pluginConfig) {
        return _tinymcePluginFactory2.default.createMcePlugin(pluginConfig, mceCommand);

        function mceCommand(ed) {
            var dialogResultHandler = new _tinymceDialogResultHandler2.default(ed);

            _kocoDialoger2.default.show(pluginConfig.dialog, pluginConfig.fromMarkupToDialogInput(ed)).then(function (dialogResult) {
                if (dialogResult) {
                    var markup = pluginConfig.fromDialogResultToMarkup(dialogResult);
                    dialogResultHandler.replaceElement(markup);
                }
            });
        }
    }
});