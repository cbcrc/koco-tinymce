(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'jquery', 'koco-url-utilities', 'tinymce'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('jquery'), require('koco-url-utilities'), require('tinymce'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.jquery, global.kocoUrlUtilities, global.tinymce);
        global.tinymceUtilities = mod.exports;
    }
})(this, function (exports, _jquery, _kocoUrlUtilities, _tinymce) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _jquery2 = _interopRequireDefault(_jquery);

    var _kocoUrlUtilities2 = _interopRequireDefault(_kocoUrlUtilities);

    var _tinymce2 = _interopRequireDefault(_tinymce);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var TinymceUtilities = function TinymceUtilities() {};

    TinymceUtilities.prototype.clearContentFromTinymceSpecificMarkup = function (text) {
        var $buffer = (0, _jquery2.default)('<div>');
        $buffer.html(text);
        $buffer.find('.articleBody').removeClass('articleBody');
        $buffer.find('.first').removeClass('first');
        $buffer.find('[itemprop]').removeAttr('itemprop');
        $buffer.find('*[class=""]').removeAttr('class');

        var result = $buffer.html();

        return result;
    };

    TinymceUtilities.prototype.cleanTinymceMarkup = function (tinymceMarkup, $buffer) {
        if (tinymceMarkup === '&nbsp;') {
            //bugfix IE10
            return '';
        }

        $buffer.html(tinymceMarkup);
        removeAllClassesRelatedToNonEditablePlugin($buffer);
        replaceQuotes($buffer);
        replaceFakeSpans($buffer);
        replaceNonBreakingSpaceImages($buffer);

        return normalizeQuotesWithNonBreakingSpaces($buffer.html());
    };

    function removeAllClassesRelatedToNonEditablePlugin($buffer) {
        $buffer.find('.mceNonEditable').removeClass('mceNonEditable');
        $buffer.find('.mceEditable').removeClass('mceEditable');
    }

    function replaceQuotes($buffer) {
        $buffer.find('blockquote').each(function () {
            var blockquote = (0, _jquery2.default)(this);
            var quote = blockquote.find('> p');
            if (!quote.length) {
                blockquote.prepend('<p></p>');
            } else if (quote.first().html() === 'n/a') {
                quote.first().html('');
            }
        });

        sortByDepthFirst($buffer.find('blockquote > footer > p:first-child')).each(function () {
            replaceTag(this, 'span');
        });
    }

    function replaceFakeSpans($buffer) {
        sortByDepthFirst($buffer.find('.fakespan')).removeClass('fakespan').each(function () {
            replaceTag(this, 'span');
        });
    }

    function replaceNonBreakingSpaceImages($buffer) {
        $buffer.find('.nonbreaking').replaceWith('&nbsp;');
    }

    function normalizeQuotesWithNonBreakingSpaces(html) {
        return html.replace(/(«|&laquo;)(\s|&nbsp;)*/g, '&laquo;&nbsp;').replace(/(\s|&nbsp;)*(»|&raquo;)/g, '&nbsp;&raquo;');
    }

    function sortByDepthFirst($elements) {
        var elementsAndDepth = $elements.map(function () {
            return {
                depth: (0, _jquery2.default)(this).parents().length,
                element: this
            };
        }).get();

        elementsAndDepth.sort(function (a, b) {
            return b.depth - a.depth;
        });

        var result = elementsAndDepth.map(function (elementAndDepth) {
            return elementAndDepth.element;
        });

        return (0, _jquery2.default)(result);
    }

    TinymceUtilities.prototype.toTinymceMarkup = function (markup, editor) {
        var $buffer = (0, _jquery2.default)('<div>').html(markup);

        replaceNonBreakingSpaces($buffer, editor);

        $buffer.find('figure, blockquote').addClass('mceNonEditable');
        $buffer.find('blockquote > p').addClass('mceEditable').each(allowEditingEmptyQuote);
        sortByDepthFirst($buffer.find('blockquote > footer > span')).addClass('mceEditable').each(function () {
            //les span empêchent le plugin tinymce/noneditable de fonctionner correctement
            replaceTag(this, 'p');
        });

        sortByDepthFirst($buffer.find('figcaption span')).addClass('fakespan').each(function () {
            replaceTag(this, 'div');
        });

        return $buffer.html();
    };

    function replaceNonBreakingSpaces($buffer, editor) {
        var nonBreakingSpace = /(?:&nbsp;|\u00a0)/;
        var nonBreakingSpaceImage = '<img data-nonbreaking src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" class="nonbreaking' + (!editor.plugins.advvisualchars || !editor.plugins.advvisualchars.state ? ' hidden' : '') + '" />';

        var textNodesWithNonBreakingSpaces = $buffer.find(':not(iframe)').addBack().contents().filter(function () {
            return this.nodeType === 3 && nonBreakingSpace.test(this.textContent);
        });

        textNodesWithNonBreakingSpaces.each(function () {
            var textParts = this.textContent.split(nonBreakingSpace);

            var buffer = (0, _jquery2.default)('<div>');
            for (var i = 0; i < textParts.length; ++i) {
                // We have to do this to parse out user-entered HTML
                buffer.append(document.createTextNode(textParts[i]));

                if (i + 1 !== textParts.length) {
                    buffer.append(nonBreakingSpaceImage);
                }
            }

            (0, _jquery2.default)(this).replaceWith(buffer.contents());
        });
    }

    function allowEditingEmptyQuote() {
        if (!this.innerHTML || this.innerHTML.match(/$\s*^/m)) {
            this.innerHTML = 'n/a';
        }
    }

    function replaceTag(element, newTagName) {
        var newElement = document.createElement(newTagName);
        newElement.className = element.className;
        newElement.innerHTML = element.innerHTML;
        for (var i = element.attributes.length - 1; i >= 0; i--) {
            var attr = element.attributes[i];
            newElement.setAttribute(attr.nodeName, attr.nodeValue);
        }

        element.parentNode.insertBefore(newElement, element);
        element.parentNode.removeChild(element);
    }

    TinymceUtilities.prototype.isInternetExplorer = function () {
        return _tinymce2.default.isIE;
    };

    TinymceUtilities.prototype.isInternetExplorerLessThan9 = function () {
        return _tinymce2.default.isIE8 || _tinymce2.default.isIE7 || _tinymce2.default.isIE6;
    };

    exports.default = new TinymceUtilities();
});