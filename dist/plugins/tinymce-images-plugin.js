(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'jquery', 'knockout', 'koco-url-utilities', 'tinymce-dialog-factory', 'koco-array-utilities'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('jquery'), require('knockout'), require('koco-url-utilities'), require('tinymce-dialog-factory'), require('koco-array-utilities'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.jquery, global.knockout, global.kocoUrlUtilities, global.tinymceDialogFactory, global.kocoArrayUtilities);
        global.tinymceImagesPlugin = mod.exports;
    }
})(this, function (exports, _jquery, _knockout, _kocoUrlUtilities, _tinymceDialogFactory, _kocoArrayUtilities) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _jquery2 = _interopRequireDefault(_jquery);

    var _knockout2 = _interopRequireDefault(_knockout);

    var _kocoUrlUtilities2 = _interopRequireDefault(_kocoUrlUtilities);

    var _tinymceDialogFactory2 = _interopRequireDefault(_tinymceDialogFactory);

    var _kocoArrayUtilities2 = _interopRequireDefault(_kocoArrayUtilities);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    exports.default = _tinymceDialogFactory2.default.createMcePlugin({
        pluginName: 'images',
        title: 'images.desc',
        image: _kocoUrlUtilities2.default.url('/images/pictures.png'),
        pluginInfo: {
            longname: 'Images plugin',
            author: 'Plate-forme',
            version: '2.0'
        },
        fromDialogResultToMarkup: fromDialogResultToMarkup,
        fromMarkupToDialogInput: fromMarkupToDialogInput,
        dialog: 'concrete-image'
    });


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
});