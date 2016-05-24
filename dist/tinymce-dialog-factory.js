'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tinymcePluginFactory = require('tinymce-plugin-factory');

var _tinymcePluginFactory2 = _interopRequireDefault(_tinymcePluginFactory);

var _tinymceDialogResultHandler = require('tinymce-dialog-result-handler');

var _tinymceDialogResultHandler2 = _interopRequireDefault(_tinymceDialogResultHandler);

var _dialoger = require('dialoger');

var _dialoger2 = _interopRequireDefault(_dialoger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    createMcePlugin: createMcePlugin
};

//Pour simplifier l'implémentation, on assume que le caller
//ne garde pas de référence à pluginConfig.
// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

function createMcePlugin(pluginConfig) {
    return _tinymcePluginFactory2.default.createMcePlugin(pluginConfig, mceCommand);

    function mceCommand(ed) {
        var dialogResultHandler = new _tinymceDialogResultHandler2.default(ed);

        _dialoger2.default.show(pluginConfig.dialog, pluginConfig.fromMarkupToDialogInput(ed)).then(function (dialogResult) {
            if (dialogResult) {
                var markup = pluginConfig.fromDialogResultToMarkup(dialogResult);
                dialogResultHandler.replaceElement(markup);
            }
        });
    }
}