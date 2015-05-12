(function (global) {
    //Éditeur de source HTML
    // Load plugin specific language pack
    tinymce.PluginManager.requireLangPack('advcode');
    
    tinymce.create('tinymce.plugins.AdvCode', {
        /**
        * Initializes the plugin, this will be executed after the plugin has been created.
        * This call is done before the editor instance has finished it's initialization so use the onInit event
        * of the editor instance to intercept that event.
        *
        * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
        * @param {string} url Absolute URL to where the plugin is located.
        */
        init: function (ed, url) {
            // Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceAdvCode');
            ed.addCommand('mceAdvCode', function () {
                ed.windowManager.open({
                    file: url + '/advcode.htm',
                    width: 600,
                    height: 400,
                    inline: true,
                    translate_i18n: true
                }, {
                    plugin_url: url // Plugin absolute URL
                });
            });

            // Register code button
            ed.addButton('code', {
                title: 'advcode.title',
                cmd: 'mceAdvCode'
            });
        },

        /**
        * Returns information about the plugin as a name/value array.
        * The current keys are longname, author, authorurl, infourl and version.
        *
        * @return {Object} Name/value array containing information about the plugin.
        */
        getInfo: function () {
            return {
                longname: 'Source Editor',
                author: 'Hugo Leclerc',
                version: "1.0"
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('advcode', tinymce.plugins.AdvCode);

})(this);