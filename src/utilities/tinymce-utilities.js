// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

define(['jquery', 'url-utilities', 'tinymce'],
    function($, urls, tinyMCE) {
        'use strict';

        var TinymceUtilities = function TinymceUtilities() {};

        TinymceUtilities.prototype.clearContentFromTinyMceSpecificMarkup = function(text) {
            var $buffer = $('<div>');
            $buffer.html(text);
            $buffer.find('.articleBody').removeClass('articleBody');
            $buffer.find('.first').removeClass('first');
            $buffer.find('[itemprop]').removeAttr('itemprop');
            $buffer.find('*[class=""]').removeAttr('class');

            var result = $buffer.html();

            return result;
        };

        TinymceUtilities.prototype.cleanTinyMceMarkup = function(tinyMceMarkup, $buffer) {
            if (tinyMceMarkup === '&nbsp;') { //bugfix IE10
                return '';
            }

            $buffer.html(tinyMceMarkup).find('img.nonbreaking').replaceWith('&nbsp;');

            return $buffer.html();
        };

        TinymceUtilities.prototype.toTinyMceMarkup = function(rawMarkup, editor) {
            var tinyMceMarkup = rawMarkup;

            //tinyMceMarkup = tinyMceMarkup.replace(/\r/g, '\n');
            //tinyMceMarkup = tinyMceMarkup.replace(/\r\n/g, '\n');
            //tinyMceMarkup = tinyMceMarkup.replace(/(\t|\n)/g, ' ');
            //tinyMceMarkup = tinyMceMarkup.replace(/<\/p>/gi, ' ');
            //tinyMceMarkup = tinyMceMarkup.replace(/<b(\s+[^>]*)?>/gi, '<strong>');
            //tinyMceMarkup = tinyMceMarkup.replace(/<\/b>/gi, '</strong>');
            //tinyMceMarkup = tinyMceMarkup.replace(/<i(\s+[^>]*)?>/gi, '<em>');
            //tinyMceMarkup = tinyMceMarkup.replace(/<\/i>/gi, '</em>');
            //tinyMceMarkup = tinyMceMarkup.replace(/&#160;/g, "&nbsp;");
            tinyMceMarkup = tinyMceMarkup.replace(/&nbsp;/gi, '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" class="nonbreaking' +
                ((!editor.plugins.advvisualchars || !editor.plugins.advvisualchars.state) ? ' hidden' : '') + '"/>');

            //if (tinyMceMarkup === "&nbsp;") { //bugfix IE10
            //    tinyMceMarkup = '';
            //}

            return tinyMceMarkup;
        };

        TinymceUtilities.prototype.isInternetExplorer = function() {
            return tinyMCE.isIE;
        };

        TinymceUtilities.prototype.isInternetExplorerLessThan9 = function() {
            return tinyMCE.isIE8 || tinyMCE.isIE7 || tinyMCE.isIE6;
        };

        return new TinymceUtilities();
    });
