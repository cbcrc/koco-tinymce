(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'jquery', 'koco-url-utilities', 'tinymce-dialog-factory'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('jquery'), require('koco-url-utilities'), require('tinymce-dialog-factory'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.jquery, global.kocoUrlUtilities, global.tinymceDialogFactory);
        global.tinymceLinkPlugin = mod.exports;
    }
})(this, function (exports, _jquery, _kocoUrlUtilities, _tinymceDialogFactory) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _jquery2 = _interopRequireDefault(_jquery);

    var _kocoUrlUtilities2 = _interopRequireDefault(_kocoUrlUtilities);

    var _tinymceDialogFactory2 = _interopRequireDefault(_tinymceDialogFactory);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    exports.default = _tinymceDialogFactory2.default.createMcePlugin({
        pluginName: 'linkCustom',
        title: 'advlink.link_desc',
        image: _kocoUrlUtilities2.default.url('/images/link.png'),
        pluginInfo: {
            longname: 'Hyperlien',
            author: 'Plate-forme',
            version: '1.0'
        },
        fromDialogResultToMarkup: fromDialogResultToMarkup,
        fromMarkupToDialogInput: fromMarkupToDialogInput,
        dialog: 'link'
    });


    function fromDialogResultToMarkup(dialogResult) {
        var $buffer = (0, _jquery2.default)('<div>');
        $buffer.html(dialogResult.title);
        $buffer.find('.nonbreaking').replaceWith('&nbsp;');

        var a = document.createElement('a');
        a.title = $buffer.html();
        a.innerHTML = dialogResult.text;
        a.href = dialogResult.url;

        return a.outerHTML;
    }

    function fromMarkupToDialogInput(ed) {
        var node = ed.selection.getNode();
        var dialogInput = {
            title: '',
            text: '',
            url: ''
        };

        if (node) {
            var $node = (0, _jquery2.default)(node);

            if (!$node.is('a')) {
                var $a = $node.closest('a');

                if ($a.length === 1) {
                    $node = $a;
                }
            }

            if (!$node.is('a') && $node.is('p')) {
                var firstChild = $node.first();

                if (firstChild && firstChild.is('a') && firstChild.clone().wrap('<div>').parent().html() === $node.html()) {
                    $node = firstChild[0];
                } else {
                    dialogInput.text = getContent(ed);

                    return dialogInput;
                }
            }

            if ($node.is('a')) {
                dialogInput.url = $node.attr('href');
                dialogInput.title = $node.attr('title');
            }

            dialogInput.text = $node.html();
            ed.selection.select($node[0]);
        }

        return dialogInput;
    }

    function getContent(ed) {
        var content = ed.selection.getContent();

        if (content) {
            var $content = (0, _jquery2.default)(jQuerySelectorEscape(content));

            /* Bug IE8 */
            if ($content.length === 1 && $content[0].nodeName === 'P') {
                content = $content[0].innerHTML;
            }
        }

        return content;
    }

    function jQuerySelectorEscape(str) {
        if (!str) {
            return '';
        }

        return str.replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~]/g, '\\$&');
    }
});