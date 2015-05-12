/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function() {
	tinymce.create('tinymce.plugins.AdvVisualChars', {
		init : function(ed, url) {
			var t = this;

			t.editor = ed;

			// Register commands
			ed.addCommand('mceAdvVisualChars', t._toggleVisualChars, t);

			// Register buttons
			ed.addButton('visualchars', {title : 'visualchars.desc', cmd : 'mceAdvVisualChars'});

			ed.onInit.add(function () {
			    if (ed.settings.visualchars_default_state) {
			        ed.execCommand('mceAdvVisualChars', false);
			    }
			});
		},

		getInfo : function() {
			return {
				longname : 'Visual characters',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/visualchars',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		},

		// Private methods

		_toggleVisualChars : function(bookmark) {
		    var t = this, ed = t.editor;

		    t.state = !t.state;
		    ed.controlManager.setActive('visualchars', t.state);

		    if (t.state) {
		        $(ed.getBody()).find('.nonbreaking').removeClass('hidden');
		    } else {
		        $(ed.getBody()).find('.nonbreaking').addClass('hidden');
		    }
		}
	});

	// Register plugin
	tinymce.PluginManager.add('advvisualchars', tinymce.plugins.AdvVisualChars);
})();