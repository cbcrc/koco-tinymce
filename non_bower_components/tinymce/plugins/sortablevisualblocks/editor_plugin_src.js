/**
 * editor_plugin_src.js
 *
 * Copyright 2012, Radio-Canada
 * Released under LGPL License.
 *
 * License: 
 * Contributing: 
 */

(function() {
    tinymce.create('tinymce.plugins.SortableVisualBlocks', {
		init : function(ed, url) {
			var cssId;

			// We don't support older browsers like IE6/7 and they don't provide prototypes for DOM objects
			if (!window.NodeList) {
				return;
			}
		    
			function sortable(disabled) {
		        var $iframe = $('#' + ed.id + "_ifr"),
                    win = $iframe[0].contentWindow,
                    timeout;
            
		        timeout = setInterval(function () {
		            if (win.jQuery && win.jQuery.fn.sortable) {
		                clearInterval(timeout);
		                //body.removeChild(jQuery);
		                //body.removeChild(jQueryUI);

		                win.jQuery('ul,body').sortable({ disabled: disabled });
		            }
		        }, 100);
		    }

			ed.addCommand('mceSortableVisualBlocks', function () {
			    var dom = ed.dom, cssElm;

			    if (!cssId) {
			        cssId = dom.uniqueId();
			        cssElm = dom.create('link', {
			            id: cssId,
			            rel : 'stylesheet',
			            href: url + '/css/sortablevisualblocks.css'
			        });

			        var head = ed.getDoc().getElementsByTagName('head')[0];

			        head.appendChild(cssElm);

			        var jqueryScriptElm = dom.create('script', {
			            id: dom.uniqueId(),
			            src: '//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js'
			        });

			        head.appendChild(jqueryScriptElm);
				    
			        var jqueryUiScriptElm = dom.create('script', {
			            id: dom.uniqueId(),
			            src: '//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js'
			        });

			        head.appendChild(jqueryUiScriptElm);
				    
			    } else {
			        cssElm = dom.get(cssId);
			        cssElm.disabled = !cssElm.disabled;
			    }

			    ed.controlManager.setActive('visualblocks', !cssElm.disabled);
			    sortable(cssElm.disabled);

			    //if (!linkElm.disabled) {
			    //    //$("#TinyMceDocumentBody_ifr").contents().on("click", "li", function (event) {
			    //    //    alert($(this).text());
			    //    //});
			    //    //$("#sortable").sortable();

			    //    var $iframe = $("#TinyMceDocumentBody_ifr"),
			    //        win = $iframe[0].contentWindow,
			    //        doc = win.document,
			    //        body = doc.body,
			    //        jQuery, jQueryUI, timeout;

			    //    jQuery = doc.createElement('script');
			    //    jQuery.src = '//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js';
			    //    body.appendChild(jQuery);

			    //    jQueryUI = doc.createElement('script');
			    //    jQueryUI.src = '//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js';
			    //    body.appendChild(jQueryUI);

			    //    timeout = setInterval(function () {
			    //        if (win.jQuery && win.jQuery.fn.sortable) {
			    //            clearInterval(timeout);
			    //            body.removeChild(jQuery);
			    //            body.removeChild(jQueryUI);
			    //            win.jQuery('ul,body').sortable({ cursor: 'move' });
			    //        }
			    //    }, 100);

			    //}

			});

			ed.addButton('visualblocks', { title: 'visualblocks.desc', cmd: 'mceSortableVisualBlocks' });

			ed.onInit.add(function() {
			    if (ed.settings.visualblocks_default_state) {
					ed.execCommand('mceSortableVisualBlocks', false, null, {skip_focus : true});
				}
			});
		},

		getInfo : function() {
			return {
				longname : 'Sortable Visual blocks',
				author : 'Radio-Canada - Maxime Séguin',
				authorurl: 'http://www.radio-canada.ca/',
				infourl: 'http://www.radio-canada.ca/',
				version : "0.1"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('sortablevisualblocks', tinymce.plugins.SortableVisualBlocks);
})();