import $ from 'jquery';
import urls from 'koco-url-utilities';
import tinyMCE from 'tinymce';


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
    replaceNonBreakingSpaceImages($buffer);

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

    sortByDepthFirst($buffer.find('blockquote > footer > p:first-child'))
        .each(function() {
            replaceTag(this, 'span');
        });
}

function replaceFakeSpans($buffer) {
    sortByDepthFirst($buffer.find('.fakespan'))
        .removeClass('fakespan')
        .each(function() {
            replaceTag(this, 'span');
        });
}

function replaceNonBreakingSpaceImages($buffer) {
    $buffer.find('.nonbreaking').replaceWith('&nbsp;');
}

function normalizeQuotesWithNonBreakingSpaces(html) {
    return html
        .replace(/(«|&laquo;)(\s|&nbsp;)*/g, '&laquo;&nbsp;')
        .replace(/(\s|&nbsp;)*(»|&raquo;)/g, '&nbsp;&raquo;');
}

function sortByDepthFirst($elements) {
    var elementsAndDepth = $elements.map(function() {
        return {
            depth: $(this).parents().length,
            element: this
        };
    }).get();

    elementsAndDepth.sort(function(a, b) {
        return b.depth - a.depth;
    });

    var result = elementsAndDepth.map(function(elementAndDepth) {
        return elementAndDepth.element;
    });

    return $(result);
}

TinymceUtilities.prototype.toTinymceMarkup = function(markup, editor) {
    var $buffer = $('<div>').html(markup);

    replaceNonBreakingSpaces($buffer, editor);

    $buffer.find('figure, blockquote')
        .addClass('mceNonEditable');
    $buffer.find('blockquote > p')
        .addClass('mceEditable')
        .each(allowEditingEmptyQuote);
    sortByDepthFirst($buffer.find('blockquote > footer > span'))
        .addClass('mceEditable')
        .each(function() {
            //les span empêchent le plugin tinymce/noneditable de fonctionner correctement
            replaceTag(this, 'p');
        });

    sortByDepthFirst($buffer.find('figcaption span'))
        .addClass('fakespan')
        .each(function() {
            replaceTag(this, 'div');
        });

    return $buffer.html();
};

function replaceNonBreakingSpaces($buffer, editor) {
    var nonBreakingSpace = /(?:&nbsp;|\u00a0)/;
    var nonBreakingSpaceImage = '<img data-nonbreaking src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" class="nonbreaking' +
        ((!editor.plugins.advvisualchars || !editor.plugins.advvisualchars.state) ? ' hidden' : '') + '" />';

    var textNodesWithNonBreakingSpaces = $buffer.find(':not(iframe)').addBack().contents().filter(function() {
        return this.nodeType === 3 && nonBreakingSpace.test(this.textContent);
    });

    textNodesWithNonBreakingSpaces.each(function() {
        var textParts = this.textContent.split(nonBreakingSpace);

        var buffer = $('<div>');
        for (var i = 0; i < textParts.length; ++i) {
            // We have to do this to parse out user-entered HTML
            buffer.append(document.createTextNode(textParts[i]));

            if (i + 1 !== textParts.length) {
                buffer.append(nonBreakingSpaceImage);
            }
        }

        $(this).replaceWith(buffer.contents());
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

TinymceUtilities.prototype.isInternetExplorer = function() {
    return tinyMCE.isIE;
};

TinymceUtilities.prototype.isInternetExplorerLessThan9 = function() {
    return tinyMCE.isIE8 || tinyMCE.isIE7 || tinyMCE.isIE6;
};

export default new TinymceUtilities();
