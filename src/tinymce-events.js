// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

//Tenter de ne pas utiliser tinymce.activeEditor et utiliser la reference a l'éditeur passer en arg
import $ from 'jquery';
import urls from 'url-utilities';
import tinyMCE from 'tinymce';
import rangy from 'rangy';


//todo: document cette fonction - briser en plus petit morceaux
function pastePreprocess(pl, o) {
    var selectedNode = pl.editor.selection.getNode();
    var $closestQuote = $(selectedNode).closest('.quote.mceEditable');
    var $closestAuthor = $(selectedNode).closest('.name.mceEditable');

    if ($closestQuote.length > 0 || $closestAuthor.length > 0) {
        var lines = [];
        var $buffer = $('<div>').append(o.content);
        $buffer.find('p').each(function(i, p) {
            lines.push($closestAuthor.length > 0 ? $(p).text() : $(p).html());
        });

        if ($closestQuote.length > 0) {
            o.content = lines.length > 0 ? lines.join('<br /><br />') : $buffer.text();
            $closestQuote.html(o.content);
        } else {
            $buffer.find('br').replaceWith(' ');
            o.content = lines.length > 0 ? lines.join(' ') : $buffer.text();
            $closestAuthor.html(o.content);
        }

        o.content = '';
    } else {
        o.content = o.content
            //.replace(/&#160;/g, '&nbsp;')
            .replace(/&nbsp;/gi, '<img data-nonbreaking src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" class="nonbreaking' +
                ((!pl.editor.plugins.advvisualchars || !pl.editor.plugins.advvisualchars.state) ? ' hidden' : '') +
                '"/>');
    }
}

function handleNonEditableExitKeys(e) {
    var selectedNode = tinyMCE.activeEditor.selection.getNode(),
        $closestNonEditableElement,
        $selectedNode = $(selectedNode);

    if (e.type.toLowerCase() !== 'keydown') {
        return true;
    }

    // Handle ENTER
    if (e.keyCode === 13 && !e.shiftKey) {
        $closestNonEditableElement = $selectedNode.closest('blockquote, figure');
        if ($closestNonEditableElement.length > 0) {
            var emptyBlock;
            if (e.ctrlKey) {
                $closestNonEditableElement.before(getEmptyBlockContent());
                emptyBlock = $closestNonEditableElement.prev()[0];
                selectElement(emptyBlock);
            } else {
                $closestNonEditableElement.after(getEmptyBlockContent());
                emptyBlock = $closestNonEditableElement.next()[0];

                if ($('html').hasClass('lt-ie9')) {
                    selectElementWorkaroundElementAfterIeVersionLt9(emptyBlock);
                } else {
                    selectElement(emptyBlock);
                }
            }
            return false;
        }
    }
    // Handle DELETE and BACKSPACE
    else if (e.keyCode === 8 || e.keyCode === 46) {
        $closestNonEditableElement = $selectedNode.closest('figure');

        if ($closestNonEditableElement.length > 0) {
            tinyMCE.activeEditor.dom.remove($closestNonEditableElement);
            try {
                tinyMCE.UndoManager.add();
            } catch (e) {}
            return false;
        } else if (tinyMCE.isIE8) {
            var $previousNode = $selectedNode.prev();

            if ($previousNode.is('blockquote, figure')) {
                var iFrameWindow = getIframeWindow(tinyMCE.activeEditor.id + '_ifr');
                var select = rangy.getSelection(iFrameWindow);
                var selRange = select.getRangeAt(0);

                if (selRange.textRange.text.length === 0 && selRange.textRange.htmlText.length === 0) {
                    var nonEditable = $previousNode[0];

                    // Check the caret is located after the non-editable element
                    var range = rangy.createRange(iFrameWindow.document);
                    range.collapseAfter(nonEditable);

                    if (selRange.compareBoundaryPoints(range.START_TO_END, range) != -1) {
                        // Check whether there is any text between the caret and the
                        // non-editable element. If not, delete the element and move
                        // the caret to where it had been
                        range.setEnd(selRange.startContainer, selRange.startOffset);

                        if (range.toString() === '') {
                            tinyMCE.activeEditor.dom.remove($previousNode);
                            try {
                                tinyMCE.UndoManager.add();
                            } catch (e) {}
                            return false;
                        }
                    }
                }
            }
        }
    }

    return true;

    function getIframeWindow(iFrameId) {
        var iframe = document.getElementById(iFrameId);
        return iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument.defaultView;
    }

    //IE version < 9 ne supporte pas bien les W3C range
    //De plus, après efforts significatifs, pas de résultats suffisants avec les TextRange utilisés par ces version de IE.
    //Solution: utiliser le mode compatible avec W3C et compatibilité
    //Toutefois, le mode compatible avec W3C ne fonctionne pas bien lorsque l'élément est inséré après le NonEditableElement.
    //Pour contourner le problème, positionner le curseur après l'espace et supprimer l'espace par la suite

    function selectElementWorkaroundElementAfterIeVersionLt9(el) {
        var rng = tinyMCE.activeEditor.selection.getRng(true); //true:Forces a compatible W3C range on IE.
        rng.setStart(el.childNodes[0], 1);
        rng.setEnd(el.childNodes[0], 2);
        tinyMCE.activeEditor.selection.setRng(rng);
        el.innerHTML = '';
    }

    function selectElement(el) {
        var rng = tinyMCE.activeEditor.selection.getRng(true); //true:Forces a compatible W3C range on IE.
        rng.selectNodeContents(el);
        tinyMCE.activeEditor.selection.setRng(rng);
    }

    function getEmptyBlockContent() {
        return '<p>&nbsp;</p>'; //&nbsp; requis pour la sélection ( Chrome et IE version < 9)
    }
}

function nodeChanged(editorId /*, node, undoIndex, undoLevels, visualAid, anySelection*/ ) {
    //Récupérer le contenu du iframe
    var $contents = $('#' + editorId + '_ifr').contents();

    //OnlyFirstElementAsFirst
    $contents.find('.first').removeClass('first');
    $contents.find('body > *:first-child').addClass('first');

    //Ajouter les microdonnées
    $contents.find('body > p, body > ul, body > ol, body > .framed, body > blockquote')
        .addClass('articleBody')
        .attr('itemprop', 'articleBody');

    //Retirer les microdonnées sur les éléments contenus dans un encadré
    $contents.find('.framed > p, .framed > ul, .framed > ol, blockquote > p')
        .removeClass('articleBody')
        .removeAttr('itemprop');

    return false; // Pass to next handler in chain
}

function openMediaEditor(ed /*, evt*/ ) {
    //Double-clic sur un média ouvre la fenêtre d'édition associée.
    var selectedNode = ed.selection.getNode();

    if (tinyMCE.isIE8 && selectedNode.nodeName === 'BODY' && $(selectedNode).children().length > 0) {
        selectedNode = $(selectedNode).children().get(0);
    }

    var $closestFigure = $(selectedNode).closest('figure');

    //TODO: les css classes embed et snippet semble manquer selon Visual Studio
    if ($closestFigure.length > 0) {
        if ($closestFigure.hasClass('image')) {
            ed.execCommand('mceImages', false);
        } else if ($closestFigure.hasClass('gallery')) {
            ed.execCommand('mcePhotoAlbum', false);
        } else if ($closestFigure.hasClass('medianet')) {
            ed.execCommand('mceMedianet', false);
        } else if ($closestFigure.hasClass('embed')) {
            ed.execCommand('mceExternalMultimediaContent', false);
        } else if ($closestFigure.hasClass('snippet')) {
            ed.execCommand('mceHtmlSnippet', false);
        }
    }
}

var tool = {
    pastePreprocess: pastePreprocess,
    handleNonEditableExitKeys: handleNonEditableExitKeys,
    nodeChanged: nodeChanged,
    openMediaEditor: openMediaEditor
};

export default tool;
