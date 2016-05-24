'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tinymceDialogResultHandler = require('tinymce-dialog-result-handler');

var _tinymceDialogResultHandler2 = _interopRequireDefault(_tinymceDialogResultHandler);

var _tinymce = require('tinymce');

var _tinymce2 = _interopRequireDefault(_tinymce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

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