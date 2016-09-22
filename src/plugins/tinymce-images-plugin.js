// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import $ from 'jquery';
import ko from 'knockout';
import urls from 'koco-url-utilities';
import mceDialogFactory from 'tinymce-dialog-factory';
import arrayUtilities from 'koco-array-utilities';


export default mceDialogFactory.createMcePlugin({
    pluginName: 'images',
    title: 'images.desc', //'Ins\u00e9rer/\u00e9diter une image',
    image: urls.url('/images/pictures.png'),
    pluginInfo: {
        longname: 'Images plugin',
        author: 'Plate-forme',
        version: '2.0'
    },
    fromDialogResultToMarkup: fromDialogResultToMarkup,
    fromMarkupToDialogInput: fromMarkupToDialogInput,
    dialog: 'concrete-image'
});

// Move to image-utilities
function isPictoImage(conceptualImage) {
    return Boolean(conceptualImage && conceptualImage.contentType && conceptualImage.contentType.id === 19);
}

// Move to image-utilities
function updateImageUrlWithMaxDimensions(imageUrl, maxWidth, maxHeight) {
    var fitTransformation = '/w_' + maxWidth + ',h_' + maxHeight + ',c_limit';
    return imageUrl.replace('/v1/', fitTransformation + '/v1/');
}

// Move to image-utilities
function getImagePreview(dialogResult) {
    if (isPictoImage(dialogResult.conceptualImage)) {
        return updateImageUrlWithMaxDimensions(dialogResult.concreteImage.mediaLink.href, 720, 480);
    }

    return dialogResult.concreteImage.mediaLink.href;
}

function fromDialogResultToMarkup(dialogResult) {
    var $figure = $('<figure>')
        .attr('itemprop', 'associatedMedia')
        .attr('itemscope', 'itemscope')
        .attr('itemtype', 'http://schema.org/ImageObject')
        .attr('itemid', dialogResult.concreteImage.mediaLink.href)
        .attr('data-align', dialogResult.align)
        .attr('data-link', dialogResult.link)
        .addClass('associatedMedia')
        .addClass('image')
        .addClass('mceNonEditable')
        .addClass('align-' + dialogResult.align);

    var imagePreview = getImagePreview(dialogResult);
    var $image = $('<img>')
        .attr('alt', dialogResult.conceptualImage.alt)
        .attr('src', imagePreview)
        .attr('itemprop', 'contentURL');

    var $caption = $('<figcaption>');

    if (dialogResult.conceptualImage.legend) {
        var $legend = $('<div>')
            .attr('itemprop', 'description')
            .addClass('description')
            .addClass('fakespan')
            .html(dialogResult.conceptualImage.legend);

        $caption.append($legend);
    }


    //TODO: Mettre beau...

    var credits = [];

    if (dialogResult.conceptualImage.pressAgency) {
        credits.push(
            '<div itemscope itemprop="copyrightHolder sourceOrganization provider" itemtype="http://schema.org/Organization" itemid="' + dialogResult.conceptualImage.pressAgency + '" class="copyrightHolder sourceOrganization provider fakespan">' + '<div class="fakespan" itemprop="name">' + dialogResult.conceptualImage.pressAgency + '</div></div>'
        );
    }

    if (dialogResult.conceptualImage.imageCredits) {
        credits.push('<div itemprop="creator" itemscope itemtype="http://schema.org/Person" class="creator fakespan"><div class="fakespan" itemprop="name">' + dialogResult.conceptualImage.imageCredits + '</div></div>');
    }

    if (arrayUtilities.isNotEmptyArray(credits)) {
        $caption.append(' &copy;&nbsp;' + credits.join('/'));
    }

    $figure.append($image).append($caption);

    var html = $figure.get(0).outerHTML;

    return html;
}

function fromMarkupToDialogInput(ed) {
    var node = ed.selection.getNode();
    var $figure = $(node).closest('figure.image');
    var result = {
        settings: ko.toJS(ed.settings.imagesDialogSettings)
    };

    if ($figure.length > 0) {
        result.concreteImageUrl = $figure.attr('itemid');
        result.alt = $figure.find('img').length > 0 ? $($figure.find('img')[0]).attr('alt') : '';
        result.legend = $figure.find('.description').length > 0 ? $figure.find('.description').html() : '';
        result.pressAgency = $figure.find('.copyrightHolder').length > 0 ? $figure.find('.copyrightHolder').children('div.fakespan').html() : '';
        result.imageCredits = $figure.find('.creator').length > 0 ? $figure.find('.creator').children('div.fakespan').html() : '';
        result.align = $figure.data('align');
        result.link = $figure.data('link');
    }

    return result;
}
