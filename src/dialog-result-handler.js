// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

define(['jquery', 'tinymce-utilities', 'string-utilities', './selection-memento', './transcient-scope'],
    function($, tinymceUtilities, stringUtilities, SelectionMemento, TransientScope) {
        'use strict';

        var DialogResultHandler = function(editor) {
            this.editor = editor;
        };

        // *** Not Internet Explorer ***
        DialogResultHandler.prototype.getOnResultHandler_NotInternetExplorer = function() {
            var that = this;

            return function(result) {
                var selectedNode;

                if (result) {
                    result = tinymceUtilities.toTinyMceMarkup(result, that.editor);
                    selectedNode = that.getCurrentNodeOrClosestFigure();
                    that.replaceElement(selectedNode, result);
                }
            };
        };

        // *** Internet Explorer ***
        DialogResultHandler.prototype.getOnResultHandler_InternetExplorer = function() {
            var selectedNode = this.getCurrentNodeOrClosestFigure();
            var selectionMemento = new SelectionMemento(this.editor);
            var that = this;

            return function(result) {
                if (result) {
                    result = tinymceUtilities.toTinyMceMarkup(result, that.editor);

                    if (selectedNode.nodeName === 'BODY') {
                        that.editor.execCommand('mceInsertContent', false, result);
                    } else {
                        that.replaceElement_InternetExplorer(selectedNode, selectionMemento, result);
                    }
                } else { //Si dialogue est annulé
                    selectionMemento.restore();
                }
            };
        };

        DialogResultHandler.prototype.replaceElement_InternetExplorer = function(selectedNode, selectionMemento, newElement) {
            var emptyElementBefore = tinymceUtilities.createEmptyBlockBefore(selectedNode);
            var emptyElementAfter = tinymceUtilities.createEmptyBlockAfter(selectedNode);
            var transientScope = new TransientScope(this.editor);

            transientScope.add(emptyElementBefore);
            transientScope.add(emptyElementAfter);

            //Important: Ne pas restaurer la sélection avant l'ajout des block vides autour de la figure
            this.setSelectionBeforeReplaceElement(selectedNode, selectionMemento);
            this.replaceElement(selectedNode, newElement);

            transientScope.deleteAll();

            this.avoidTwoFiguresOneAfterTheOther_IfInternetExplorer_LessThan9();
        };

        DialogResultHandler.prototype.setSelectionBeforeReplaceElement = function(selectedNode, selectionMemento) {
            if (this.isFigure(selectedNode)) {
                this.limitSelectionToFigure(selectedNode);
            } else {
                selectionMemento.restore();
            }
        };

        DialogResultHandler.prototype.limitSelectionToFigure = function(selectedNode) {
            this.selectElement(selectedNode);
        };

        DialogResultHandler.prototype.selectElement = function(toSelect) {
            var rng = this.editor.selection.getRng(true); //true:Forces a compatible W3C range on IE version >=9.
            rng.selectNodeContents(toSelect);
            this.editor.selection.setRng(rng);
        };

        DialogResultHandler.prototype.avoidTwoFiguresOneAfterTheOther_IfInternetExplorer_LessThan9 = function() {
            var figureAfterInsertOrEdit;

            if (tinymceUtilities.isInternetExplorerLessThan9()) {
                figureAfterInsertOrEdit = this.getCurrentNodeOrClosestFigure();
                if (this.isFigureBefore(figureAfterInsertOrEdit)) {
                    tinymceUtilities.createEmptyBlockBefore(figureAfterInsertOrEdit);
                }
                if (this.isFigureAfter(figureAfterInsertOrEdit)) {
                    tinymceUtilities.createEmptyBlockAfter(figureAfterInsertOrEdit);
                }
            }
        };

        DialogResultHandler.prototype.isFigureBefore = function(element) {
            var before = $(element).prev()[0];
            return this.isFigure(before);
        };

        DialogResultHandler.prototype.isFigureAfter = function(element) {
            var after = $(element).next()[0];
            return this.isFigure(after);
        };

        // *** Common ***
        DialogResultHandler.prototype.replaceElement = function(selectedNode, newElement) {
            if (this.isFigure(selectedNode)) {
                var div = document.createElement('div');
                div.innerHTML = newElement;
                var newNode = div.firstChild;

                this.editor.dom.replace(newNode, selectedNode);
            } else {
                this.editor.execCommand('mceInsertContent', false, newElement);
            }
        };

        DialogResultHandler.prototype.getCurrentNodeOrClosestFigure = function() {
            var currentNode = this.editor.selection.getNode();
            var closestFigure = this.editor.dom.getParent(currentNode, 'figure');

            return closestFigure ? closestFigure : currentNode;
        };

        DialogResultHandler.prototype.isFigure = function(element) {
            return element ? stringUtilities.caseInsensitiveCmp(element.tagName, 'figure') : false;
        };

        DialogResultHandler.prototype.getOnResultHandler_toBeInvokeBeforeShowingModal = function() {
            if (tinymceUtilities.isInternetExplorer() === false) {
                return this.getOnResultHandler_NotInternetExplorer();
            } else {
                return this.getOnResultHandler_InternetExplorer();
            }
        };

        return DialogResultHandler;
    });
