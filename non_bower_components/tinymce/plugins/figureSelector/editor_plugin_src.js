(function (global, tinymce, $) {
    tinymce.create('tinymce.plugins.figureSelectorPlugin', {
        
        init: function (ed, url) {
            ed.onNodeChange.add(function (editor, cm, n) {
                if (n) {
                    // look for selection in a figure element
                    var elm = n; // remember original node

                    while ((!n.nodeName || (n.nodeName !== "FIGURE" && n.nodeName !== 'figure')) && n !== ed.getBody() && n.parentNode) {
                        n = n.parentNode;
                    }

                    // check if actual node is inside a figure element
                    if ((n.nodeName && (n.nodeName === "FIGURE" || n.nodeName === 'figure')) || n.isFigure) {
                        // select the node
                        try { ed.selection.select(n); } catch (e) { };

                        // mark node as a "figure" type of node
                        n.isFigure = true;

                    } else {
                        n = elm; // use initial node again
                    }

                    ed.lastActiveNode = n;
                }
            });
        },

        createControl: function () {
            return null;
        },

        getInfo: function () {
            return {
                longname: 'Figure tag automatic selection plugin',
                author: 'Plate-forme',
                version: "1.0"
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('figureSelector', tinymce.plugins.figureSelectorPlugin);

})(this, tinymce, jQuery);