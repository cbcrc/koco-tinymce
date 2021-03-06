// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import $ from 'jquery';
import urls from 'koco-url-utilities';
import mceDialogFactory from 'tinymce-dialog-factory';


export default mceDialogFactory.createMcePlugin({
    pluginName: 'linkCustom',
    title: 'advlink.link_desc',
    image: urls.url('/images/link.png'),
    pluginInfo: {
        longname: 'Hyperlien',
        author: 'Plate-forme',
        version: '1.0'
    },
    fromDialogResultToMarkup: fromDialogResultToMarkup,
    fromMarkupToDialogInput: fromMarkupToDialogInput,
    dialog: 'link'
});

function fromDialogResultToMarkup(dialogResult) {
    var $buffer = $('<div>');
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
        var $node = $(node);

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
        var $content = $(jQuerySelectorEscape(content));

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
