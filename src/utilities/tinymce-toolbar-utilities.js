// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

define(['jquery', 'router', 'dialoger', 'tinymce'],
    function($, router, dialoger, tinyMCE) {
        'use strict';

        var tool = {
            init: function(editor, $textArea) {
                var $window = $(window);
                var $container = $textArea.parent();
                var $tinymceEndMarker = getNextElement($container);

                var $tinyMceBody = $container.find('#' + $textArea[0].id + '_tbl'),
                    $tinyMceToolbarBody = $container.find('#' + $textArea[0].id + '_external'),
                    $tinyMceToolbar = $tinyMceToolbarBody.parent();

                $tinyMceToolbarBody.css({
                    'display': 'block',
                    'position': 'static'
                });
                $tinyMceToolbar.addClass('defaultSkin');
                moveToolbarToTop();

                $container.find('#' + $textArea[0].id + '_external_close').remove();
                $container.find('#' + $textArea[0].id + '_tblext').css({
                    'width': '100%'
                });

                $window.resize(function() {
                    if ($tinyMceBody.width() != $tinyMceToolbar.width()) {
                        $tinyMceToolbar.width($tinyMceBody.width());
                    }
                });

                tinyMCE.dom.Event.add(editor.getWin(), 'resize', function() {
                    $.waypoints('refresh');
                });

                $container.waypoint(function(event, direction) {
                    if (isActiveView($container)) {
                        if (direction === 'down' && !isTopIntoView($container)) {
                            if (isBottomIntoView($container)) {
                                moveToolbarToBottom();
                            } else {
                                floatToolbar();
                            }
                        } else {
                            moveToolbarToTop();
                        }
                    }
                }, {
                    offset: function() {
                        return getTopOffset(false);
                    }
                });

                $tinymceEndMarker.waypoint(function(event, direction) {
                    if (isActiveView($container)) {
                        if (!isScrolledIntoView($container, false)) {
                            if (direction === 'down' && !isTopIntoView($container)) {
                                moveToolbarToBottom();
                            } else {
                                if (!$tinyMceToolbar.hasClass('editor-toolbar-top')) {
                                    floatToolbar();
                                }
                            }
                        }
                    }
                }, {
                    offset: function() {
                        return $.waypoints('viewportHeight') - $(this).outerHeight();
                    }
                });

                function isScrolledIntoView($elem, completelyVisible) {
                    var docViewTop = $window.scrollTop();
                    var docViewBottom = docViewTop + $window.height();

                    var elemTop = $elem.offset().top;
                    var elemBottom = elemTop + $elem.height();

                    if (completelyVisible) {
                        return ((docViewTop < elemTop) && (docViewBottom > elemBottom));
                    }

                    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
                }

                function moveToolbarToTop() {
                    $tinyMceToolbar.css({
                        'position': 'static',
                        'width': '100%'
                    });
                    $container.prepend($tinyMceToolbar);
                    $tinyMceToolbarBody.css({
                        'border-bottom': '0',
                        'border-top': '1px solid #CCC'
                    });
                    $tinyMceToolbar.addClass('editor-toolbar-top');
                    $tinyMceToolbar.removeClass('editor-toolbar-float editor-toolbar-bottom');
                }

                function floatToolbar() {
                    $tinyMceToolbar.css({
                        'position': 'fixed',
                        'top': getTopOffset(true),
                        'width': $tinyMceBody.width()
                    });
                    $tinyMceToolbarBody.css({
                        'border-bottom': '1px solid #CCC',
                        'border-top': '0'
                    });
                    $tinyMceToolbar.addClass('editor-toolbar-float');
                    $tinyMceToolbar.removeClass('editor-toolbar-top editor-toolbar-bottom');
                }

                function moveToolbarToBottom() {
                    $tinyMceToolbar.css({
                        'position': 'static',
                        'width': '100%'
                    });
                    $container.append($tinyMceToolbar);
                    $tinyMceToolbarBody.css({
                        'border-bottom': '1px solid #CCC',
                        'border-top': '0'
                    });
                    $tinyMceToolbar.addClass('editor-toolbar-bottom');
                    $tinyMceToolbar.removeClass('editor-toolbar-top editor-toolbar-float');

                    //stop flickering... bug IE8
                    if (tinyMCE.isIE8) {
                        $window.scrollTop($window.scrollTop() + 100);
                    }
                }

                function getTopOffset(withPx) {
                    var offset = tinyMCE.isIE8 || ($window.width() > 768) ? 50 : 0;

                    if (withPx) {
                        offset = offset + 'px';
                    }

                    return offset;
                }

                function isActiveView($element) {
                    return $element.is(':visible');
                }

                function getBottomOffset(withPx) {
                    var offset = tinyMCE.isIE8 || ($window.width() > 768) ? 64 : 0;

                    if (withPx) {
                        offset = offset + 'px';
                    }

                    return offset;
                }

                function isBottomIntoView($elem) {
                    var docViewTop = $window.scrollTop();
                    var docViewBottom = docViewTop + $window.height();

                    var elemTop = $elem.offset().top;
                    var elemBottom = elemTop + $elem.height();

                    return docViewBottom - getBottomOffset() > elemBottom;
                }

                function isTopIntoView($elem) {
                    var docViewTop = $window.scrollTop();
                    var elemTop = $elem.offset().top;

                    return docViewTop + getTopOffset() < elemTop;
                }
            }
        };

        function getNextElement($element) {
            var $next = $element.next();

            while ($next.length == 0) {
                $element = $element.parent();
                $next = $element.next();
            }

            return $next;
        }

        return tool;
    });
