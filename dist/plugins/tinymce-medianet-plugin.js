(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'jquery', 'knockout', 'koco-url-utilities', 'tinymce-dialog-factory', 'koco-image-utilities', 'koco-resource-utilities', 'moment'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('jquery'), require('knockout'), require('koco-url-utilities'), require('tinymce-dialog-factory'), require('koco-image-utilities'), require('koco-resource-utilities'), require('moment'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.jquery, global.knockout, global.kocoUrlUtilities, global.tinymceDialogFactory, global.kocoImageUtilities, global.kocoResourceUtilities, global.moment);
        global.tinymceMedianetPlugin = mod.exports;
    }
})(this, function (exports, _jquery, _knockout, _kocoUrlUtilities, _tinymceDialogFactory, _kocoImageUtilities, _kocoResourceUtilities, _moment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _jquery2 = _interopRequireDefault(_jquery);

    var _knockout2 = _interopRequireDefault(_knockout);

    var _kocoUrlUtilities2 = _interopRequireDefault(_kocoUrlUtilities);

    var _tinymceDialogFactory2 = _interopRequireDefault(_tinymceDialogFactory);

    var _kocoImageUtilities2 = _interopRequireDefault(_kocoImageUtilities);

    var _kocoResourceUtilities2 = _interopRequireDefault(_kocoResourceUtilities);

    var _moment2 = _interopRequireDefault(_moment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function fromDialogResultToMarkup(dialogResult) {
        var contentItemSummary = dialogResult,
            isAudio = _kocoResourceUtilities2.default.isAudioMedia(contentItemSummary.legacy.resourceType),
            $figure = (0, _jquery2.default)('<figure>'),
            $placeholder = (0, _jquery2.default)('<div>'),
            meta,
            $caption = (0, _jquery2.default)('<figcaption>'),
            durationParts,
            hours,
            minutes,
            seconds,
            isoDuration;

        if (contentItemSummary.legacy.applicationCode == 'musichall-wr') {
            isAudio = true;
        }

        $figure.attr('itemscope', 'itemscope').attr('itemtype', isAudio ? 'http://schema.org/AudioObject' : 'http://schema.org/VideoObject').attr('itemprop', 'associatedMedia');

        if (contentItemSummary.canonicalWebLink.href) {
            $figure.attr('itemid', contentItemSummary.canonicalWebLink.href);
        }

        var duration = null;

        if (contentItemSummary.summaryMultimediaItem && contentItemSummary.summaryMultimediaItem.duration) {
            duration = contentItemSummary.summaryMultimediaItem.duration;
        }

        $figure.attr('data-description', contentItemSummary.legacy.description).attr('data-zap', contentItemSummary.legacy.zap).attr('data-embed', true).attr('data-une', contentItemSummary.legacy.une).attr('data-cond', contentItemSummary.legacy.cond).attr('data-gui', contentItemSummary.legacy.gui).attr('data-duration', duration).attr('data-mce-contenteditable', false).addClass('associatedMedia medianet mceNonEditable').addClass(getResourceCssClass(contentItemSummary)).addClass('align-' + contentItemSummary.legacy.align);

        if (contentItemSummary.legacy.applicationCode) {
            $figure.attr('data-application-code', contentItemSummary.legacy.applicationCode);
        }
        if (contentItemSummary.targetId) {
            $figure.attr('data-external-id', contentItemSummary.targetId);
        }
        if (contentItemSummary.broadcastableItem) {

            if (contentItemSummary.broadcastableItem.legacyId) {
                $figure.attr('data-code-emission', contentItemSummary.broadcastableItem.legacyId);
            }

            if (contentItemSummary.broadcastableItem.title) {
                $figure.attr('data-program-name', contentItemSummary.broadcastableItem.title);
            }
        }
        if (contentItemSummary.legacy.androidUrl) {
            $figure.attr('data-android-url', contentItemSummary.legacy.androidUrl);
        }
        if (contentItemSummary.legacy.blackberryUrl) {
            $figure.attr('data-blackberry-url', contentItemSummary.legacy.blackberryUrl);
        }
        if (contentItemSummary.legacy.iosUrl) {
            $figure.attr('data-ios-url', contentItemSummary.legacy.iosUrl);
        }

        $figure.attr('data-summary', contentItemSummary.legacy.summary || '');

        if (contentItemSummary.publishedLastTimeAt) {
            $figure.attr('data-date-time', //TODO: Valider qu'on conserver le meme format que V1
            _moment2.default.utc(contentItemSummary.publishedLastTimeAt).local().format('YYYY-MM-DDTHH:mm:ss'));
        }

        if (duration) {
            durationParts = duration.split(':');
            hours = parseInt(durationParts[0], 10);
            minutes = parseInt(durationParts[1], 10);
            seconds = parseInt(durationParts[2], 10);
            isoDuration = 'PT';

            if (hours > 0) {
                isoDuration += hours + 'H';
            }
            if (minutes > 0) {
                isoDuration += minutes + 'M';
            }
            if (seconds > 0) {
                isoDuration += seconds + 'S';
            }
            meta = (0, _jquery2.default)('<meta>').attr('itemprop', 'duration').attr('content', isoDuration);
            $figure.append(meta);
        }

        var summaryImage = null;

        if (contentItemSummary.summaryMultimediaItem && contentItemSummary.summaryMultimediaItem.summaryImage) {
            summaryImage = contentItemSummary.summaryMultimediaItem.summaryImage;
        } else if (contentItemSummary.summaryMultimediaItem && contentItemSummary.summaryMultimediaItem.dtoName == 'ConceptualImage') {
            summaryImage = contentItemSummary.summaryMultimediaItem;
        }

        if (summaryImage) {
            //TODO: Attention - Nouvelles (ghtml) les images devraient defaultToClosestDimension == false
            var defaultToClosestDimension = true /*contentItemSummary.summaryMultimediaItem.summaryImage.contentType.id != '20'*/;

            var image = _kocoImageUtilities2.default.getConcreteImage(summaryImage, {
                preferedWidth: 635,
                preferedHeight: 357,
                defaultToClosestDimension: defaultToClosestDimension
            });

            if (!image) {
                image = _kocoImageUtilities2.default.getHighResolutionAudioVideoConcreteImage(summaryImage);
            }

            if (image && image.mediaLink && image.mediaLink.href) {
                meta = (0, _jquery2.default)('<meta>').attr('itemprop', 'image').attr('content', image.mediaLink.href);
                $figure.append(meta);
            }

            var thumbnail = _kocoImageUtilities2.default.getConcreteImage(summaryImage, {
                preferedWidth: 135,
                preferedHeight: 76,
                defaultToClosestDimension: defaultToClosestDimension
            });

            if (!thumbnail) {
                thumbnail = _kocoImageUtilities2.default.getLowResolutionAudioVideoConcreteImage(summaryImage);
            }

            if (thumbnail && thumbnail.mediaLink && thumbnail.mediaLink.href) {
                meta = (0, _jquery2.default)('<meta>').attr('itemprop', 'thumbnail').attr('content', thumbnail.mediaLink.href);
                $figure.append(meta);
            }
        }

        //why a empty placeholder?
        $placeholder.addClass('placeholder');
        $figure.append($placeholder);

        var description = contentItemSummary.title.replace(/(\r\n|\n|\r)/gm, ' ').trim();

        $caption.attr('itemprop', 'description').addClass('description').text(description);
        $figure.append($caption);

        return $figure.get(0).outerHTML;
    } // Copyright (c) CBC/Radio-Canada. All rights reserved.
    // Licensed under the MIT license. See LICENSE file in the project root for full license information.

    function fromMarkupToDialogInput(ed) {
        var figure = (0, _jquery2.default)(ed.selection.getNode()).closest('figure.medianet'),
            isResourceSelected = figure.length > 0,
            contentItemSummary = null,
            result = _jquery2.default.extend({}, _knockout2.default.toJS(ed.settings.medianetDialogSettings));

        result.imagesDialogSettings = _knockout2.default.toJS(ed.settings.imagesDialogSettings);

        if (isResourceSelected) {
            contentItemSummary = {
                legacy: {},
                broadcastableItem: {},
                summaryMultimediaItem: {
                    summaryImage: {
                        concreteImages: []
                    }
                },
                canonicalWebLink: {}
            };

            contentItemSummary.legacy.align = figure.hasClass('align-right') ? 'right' : 'left';
            contentItemSummary.legacy.applicationCode = figure.data('application-code');
            contentItemSummary.legacy.androidUrl = figure.data('android-url');
            contentItemSummary.legacy.blackberryUrl = figure.data('blackberry-url');
            contentItemSummary.broadcastableItem.legacyId = figure.data('code-emission');
            contentItemSummary.broadcastableItem.title = figure.data('program-name');
            contentItemSummary.legacy.cond = figure.data('cond');
            contentItemSummary.legacy.description = figure.data('description');
            contentItemSummary.summary = figure.data('description');
            contentItemSummary.summaryMultimediaItem.duration = figure.data('duration');
            contentItemSummary.legacy.embed = figure.data('embed');
            contentItemSummary.targetId = figure.data('external-id');
            contentItemSummary.legacy.gui = figure.data('gui');

            //Touchy... on recré l'id
            contentItemSummary.summaryMultimediaItem.id = contentItemSummary.legacy.applicationCode + '-' + contentItemSummary.targetId;

            var image = figure.children('meta[itemprop=image]').attr('content');

            if (image) {
                contentItemSummary.summaryMultimediaItem.summaryImage.concreteImages.push({
                    mediaLink: {
                        href: image
                    },
                    width: 635,
                    height: 357,
                    dimensionRatio: '16:9'
                });
            }

            var thumbnail = figure.children('meta[itemprop=thumbnail]').attr('content');

            if (thumbnail) {
                contentItemSummary.summaryMultimediaItem.summaryImage.concreteImages.push({
                    mediaLink: {
                        href: thumbnail
                    },
                    width: 135,
                    height: 76,
                    dimensionRatio: '16:9'
                });
            }

            contentItemSummary.legacy.iosUrl = figure.data('ios-url');
            contentItemSummary.title = figure.children('figcaption').text();
            contentItemSummary.legacy.une = figure.data('une');
            contentItemSummary.canonicalWebLink.href = figure.attr('itemid');
            contentItemSummary.legacy.zap = figure.data('zap');
            contentItemSummary.legacy.summary = figure.data('summary');

            contentItemSummary.publishedLastTimeAt = (0, _moment2.default)(figure.data('date-time')).format('YYYY-MM-DD HH:mm Z');

            if (figure.hasClass('audio')) {
                contentItemSummary.legacy.resourceType = _kocoResourceUtilities2.default.resourceTypes.audio;
            } else if (figure.hasClass('livevideo')) {
                contentItemSummary.legacy.resourceType = _kocoResourceUtilities2.default.resourceTypes.liveVideo;
            } else if (figure.hasClass('liveaudio')) {
                contentItemSummary.legacy.resourceType = _kocoResourceUtilities2.default.resourceTypes.liveAudio;
            } else if (figure.hasClass('video')) {
                contentItemSummary.legacy.resourceType = _kocoResourceUtilities2.default.resourceTypes.video;
            } else if (figure.hasClass('track')) {
                contentItemSummary.legacy.resourceType = _kocoResourceUtilities2.default.resourceTypes.track;
            } else if (figure.hasClass('webradio')) {
                contentItemSummary.legacy.resourceType = _kocoResourceUtilities2.default.resourceTypes.webradio;
            }
        }

        result.content = contentItemSummary;

        return result;
    }

    function getResourceCssClass(resource) {
        var cssClass = '';

        if (resource.legacy.applicationCode === 'musichall-wr') {
            return 'webradio';
        }

        switch (resource.legacy.resourceType) {
            case _kocoResourceUtilities2.default.resourceTypes.audio:
                cssClass = 'audio';
                break;
            case _kocoResourceUtilities2.default.resourceTypes.video:
                cssClass = 'video';
                break;
            case _kocoResourceUtilities2.default.resourceTypes.liveVideo:
                cssClass = 'livevideo';
                break;
            case _kocoResourceUtilities2.default.resourceTypes.liveAudio:
                cssClass = 'liveaudio';
                break;
            case _kocoResourceUtilities2.default.resourceTypes.track:
                cssClass = 'track';
                break;
            case _kocoResourceUtilities2.default.resourceTypes.webradio:
                cssClass = 'webradio';
                break;
        }

        return cssClass;
    }

    exports.default = _tinymceDialogFactory2.default.createMcePlugin({
        pluginName: 'medianet',
        title: 'medianet.desc', //'Insérer/éditer un player Médianet',
        image: _kocoUrlUtilities2.default.url('/images/play.png'),
        pluginInfo: {
            longname: 'Medianet plugin',
            author: 'Plate-forme',
            version: '1.0'
        },
        fromDialogResultToMarkup: fromDialogResultToMarkup,
        fromMarkupToDialogInput: fromMarkupToDialogInput,
        dialog: 'legacy-media'
    });
});