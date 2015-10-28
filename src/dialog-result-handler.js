// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

define(['jquery', 'tinymce-utilities', 'string-utilities'],
    function($, tinymceUtilities, stringUtilities) {
        'use strict';

        var DialogResultHandler = function(editor) {
            this.editor = editor;
        };

        DialogResultHandler.prototype.replaceElement = function(markup) {
            if (!markup) {
                return;
            }

            var selectedNode = getCurrentNodeOrClosestFigure(this.editor);
            var newElement = tinymceUtilities.toTinyMceMarkup(markup, this.editor);
            replaceElement(this.editor, selectedNode, newElement);
        };

        function getCurrentNodeOrClosestFigure(editor) {
            var currentNode = editor.selection.getNode();
            var closestFigure = editor.dom.getParent(currentNode, 'figure');

            return closestFigure ? closestFigure : currentNode;
        }

        function replaceElement(editor, selectedNode, newElement) {
            if (isFigure(selectedNode)) {
                var div = document.createElement('div');
                div.innerHTML = newElement;
                var newNode = div.firstChild;

                editor.dom.replace(newNode, selectedNode);
                // DOM replace doesn't trigger the onChange event, we need to trigger it manually
                editor.onChange.dispatch(editor, newNode, editor.undoManager);
            } else {
                editor.execCommand('mceInsertContent', false, newElement);
            }
        }

        function isFigure(element) {
            return element ? stringUtilities.caseInsensitiveCmp(element.tagName, 'figure') : false;
        }

        return DialogResultHandler;
    });
