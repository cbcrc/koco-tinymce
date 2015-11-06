define([
        'knockout',
        'jquery',
        'url-utilities',
        'tinymce-events',
        'tinymce-utilities',
        'tinymce'
    ],
    function(ko, $, urls, tinymceEvents, tinymceUtilities, tinyMCE) {
        'use strict';

        var TinymceBaseBindingHandler = function(element, valueAccessor, allBindingsAccessor, viewModel, context) {
            var self = this;

            self.element = element;
            self.$textArea = $(element);
            self.$buffer = $('<div>');
            self.valueObservable = valueAccessor();
            self.tinymceid = self.buildId();
            self.allBindings = allBindingsAccessor();

            ko.applyBindingsToNode(element, {
                value: self.valueObservable
            });

            self.$textArea.attr('id', self.tinymceid);

            setTimeout(function() {
                tinyMCE.init(self.getConfig());
            }, 0);
        };

        TinymceBaseBindingHandler.prototype.dispose = function() {
            var self = this;

            //tinyMCE.execCommand('mceRemoveControl', false, element.id);
            var editor = tinyMCE.get(self.element.id);
            tinyMCE.execCommand('mceFocus', false, self.element.id);
            tinyMCE.execCommand('mceRemoveControl', true, self.element.id);
            editor.remove();

            self.$textArea.remove();
            self.$buffer.remove();
            self.valueObservable = null;
            self.tinymceid = null;
            self.allBindings = null;
            self.canEditHtml = null;
            self.tinymceConfig = null;
        };

        //abstract
        TinymceBaseBindingHandler.prototype.buildId = function() {
            //var self = this;

            throw new Error('buildId must be implemented.');
        };

        TinymceBaseBindingHandler.prototype.tinymceOnContentChanged = function(editor) {
            var self = this;

            var rawMarkup = tinymceUtilities.cleanTinymceMarkup(editor.getContent(), self.$buffer);

            if (rawMarkup !== self.valueObservable()) {
                self.valueObservable(rawMarkup);
            }
        };

        TinymceBaseBindingHandler.prototype.tinymceSetup = function(editor) {
            var self = this;

            //on change is only called on lost focus but we need live feedback, so we also use onKeyUp
            editor.onChange.add(function(editor) {
                self.tinymceOnContentChanged(editor);
            });
            editor.onKeyUp.add(function(editor) {
                self.tinymceOnContentChanged(editor);
            });
            
            editor.onInit.add(function(editor) {
                self.tinymceOnInit(editor);
            });

            editor.onPostRender.add(function(editor) {
                self.tinymceOnPostRender(editor);
            });
        };

        TinymceBaseBindingHandler.prototype.tinymceOnInit = function(editor) {
            var self = this;

            self.valueObservable.tinymce = editor;
            self.updateContent(editor);
        };

        TinymceBaseBindingHandler.prototype.tinymceOnPostRender = function(editor) {
            var self = this;

            if(self.allBindings.editorInitializationDeferred){
                self.allBindings.editorInitializationDeferred.resolve();
            }
        };

        TinymceBaseBindingHandler.prototype.updateContent = function(editor) {
            //var self = this;

            var currentRawContent = editor.getContent({
                format: 'raw'
            });

            var cleanedUpRawContent = tinymceUtilities.toTinymceMarkup(currentRawContent, editor);

            if (currentRawContent !== cleanedUpRawContent) {
                editor.setContent(cleanedUpRawContent, {
                    format: 'raw'
                });
            }
        };

        TinymceBaseBindingHandler.prototype.getConfig = function() {
            var self = this;

            var tinymceConfig = {
                mode: 'exact',
                elements: self.tinymceid,
                theme: 'advanced',
                dialog_type: 'modal',
                language: 'fr',
                setup: function(editor) {
                    self.tinymceSetup(editor);
                },
                width: '100%',
                entity_encoding: 'named',
                visualchars_default_state: true,
                schema: 'html5',
                inlinepopups_skin: 'bootstrap'
            };

            return tinymceConfig;
        };

        return TinymceBaseBindingHandler;
    });
