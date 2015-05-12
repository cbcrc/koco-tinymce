// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

define(['jquery'],
    function($) {
        'use strict';

        return {
            //Les buttons qui ont leur propres mécanisme d'activation ne peuvent être gérés par le buttonToggler
            notManagedButtons: ['code', 'visualchars', 'visualblocks', 'pastetext'],
            zones: [{
                name: 'bullist',
                enabledButtons: ['bold', 'italic', 'bullist', 'linkCustom', 'unlink', 'anchor', 'nonbreaking', 'br'],
                activeButtons: ['bullist'],
                inZoneSelector: 'ul'
            }, {
                name: 'numlist',
                enabledButtons: ['bold', 'italic', 'numlist', 'linkCustom', 'unlink', 'anchor', 'nonbreaking', 'br'],
                activeButtons: ['numlist'],
                inZoneSelector: 'ol'
            }, {
                name: 'blockquoteAuthor',
                enabledButtons: [],
                activeButtons: [],
                inZoneSelector: 'blockquote > footer'
            }, {
                name: 'blockquote',
                enabledButtons: ['bold', 'italic', 'linkCustom', 'unlink', 'anchor', 'nonbreaking', 'br'],
                activeButtons: [],
                inZoneSelector: 'blockquote'
            }, {
                name: 'framed',
                enabledButtons: ['bold', 'italic', 'linkCustom', 'unlink', 'anchor', 'nonbreaking', 'framed', 'bullist', 'numlist', 'nonbreaking', 'br'],
                activeButtons: ['framed'],
                inZoneSelector: 'div.framed'
            }, {
                name: 'linkCustom',
                enabledButtons: [
                    'bold', 'italic', 'linkCustom', 'unlink', 'anchor', 'nonbreaking', 'quote', 'framed',
                    'bullist', 'numlist', 'nonbreaking', 'images', 'br', 'hr'
                ],
                activeButtons: ['linkCustom', 'unlink'],
                inZoneSelector: 'a'
            }],

            shortcuts: {
                bold: ['ctrl+b', 'bold_desc', 'Bold'],
                italic: ['ctrl+i', 'italic_desc', 'Italic'],
                linkCustom: ['ctrl+k', 'link_desc', 'mceLinkCustom'],
                unlink: ['ctrl+shift+k', 'unlink_desc', 'unlink']
            },

            additionalNodeChangeCallbacks: [{
                buttonName: 'framed',
                callback: function(controlManager, content, node) {
                    if (controlManager.get('framed')) {
                        var $closestFigureOrBlockquote = $(node).closest('figure, blockquote');
                        var $unauthorizedElements = $('<div>').append(content).find('figure, blockquote, .framed, hr');
                        var $closestFrame = $(node).closest('.framed');
                        controlManager.setDisabled('framed', ($closestFrame.length == 0 && content.length == 0) || ($unauthorizedElements.length > 0 && $closestFrame.length == 0) || $closestFigureOrBlockquote.length > 0);
                        controlManager.setActive('framed', $closestFrame.length > 0);
                    }
                }
            }, {
                buttonName: 'quote',
                callback: function(controlManager, content, node) {
                    if (controlManager.get('quote')) {
                        var $closest = $(node).closest('figure, blockquote, li, .framed');
                        var $found = $('<div>').append(content).find('figure, blockquote, li, .framed');
                        controlManager.setDisabled('quote', $closest.length > 0 || $found.length > 0);
                    }
                }
            }, {
                buttonName: 'numlist',
                callback: function(controlManager, content, node) {
                    if (controlManager.get('numlist')) {
                        var $closest = $(node).closest('figure, blockquote');
                        var $found = $('<div>').append(content).find('figure, blockquote');
                        controlManager.setDisabled('numlist', $closest.length > 0 || $found.length > 0);
                    }
                }
            }, {
                buttonName: 'bullist',
                callback: function(controlManager, content, node) {
                    if (controlManager.get('bullist')) {
                        var $closest = $(node).closest('figure, blockquote');
                        var $found = $('<div>').append(content).find('figure, blockquote');
                        controlManager.setDisabled('bullist', $closest.length > 0 || $found.length > 0);
                    }
                }
            }]
        };
    });
