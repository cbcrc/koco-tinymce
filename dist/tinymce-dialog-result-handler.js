'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _tinymceUtilities = require('tinymce-utilities');

var _tinymceUtilities2 = _interopRequireDefault(_tinymceUtilities);

var _kocoStringUtilities = require('koco-string-utilities');

var _kocoStringUtilities2 = _interopRequireDefault(_kocoStringUtilities);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DialogResultHandler = function DialogResultHandler(editor) {
    this.editor = editor;
}; // Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

DialogResultHandler.prototype.replaceElement = function (markup) {
    if (!markup) {
        return;
    }

    var selectedNode = getCurrentNodeOrClosestFigure(this.editor);
    var newElement = _tinymceUtilities2.default.toTinymceMarkup(markup, this.editor);
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
    return element ? _kocoStringUtilities2.default.caseInsensitiveCmp(element.tagName, 'figure') : false;
}

exports.default = DialogResultHandler;