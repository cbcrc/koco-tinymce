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
        title: 'html-snippet.desc',
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
        var markup = '<figure class="snippet mceNonEditable" data-html-snippet-id="' + dialogResult.snippetId + '">';
        markup += '<div class="placeholder">' + dialogResult.snippetBody + '&nbsp;</div>';
        markup += '</figure>';

        return markup;
    }

    function fromMarkupToDialogInput(ed) {
        var $figure = (0, _jquery2.default)(ed.selection.getNode()).closest('figure.snippet');
        var snippetId = $figure.attr('data-html-snippet-id') || 0;

        var markup = $figure.find('.placeholder > .sandbox').attr('srcdoc') || '';
        var snippetBody = markup.replace(/^(&nbsp;)+/gi, '').replace(/(&nbsp;)+$/gi, '').replace(/mce-text\//gi, 'text/').replace(/data-mce-src="[^"]*"/gi, '').replace(/((?!(\n)).|^)<(?!!\[CDATA\[)/gi, '$1\n<') // < not preceded by new line and not followed by ![CDATA[
        .replace(/^\n</i, '<');

        return {
            isPredefinedSnippetsShown: true,
            snippetBody: snippetBody,
            snippetId: snippetId
        };
    }
});