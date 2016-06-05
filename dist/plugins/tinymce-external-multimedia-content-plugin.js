// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import $ from 'jquery';
import urls from 'koco-url-utilities';
import mceDialogFactory from 'tinymce-dialog-factory';


export default mceDialogFactory.createMcePlugin({
    pluginName: 'externalMultimediaContent',
    title: 'Ins\u00e9rer/\u00e9diter un contenu multim\u00e9dia externe',
    image: urls.url('/images/vimeo.png'),
    pluginInfo: {
        longname: 'External multimedia content plugin',
        author: 'Plate-forme',
        version: '1.0'
    },
    fromDialogResultToMarkup: fromDialogResultToMarkup,
    fromMarkupToDialogInput: fromMarkupToDialogInput,
    dialog: 'external-multimedia-content'
});

function fromMarkupToDialogInput(ed) {
    var $figure = $(ed.selection.getNode()).closest('figure.embed');

    if ($figure.length === 0) {
        return null;
    }

    if (!$figure.attr('data-content-type-id') ||
        !$figure.attr('data-content-id')) {
        throw 'external multimedia content sans attributs data-content-type-id et data-content-id n\'est pas supporté.';
    }

    return {
        externalMultimedia: {
            contentType: {
                id: $figure.attr('data-content-type-id')
            },
            id: $figure.attr('data-content-id')
        }
    };
}

function fromDialogResultToMarkup(dialogResult) {
    //youTube
    if (dialogResult.contentType.id === 3) {
        return generateYouTubeFigure(dialogResult);
    }
    //SoundCloud
    if (dialogResult.contentType.id === 4) {
        return generateSoundCloudFigure(dialogResult);
    }
    //Vine
    if (dialogResult.contentType.id === 5) {
        return generateVineFigure(dialogResult);
    }
    //Instagram
    if (dialogResult.contentType.id === 6) {
        return generateInstagramFigure(dialogResult);
    }
    //Vimeo
    if (dialogResult.contentType.id === 7) {
        return generateVimeoFigure(dialogResult);
    }

    throw 'not implemented';
}

function generateYouTubeFigure(dialogResult) {
    var embed = '<iframe width="560" height="315" src="//www.youtube-nocookie.com/embed/' + dialogResult.id + '" frameborder="0" allowfullscreen></iframe>';

    return generateExternalMultimediaContentFigure(dialogResult, embed);
}

function generateSoundCloudFigure(dialogResult) {
    var embed = '<iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + dialogResult.id + '&amp;auto_play=false&amp;hide_related=false&amp;visual=true"></iframe>';

    return generateExternalMultimediaContentFigure(dialogResult, embed);
}

function generateVineFigure(dialogResult) {
    var embed = '<iframe class="vine-embed" src="https://vine.co/v/' + dialogResult.id + '/embed/simple" width="600" height="600" frameborder="0"></iframe><script async src="//platform.vine.co/static/scripts/embed.js" charset="utf-8"></script>';

    return generateExternalMultimediaContentFigure(dialogResult, embed);
}

function generateInstagramFigure(dialogResult) {
    var embed = '<iframe src="//instagram.com/p/' + dialogResult.id + '/embed/" width="612" height="710" frameborder="0" scrolling="no" allowtransparency="true"></iframe>';

    return generateExternalMultimediaContentFigure(dialogResult, embed);
}

function generateVimeoFigure(dialogResult) {
    var embed = '<iframe src="//player.vimeo.com/video/' + dialogResult.id + '" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

    return generateExternalMultimediaContentFigure(dialogResult, embed);
}

function generateExternalMultimediaContentFigure(dialogResult, embed) {
    //respecter la structure pour ne pas briser les transformations vers le xml de ghtml, mais ajouter data-content-type-id et data-content-id
    var url = parseUrlFromEmbed(embed);
    var result =
        '<figure itemprop="associatedMedia" itemscope="itemscope" itemtype="http://schema.org/MediaObject" itemid="' + url + '" class="associatedMedia embed mceNonEditable" data-content-type-id=' + dialogResult.contentType.id + ' data-content-id=' + dialogResult.id + '><div class="placeholder">' + embed + '&nbsp;</div></figure>';
    return result;
}

function parseUrlFromEmbed(embed) {
    var urlMatch = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/.exec(embed);
    if (!urlMatch) {
        return '';
    }

    return urlMatch[0];
}
