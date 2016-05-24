'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _urlUtilities = require('url-utilities');

var _urlUtilities2 = _interopRequireDefault(_urlUtilities);

var _tinymceDialogFactory = require('tinymce-dialog-factory');

var _tinymceDialogFactory2 = _interopRequireDefault(_tinymceDialogFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _tinymceDialogFactory2.default.createMcePlugin({
    pluginName: 'photoAlbum',
    title: 'Insérer/éditer un album photos',
    image: _urlUtilities2.default.url('/images/album.png'),
    pluginInfo: {
        longname: 'Photo Album plugin',
        author: 'Plate-forme',
        version: '1.0'
    },
    fromDialogResultToMarkup: fromDialogResultToMarkup,
    fromMarkupToDialogInput: fromMarkupToDialogInput,
    dialog: 'photo-album'
}); // Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

function fromDialogResultToMarkup(dialogResult) {
    //stle: review prop value

    //Figure element
    var $photoAlbum = (0, _jquery2.default)('<figure>').attr('itemprop', 'associatedMedia').attr('itemscope', 'itemscope').attr('itemtype', 'http://schema.org/MediaObject').attr('itemid', dialogResult.targetId).attr('data-id', dialogResult.targetId)
    //Le plugin fonctionne seulement avec les albumsphotosv2 (data-version=3)
    .attr('data-version', 3).attr('cond', true).attr('data-display', 'galleria').addClass('associatedMedia')
    //Garder la classe gallery pour éviter de modifier
    //les transformations vers le XML de GHTML
    .addClass('gallery').addClass('mceNonEditable');

    var $figcaptionPlaceholder = (0, _jquery2.default)('<div>').addClass('placeholder');

    //figcaption element
    var $caption = (0, _jquery2.default)('<figcaption>').addClass('description').attr('itemprop', 'description').html(dialogResult.title);

    $photoAlbum.append($figcaptionPlaceholder).append($caption);

    var html = $photoAlbum.get(0).outerHTML;

    return html;
}

function fromMarkupToDialogInput(ed) {
    var node = ed.selection.getNode();
    var $figure = (0, _jquery2.default)(node).closest('figure.gallery');

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