// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

define(['tinymce-utilities'],
    function(tinymceUtilities) {
        'use strict';

        var SelectionMemento = function(editor) {
            this.editor = editor;
            this.selection = tinymceUtilities.getCurrentSelectionRange(editor);
        };

        SelectionMemento.prototype.restore = function() {
            this.editor.selection.setRng(this.selection);
        };

        return SelectionMemento;
    });
