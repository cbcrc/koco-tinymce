// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

define([
        'jquery',
        'url-utilities',
        'tinymce-dialog-factory'
    ],
    function($, urls, mceDialogFactory) {
        'use strict';

        return mceDialogFactory.createMcePlugin(
            {
                pluginName: 'photoAlbum',
                title: 'Ins\u00e9rer/\u00e9diter un album photos',
                image: urls.url('/images/album.png'),
                pluginInfo: {
                    longname: 'Photo Album plugin',
                    author: 'Plate-forme',
                    version: '1.0'
                },
                fromDialogResultToMarkup: fromDialogResultToMarkup,
                fromMarkupToDialogInput: fromMarkupToDialogInput,
                dialog: 'photo-album'
            }
        );

        function fromDialogResultToMarkup(dialogResult) {
            //stle: review prop value

            //Figure element
            var $photoAlbum = $('<figure>')
                .attr('itemprop', 'associatedMedia')
                .attr('itemscope', 'itemscope')
                .attr('itemtype', 'http://schema.org/MediaObject')
                .attr('itemid', dialogResult.targetId)
                .attr('data-id', dialogResult.targetId)
                //Le plugin fonctionne seulement avec les albumsphotosv2 (data-version=3)
                .attr('data-version', 3)
                .attr('cond', true)
                .attr('data-display', 'galleria')
                .addClass('associatedMedia')
                //Garder la classe gallery pour éviter de modifier
                //les transformations vers le XML de GHTML
                .addClass('gallery')
                .addClass('mceNonEditable');

            var $figcaptionPlaceholder = $('<div>').addClass('placeholder');

            //figcaption element
            var $caption = $('<figcaption>')
                .addClass('description')
                .attr('itemprop', 'description')
                .html(dialogResult.title);

            $photoAlbum.append($figcaptionPlaceholder).append($caption);

            var html = $photoAlbum.get(0).outerHTML;

            return html;
        }

        function fromMarkupToDialogInput(ed) {
            var node = ed.selection.getNode();
            var $figure = $(node).closest('figure.gallery');

            if ($figure.length !== 1) {
                return null;
            }

            var title = $figure.find('.description').html();

            return {
                photoAlbum: {
                    targetId: Number($figure.attr('data-id')),
                    title: title,
                    authorName: null
                }
            };
        }
    });
