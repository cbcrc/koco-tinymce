(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'jquery'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('jquery'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.jquery);
        global.tinymceButtonToggler = mod.exports;
    }
})(this, function (exports, _jquery) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _jquery2 = _interopRequireDefault(_jquery);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var ctor = function ctor(editor) {
        var self = this;

        self.editor = editor;
        self.previousZone = null;
        self.allManagedButtons = [];
        self.noop = function () {};

        // Register dummy command to use it as place holder to stop shortcuts
        editor.addCommand('noop', self.noop);

        self.buttonTogglerConfig = editor.settings.buttonTogglerConfig || {};
        self.buttonTogglerConfig.shortcuts = self.buttonTogglerConfig.shortcuts || {};
        self.zones = self.buttonTogglerConfig.zones;

        editor.onNodeChange.add(function (ed, cm, n) {
            self.onNodeChange(n);

            var c = ed.selection ? ed.selection.getContent() : '';
            var config = self.buttonTogglerConfig && self.buttonTogglerConfig.additionalNodeChangeCallbacks ? self.buttonTogglerConfig.additionalNodeChangeCallbacks : [];

            (0, _jquery2.default)(config).each(function (i, obj) {
                //console.log(obj.buttonName);
                obj.callback(cm, c, n);
            });
        });

        self.initAllManagedButtons = function () {
            var controls = self.controlManager.controls,
                controlKey,
                control,
                controlId;

            for (controlKey in controls) {
                if (controls.hasOwnProperty(controlKey)) {
                    control = controls[controlKey];
                    controlId = self.parseButtonId(control);

                    if (self.isControlAToolbar(control) === false && self.isControlAManagedButton(controlId)) {
                        self.allManagedButtons.push(controlId);
                    }
                }
            }
        };

        self.disableAllShortcuts = function () {
            var prop;

            for (prop in self.editor.shortcuts) {
                // Don<t disable Undo (90), Redo (90), Save (83)
                if (prop !== 'ctrl,,,89' && prop !== 'ctrl,,,90' && prop !== 'ctrl,,,83') {
                    if (self.editor.shortcuts.hasOwnProperty(prop)) {
                        self.editor.shortcuts[prop].func = self.noop;
                    }
                }
            }
        };

        self.isControlAManagedButton = function (controlId) {
            return _jquery2.default.inArray(controlId, self.buttonTogglerConfig.notManagedButtons) === -1;
        };

        self.isControlAToolbar = function (control) {
            return typeof control.controls !== 'undefined';
        };

        self.parseButtonId = function (control) {
            return control.id.slice(self.editor.editorId.length + 1);
        };

        self.initDefaultZone = function () {
            var defaultZone = {
                name: 'default',
                enabledButtons: self.allManagedButtons,
                activeButtons: [],
                inZoneSelector: '*'
            };
            //Default must be the last zone
            self.zones.push(defaultZone);
            self.enterCurrentZone(defaultZone);
            self.previousZone = defaultZone;
        };

        //--------------------------------------------------------------
        //Button Toggler Logic
        //--------------------------------------------------------------
        self.onNodeChange = function (currentNode) {
            var currentZone = self.findCurrentZone(currentNode);
            if (currentZone !== self.previousZone) {
                self.exitPreviousZone();
                self.enterCurrentZone(currentZone);
                self.previousZone = currentZone;
            }
        };

        self.findCurrentZone = function (currentNode) {
            var zone,
                i = 0,
                zoneLength = self.zones.length;

            for (; i < zoneLength; i++) {
                zone = self.zones[i];
                if (self.isCurrentNodeInZone(currentNode, zone.inZoneSelector)) {
                    return zone;
                }
            }
            //Ne peut atteindre ce point, le currentNode est toujours dans la zone par defaut
        };

        self.isCurrentNodeInZone = function (currentNode, inZoneSelector) {
            return (0, _jquery2.default)(currentNode).closest(inZoneSelector).length > 0;
        };

        self.exitPreviousZone = function () {
            self.setEnabledButtons(self.allManagedButtons, false);
            self.setActiveButtons(self.allManagedButtons, false);
        };

        self.enterCurrentZone = function (currentZone) {
            self.setEnabledButtons(currentZone.enabledButtons, true);
            self.setActiveButtons(currentZone.activeButtons, true);
        };

        self.setEnabledButtons = function (buttons, isEnabled) {
            var i = 0,
                buttonsLength = buttons.length;

            for (; i < buttonsLength; i++) {
                self.controlManager.setDisabled(buttons[i], !isEnabled);

                self.setShortcut(buttons[i], isEnabled);
            }
        };

        self.setActiveButtons = function (buttons, isActive) {
            var i = 0,
                buttonsLength = buttons.length;

            for (; i < buttonsLength; i++) {
                self.controlManager.setActive(buttons[i], isActive);
            }
        };

        self.setShortcut = function (buttonName, isEnabled) {
            var shortcut = self.buttonTogglerConfig.shortcuts[buttonName];

            if (typeof shortcut === 'undefined') {
                return;
            }

            self.editor.addShortcut(shortcut[0], shortcut[1], isEnabled ? shortcut[2] : 'noop');
        };

        self.editor.onPreInit.add(function () {
            self.controlManager = self.editor.controlManager;
            self.disableAllShortcuts();
            self.initAllManagedButtons();
            self.initDefaultZone();
        });

        return self;
    }; // Copyright (c) CBC/Radio-Canada. All rights reserved.
    // Licensed under the MIT license. See LICENSE file in the project root for full license information.

    exports.default = ctor;
});