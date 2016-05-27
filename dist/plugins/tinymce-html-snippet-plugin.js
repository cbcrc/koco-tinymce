'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _kocoUrlUtilities = require('koco-url-utilities');

var _kocoUrlUtilities2 = _interopRequireDefault(_kocoUrlUtilities);

var _tinymceDialogFactory = require('tinymce-dialog-factory');

var _tinymceDialogFactory2 = _interopRequireDefault(_tinymceDialogFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
}); // Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

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