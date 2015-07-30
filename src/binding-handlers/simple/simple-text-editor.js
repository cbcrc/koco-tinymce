// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

define([
        'knockout', 'jquery', 'url-utilities', 'tinymce-events',
        'tinymce-toolbar-utilities', './button-toggler-config', 'tinymce-utilities', 'tinymce'
    ],
    function(ko, $, urls, tinymceEvents, toolbarUtilities, buttonTogglerConfig, tinymceUtilities, tinyMCE) {
        'use strict';

        var editorId = 0;

        ko.bindingHandlers.simpleTextEditor = {
            init: function(element, valueAccessor, allBindingsAccessor /*, viewModel, context*/) {
                var $textArea = $(element),
                    $buffer = $('<div>'),
                    valueObservable = valueAccessor(),
                    tinymceid = 'simple-text-editor-' + (++editorId),
                    canEditHtml = allBindingsAccessor().canEditHtml;

                var tinyMceConfig = {
                    //script_url: '/Scripts/tinymce/tiny_mce_gzip.ashx',/*'/Content/tinymce-single.css',*/
                    mode: 'exact',
                    elements: tinymceid,
                    //mode:'none',
                    theme: 'advanced',
                    dialog_type: 'modal',
                    language: 'fr',
                    width: '100%',
                    height: '200px',
                    custom_shortcuts: true,

                    plugins: 'pagebreak,style,layer,table,iespell,inlinepopups,insertdatetime,preview,searchreplace,print,paste,directionality,fullscreen,framed,advcode,' +
                        'noneditable,sortablevisualblocks,advvisualchars,advnonbreaking,xhtmlxtras,template,quote,buttonToggler,figureSelector,br,linkCustom',

                    extended_valid_elements: '@[itemscope|itemtype|itemid|itemprop|class|data-align|data-application-code|data-external-id|' +
                        'data-code-emission|data-android-url|data-blackberry-url|data-ios-url|data-image|data-zap|data-embed|' +
                        'data-une|data-cond|data-gui|data-duration|data-id|data-p|data-m|data-g|data-version|data-display|data-mce-contenteditable],' +
                        '-footer,-figure,-figcaption,-span,-fakespan,-small,-p,div,script[async|charset|src|type],noscript,' +
                        'iframe[*],embed[*]',

                    valid_children: '+object[embed],+figcaption[span],+small[span]',

                    entity_encoding: 'named',
                    entities: '160,nbsp',
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
                    theme_advanced_buttons1: 'bold,italic,|,linkCustom,unlink,|,br,nonbreaking' + (canEditHtml ? ',code' : ''),
                    theme_advanced_buttons2: '',
                    theme_advanced_blockformats: 'p,h2,h3,h4',
                    theme_advanced_statusbar_location: 'none',
                    theme_advanced_path: false,
                    theme_advanced_resizing: true,
                    theme_advanced_resize_horizontal: false,
                    theme_advanced_resizing_use_cookie: false,

                    content_css: urls.url('components/tinymce/binding-handlers/texteditor.min.css'),
                    popup_css: urls.url('bower_components/bootstrap/dist/css/bootstrap.min.css'),
                    popup_css_add: urls.url('components/tinymce/binding-handlers/bootstrap-tinyMCE.dialog.min.css'),
                    inlinepopups_skin: 'bootstrap',
                    buttonTogglerConfig: buttonTogglerConfig,
                    handle_event_callback: tinymceEvents.handleNonEditableExitKeys,
                    setup: tinyMceSetup /*tinyMceSetup*/,
                    paste_preprocess: tinymceEvents.pastePreprocess
                };


                ko.applyBindingsToNode(element, {
                    value: valueObservable
                });

                $textArea.attr('id', tinymceid);

                tinyMCE.init(tinyMceConfig);


                ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                    var editor = tinyMCE.get(element.id);

                    tinyMCE.execCommand('mceFocus', false, element.id);
                    tinyMCE.execCommand('mceRemoveControl', true, element.id);

                    // editor.onKeyUp.remove(contentChanged);
                    // editor.onChange.remove(contentChanged);
                    // editor.onInit.remove(tinyMceInit);

                    editor.remove();

                    $buffer.remove();

                    tinyMceConfig = null;

                    // window.tinymce = null;
                    // delete window.tinymce;

                    // window.tinyMCE = null;
                    // delete window.tinyMCE;
                    //tinyMCE.execCommand('mceRemoveControl', false, element.id);
                });

                //TODO (important): Le fait d'utiliser l'extension setup de tinymce cause un memory leak...
                function tinyMceSetup( editor) {
                    //var editor = arguments[0];
                    // var editor = tinyMCE.get(tinymceid);
                     editor.onKeyUp.add(contentChanged);
                     editor.onChange.add(contentChanged);
                    editor.onInit.add(tinyMceInit);
                    //editor.onDblClick.add(tinymceEvents.openMediaEditor);
                }

                function tinyMceInit(editor) {
                    valueObservable.tinymce = editor;

                    updateContent(editor);

                    tinymceUtilities.isLoading = false;
                }

                function contentChanged(editor) {
                    var rawMarkup = tinymceUtilities.cleanTinyMceMarkup(editor.getContent(), $buffer);

                    if (rawMarkup != valueObservable()) {
                        $textArea.text(rawMarkup);
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

            if (currentRawContent != cleanedUpRawContent) {
                editor.setContent(cleanedUpRawContent, {
                    format: 'raw'
                });
            }
        }
    });
