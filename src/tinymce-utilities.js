define(['jquery', 'url-utilities', 'tinymce'],
    function($, urls, tinyMCE) {
        'use strict';

        var TinymceUtilities = function TinymceUtilities() {};

        TinymceUtilities.prototype.clearContentFromTinymceSpecificMarkup = function(text) {
            var $buffer = $('<div>');
            $buffer.html(text);
            $buffer.find('.articleBody').removeClass('articleBody');
            $buffer.find('.first').removeClass('first');
            $buffer.find('[itemprop]').removeAttr('itemprop');
            $buffer.find('*[class=""]').removeAttr('class');

            var result = $buffer.html();

            return result;
        };

        TinymceUtilities.prototype.cleanTinymceMarkup = function(tinymceMarkup, $buffer) {
            if (tinymceMarkup === '&nbsp;') { //bugfix IE10
                return '';
            }

            $buffer.html(tinymceMarkup);
            removeAllClassesRelatedToNonEditablePlugin($buffer);
            replaceQuotes($buffer);
            replaceFakeSpans($buffer);
            replaceNonBreakingSpaces($buffer);

            return normalizeQuotesWithNonBreakingSpaces($buffer.html());
        };

        function removeAllClassesRelatedToNonEditablePlugin($buffer) {
            $buffer.find('.mceNonEditable').removeClass('mceNonEditable');
            $buffer.find('.mceEditable').removeClass('mceEditable');
        }

        function replaceQuotes($buffer) {
            $buffer.find('blockquote')
                .each(function() {
                    var blockquote = $(this);
                    var quote = blockquote.find('> p');
                    if (!quote.length) {
                        blockquote.prepend('<p></p>');
                    } else if (quote.first().html() === 'n/a') {
                        quote.first().html('');
                    }
                });

            $buffer.find('blockquote > footer > p:first-child')
                .each(function() {
                    replaceTag(this, '<span>');
                });
        }

        function replaceFakeSpans($buffer) {
            $buffer.find('.fakespan')
                .removeClass('fakespan')
                .each(function() {
                    replaceTag(this, '<span>');
                });
        }

        function replaceNonBreakingSpaces($buffer) {
            $buffer.find('.nonbreaking').replaceWith('&nbsp;');
        }

        function normalizeQuotesWithNonBreakingSpaces(html) {
            return html
                .replace(/(«|&laquo;)(\s|&nbsp;)*/g, '&laquo;&nbsp;')
                .replace(/(\s|&nbsp;)*(»|&raquo;)/g, '&nbsp;&raquo;');
        }

        TinymceUtilities.prototype.toTinymceMarkup = function(rawMarkup, editor) {
            var $buffer = $('<div>');
            var markup = rawMarkup.replace(/&nbsp;/gi, '<img data-nonbreaking src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" class="nonbreaking' +
                ((!editor.plugins.advvisualchars || !editor.plugins.advvisualchars.state) ? ' hidden' : '') + '"/>');

            $buffer.html(markup);
            $buffer.find('figure, blockquote')
                .addClass('mceNonEditable');
            $buffer.find('blockquote > p')
                .addClass('mceEditable')
                .each(allowEditingEmptyQuote);
            $buffer.find('blockquote > footer > span')
                .addClass('mceEditable')
                .each(function() {
                    //les span empêchent le plugin tinymce/noneditable de fonctionner correctement
                    replaceTag(this, '<p>');
                });

            $buffer.find('figcaption span')
                .addClass('fakespan')
                .each(function() {
                    replaceTag(this, '<div>');
                });

            return $buffer.html();
        };

        function allowEditingEmptyQuote() {
            if (!this.innerHTML || this.innerHTML.match(/$\s*^/m)) {
                this.innerHTML = 'n/a';
            }
        }

        function replaceTag(currentElem, newTagObj) {
            var $currentElem = $(currentElem);
            var $newTag = $(newTagObj).clone();
            var newTag = $newTag[0];

            newTag.className = currentElem.className;
            $.each($currentElem.prop('attributes'), function() {
                $newTag.attr(this.name, this.value);
            });

            $currentElem.wrapAll($newTag);
            $currentElem.contents().unwrap();
        }

        TinymceUtilities.prototype.isInternetExplorer = function() {
            return tinyMCE.isIE;
        };

        TinymceUtilities.prototype.isInternetExplorerLessThan9 = function() {
            return tinyMCE.isIE8 || tinyMCE.isIE7 || tinyMCE.isIE6;
        };

        return new TinymceUtilities();
    });
