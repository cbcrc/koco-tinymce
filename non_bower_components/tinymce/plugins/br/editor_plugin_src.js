(function () {
    // Load plugin specific language pack
    tinymce.PluginManager.requireLangPack('br');
    
    tinymce.create('tinymce.plugins.linebreakPlugin', {
        
        init: function (ed, url) {

            // Register commands
            ed.addCommand('mceLinebreak', function () {
                // We simulate the SHIFT+ENTER keypress because TinyMCE handles corner cases
                // for this scenario
                ed.onKeyDown.dispatch(ed, jQuery.Event("keydown", { shiftKey: true, keyCode: 13 }));
            });
            
            // Register button
            ed.addButton('br', {
                title: 'br.title',
                image: '/v2/content/images/linebreak.gif',
                cmd: 'mceLinebreak'
            });
        },

        createControl: function () {
            return null;
        }
    });

    // Register plugin
    tinymce.PluginManager.add('br', tinymce.plugins.linebreakPlugin);

})();