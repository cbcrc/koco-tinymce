(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'tinymce-button-toggler', 'tinymce'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('tinymce-button-toggler'), require('tinymce'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.tinymceButtonToggler, global.tinymce);
        global.tinymceButtonTogglerPlugin = mod.exports;
    }
})(this, function (exports, _tinymceButtonToggler, _tinymce) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _tinymceButtonToggler2 = _interopRequireDefault(_tinymceButtonToggler);

    var _tinymce2 = _interopRequireDefault(_tinymce);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    // Copyright (c) CBC/Radio-Canada. All rights reserved.
    // Licensed under the MIT license. See LICENSE file in the project root for full license information.

    var buttonTogglerPlugin = {
        getInfo: function getInfo() {
            return {
                longname: 'Button Toggler',
                author: 'Radio-Canada',
                version: '1.1'
            };
        },

        //TODO: Refactoring (memory leak?..) - mettre l'instance sur l'éditeur pour qu'elle soit supprimer avec l'éditeur
        init: function init(ed) {
            new _tinymceButtonToggler2.default(ed);
        }
    };

    exports.default = {
        init: function init() {
            _tinymce2.default.create('tinymce.plugins.ButtonTogglerPlugin', buttonTogglerPlugin);
            _tinymce2.default.PluginManager.add('buttonToggler', _tinymce2.default.plugins.ButtonTogglerPlugin);
        }
    };
});