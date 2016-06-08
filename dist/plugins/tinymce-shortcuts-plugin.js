(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'jquery', 'koco-url-utilities', 'tinymce-plugin-factory', 'koco-dialoger'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('jquery'), require('koco-url-utilities'), require('tinymce-plugin-factory'), require('koco-dialoger'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.jquery, global.kocoUrlUtilities, global.tinymcePluginFactory, global.kocoDialoger);
        global.tinymceShortcutsPlugin = mod.exports;
    }
})(this, function (exports, _jquery, _kocoUrlUtilities, _tinymcePluginFactory, _kocoDialoger) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _jquery2 = _interopRequireDefault(_jquery);

    var _kocoUrlUtilities2 = _interopRequireDefault(_kocoUrlUtilities);

    var _tinymcePluginFactory2 = _interopRequireDefault(_tinymcePluginFactory);

    var _kocoDialoger2 = _interopRequireDefault(_kocoDialoger);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    exports.default = _tinymcePluginFactory2.default.createMcePlugin({
        pluginName: 'shortcuts',
        title: 'Raccourcis clavier',
        image: _kocoUrlUtilities2.default.url('/images/question.png'),
        pluginInfo: {
            longname: 'Shortcuts plugin',
            author: 'Plate-forme',
            version: '1.0'
        }
    }, function () {
        _kocoDialoger2.default.show('help-shortcuts');
    });
});