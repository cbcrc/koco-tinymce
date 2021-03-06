(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'jquery', 'tinymce'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('jquery'), require('tinymce'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.jquery, global.tinymce);
    global.tinymceToolbarUtilities = mod.exports;
  }
})(this, function (exports, _jquery, _tinymce) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _jquery2 = _interopRequireDefault(_jquery);

  var _tinymce2 = _interopRequireDefault(_tinymce);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // Copyright (c) CBC/Radio-Canada. All rights reserved.
  // Licensed under the MIT license. See LICENSE file in the project root for full license information.

  var tool = {
    init: function init(editor, $textArea) {
      var $window = (0, _jquery2.default)(window);
      var $container = $textArea.parent();
      var $tinymceEndMarker = getNextElement($container);

      var $tinymceBody = $container.find('#' + $textArea[0].id + '_tbl'),
          $tinymceToolbarBody = $container.find('#' + $textArea[0].id + '_external'),
          $tinymceToolbar = $tinymceToolbarBody.parent();

      $tinymceToolbarBody.css({
        'display': 'block',
        'position': 'static'
      });
      $tinymceToolbar.addClass('defaultSkin');
      moveToolbarToTop();

      $container.find('#' + $textArea[0].id + '_external_close').remove();
      $container.find('#' + $textArea[0].id + '_tblext').css({
        'width': '100%'
      });

      $window.resize(function () {
        if ($tinymceBody.width() != $tinymceToolbar.width()) {
          $tinymceToolbar.width($tinymceBody.width());
        }
      });

      _tinymce2.default.dom.Event.add(editor.getWin(), 'resize', function () {
        _jquery2.default.waypoints('refresh');
      });

      $container.waypoint(function (event, direction) {
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
        offset: function offset() {
          return getTopOffset(false);
        }
      });

      $tinymceEndMarker.waypoint(function (event, direction) {
        if (isActiveView($container)) {
          if (!isScrolledIntoView($container, false)) {
            if (direction === 'down' && !isTopIntoView($container)) {
              moveToolbarToBottom();
            } else {
              if (!$tinymceToolbar.hasClass('editor-toolbar-top')) {
                floatToolbar();
              }
            }
          }
        }
      }, {
        offset: function offset() {
          return _jquery2.default.waypoints('viewportHeight') - (0, _jquery2.default)(this).outerHeight();
        }
      });

      function isScrolledIntoView($elem, completelyVisible) {
        var docViewTop = $window.scrollTop();
        var docViewBottom = docViewTop + $window.height();

        var elemTop = $elem.offset().top;
        var elemBottom = elemTop + $elem.height();

        if (completelyVisible) {
          return docViewTop < elemTop && docViewBottom > elemBottom;
        }

        return elemBottom <= docViewBottom && elemTop >= docViewTop;
      }

      function moveToolbarToTop() {
        $tinymceToolbar.css({
          'position': 'static',
          'width': '100%'
        });
        $container.prepend($tinymceToolbar);
        $tinymceToolbarBody.css({
          'border-bottom': '0',
          'border-top': '1px solid #CCC'
        });
        $tinymceToolbar.addClass('editor-toolbar-top');
        $tinymceToolbar.removeClass('editor-toolbar-float editor-toolbar-bottom');
      }

      function floatToolbar() {
        $tinymceToolbar.css({
          'position': 'fixed',
          'top': getTopOffset(true),
          'width': $tinymceBody.width()
        });
        $tinymceToolbarBody.css({
          'border-bottom': '1px solid #CCC',
          'border-top': '0'
        });
        $tinymceToolbar.addClass('editor-toolbar-float');
        $tinymceToolbar.removeClass('editor-toolbar-top editor-toolbar-bottom');
      }

      function moveToolbarToBottom() {
        $tinymceToolbar.css({
          'position': 'static',
          'width': '100%'
        });
        $container.append($tinymceToolbar);
        $tinymceToolbarBody.css({
          'border-bottom': '1px solid #CCC',
          'border-top': '0'
        });
        $tinymceToolbar.addClass('editor-toolbar-bottom');
        $tinymceToolbar.removeClass('editor-toolbar-top editor-toolbar-float');

        //stop flickering... bug IE8
        if (_tinymce2.default.isIE8) {
          $window.scrollTop($window.scrollTop() + 100);
        }
      }

      function getTopOffset(withPx) {
        var offset = _tinymce2.default.isIE8 || $window.width() > 768 ? 50 : 0;

        if (withPx) {
          offset = offset + 'px';
        }

        return offset;
      }

      function isActiveView($element) {
        return $element.is(':visible');
      }

      function getBottomOffset(withPx) {
        var offset = _tinymce2.default.isIE8 || $window.width() > 768 ? 64 : 0;

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

  exports.default = tool;
});