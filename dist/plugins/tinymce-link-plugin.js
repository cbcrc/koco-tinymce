'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _urlUtilities = require('url-utilities');

var _urlUtilities2 = _interopRequireDefault(_urlUtilities);

var _tinymceDialogFactory = require('tinymce-dialog-factory');

var _tinymceDialogFactory2 = _interopRequireDefault(_tinymceDialogFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _tinymceDialogFactory2.default.createMcePlugin({
    pluginName: 'linkCustom',
    title: 'Insérer/éditer un hyperlien',
    image: _urlUtilities2.default.url('/images/link.png'),
    pluginInfo: {
        longname: 'Hyperlien',
        author: 'Plate-forme',
        version: '1.0'
    },
    fromDialogResultToMarkup: fromDialogResultToMarkup,
    fromMarkupToDialogInput: fromMarkupToDialogInput,
    dialog: 'link'
}); // Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

function fromDialogResultToMarkup(dialogResult) {
    var $buffer = (0, _jquery2.default)('<div>');
    $buffer.html(dialogResult.title);
    $buffer.find('.nonbreaking').replaceWith('&nbsp;');

    var a = document.createElement('a');
    a.title = $buffer.html();
    a.innerHTML = dialogResult.text;
    a.href = dialogResult.url;

    return a.outerHTML;
}

function fromMarkupToDialogInput(ed) {
    var node = ed.selection.getNode();
    var dialogInput = {
        title: '',
        text: '',
        url: ''
    };

    if (node) {
        var $node = (0, _jquery2.default)(node);

        if (!$node.is('a')) {
            var $a = $node.closest('a');

            if ($a.length === 1) {
                $node = $a;
            }
        }

        if (!$node.is('a') && $node.is('p')) {
            var firstChild = $node.first();

            if (firstChild && firstChild.is('a') && firstChild.clone().wrap('<div>').parent().html() === $node.html()) {
                $node = firstChild[0];
            } else {
                dialogInput.text = getContent(ed);

                return dialogInput;
            }
        }

        if ($node.is('a')) {
            dialogInput.url = $node.attr('href');
            dialogInput.title = $node.attr('title');
        }

        dialogInput.text = $node.html();
        ed.selection.select($node[0]);
    }

    return dialogInput;
}

function getContent(ed) {
    var content = ed.selection.getContent();

    if (content) {
        var $content = (0, _jquery2.default)(jQuerySelectorEscape(content));

        /* Bug IE8 */
        if ($content.length === 1 && $content[0].nodeName === 'P') {
            content = $content[0].innerHTML;
        }
    }

    return content;
}

function jQuerySelectorEscape(str) {
    if (!str) {
        return '';
    }

    return str.replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~]/g, '\\$&');
}