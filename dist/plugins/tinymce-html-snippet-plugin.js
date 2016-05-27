(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'jquery', 'koco-url-utilities', 'tinymce-dialog-factory'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('jquery'), require('koco-url-utilities'), require('tinymce-dialog-factory'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.jquery, global.kocoUrlUtilities, global.tinymceDialogFactory);
        global.tinymceHtmlSnippetPlugin = mod.exports;
    }
})(this, function (exports, _jquery, _kocoUrlUtilities, _tinymceDialogFactory) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _jquery2 = _interopRequireDefault(_jquery);

    var _kocoUrlUtilities2 = _interopRequireDefault(_kocoUrlUtilities);

    var _tinymceDialogFactory2 = _interopRequireDefault(_tinymceDialogFactory);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    exports.default = _tinymceDialogFactory2.default.createMcePlugin({
        pluginName: 'htmlSnippet',
        title: 'Insérer un fragment de code HTML',
        image: _kocoUrlUtilities2.default.url('/images/snippet.png'),
        pluginInfo: {
            longname: 'Html snippet plugin',
            author: 'Plate-forme',
            version: '1.0'
        },
        fromDialogResultToMarkup: fromDialogResultToMarkup,
        fromMarkupToDialogInput: fromMarkupToDialogInput,
        dialog: 'html-snippets'
    });


    function fromDialogResultToMarkup(dialogResult) {
        var markup = '<figure class="snippet mceNonEditable">';
        markup += '<div class="placeholder">' + dialogResult.snippetBody + '&nbsp;</div>';
        markup += '</figure>';

        return markup;
    }

    function fromMarkupToDialogInput(ed) {
        var $figure = (0, _jquery2.default)(ed.selection.getNode()).closest('figure.snippet'),
            markup = '';

        if ($figure.length > 0) {
            markup = $figure.find('.placeholder').length > 0 ? $figure.find('.placeholder').html() : '';
        }

        var snippetBody = markup.replace(/^(&nbsp;)+/gi, '').replace(/(&nbsp;)+$/gi, '').replace(/mce-text\//gi, 'text/').replace(/data-mce-src="[^"]*"/gi, '');

        snippetBody = snippetBody.replace(/</gi, '\n<');
        snippetBody = snippetBody.replace(/^\n</i, '<');

        return {
            isPredefinedSnippetsShown: true,
            snippetBody: snippetBody
        };
    }
});