// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/*
    TODO: La fonction getOffset doit pouvoir etre overridée car elle représente la logique propre à une application

    TODO: Probleme avec la toolbar ->
    http://codepen.io/josiahruddell/pen/piFfq
    http://stackoverflow.com/questions/4326845/how-can-i-determine-the-direction-of-a-jquery-scroll-event
*/

define([
        'knockout', 'jquery', 'url-utilities', 'tinymce-events',
        'tinymce-toolbar-utilities', './button-toggler-config', 'tinymce-utilities', 'tinymce'
    ],
    function(ko, $, urls, tinymceEvents, toolbarUtilities, buttonTogglerConfig, tinymceUtilities, tinyMCE) {
        'use strict';

        var editorId = 0;

        ko.bindingHandlers.fullblownTextEditor = {
            init: function(element, valueAccessor, allBindingsAccessor/*, viewModel, context*/) {
                var $textArea = $(element),
                    $buffer = $('<div>'),
                    valueObservable = valueAccessor(),
                    tinymceid = 'full-blown-text-editor-' + (++editorId),
                    allBindings = allBindingsAccessor(),
                    medianetDialogSettings = $.extend({
                        mustShowMusichall: false
                    }, allBindings.medianetDialogSettings || {}),
                    imagesDialogSettings = $.extend({
                        contentTypeIds: [20]
                    }, allBindings.imagesDialogSettings || allBindings.medianetDialogSettings || {}),
                    canEditHtml = allBindingsAccessor().canEditHtml;


                var pluginsToLoad = [   'pagebreak',
                                        'style',
                                        'layer',
                                        'table',
                                        'iespell',
                                        'inlinepopups',
                                        'insertdatetime',
                                        'preview',
                                        'searchreplace',
                                        'print',
                                        'photoAlbum',
                                        'paste',
                                        'directionality',
                                        'fullscreen',
                                        'framed',
                                        'advcode',
                                        'linkCustom',
                                        'noneditable',
                                        'sortablevisualblocks',
                                        'advvisualchars',
                                        'advnonbreaking',
                                        'xhtmlxtras',
                                        'template',
                                        'quote',
                                        'externalMultimediaContent',
                                        'images',
                                        'medianet',
                                        'buttonToggler',
                                        'figureSelector',
                                        'br',
                                        'shortcuts',
                                        'htmlSnippet'
                                    ];

                var tinyMceConfig = {
                    //script_url: '/Scripts/tinymce/tiny_mce_gzip.ashx',/*'/Content/tinymce-single.css',*/
                    mode: 'exact',
                    elements: tinymceid,
                    //mode:'none',
                    theme: 'advanced',
                    dialog_type: 'modal',
                    language: 'fr',
                    width: '100%',
                    height: '650px',
                    custom_shortcuts: true,

                    plugins: pluginsToLoad.join(),

                    extended_valid_elements: '@[itemscope|itemtype|itemid|itemprop|class|data-align|data-application-code|data-external-id|' +
                        'data-code-emission|data-android-url|data-blackberry-url|data-ios-url|data-image|data-zap|data-embed|' +
                        'data-une|data-cond|data-gui|data-duration|data-id|data-p|data-m|data-g|data-version|data-display|data-mce-contenteditable],' +
                        '-footer,-figure,-figcaption,-span,-fakespan,-small,-p,div,script[async|charset|src|type],noscript,' +
                        'iframe[*],embed[*],img[data-nonbreaking|class|src|alt]',

                    valid_children: '+object[embed],+figcaption[span],+small[span]',

                    entity_encoding: 'named',
                    entities: '' /*160,nbsp*/ ,
                    visualchars_default_state: true,
                    paste_text_sticky: true,
                    paste_text_sticky_default: true,

                    remove_linebreaks: true,
                    fix_list_elements: true,

                    schema: 'html5',
                    end_container_on_empty_block: true,
                    style_formats: [{
                        title: 'Exergue',
                        block: 'p',
                        selector: 'p',
                        attributes: {
                            itemprop: 'articleBody'
                        },
                        classes: 'articleBody exergue'
                    }, {
                        title: 'h2',
                        block: 'h2'
                    }, {
                        title: 'h3',
                        block: 'h3'
                    }, {
                        title: 'h4',
                        block: 'h4'
                    }],

                    // Theme options
                    theme_advanced_buttons1: 'bold,italic,quote,|,sub,sup,|,numlist,bullist,|,linkCustom,unlink,anchor,|,hr,br,nonbreaking,|,shortcuts',
                    theme_advanced_buttons2: 'styleselect,framed,|,images,photoAlbum,medianet,externalMultimediaContent,htmlSnippet,|,visualchars,visualblocks,pastetext' + (canEditHtml ? ',code' : ''),
                    theme_advanced_toolbar_location: 'external',
                    theme_advanced_toolbar_align: 'left',
                    theme_advanced_blockformats: 'p,h2,h3,h4',
                    theme_advanced_statusbar_location: 'bottom',
                    theme_advanced_path: false,
                    theme_advanced_resizing: true,
                    theme_advanced_resize_horizontal: false,
                    theme_advanced_resizing_use_cookie: false,


                    content_css_url: urls.url('bower_components/koco-tinymce/src/binding-handlers/texteditor.min.css'),
                    popup_css_url: urls.url('bower_components/bootstrap/dist/css/bootstrap.min.css'),
                    popup_css_add_url: urls.url('bower_components/koco-tinymce/src/binding-handlers/bootstrap-tinyMCE.dialog.min.css'),
                    inlinepopups_skin: 'bootstrap',


                    buttonTogglerConfig: buttonTogglerConfig,
                    handle_event_callback: tinymceEvents.handleNonEditableExitKeys,
                    handle_node_change_callback: tinymceEvents.nodeChanged,
                    setup: tinyMceSetup,
                    paste_preprocess: tinymceEvents.pastePreprocess,
                    medianetDialogSettings: medianetDialogSettings,
                    imagesDialogSettings: imagesDialogSettings
                };

                ko.applyBindingsToNode(element, {
                    value: valueObservable
                });

                $textArea.attr('id', tinymceid);

                setTimeout(function () {
                    tinyMCE.init(tinyMceConfig);
                }, 0);

                ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                    tinyMCE.execCommand('mceRemoveControl', false, element.id);
                });

                function tinyMceSetup(editor) {
                    //editor.onKeyUp.add(contentChanged);
                    editor.onChange.add(contentChanged);
                    editor.onInit.add(tinyMceInit);
                    editor.onDblClick.add(tinymceEvents.openMediaEditor);
                }

                function tinyMceInit(editor) {
                    valueObservable.tinymce = editor;

                    updateContent(editor);

                    //Pour supporter le cas ou la valeur est updatée par autre chose que l'éditeur
                    //TODO
                    //valueObservable.subscribe(function () {
                    //    updateContent(editor);
                    //});

                    toolbarUtilities.init(editor, $textArea);

                    tinymceUtilities.isLoading = false;
                    //TODO: Loader
                    //$('#tinymce-loading').hide();
                }

                function contentChanged(editor) {
                    var rawMarkup = tinymceUtilities.cleanTinyMceMarkup(editor.getContent(), $buffer);

                    if (rawMarkup !== valueObservable()) {
                        valueObservable(rawMarkup);
                    }
                }
            }
        };

        function updateContent(editor) {
            var currentRawContent = editor.getContent({
                format: 'raw'
            });
            var cleanedUpRawContent = tinymceUtilities.toTinyMceMarkup(currentRawContent, editor);

            if (currentRawContent !== cleanedUpRawContent) {
                editor.setContent(cleanedUpRawContent, {
                    format: 'raw'
                });
            }
        }
    });
