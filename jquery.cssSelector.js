/*!
 * jQuery cssSelector plugin
 * Retrieves the specific CSS selector of a DOM object in relation to its topmost parent.
 * Copyright (c) 2014 Baris Aydinoglu (baris.aydinoglu.info)
 * Version: 1.0.0
 *
 * Licensed under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Usage:
 *   var pathArray = $("a").cssSelector();
 *   var pathStrings = $("div > span").cssSelector("path");
 *   // e.g., ["html > body.login > div#bar > div#nav.b > span.a"}
 *   var pathArray = $("#header").cssSelector("refresh");
 */
;
(function($, window, document, undefined) {
    var pluginName = "cssSelector",
        // the name of using in .data()
        dataPlugin = "plugin_" + pluginName;
    var calculatePath = function(node) {
        var path = undefined;
        if (!node) {
            return path;
        }
        path = [];
        while (node.length) {
            var realNode = node[0],
                name = realNode.localName,
                id, classNameStr, currentNode;
            if (!name) {
                break;
            }
            currentNode = {};
            currentNode.name = name.toLowerCase();
            id = realNode.id;
            if ( !! id) {
                currentNode.id = id;
            }
            classNameStr = realNode.className;
            if ( !! classNameStr) {
                var classNames = classNameStr.split(/[\s\n]+/),
                    classNamesArray = [];
                for (var i = 0, l = classNames.length; i < l; i++) {
                    if ( !! classNames[i] && !! $.trim(classNames[i])) {
                        classNamesArray.push(classNames[i]);
                    }
                }
                if (classNamesArray.length > 0) {
                    currentNode.classes = [];
                    for (var i = 0, l = classNamesArray.length; i < l; i++) {
                        currentNode.classes.push(classNamesArray[i]);
                    }
                }
            }
            path.push(currentNode);
            node = node.parent();
        }
        return path.reverse();
    };
    var stringifyPath = function(paths) {
        var pathStr = undefined;
        if (!paths) {
            return pathStr;
        }
        pathStr = "";
        for (var i = 0, l = paths.length; i < l; i++) {
            pathStr = pathStr + " > " + paths[i].name;
            if (paths[i].name !== "html") {
                if ( !! paths[i].id) {
                    0
                    pathStr += "#" + paths[i].id;
                }
                if ( !! paths[i].classes && paths[i].classes.length > 0) {
                    pathStr += "." + paths[i].classes.join(".");
                }
            }
        }
        return pathStr.substring(3);
    };
    var CssSelector = function(element) {};
    CssSelector.prototype = {
        init: function() {
            this.paths = calculatePath(this.element);
        },
        pathArray: function() {
            return this.paths;
        },
        path: function() {
            return stringifyPath(this.paths);
        },
        refresh: function() {
            this.init();
            return this.pathArray();
        },
        destroy: function() {
            this.element.data(dataPlugin, null);
        }
    }
    $.fn[pluginName] = function(arg) {
        var args;
        return $.map(this, function(el) {
            var $el = $(el),
                instance = $el.data(dataPlugin);
            if (!(instance instanceof CssSelector)) {
                instance = new CssSelector($el);
                instance.element = $el;
                $el.data(dataPlugin, instance);
                instance.init();
            }
            if (arg === undefined) {
                return instance.pathArray();
            }
            if (typeof arg === "string" && typeof instance[arg] === "function") {
                args = Array.prototype.slice.call(arguments, 1);
                return instance[arg].apply(instance, args);
            } else {
                $.error("Method " + arg + " does not exist on jQuery." + pluginName);
            }
        });
    };
}(jQuery, window, document));
