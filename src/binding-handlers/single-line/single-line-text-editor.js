// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

define([
        'knockout', 'jquery', 'url-utilities', 'tinymce-events',
        'tinymce-toolbar-utilities', 'tinymce-utilities', 'tinymce'
    ],
    function(ko, $, urls, tinymceEvents, toolbarUtilities, tinymceUtilities, tinyMCE) {
        'use strict';

        var editorId = 0;

        var defaultSettings = {
            enabledButtons: 'bold,italic,nonbreaking',
        };

        ko.bindingHandlers.singleLineTextEditor = {
            init: function(element, valueAccessor, allBindingsAccessor, viewModel, context) {

                var $textArea = $(element),
                    $buffer = $('<div>'),
                    valueObservable = valueAccessor(),
                    tinymceid = 'single-line-text-editor-' + (++editorId),
                    canEditHtml = allBindingsAccessor().canEditHtml;

                if (canEditHtml) {
                    defaultSettings.enabledButtons += ',code';
                }

                var settings = $.extend({}, defaultSettings, allBindingsAccessor().singleLineTextEditorSettings);

                var tinyMceConfig = {
                    mode: 'exact',
                    elements: tinymceid,
                    //mode:'none',
                    content_css: urls.url('bower_components/koco-tinymce/src/binding-handlers/single-line/single-line-text-editor.min.css'),
                    popup_css: urls.url('bower_components/bootstrap/dist/css/bootstrap.min.css'),
                    popup_css_add: urls.url('bower_components/koco-tinymce/src/binding-handlers/bootstrap-tinyMCE.dialog.min.css'),
                    theme: 'advanced',
                    language: 'fr',
                    width: 'auto',
                    height: '30px',
                    plugins: 'advvisualchars,advnonbreaking,paste,advcode',
                    theme_advanced_buttons1: settings.enabledButtons,
                    theme_advanced_statusbar_location: 'none',
                    visualchars_default_state: true,
                    entity_encoding: 'named',
                    entities: '160,nbsp',
                    valid_elements: getTinyMceValidElementsFromButtons(settings.enabledButtons),
                    forced_root_block: '',
                    handle_event_callback: tinyMceBlockEnterKey,
                    setup: tinyMceSetup,
                    paste_preprocess: tinyMcePastePreprocess
                };

                ko.applyBindingsToNode(element, {
                    value: valueObservable
                });

                $textArea.attr('id', tinymceid);

                $textArea.addClass('mce-single');

                //setTimeout(function () {
                tinyMCE.init(tinyMceConfig);
                //}, 100);

                //var interval = setInterval(function () {
                //    if (!tinymceUtilities.isLoading) {
                //        clearInterval(interval);
                //        tinymceUtilities.isLoading = true;
                //        tinyMCE.settings = tinyMceConfig;
                //        setTimeout(function() {
                //            tinyMCE.execCommand('mceAddControl', true, tinymceid);
                //        }, 1000);
                //        //tinyMCE.init(tinyMceConfig);
                //    }
                //}, 1000);



                ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                    tinyMCE.execCommand('mceRemoveControl', false, element.id);
                });

                //#region Utilities

                function tinyMceSetup(editor) {
                    editor.onKeyUp.add(contentChanged);
                    editor.onChange.add(contentChanged);
                    editor.onInit.add(tinyMceInit);
                }

                function tinyMceInit(editor) {
                    valueObservable.tinymce = editor;

                    $textArea.siblings('span.mceEditor').addClass('scoop-editor-single');
                    updateContent(editor);

                    //Pour supporter le cas ou la valeur est updatée par autre chose que l'éditeur
                    //valueObservable.subscribe(function () {
                    //    tinymceUtilities.updateContent(getValueFromObservable(valueObservable, editor), editor, $buffer);
                    //});

                    tinymceUtilities.isLoading = false;

                    //TODO: Loader
                    //$('#tinymce-loading').hide();
                }

                function contentChanged(editor) {
                    var rawMarkup = tinymceUtilities.cleanTinyMceMarkup(editor.getContent(), $buffer);

                    if (rawMarkup != valueObservable()) {
                        $textArea.text(rawMarkup);
                        valueObservable(rawMarkup);
                    }
                }

                //#endregion
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

        function tinyMceBlockEnterKey(e) {
            return (e.keyCode !== 13);
        }

        function getTinyMceValidElementsFromButtons(buttons) {
            return $.map(buttons.split(','), function(button) {
                if (button === 'bold') {
                    return '-strong';
                } else if (button === 'italic') {
                    return '-em';
                } else if (button === 'nonbreaking') {
                    return '-img[src|alt|class]';
                }
                return '';
            }).join(',');
        }

        function tinyMcePastePreprocess(pl, o) {
            o.content = tinymceUtilities.toTinyMceMarkup(o.content, pl.editor);
        }
    });
