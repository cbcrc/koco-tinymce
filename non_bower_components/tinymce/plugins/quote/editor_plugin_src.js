(function ($) {
    var quotePlugin = {
        pluginId: 'quote',

        getInfo: function() {
            return {
                longname: 'Quote plugin',
                author: 'Stephane Leblanc',
                version: "1.0"
            };
        }
    };

    quotePlugin.init = function (ed, url) {
        ed.addCommand('mceQuote', function () {
            var authorTag = ed.getLang('quote.authorTag', 0);
            var content = ed.selection.getContent();

            if (!content) {
                content = ed.getLang('quote.quoteTag', 0);
            } else {
                //if (content.substring(0, 1) === '<') { /* Bug IE8 */
                //    var $content = $(content);
                //
                //    if ($content.length === 1 && $content[0].nodeName === "P") {
                //        content = $content[0].innerHTML;
                //    }
                //}
                var lines = [];
                var $buffer = $('<div>').append(content);
                $buffer.find('p').each(function (i, element) {
                    lines.push($(element).html());
                });
                content = lines.length > 0 ? lines.join('<br /><br />') : content;
            }
            
            var quoteTemplate =
                    '<blockquote itemprop="articleBody" class="articleBody mceNonEditable">' +
                        '<p class="quote mceEditable">' + content + '</p>' +
                        '<footer itemscope="itemscope" itemtype="http://schema.org/Person">' +
                            '<p itemprop="name" class="name mceEditable">' + authorTag + '</p>' +
                        '</footer>' +
                    '</blockquote>';

            ed.execCommand('mceInsertContent', false, quoteTemplate);
        });
            
        ed.addButton(quotePlugin.pluginId, {
            title: 'quote.desc',
            cmd: 'mceQuote'
        });
        
        //ed.onNodeChange.add(function (ed, cm, n) {
            //var content = ed.selection.getContent();
            //var $closestListItem = $(ed.selection.getNode()).closest('li');
            //var $unauthorizedElements = $('<div>').append(content).find('li');
            //cm.setDisabled(quotePlugin.pluginId, $closestListItem.length > 0 || $unauthorizedElements.length > 0);
        //});
    };

    tinymce.PluginManager.requireLangPack(quotePlugin.pluginId);
    tinymce.create('tinymce.plugins.QuotePlugin', quotePlugin);
    tinymce.PluginManager.add(quotePlugin.pluginId, tinymce.plugins.QuotePlugin);
})(jQuery);

