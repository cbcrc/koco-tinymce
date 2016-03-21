// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

define(['tinymce-dialog-result-handler', 'tinymce'],
    function(DialogResultHandler, tinymce) {
        'use strict';

        return {
            createMcePlugin: createMcePlugin
        };

        //Pour simplifier l'implémentation, on assume que le caller
        //ne garde pas de référence à pluginConfig.
        function createMcePlugin(pluginConfig, mceCommand) {
            var commandName = 'mce' + capitalizeFirstLetter(pluginConfig.pluginName);

            var plugin = {
                init: function init(ed) {
                    ed.addCommand(commandName, function() {
                        mceCommand(ed);
                    });

                    ed.addButton(pluginConfig.pluginName, {
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
                    tinymce.create('tinymce.plugins.' + pluginConfig.pluginName, plugin);
                    tinymce.PluginManager.add(pluginConfig.pluginName, tinymce.plugins[pluginConfig.pluginName]);
                }
            };
        }

        function capitalizeFirstLetter(text) {
            return text.charAt(0).toUpperCase() + text.slice(1);
        }
    });
