import ko from 'knockout';
import $ from 'jquery';
import tinymceUtilities from 'tinymce-utilities';
import tinyMCE from 'tinymce';

let editorId = 0;

const TINYMCE_DFAULT_CONFIG = {
  mode: 'exact',
  theme: 'advanced',
  dialog_type: 'modal',
  language: 'fr',
  width: '100%',
  entity_encoding: 'named',
  visualchars_default_state: true,
  schema: 'html5',
  inlinepopups_skin: 'bootstrap'
};

const buildId = idPrefix => `${idPrefix}-text-editor-${(++editorId)}`;

class TinyMceBaseTextEditor {
  constructor(options) {
    this.options = options;
    this.$textArea = $(this.options.element);
    this.$buffer = $('<div>');

    this.tinymceConfig = Object.assign({}, TINYMCE_DFAULT_CONFIG, this.options.tinymceConfig || {});
    this.tinymceConfig.setup = editor => this.tinymceSetup(editor);
    this.tinymceConfig.elements = buildId(options.idPrefix);
    this.tinymceConfig.readonly = this.$textArea.prop('readonly');

    if (this.tinymceConfig.buttonTogglerConfig) {
      if (this.tinymceConfig.plugins) {
        this.tinymceConfig.plugins += ',buttonToggler';
      } else {
        this.tinymceConfig.plugins = 'buttonToggler';
      }
    }

    ko.applyBindingsToNode(this.options.element, {
      value: this.options.value
    });

    this.$textArea.attr('id', this.tinymceConfig.elements);

    setTimeout(() => {
      tinyMCE.init(this.tinymceConfig);
    }, 0);
  }

  dispose() {
    const editor = tinyMCE.get(this.options.element.id);

    // todo: investiguer pourquoi editor is null
    if (editor) {
      tinyMCE.execCommand('mceFocus', false, this.options.element.id);
      tinyMCE.execCommand('mceRemoveControl', true, this.options.element.id);
      editor.remove();

      this.$textArea.remove();
      this.$buffer.remove();
      this.tinymceConfig = null;
      this.options = null;
    }
  }

  tinymceOnContentChanged(editor) {
    const rawMarkup = tinymceUtilities.cleanTinymceMarkup(editor.getContent(), this.$buffer);

    if (rawMarkup !== this.options.value()) {
      this.options.value(rawMarkup);
    }
  }

  tinymceSetup(editor) {
    // on change is only called on lost focus but we need live feedback, so we also use onKeyUp
    editor.onChange.add((e) => {
      this.tinymceOnContentChanged(e);
    });
    editor.onKeyUp.add((e) => {
      this.tinymceOnContentChanged(e);
    });

    editor.onInit.add((e) => {
      this.tinymceOnInit(e);
    });

    editor.onPostRender.add((e) => {
      this.tinymceOnPostRender(e);
    });
  }

  tinymceOnInit(editor) {
    // why this line?
    this.options.value.tinymce = editor;
    this.updateContent(editor);
  }

  tinymceOnPostRender( /* editor */ ) {
    if (this.options.editorInitializationDeferred) {
      this.options.editorInitializationDeferred.resolve();
    }
  }

  updateContent(editor) {
    const currentRawContent = editor.getContent({
      format: 'raw'
    });

    const cleanedUpRawContent = tinymceUtilities.toTinymceMarkup(currentRawContent, editor);

    if (currentRawContent !== cleanedUpRawContent) {
      editor.setContent(cleanedUpRawContent, {
        format: 'raw'
      });
    }
  }
}

export default TinyMceBaseTextEditor;
