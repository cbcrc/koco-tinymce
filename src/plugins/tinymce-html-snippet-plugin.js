// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

define([
        'jquery',
        'url-utilities',
        'tinymce-dialog-factory'
    ],
    function($, urls, mceDialogFactory) {
        'use strict';

        return mceDialogFactory.createMcePlugin({
            pluginName: 'htmlSnippet',
            title: 'Ins\u00e9rer un fragment de code HTML',
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
            var markup = '<figure class="snippet mceNonEditable">';
            markup += '<div class="placeholder">' + dialogResult.snippetBody + '&nbsp;</div>';
            markup += '</figure>';

            return markup;
        }

        function fromMarkupToDialogInput(ed) {
            var $figure = $(ed.selection.getNode()).closest('figure.snippet'),
                markup = '';

            if ($figure.length > 0) {
                markup = $figure.find('.placeholder').length > 0 ? $figure.find('.placeholder').html() : '';
            }

            var snippetBody = markup
                .replace(/^(&nbsp;)+/gi, '')
                .replace(/(&nbsp;)+$/gi, '')
                .replace(/mce-text\//gi, 'text/')
                .replace(/data-mce-src="[^"]*"/gi, '');

            snippetBody = snippetBody.replace(/</gi, '\n<');
            snippetBody = snippetBody.replace(/^\n</i, '<');

            return {
                isPredefinedSnippetsShown: true,
                snippetBody: snippetBody
            };
        }
    });
