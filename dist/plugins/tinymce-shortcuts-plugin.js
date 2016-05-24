'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _urlUtilities = require('url-utilities');

var _urlUtilities2 = _interopRequireDefault(_urlUtilities);

var _tinymcePluginFactory = require('tinymce-plugin-factory');

var _tinymcePluginFactory2 = _interopRequireDefault(_tinymcePluginFactory);

var _dialoger = require('dialoger');

var _dialoger2 = _interopRequireDefault(_dialoger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

exports.default = _tinymcePluginFactory2.default.createMcePlugin({
    pluginName: 'shortcuts',
    title: 'Raccourcis clavier',
    image: _urlUtilities2.default.url('/images/question.png'),
    pluginInfo: {
        longname: 'Shortcuts plugin',
        author: 'Plate-forme',
        version: '1.0'
    }
}, function () {
    _dialoger2.default.show('help-shortcuts');
});