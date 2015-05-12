// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

define(['./mce-plugin-factory', '../dialog-result-handler', 'dialoger'],
    function(puglinFactory, DialogResultHandler, dialoger) {
        'use strict';

        return {
            createMcePlugin: createMcePlugin
        };

        //Pour simplifier l'implémentation, on assume que le caller
        //ne garde pas de référence à pluginConfig.
        function createMcePlugin(pluginConfig) {
            return puglinFactory.createMcePlugin(pluginConfig, mceCommand);

            function mceCommand(ed) {
                var modalResultHandler = new DialogResultHandler(ed).getOnResultHandler_toBeInvokeBeforeShowingModal();

                dialoger.show(pluginConfig.dialog, pluginConfig.fromMarkupToDialogInput(ed)).then(function(dialogResult) {
                        if (dialogResult) {
                            var markup = pluginConfig.fromDialogResultToMarkup(dialogResult);
                            modalResultHandler(markup);
                        }
                    });
            }
        }
    });
