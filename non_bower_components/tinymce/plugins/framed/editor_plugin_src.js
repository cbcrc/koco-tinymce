(function () {
    var framedPlugin = {
        pluginId: 'framed',

        getInfo: function() {
            return {
                longname: 'Framed Plugin',
                author: 'Hugo Leclerc',
                version: "1.0"
            };
        }
    };

    framedPlugin.init = function (ed, url) {
        ed.addCommand('mceFramed', function () {
            var $closestFrame = $(ed.selection.getNode()).closest('.framed');
            
            if ($closestFrame.length > 0) {
                var html = $closestFrame.html();
                if (tinymce.isIE8) {
                    tinyMCE.activeEditor.dom.remove($closestFrame.get(0));
                    ed.execCommand('mceInsertContent', false, html);
                } else {
                    ed.selection.select($closestFrame.get(0));
                    ed.selection.setContent($closestFrame.html());
                    //$closestFrame.replaceWith(html);
                }
            } else {
                var $closestBlock = $(ed.selection.getNode()).closest('p, ul, ol');
                if ($closestBlock.length > 0) {
                    ed.selection.select($closestBlock.get(0));
                }
                var content = ed.selection.getContent();
                ed.execCommand('mceInsertContent', false, '<div class="framed">' + (content ? content : '<p></p>') + '</div>');
                //ed.selection.setContent('<div class="framed">' + (content ? content : '<p></p>') + '</div>');
            }
            try { tinymce.UndoManager.add(); } catch (e) { }
        });
            
        ed.addButton(framedPlugin.pluginId, {
            title: 'framed.desc',
            cmd: 'mceFramed',
            image: '/v2/Content/images/framed.png'
        });
    };

    tinymce.PluginManager.requireLangPack(framedPlugin.pluginId);
    tinymce.create('tinymce.plugins.FramedPlugin', framedPlugin);
    tinymce.PluginManager.add(framedPlugin.pluginId, tinymce.plugins.FramedPlugin);
})();

