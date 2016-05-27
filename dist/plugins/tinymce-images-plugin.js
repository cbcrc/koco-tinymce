'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _knockout = require('knockout');

var _knockout2 = _interopRequireDefault(_knockout);

var _kocoUrlUtilities = require('koco-url-utilities');

var _kocoUrlUtilities2 = _interopRequireDefault(_kocoUrlUtilities);

var _tinymceDialogFactory = require('tinymce-dialog-factory');

var _tinymceDialogFactory2 = _interopRequireDefault(_tinymceDialogFactory);

var _kocoArrayUtilities = require('koco-array-utilities');

var _kocoArrayUtilities2 = _interopRequireDefault(_kocoArrayUtilities);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _tinymceDialogFactory2.default.createMcePlugin({
    pluginName: 'images',
    title: 'Insérer/éditer une image',
    image: _kocoUrlUtilities2.default.url('/images/pictures.png'),
    pluginInfo: {
        longname: 'Images plugin',
        author: 'Plate-forme',
        version: '2.0'
    },
    fromDialogResultToMarkup: fromDialogResultToMarkup,
    fromMarkupToDialogInput: fromMarkupToDialogInput,
    dialog: 'concrete-image'
}); // Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

function fromDialogResultToMarkup(dialogResult) {
    var $figure = (0, _jquery2.default)('<figure>').attr('itemprop', 'associatedMedia').attr('itemscope', 'itemscope').attr('itemtype', 'http://schema.org/ImageObject').attr('itemid', dialogResult.concreteImage.mediaLink.href) //On pourrait aussi mettre le normalizedname ?
    .attr('data-align', dialogResult.align).attr('data-link', dialogResult.link).addClass('associatedMedia').addClass('image').addClass('mceNonEditable').addClass('align-' + dialogResult.align);

    var $image = (0, _jquery2.default)('<img>').attr('alt', dialogResult.conceptualImage.alt).attr('src', dialogResult.concreteImage.mediaLink.href).attr('itemprop', 'contentURL');

    var $caption = (0, _jquery2.default)('<figcaption>');

    if (dialogResult.conceptualImage.legend) {
        var $legend = (0, _jquery2.default)('<div>').attr('itemprop', 'description').addClass('description').addClass('fakespan').html(dialogResult.conceptualImage.legend);

        $caption.append($legend);
    }

    //TODO: Mettre beau...

    var credits = [];

    if (dialogResult.conceptualImage.pressAgency) {
        credits.push('<div itemscope itemprop="copyrightHolder sourceOrganization provider" itemtype="http://schema.org/Organization" itemid="' + dialogResult.conceptualImage.pressAgency + '" class="copyrightHolder sourceOrganization provider fakespan">' + '<div class="fakespan" itemprop="name">' + dialogResult.conceptualImage.pressAgency + '</div></div>');
    }

    if (dialogResult.conceptualImage.imageCredits) {
        credits.push('<div itemprop="creator" itemscope itemtype="http://schema.org/Person" class="creator fakespan"><div class="fakespan" itemprop="name">' + dialogResult.conceptualImage.imageCredits + '</div></div>');
    }

    if (_kocoArrayUtilities2.default.isNotEmptyArray(credits)) {
        $caption.append(' &copy;&nbsp;' + credits.join('/'));
    }

    $figure.append($image).append($caption);

    var html = $figure.get(0).outerHTML;

    return html;
}

function fromMarkupToDialogInput(ed) {
    var node = ed.selection.getNode();
    var $figure = (0, _jquery2.default)(node).closest('figure.image');
    var result = {
        settings: _knockout2.default.toJS(ed.settings.imagesDialogSettings)
    };

    if ($figure.length > 0) {
        result.concreteImageUrl = $figure.find('img').length > 0 ? (0, _jquery2.default)($figure.find('img')[0]).attr('src') : '';
        result.alt = $figure.find('img').length > 0 ? (0, _jquery2.default)($figure.find('img')[0]).attr('alt') : '';
        result.legend = $figure.find('.description').length > 0 ? $figure.find('.description').html() : '';
        result.pressAgency = $figure.find('.copyrightHolder').length > 0 ? $figure.find('.copyrightHolder').children('div.fakespan').html() : '';
        result.imageCredits = $figure.find('.creator').length > 0 ? $figure.find('.creator').children('div.fakespan').html() : '';
        result.align = $figure.data('align');
        result.link = $figure.data('link');
    }

    return result;
}