// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

define([
        'jquery',
        'url-utilities',
        'tinymce-dialog-factory',
        'image-utilities',
        'resource-utilities',
        'moment'
    ],
    function($, urls, mceDialogFactory, imageUtilities, resourceUtilities, moment) {
        'use strict';

        function fromDialogResultToMarkup(dialogResult) {
            var contentItemSummary = dialogResult,
                isAudio = resourceUtilities.isAudioMedia(contentItemSummary.legacy.resourceType),
                $figure = $('<figure>'),
                $placeholder = $('<div>'),
                meta,
                $caption = $('<figcaption>'),
                durationParts,
                hours,
                minutes,
                seconds,
                isoDuration;

            if (contentItemSummary.legacy.applicationCode == 'musichall-wr') {
                isAudio = true;
            }

            $figure.attr('itemscope', 'itemscope')
                .attr('itemtype', isAudio ? 'http://schema.org/AudioObject' : 'http://schema.org/VideoObject')
                .attr('itemprop', 'associatedMedia');

            if (contentItemSummary.canonicalWebLink.href) {
                $figure.attr('itemid', contentItemSummary.canonicalWebLink.href);
            }

            var duration = null;

            if (contentItemSummary.summaryMultimediaItem && contentItemSummary.summaryMultimediaItem.duration) {
                duration = contentItemSummary.summaryMultimediaItem.duration;
            }

            $figure.attr('data-description', contentItemSummary.legacy.description)
                .attr('data-zap', contentItemSummary.legacy.zap)
                .attr('data-embed', true)
                .attr('data-une', contentItemSummary.legacy.une)
                .attr('data-cond', contentItemSummary.legacy.cond)
                .attr('data-gui', contentItemSummary.legacy.gui)
                .attr('data-duration', duration)
                .attr('data-mce-contenteditable', false)
                .addClass('associatedMedia medianet mceNonEditable')
                .addClass(getResourceCssClass(contentItemSummary))
                .addClass('align-' + contentItemSummary.legacy.align);

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
                    moment.utc(contentItemSummary.publishedLastTimeAt).local().format('YYYY-MM-DDTHH:mm:ss'));
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
                meta = $('<meta>').attr('itemprop', 'duration').attr('content', isoDuration);
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
                var defaultToClosestDimension = true /*contentItemSummary.summaryMultimediaItem.summaryImage.contentType.id != '20'*/ ;

                var image = imageUtilities.getConcreteImage(summaryImage, {
                    preferedWidth: 635,
                    preferedHeight: 357,
                    defaultToClosestDimension: defaultToClosestDimension
                });

                if (!image) {
                    image = imageUtilities.getHighResolutionAudioVideoConcreteImage(summaryImage);
                }

                if (image && image.mediaLink && image.mediaLink.href) {
                    meta = $('<meta>').attr('itemprop', 'image').attr('content', image.mediaLink.href);
                    $figure.append(meta);
                }

                var thumbnail = imageUtilities.getConcreteImage(summaryImage, {
                    preferedWidth: 135,
                    preferedHeight: 76,
                    defaultToClosestDimension: defaultToClosestDimension
                });

                if (!thumbnail) {
                    thumbnail = imageUtilities.getLowResolutionAudioVideoConcreteImage(summaryImage);
                }

                if (thumbnail && thumbnail.mediaLink && thumbnail.mediaLink.href) {
                    meta = $('<meta>').attr('itemprop', 'thumbnail').attr('content', thumbnail.mediaLink.href);
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
        }

        function fromMarkupToDialogInput(ed) {
            var figure = $(ed.selection.getNode()).closest('figure.medianet'),
                isResourceSelected = figure.length > 0,
                contentItemSummary = null,
                result = $.extend({}, ed.settings.medianetDialogSettings);

            result.imagesDialogSettings = ed.settings.imagesDialogSettings;

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

                contentItemSummary.publishedLastTimeAt = moment(figure.data('date-time')).format('YYYY-MM-DD HH:mm Z');

                if (figure.hasClass('audio')) {
                    contentItemSummary.legacy.resourceType = resourceUtilities.resourceTypes.audio;
                } else if (figure.hasClass('livevideo')) {
                    contentItemSummary.legacy.resourceType = resourceUtilities.resourceTypes.liveVideo;
                } else if (figure.hasClass('liveaudio')) {
                    contentItemSummary.legacy.resourceType = resourceUtilities.resourceTypes.liveAudio;
                } else if (figure.hasClass('video')) {
                    contentItemSummary.legacy.resourceType = resourceUtilities.resourceTypes.video;
                } else if (figure.hasClass('track')) {
                    contentItemSummary.legacy.resourceType = resourceUtilities.resourceTypes.track;
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
                case resourceUtilities.resourceTypes.audio:
                    cssClass = 'audio';
                    break;
                case resourceUtilities.resourceTypes.video:
                    cssClass = 'video';
                    break;
                case resourceUtilities.resourceTypes.liveVideo:
                    cssClass = 'livevideo';
                    break;
                case resourceUtilities.resourceTypes.liveAudio:
                    cssClass = 'liveaudio';
                    break;
                case resourceUtilities.resourceTypes.track:
                    cssClass = 'track';
                    break;
            }

            return cssClass;
        }

        return mceDialogFactory.createMcePlugin({
            pluginName: 'medianet',
            title: 'Ins\u00e9rer/\u00e9diter un player M\u00e9dianet',
            image: urls.url('/images/play.png'),
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
