// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

define(['jquery'],
    function($) {
        'use strict';

        var uniqueId = 0;

        var TransientScope = function(editor) {
            this.editor = editor;
            this.scopeId = 'transientScope-' + (++uniqueId);
        };

        TransientScope.prototype.add = function(toAdd) {
            $(toAdd).addClass(this.scopeId);
        };

        TransientScope.prototype.deleteAll = function() {
            var i, elementsToDelete, elementToDelete;

            elementsToDelete = this.editor.dom.select('.' + this.scopeId);

            for (i = 0; i < elementsToDelete.length; i++) {
                elementToDelete = elementsToDelete[i];
                this.editor.dom.remove(elementToDelete);
            }
        };

        return TransientScope;
    });
