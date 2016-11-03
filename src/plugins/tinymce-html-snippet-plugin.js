// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import $ from 'jquery';
import urls from 'koco-url-utilities';
import mceDialogFactory from 'tinymce-dialog-factory';


export default mceDialogFactory.createMcePlugin({
    pluginName: 'htmlSnippet',
    title: 'html-snippet.desc',
    image: urls.url('/images/snippet.png'),
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
    var $figure = $(ed.selection.getNode()).closest('figure.snippet');
    var snippetId = $figure.attr('data-html-snippet-id') || 0;

    var markup = $figure.find('.placeholder > .sandbox').attr('srcdoc') || '';
    var snippetBody = markup
        .replace(/^(&nbsp;)+/gi, '')
        .replace(/(&nbsp;)+$/gi, '')
        .replace(/mce-text\//gi, 'text/')
        .replace(/data-mce-src="[^"]*"/gi, '')
        .replace(/((?!(\n)).|^)<(?!!\[CDATA\[)/gi, '$1\n<') // < not preceded by new line and not followed by ![CDATA[
        .replace(/^\n</i, '<');

    return {
        isPredefinedSnippetsShown: true,
        snippetBody: snippetBody,
        snippetId: snippetId
    };
}
