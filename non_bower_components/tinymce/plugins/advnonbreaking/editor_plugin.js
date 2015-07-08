(function() {
	tinymce.create('tinymce.plugins.AdvNonbreaking', {
		init : function(ed, url) {
			var t = this;

			t.editor = ed;

			// Register commands
			ed.addCommand('mceAdvNonBreaking', function () {
			    ed.execCommand('mceInsertContent', false, '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" class="nonbreaking' + ((!ed.plugins.advvisualchars || !ed.plugins.advvisualchars.state) ? ' hidden' : '') + '"/>');
			});

			// Register buttons
			ed.addButton('nonbreaking', { title: 'nonbreaking.nonbreaking_desc', cmd: 'mceAdvNonBreaking' });

            // Register SHIFT+SPACE keyboard shortcut
			ed.onKeyDown.add(function (ed, e) {
			    if (e.shiftKey && e.keyCode == 32) {
			        e.preventDefault();

			        ed.execCommand('mceAdvNonBreaking');
			    }
			});

			if (ed.getParam('nonbreaking_force_tab')) {
				ed.onKeyDown.add(function(ed, e) {
					if (e.keyCode == 9) {
						e.preventDefault();

						ed.execCommand('mceAdvNonBreaking');
						ed.execCommand('mceAdvNonBreaking');
						ed.execCommand('mceAdvNonBreaking');
					}
				});
			}
		},

		getInfo : function() {
			return {
				longname : 'Nonbreaking space',
				author : 'Radio-Canada',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}

		// Private methods
	});

	// Register plugin
	tinymce.PluginManager.add('advnonbreaking', tinymce.plugins.AdvNonbreaking);
})();