(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'tinymce-dialog-result-handler', 'tinymce'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('tinymce-dialog-result-handler'), require('tinymce'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.tinymceDialogResultHandler, global.tinymce);
        global.tinymcePluginFactory = mod.exports;
    }
})(this, function (exports, _tinymceDialogResultHandler, _tinymce) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _tinymceDialogResultHandler2 = _interopRequireDefault(_tinymceDialogResultHandler);

    var _tinymce2 = _interopRequireDefault(_tinymce);

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
    function createMcePlugin(pluginConfig, mceCommand) {
        var commandName = 'mce' + capitalizeFirstLetter(pluginConfig.pluginName);

        var plugin = {
            init: function init(ed) {
                ed.addCommand(commandName, function () {
                    mceCommand(ed);
                });

                ed.addButton(pluginConfig.pluginName, {
                    //Utiliser les langs pack
                    title: pluginConfig.title,
                    cmd: commandName,
                    image: pluginConfig.image
                });
            },
            createControl: function createControl() {
                return null;
            },
            getInfo: pluginConfig.pluginInfo
        };

        return {
            init: function init() {
                _tinymce2.default.create('tinymce.plugins.' + pluginConfig.pluginName, plugin);
                _tinymce2.default.PluginManager.add(pluginConfig.pluginName, _tinymce2.default.plugins[pluginConfig.pluginName]);
            }
        };
    }

    function capitalizeFirstLetter(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
});