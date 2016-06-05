// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import ButtonToggler from 'tinymce-button-toggler';
import tinyMCE from 'tinymce';


var buttonTogglerPlugin = {
    getInfo: function() {
        return {
            longname: 'Button Toggler',
            author: 'Radio-Canada',
            version: '1.1'
        };
    },

    //TODO: Refactoring (memory leak?..) - mettre l'instance sur l'éditeur pour qu'elle soit supprimer avec l'éditeur
    init: function(ed) {
        new ButtonToggler(ed);
    }
};

export default {
    init: function() {
        tinyMCE.create('tinymce.plugins.ButtonTogglerPlugin', buttonTogglerPlugin);
        tinyMCE.PluginManager.add('buttonToggler', tinyMCE.plugins.ButtonTogglerPlugin);
    }
};
