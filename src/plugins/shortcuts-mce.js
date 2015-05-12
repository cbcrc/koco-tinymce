// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

define([
        'jquery',
        'url-utilities',
        './mce-plugin-factory',
        'dialoger'
    ],
    function($, urls, mcePluginFactory, dialoger) {
        'use strict';

        return mcePluginFactory.createMcePlugin(
            {
                pluginName: 'shortcuts',
                title: 'Raccourcis clavier',
                image: urls.url('/images/question.png'),
                pluginInfo: {
                    longname: 'Shortcuts plugin',
                    author: 'Plate-forme',
                    version: '1.0'
                }
            }, function() {
                dialoger.show('help-shortcuts');
            }
        );
    });
