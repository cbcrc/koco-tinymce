'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _knockout = require('knockout');

var _knockout2 = _interopRequireDefault(_knockout);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _kocoUrlUtilities = require('koco-url-utilities');

var _kocoUrlUtilities2 = _interopRequireDefault(_kocoUrlUtilities);

var _tinymceEvents = require('tinymce-events');

var _tinymceEvents2 = _interopRequireDefault(_tinymceEvents);

var _tinymceUtilities = require('tinymce-utilities');

var _tinymceUtilities2 = _interopRequireDefault(_tinymceUtilities);

var _tinymce = require('tinymce');

var _tinymce2 = _interopRequireDefault(_tinymce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TinymceBaseBindingHandler = function TinymceBaseBindingHandler(element, valueAccessor, allBindingsAccessor, viewModel, context) {
    var self = this;

    self.element = element;
    self.$textArea = (0, _jquery2.default)(element);
    self.$buffer = (0, _jquery2.default)('<div>');
    self.valueObservable = valueAccessor();
    self.tinymceid = self.buildId();
    self.allBindings = allBindingsAccessor();

    _knockout2.default.applyBindingsToNode(element, {
        value: self.valueObservable
    });

    self.$textArea.attr('id', self.tinymceid);

    setTimeout(function () {
        _tinymce2.default.init(self.getConfig());
    }, 0);
};

TinymceBaseBindingHandler.prototype.dispose = function () {
    var self = this;

    //tinyMCE.execCommand('mceRemoveControl', false, element.id);
    var editor = _tinymce2.default.get(self.element.id);
    _tinymce2.default.execCommand('mceFocus', false, self.element.id);
    _tinymce2.default.execCommand('mceRemoveControl', true, self.element.id);
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
TinymceBaseBindingHandler.prototype.buildId = function () {
    //var self = this;

    throw new Error('buildId must be implemented.');
};

TinymceBaseBindingHandler.prototype.tinymceOnContentChanged = function (editor) {
    var self = this;

    var rawMarkup = _tinymceUtilities2.default.cleanTinymceMarkup(editor.getContent(), self.$buffer);

    if (rawMarkup !== self.valueObservable()) {
        self.valueObservable(rawMarkup);
    }
};

TinymceBaseBindingHandler.prototype.tinymceSetup = function (editor) {
    var self = this;

    //on change is only called on lost focus but we need live feedback, so we also use onKeyUp
    editor.onChange.add(function (editor) {
        self.tinymceOnContentChanged(editor);
    });
    editor.onKeyUp.add(function (editor) {
        self.tinymceOnContentChanged(editor);
    });

    editor.onInit.add(function (editor) {
        self.tinymceOnInit(editor);
    });

    editor.onPostRender.add(function (editor) {
        self.tinymceOnPostRender(editor);
    });
};

TinymceBaseBindingHandler.prototype.tinymceOnInit = function (editor) {
    var self = this;

    self.valueObservable.tinymce = editor;
    self.updateContent(editor);
};

TinymceBaseBindingHandler.prototype.tinymceOnPostRender = function (editor) {
    var self = this;

    if (self.allBindings.editorInitializationDeferred) {
        self.allBindings.editorInitializationDeferred.resolve();
    }
};

TinymceBaseBindingHandler.prototype.updateContent = function (editor) {
    //var self = this;

    var currentRawContent = editor.getContent({
        format: 'raw'
    });

    var cleanedUpRawContent = _tinymceUtilities2.default.toTinymceMarkup(currentRawContent, editor);

    if (currentRawContent !== cleanedUpRawContent) {
        editor.setContent(cleanedUpRawContent, {
            format: 'raw'
        });
    }
};

TinymceBaseBindingHandler.prototype.getConfig = function () {
    var self = this;

    var tinymceConfig = {
        mode: 'exact',
        elements: self.tinymceid,
        theme: 'advanced',
        dialog_type: 'modal',
        language: 'fr',
        setup: function setup(editor) {
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

exports.default = TinymceBaseBindingHandler;