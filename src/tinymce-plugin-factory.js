// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

define(['tinymce-dialog-result-handler', 'string-utilities', 'tinymce'],
    function(DialogResultHandler, stringUtilities, tinymce) {
        'use strict';

        return {
            createMcePlugin: createMcePlugin
        };

        //Pour simplifier l'implémentation, on assume que le caller
        //ne garde pas de référence à pluginConfig.
        function createMcePlugin(pluginConfig, mceCommand) {
            var pluginName = stringUtilities.uncapitaliseFirstLetter(pluginConfig.pluginName);
            var commandName = 'mce' + stringUtilities.capitaliseFirstLetter(pluginName);

            var plugin = {
                init: function init(ed) {
                    ed.addCommand(commandName, function() {
                        mceCommand(ed);
                    });

                    ed.addButton(pluginName, {
                        //Utiliser les langs pack
                        title: pluginConfig.title,
                        cmd: commandName,
                        image: pluginConfig.image
                    });
                },
                createControl: function createControl() {
                    return null;
                },
                getInfo: pluginConfig.pluginInfo
            };

            return {
                init: function() {
                    tinymce.create('tinymce.plugins.' + pluginName, plugin);
                    tinymce.PluginManager.add(pluginName, tinymce.plugins[pluginName]);
                }
            };
        }
    });
