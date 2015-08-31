(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.mdastLint = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:lint
 * @fileoverview Lint markdown with mdast.
 */

'use strict';

module.exports = require('./lib');

},{"./lib":3}],2:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:lint:filter
 * @fileoverview mdast plug-in used internally by
 *   mdast-lint to filter ruleId’s by enabled and disabled
 *   ranges, or by gaps.
 * @todo Externalise into its own repository.
 */

'use strict';

var position = require('mdast-util-position');
var visit = require('unist-util-visit');

/**
 * Remove warnings which are disabled, or are in gaps.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 */
function transformer(ast, file) {
    var lastNode = ast.children[ast.children.length - 1];
    var gaps = [];
    var offset = 0;
    var isGap = false;

    if (!file || !file.messages || !file.messages.length) {
        return;
    }

    /**
     * Patch a new position.
     *
     * @param {number?} [latest] - Last found position.
     */
    function update(latest) {
        if (latest === undefined || latest === null) {
            isGap = true;

            return;
        }

        if (offset > latest) {
            return;
        }

        if (isGap) {
            gaps.push({
                'start': offset,
                'end': latest
            });

            isGap = false;
        }

        offset = latest;
    }

    visit(ast, function (node) {
        var start = position.start(node);
        var end = position.end(node);

        update(start && start.offset);

        if (!node.children) {
            update(end && end.offset);
        }
    });

    if (offset === position.end(lastNode).offset) {
        update();
        update(file.toString().length - 1);
    }

    file.messages = file.messages.filter(function (message) {
        var ranges = file.lintRanges[message.ruleId];
        var index = ranges && ranges.length;
        var gapIndex = gaps.length;
        var length = -1;
        var pos;
        var range;

        if (!message.line) {
            message.line = 1;
        }

        if (!message.column) {
            message.column = 1;
        }

        pos = file.positionToOffset(message);

        while (gapIndex--) {
            if (
                gaps[gapIndex].start <= pos &&
                gaps[gapIndex].end > pos
            ) {
                return false;
            }
        }

        while (--index > length) {
            range = ranges[index];

            if (
                range.position.line < message.line ||
                (
                    range.position.line === message.line &&
                    range.position.column < message.column
                )
            ) {
                return range.state === true;
            }
        }

        /* xistanbul ignore next - Just to be safe */
        return true;
    });
}

/**
 * Return `transformer`.
 *
 * @return {Function} - See `transformer`.
 */
function attacher() {
    return transformer;
}

/*
 * Expose.
 */

module.exports = attacher;

},{"mdast-util-position":62,"unist-util-visit":66}],3:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:lint:library
 * @fileoverview mdast plug-in providing warnings when
 *   detecting style violations.
 */

'use strict';

/*
 * Dependencies.
 */

var sort = require('vfile-sort');
var range = require('mdast-range');
var zone = require('mdast-zone');
var internals = require('./rules');
var filter = require('./filter');

/*
 * Needed for plug-in resolving.
 */

var path = require('path');
var fs = require('fs');
var exists = fs && fs.existsSync;
var resolve = path && path.resolve;
var cwd = process && process.cwd();

/**
 * Factory to create a plugin from a rule.
 *
 * @example
 *   attachFactory('foo', console.log, false)() // null
 *   attachFactory('foo', console.log, {})() // plugin
 *
 * @param {string} id - Identifier.
 * @param {Function} rule - Rule
 * @param {*} options - Options for respective rule.
 * @return {Function} - See `attach` below.
 */
function attachFactory(id, rule, options) {
    /**
     * Attach the rule to an mdast instance, unless `false`
     * is passed as an option.
     *
     * @return {Function?} - See `plugin` below.
     */
    function attach() {
        /**
         * Attach the rule to an mdast instance, unless `false`
         * is passed as an option.
         *
         * @param {Node} ast - Root node.
         * @param {File} [file] - Virtual file.
         * @param {Function} next - Signal end.
         */
        function plugin(ast, file, next) {
            /*
             * Track new messages per file.
             */

            if (file.lintIndex === undefined || file.lintIndex === null) {
                file.lintIndex = file.messages.length;
            }

            /**
             * Add `ruleId` to each new message.
             *
             * @param {Error?} err - Optional failure.
             */
            function done(err) {
                var messages = file.messages;

                while (file.lintIndex < messages.length) {
                    messages[file.lintIndex].ruleId = id;

                    file.lintIndex++;
                }

                next(err);
            }

            /*
             * Invoke `rule`, with `options`
             */

            rule(ast, file, options, done);
        }

        return options === false ? null : plugin;
    }

    return attach;
}

/**
 * Require an external.  Checks, in this order:
 *
 * -  `$cwd/$pathlike`;
 * -  `$cwd/$pathlike.js`;
 * -  `$cwd/node_modules/$pathlike`;
 * -  `$pathlike`.
 *
 * Where `$cwd` is the current working directory.
 *
 * @example
 *   var plugin = findPlugin('foo');
 *
 * @throws {Error} - Fails when `pathlike` cannot be
 *   resolved.
 * @param {string} pathlike - Reference to external.
 * @return {Object} - Result of `require`ing external.
 */
function loadExternal(pathlike) {
    var local = resolve(cwd, pathlike);
    var current = resolve(cwd, 'node_modules', pathlike);
    var plugin;

    if (exists(local) || exists(local + '.js')) {
        plugin = local;
    /* istanbul ignore else - for globals */
    } else if (exists(current)) {
        plugin = current;
    } else {
        plugin = pathlike;
    }

    return require(plugin);
}

/**
 * Load all externals.  Merges them into a single rule
 * object.
 *
 * In node, accepts externals as strings, otherwise,
 * externals should be a list of objects.
 *
 * @param {Array.<string|Object>} externals - List of
 *   paths to look for externals (only works in Node),
 *   or a list of rule objects.
 * @return {Array.<Object>} - Rule object.
 * @throws {Error} - When an external cannot be resolved.
 */
function loadExternals(externals) {
    var index = -1;
    var rules = {};
    var external;
    var ruleId;
    var mapping = externals ? externals.concat() : [];
    var length;

    mapping.push(internals);
    length = mapping.length;

    while (++index < length) {
        external = mapping[index];

        if (typeof external === 'string') {
            external = loadExternal(external);
        }

        for (ruleId in external) {
            rules[ruleId] = external[ruleId];
        }
    }

    return rules;
}

/**
 * Lint attacher.
 *
 * By default, all rules are turned on unless explicitly
 * set to `false`.  When `reset: true`, the opposite is
 * true: all rules are turned off, unless when given
 * a non-nully and non-false value.
 *
 * @example
 *   var processor = lint(mdast, {
 *     'html': false // Ignore HTML warnings.
 *   });
 *
 * @param {MDAST} mdast - Host object.
 * @param {Object?} options - Hash of rule names mapping to
 *   rule options.
 */
function lint(mdast, options) {
    var settings = options || {};
    var reset = settings.reset;
    var rules = loadExternals(settings.external);
    var id;
    var setting;

    /*
     * Ensure offset information is added.
     */

    mdast.use(range);

    /**
     * Get the latest state of a rule.
     *
     * @param {string} ruleId - Unique rule name.
     * @param {File} [file] - File (optional)
     */
    function getState(ruleId, file) {
        var ranges = file && file.lintRanges && file.lintRanges[ruleId];

        if (ranges) {
            return ranges[ranges.length - 1].state;
        }

        setting = settings[ruleId];

        if (setting === false) {
            return false;
        }

        return !reset || (setting !== null && setting !== undefined);
    }

    /**
     * Store settings on `file`.
     *
     * @param {File} file - Virtual file.
     */
    function store(file) {
        var ranges = file.lintRanges;
        var ruleId;

        if (!ranges) {
            ranges = {};

            for (ruleId in rules) {
                ranges[ruleId] = [{
                    'state': getState(ruleId),
                    'position': {
                        'line': 0,
                        'column': 0
                    }
                }];
            }

            file.lintRanges = ranges;
        }
    }

    mdast.use(function () {
        return function (ast, file) {
            store(file);
        };
    });

    /*
     * Add each rule as a seperate plugin.
     */

    for (id in rules) {
        mdast.use(attachFactory(id, rules[id], settings[id]));
    }

    /**
     * Handle a new-found marker.
     *
     * @param {Object} marker - Marker context.
     * @param {Object} parser - Parser instance.
     */
    function onparse(marker, parser) {
        var file = parser.file;
        var attributes = marker.attributes.split(' ');
        var type = attributes[0];
        var ruleId = attributes[1];
        var markers;
        var currentState;
        var previousState;

        store(file);

        if (type !== 'disable' && type !== 'enable') {
            file.fail('Unknown lint keyword `' + type + '`: use either `\'enable\'` or `\'disable\'`', marker.node);

            return;
        }

        if (!(ruleId in rules)) {
            file.fail('Unknown rule: cannot ' + type + ' `\'' + ruleId + '\'`', marker.node);

            return;
        }

        markers = file.lintRanges[ruleId];

        previousState = getState(ruleId, file);
        currentState = type === 'enable';

        if (currentState !== previousState) {
            markers.push({
                'state': currentState,
                'position': marker.node.position.start
            });
        }
    }

    mdast.use(zone({
        'name': 'lint',
        'onparse': onparse
    }));

    /*
     * Filter.
     */

    mdast.use(filter);

    /**
     * Transformer sort messages.
     */
    return function (node, file, next) {
        sort(file);
        next();
    };
}

/*
 * Expose.
 */

module.exports = lint;

},{"./filter":2,"./rules":20,"fs":undefined,"mdast-range":60,"mdast-zone":64,"path":undefined,"vfile-sort":67}],4:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module blockquote-indentation
 * @fileoverview
 *   Warn when blockquotes are either indented too much or too little.
 *
 *   Options: `number`, default: `'consistent'`.
 *
 *   The default value, `consistent`, detects the first used indentation
 *   and will warn when other blockquotes use a different indentation.
 * @example
 *   <!-- Valid, when set to `4`, invalid when set to `2` -->
 *   >   Hello
 *   ...
 *   >   World
 *
 *   <!-- Valid, when set to `2`, invalid when set to `4` -->
 *   > Hello
 *   ...
 *   > World
 *
 *   <!-- Always invalid -->
 *   > Hello
 *   ...
 *   >   World
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var toString = require('mdast-util-to-string');
var plural = require('plur');
var position = require('mdast-util-position');

/**
 * Get the indent of a blockquote.
 *
 * @param {Node} node - Node to test.
 * @return {number} - Indentation.
 */
function check(node) {
    var head = node.children[0];
    var indentation = position.start(head).column - position.start(node).column;
    var padding = toString(head).match(/^ +/);

    if (padding) {
        indentation += padding[0].length;
    }

    return indentation;
}

/**
 * Warn when a blockquote has a too large or too small
 * indentation.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {number?} [preferred='consistent'] - Preferred
 *   indentation between a blockquote and its content.
 *   When not a number, defaults to the first found
 *   indentation.
 * @param {Function} done - Callback.
 */
function blockquoteIndentation(ast, file, preferred, done) {
    preferred = isNaN(preferred) || typeof preferred !== 'number' ? null : preferred;

    visit(ast, 'blockquote', function (node) {
        var indent;
        var diff;
        var word;

        if (position.generated(node) || !node.children.length) {
            return;
        }

        if (preferred) {
            indent = check(node);
            diff = preferred - indent;
            word = diff > 0 ? 'Add' : 'Remove';

            diff = Math.abs(diff);

            if (diff !== 0) {
                file.warn(
                    word + ' ' + diff + ' ' + plural('space', diff) +
                    ' between blockquote and content',
                    position.start(node.children[0])
                );
            }
        } else {
            preferred = check(node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = blockquoteIndentation;

},{"mdast-util-position":62,"mdast-util-to-string":63,"plur":65,"unist-util-visit":66}],5:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module checkbox-character-style
 * @fileoverview
 *   Warn when list item checkboxes violate a given style.
 *
 *   The default value, `consistent`, detects the first used checked
 *   and unchecked checkbox styles, and will warn when a subsequent
 *   checkboxes uses a different style.
 *
 *   These values can also be passed in as an object, such as:
 *
 *   ```json
 *   {
 *      "checked": 'x',
 *      "unchecked": ' '
 *   }
 *   ```
 * @example
 *   <!-- Note: the double guillemet (`»`) and middle-dots represent a tab -->
 *
 *   <!-- Valid by default, `'consistent'`, or `{'checked': 'x'}` -->
 *   - [x] List item
 *   - [x] List item
 *
 *   <!-- Valid by default, `'consistent'`, or `{'checked': 'X'}` -->
 *   - [X] List item
 *   - [X] List item
 *
 *   <!-- Valid by default, `'consistent'`, or `{'unchecked': ' '}` -->
 *   - [ ] List item
 *   - [ ] List item
 *
 *   <!-- Valid by default, `'consistent'`, or `{'unchecked': '»'}` -->
 *   - [»···] List item
 *   - [»···] List item
 *
 *   <!-- Always invalid -->
 *   - [x] List item
 *   - [X] List item
 *   - [ ] List item
 *   - [»···] List item
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;
var end = position.end;

var CHECKED = {
    'x': true,
    'X': true
};

var UNCHECKED = {
    ' ': true,
    '	': true
};

/**
 * Warn when list item checkboxes violate a given style.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {Object?} preferred - An object with `checked`
 *   and `unchecked` properties, each set to null to default to
 *   the first found style, or set to `'x'` or `'X'` for checked,
 *   or `' '` (space) or `'\t'` (tab) for unchecked.
 * @param {Function} done - Callback.
 */
function checkboxCharacterStyle(ast, file, preferred, done) {
    var contents = file.toString();

    if (preferred === 'consistent' || typeof preferred !== 'object') {
        preferred = {};
    }

    if (!preferred.unchecked) {
        preferred.unchecked = null;
    }

    if (!preferred.checked) {
        preferred.checked = null;
    }

    if (
        preferred.unchecked !== null &&
        UNCHECKED[preferred.unchecked] !== true
    ) {
        file.fail(
            'Invalid unchecked checkbox marker `' +
            preferred.unchecked +
            '`: use either `\'\\t\'`, or `\' \'`'
        );
    }

    if (
        preferred.checked !== null &&
        CHECKED[preferred.checked] !== true
    ) {
        file.fail(
            'Invalid checked checkbox marker `' +
            preferred.checked +
            '`: use either `\'x\'`, or `\'X\'`'
        );
    }

    visit(ast, 'listItem', function (node) {
        var type;
        var initial;
        var final;
        var stop;
        var value;
        var style;
        var character;

        /*
         * Exit early for items without checkbox.
         */

        if (
            node.checked !== Boolean(node.checked) ||
            position.generated(node)
        ) {
            return;
        }

        type = node.checked ? 'checked' : 'unchecked';

        initial = start(node).offset;
        final = (node.children.length ? start(node.children[0]) : end(node)).offset;

        /*
         * For a checkbox to be parsed, it must be followed
         * by a white space.
         */

        value = contents.slice(initial, final).trimRight().slice(0, -1);

        /*
         * The checkbox character is behind a square
         * bracket.
         */

        character = value.charAt(value.length - 1);
        style = preferred[type];

        if (style === null) {
            preferred[type] = character;
        } else if (character !== style) {
            stop = initial + value.length;

            file.warn(
                type.charAt(0).toUpperCase() + type.slice(1) +
                ' checkboxes should use `' + style + '` as a marker',
                {
                    'start': file.offsetToPosition(stop - 1),
                    'end': file.offsetToPosition(stop)
                }
            );
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = checkboxCharacterStyle;

},{"mdast-util-position":62,"unist-util-visit":66}],6:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module checkbox-content-indent
 * @fileoverview
 *   Warn when list item checkboxes are followed by too much white-space.
 * @example
 *   <!-- Valid: -->
 *   - [ ] List item
 *   +  [x] List item
 *   *   [X] List item
 *   -    [ ] List item
 *
 *   <!-- Invalid: -->
 *   - [ ] List item
 *   + [x]  List item
 *   * [X]   List item
 *   - [ ]    List item
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;
var end = position.end;

/**
 * Warn when list item checkboxes are followed by too much white-space.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function checkboxContentIndent(ast, file, preferred, done) {
    var contents = file.toString();

    visit(ast, 'listItem', function (node) {
        var initial;
        var final;
        var value;

        /*
         * Exit early for items without checkbox.
         */

        if (
            node.checked !== Boolean(node.checked) ||
            position.generated(node)
        ) {
            return;
        }

        initial = start(node).offset;
        final = (node.children.length ? start(node.children[0]) : end(node)).offset;

        while (/[^\S\n]/.test(contents.charAt(final))) {
            final++;
        }

        /*
         * For a checkbox to be parsed, it must be followed
         * by a white space.
         */

        value = contents.slice(initial, final);

        value = value.slice(value.indexOf(']') + 1);

        if (value.length === 1) {
            return;
        }

        file.warn('Checkboxes should be followed by a single character', {
            'start': file.offsetToPosition(final - value.length + 1),
            'end': file.offsetToPosition(final)
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = checkboxContentIndent;

},{"mdast-util-position":62,"unist-util-visit":66}],7:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module code-block-style
 * @fileoverview
 *   Warn when code-blocks do not adhere to a given style.
 *
 *   Options: `string`, either `'consistent'`, `'fences'`, or `'indented'`,
 *   default: `'consistent'`.
 *
 *   The default value, `consistent`, detects the first used code-block
 *   style, and will warn when a subsequent code-block uses a different
 *   style.
 * @example
 *   <!-- Valid, when set to `indented` or `consistent`, invalid when set to `fenced` -->
 *      Hello
 *
 *   ...
 *
 *      World
 *
 *   <!-- Valid, when set to `fenced` or `consistent`, invalid when set to `indented` -->
 *   ```
 *   Hello
 *   ```
 *   ...
 *   ```bar
 *   World
 *   ```
 *
 *   <!-- Always invalid -->
 *       Hello
 *   ...
 *   ```
 *   World
 *     ```
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;
var end = position.end;

/*
 * Valid styles.
 */

var STYLES = {
    'null': true,
    'fenced': true,
    'indented': true
};

/**
 * Warn for violating code-block style.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} [preferred='consistent'] - Preferred
 *   code block style.  Defaults to `'consistent'` when
 *   not a a string.  Otherwise, should be one of
 *   `'fenced'` or `'indented'`.
 * @param {Function} done - Callback.
 */
function codeBlockStyle(ast, file, preferred, done) {
    var contents = file.toString();

    preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

    if (STYLES[preferred] !== true) {
        file.fail('Invalid code block style `' + preferred + '`: use either `\'consistent\'`, `\'fenced\'`, or `\'indented\'`');

        return;
    }

    /**
     * Get the style of `node`.
     *
     * @param {Node} node - Node.
     * @return {string?} - `'fenced'`, `'indented'`, or
     *   `null`.
     */
    function check(node) {
        var initial = start(node).offset;
        var final = end(node).offset;

        if (position.generated(node)) {
            return null;
        }

        if (
            node.lang ||
            /^\s*([~`])\1{2,}/.test(contents.slice(initial, final))
        ) {
            return 'fenced';
        }

        return 'indented';
    }

    visit(ast, 'code', function (node) {
        var current = check(node);

        if (!current) {
            return;
        }

        if (!preferred) {
            preferred = current;
        } else if (preferred !== current) {
            file.warn('Code blocks should be ' + preferred, node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = codeBlockStyle;

},{"mdast-util-position":62,"unist-util-visit":66}],8:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module definition-case
 * @fileoverview
 *   Warn when definition labels are not lower-case.
 * @example
 *   <!-- Valid -->
 *   [example] http://example.com "Example Domain"
 *
 *   <!-- Invalid -->
 *   ![Example] http://example.com/favicon.ico "Example image"
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Expressions.
 */

var LABEL = /^\s*\[((?:\\[\s\S]|[^\[\]])+)\]/;

/**
 * Warn when definitions are not placed at the end of the
 * file.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function definitionCase(ast, file, preferred, done) {
    var contents = file.toString();

    /**
     * Validate a node, either a normal definition or
     * a footnote definition.
     *
     * @param {Node} node - Node.
     */
    function validate(node) {
        var start = position.start(node).offset;
        var end = position.end(node).offset;
        var label;

        if (position.generated(node)) {
            return;
        }

        label = contents.slice(start, end).match(LABEL)[1];

        if (label !== label.toLowerCase()) {
            file.warn('Do not use upper-case characters in definition labels', node);
        }
    }

    visit(ast, 'definition', validate);
    visit(ast, 'footnoteDefinition', validate);

    done();
}

/*
 * Expose.
 */

module.exports = definitionCase;

},{"mdast-util-position":62,"unist-util-visit":66}],9:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module definition-spacing
 * @fileoverview
 *   Warn when consecutive white space is used in a definition.
 * @example
 *   <!-- Valid -->
 *   [example domain] http://example.com "Example Domain"
 *
 *   <!-- Invalid -->
 *   ![example    image] http://example.com/favicon.ico "Example image"
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Expressions.
 */

var LABEL = /^\s*\[((?:\\[\s\S]|[^\[\]])+)\]/;

/**
 * Warn when consecutive white space is used in a
 * definition.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function definitionSpacing(ast, file, preferred, done) {
    var contents = file.toString();

    /**
     * Validate a node, either a normal definition or
     * a footnote definition.
     *
     * @param {Node} node - Node.
     */
    function validate(node) {
        var start = position.start(node).offset;
        var end = position.end(node).offset;
        var label;

        if (position.generated(node)) {
            return;
        }

        label = contents.slice(start, end).match(LABEL)[1];

        if (/[ \t\n]{2,}/.test(label)) {
            file.warn('Do not use consecutive white-space in definition labels', node);
        }
    }

    visit(ast, 'definition', validate);
    visit(ast, 'footnoteDefinition', validate);

    done();
}

/*
 * Expose.
 */

module.exports = definitionSpacing;

},{"mdast-util-position":62,"unist-util-visit":66}],10:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module emphasis-marker
 * @fileoverview
 *   Warn for violating emphasis markers.
 *
 *   Options: `string`, either `'consistent'`, `'*'`, or `'_'`,
 *   default: `'consistent'`.
 *
 *   The default value, `consistent`, detects the first used emphasis
 *   style, and will warn when a subsequent emphasis uses a different
 *   style.
 * @example
 *   <!-- Valid when set to `consistent` or `*` -->
 *   *foo*
 *   *bar*
 *
 *   <!-- Valid when set to `consistent` or `_` -->
 *   _foo_
 *   _bar_
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Map of valid markers.
 */

var MARKERS = {
    '*': true,
    '_': true,
    'null': true
};

/**
 * Warn when an `emphasis` node has an incorrect marker.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} [preferred='consistent'] - Preferred
 *   marker, either `'*'` or `'_'`, or `'consistent'`.
 * @param {Function} done - Callback.
 */
function emphasisMarker(ast, file, preferred, done) {
    preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

    if (MARKERS[preferred] !== true) {
        file.fail('Invalid emphasis marker `' + preferred + '`: use either `\'consistent\'`, `\'*\'`, or `\'_\'`');

        return;
    }

    visit(ast, 'emphasis', function (node) {
        var marker = file.toString().charAt(position.start(node).offset);

        if (position.generated(node)) {
            return;
        }

        if (preferred) {
            if (marker !== preferred) {
                file.warn('Emphasis should use `' + preferred + '` as a marker', node);
            }
        } else {
            preferred = marker;
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = emphasisMarker;

},{"mdast-util-position":62,"unist-util-visit":66}],11:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module fenced-code-flag
 * @fileoverview
 *   Warn when fenced code blocks occur without language flag.
 *
 *   Options: `Array.<string>` or `Object`.
 *
 *   Providing an array, is a shortcut for just providing the `flags`
 *   property on the object.
 *
 *   The object can have an array of flags which are deemed valid.
 *   In addition it can have the property `allowEmpty` (`boolean`)
 *   which signifies whether or not to warn for fenced code-blocks without
 *   languge flags.
 * @example
 *   <!-- Valid: -->
 *   ```hello
 *   world();
 *   ```
 *
 *   <!-- Valid: -->
 *      Hello
 *
 *   <!-- Invalid: -->
 *   ```
 *   world();
 *   ```
 *
 *   <!-- Valid when given `{allowEmpty: true}`: -->
 *   ```
 *   world();
 *   ```
 *
 *   <!-- Invalid when given `["world"]`: -->
 *   ```hello
 *   world();
 *   ```
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;
var end = position.end;

/**
 * Warn for fenced code blocks without language flag.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {Object|Array.<string>} [preferred] - List
 *   of flags deemed valid.
 * @param {Function} done - Callback.
 */
function fencedCodeFlag(ast, file, preferred, done) {
    var contents = file.toString();
    var allowEmpty = false;
    var flags = [];

    if (typeof preferred === 'object' && !('length' in preferred)) {
        allowEmpty = Boolean(preferred.allowEmpty);

        preferred = preferred.flags;
    }

    if (typeof preferred === 'object' && 'length' in preferred) {
        flags = String(preferred).split(',');
    }

    visit(ast, 'code', function (node) {
        var value = contents.slice(start(node).offset, end(node).offset);

        if (position.generated(node)) {
            return;
        }

        if (node.lang) {
            if (flags.length && flags.indexOf(node.lang) === -1) {
                file.warn('Invalid code-language flag', node);
            }
        } else if (/^\ {0,3}([~`])\1{2,}/.test(value) && !allowEmpty) {
            file.warn('Missing code-language flag', node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = fencedCodeFlag;

},{"mdast-util-position":62,"unist-util-visit":66}],12:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module fenced-code-marker
 * @fileoverview
 *   Warn for violating fenced code markers.
 *
 *   Options: `string`, either `` '`' ``, or `'~'`, default: `'consistent'`.
 *
 *   The default value, `consistent`, detects the first used fenced code
 *   marker style, and will warn when a subsequent fenced code uses a
 *   different style.
 * @example
 *   <!-- Valid by default and `` '`' ``: -->
 *   ```foo
 *   bar();
 *   ```
 *
 *   ```
 *   baz();
 *   ```
 *
 *   <!-- Valid by default and `'~'`: -->
 *   ~~~foo
 *   bar();
 *   ~~~
 *
 *   ~~~
 *   baz();
 *   ~~~
 *
 *   <!-- Always invalid: -->
 *   ~~~foo
 *   bar();
 *   ~~~
 *
 *   ```
 *   baz();
 *   ```
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Map of valid markers.
 */

var MARKERS = {
    '`': true,
    '~': true,
    'null': true
};

/**
 * Warn for violating fenced code markers.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} [preferred='consistent'] - Preferred
 *   marker, either `` '`' `` or `~`, or `'consistent'`.
 * @param {Function} done - Callback.
 */
function fencedCodeMarker(ast, file, preferred, done) {
    var contents = file.toString();

    preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

    if (MARKERS[preferred] !== true) {
        file.fail('Invalid fenced code marker `' + preferred + '`: use either `\'consistent\'`, `` \'\`\' ``, or `\'~\'`');

        return;
    }

    visit(ast, 'code', function (node) {
        var marker = contents.substr(position.start(node).offset, 4);

        if (position.generated(node)) {
            return;
        }

        marker = marker.trimLeft().charAt(0);

        /*
         * Ignore unfenced code blocks.
         */

        if (MARKERS[marker] !== true) {
            return;
        }

        if (preferred) {
            if (marker !== preferred) {
                file.warn('Fenced code should use ' + preferred + ' as a marker', node);
            }
        } else {
            preferred = marker;
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = fencedCodeMarker;

},{"mdast-util-position":62,"unist-util-visit":66}],13:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module file-extension
 * @fileoverview
 *   Warn when the document’s extension differs from the given preferred
 *   extension.
 *
 *   Does not warn when given documents have no file extensions (such as
 *   `AUTHORS` or `LICENSE`).
 *
 *   Options: `string`, default: `'md'` — Expected file extension.
 * @example
 *   Invalid (when `'md'`): readme.mkd, readme.markdown, etc.
 *   Valid (when `'md'`): readme, readme.md
 */

'use strict';

/**
 * Check file extensions.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} [preferred='md'] - Expected file
 *   extension.
 * @param {Function} done - Callback.
 */
function fileExtension(ast, file, preferred, done) {
    var ext = file.extension;

    preferred = typeof preferred === 'string' ? preferred : 'md';

    if (ext !== '' && ext !== preferred) {
        file.warn('Invalid extension: use `' + preferred + '`');
    }

    done();
}

/*
 * Expose.
 */

module.exports = fileExtension;

},{}],14:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module final-definition
 * @fileoverview
 *   Warn when definitions are not placed at the end of the file.
 * @example
 *   <!-- Valid: -->
 *   ...
 *
 *   [example] http://example.com "Example Domain"
 *
 *   <!-- Invalid: -->
 *   ...
 *
 *   [example] http://example.com "Example Domain"
 *
 *   A trailing paragraph.
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;

/**
 * Warn when definitions are not placed at the end of
 * the file.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function finalDefinition(ast, file, preferred, done) {
    var last = null;

    visit(ast, function (node) {
        var line = start(node).line;

        /*
         * Ignore generated nodes.
         */

        if (node.type === 'root' || position.generated(node)) {
            return;
        }

        if (node.type === 'definition') {
            if (last !== null && last > line) {
                file.warn('Move definitions to the end of the file (after the node at line `' + last + '`)', node);
            }
        } else if (last === null) {
            last = line;
        }
    }, true);

    done();
}

/*
 * Expose.
 */

module.exports = finalDefinition;

},{"mdast-util-position":62,"unist-util-visit":66}],15:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module final-newline
 * @fileoverview
 *   Warn when a newline at the end of a file is missing.
 *
 *   See [StackExchange](http://unix.stackexchange.com/questions/18743) for
 *   why.
 */

'use strict';

/**
 * Warn when the list-item marker style of unordered lists
 * violate a given style.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function finalNewline(ast, file, preferred, done) {
    var contents = file.toString();
    var last = contents.length - 1;

    if (last > 0 && contents.charAt(last) !== '\n') {
        file.warn('Missing newline character at end of file');
    }

    done();
}

/*
 * Expose.
 */

module.exports = finalNewline;

},{}],16:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module first-heading-level
 * @fileoverview
 *   Warn when the first heading has a level other than `1`.
 * @example
 *   <!-- Valid: -->
 *   # Foo
 *
 *   ## Bar
 *
 *   <!-- Invalid: -->
 *   ## Foo
 *
 *   # Bar
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/**
 * Warn when the first heading has a level other than `1`.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function firstHeadingLevel(ast, file, preferred, done) {
    visit(ast, 'heading', function (node) {
        if (position.generated(node)) {
            return null;
        }

        if (node.depth !== 1) {
            file.warn('First heading level should be `1`', node);
        }

        return false;
    });

    done();
}

module.exports = firstHeadingLevel;

},{"mdast-util-position":62,"unist-util-visit":66}],17:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module hard-break-spaces
 * @fileoverview
 *   Warn when too many spaces are used to create a hard break.
 * @example
 *   <!-- Note: the middle-dots represent spaces -->
 *
 *   <!-- Valid: -->
 *   Lorem ipsum··
 *   dolor sit amet
 *
 *   <!-- Invalid: -->
 *   Lorem ipsum···
 *   dolor sit amet.
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/**
 * Warn when too many spaces are used to create a
 * hard break.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function hardBreakSpaces(ast, file, preferred, done) {
    var contents = file.toString();

    visit(ast, 'break', function (node) {
        var start = position.start(node).offset;
        var end = position.end(node).offset;

        if (position.generated(node)) {
            return;
        }

        if (contents.slice(start, end).length > 3) {
            file.warn('Use two spaces for hard line breaks', node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = hardBreakSpaces;

},{"mdast-util-position":62,"unist-util-visit":66}],18:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module heading-increment
 * @fileoverview
 *   Warn when headings increment with more than 1 level at a time.
 * @example
 *   <!-- Valid: -->
 *   # Foo
 *
 *   ## Bar
 *
 *   <!-- Invalid: -->
 *   # Foo
 *
 *   ### Bar
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/**
 * Warn when headings increment with more than 1 level at
 * a time.
 *
 * Never warns for the first heading.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function headingIncrement(ast, file, preferred, done) {
    var prev = null;

    visit(ast, 'heading', function (node) {
        var depth = node.depth;

        if (position.generated(node)) {
            return;
        }

        if (prev && depth > prev + 1) {
            file.warn('Heading levels should increment by one level at a time', node);
        }

        prev = depth;
    });

    done();
}

/*
 * Expose.
 */

module.exports = headingIncrement;

},{"mdast-util-position":62,"unist-util-visit":66}],19:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module heading-style
 * @fileoverview
 *   Warn when a heading does not conform to a given style.
 *
 *   Options: `string`, either `'consistent'`, `'atx'`, `'atx-closed'`,
 *   or `'setext'`, default: `'consistent'`.
 *
 *   The default value, `consistent`, detects the first used heading
 *   style, and will warn when a subsequent heading uses a different
 *   style.
 * @example
 *   <!-- Valid when `consistent` or `atx` -->
 *   # Foo
 *
 *   ## Bar
 *
 *   ### Baz
 *
 *   <!-- Valid when `consistent` or `atx-closed` -->
 *   # Foo #
 *
 *   ## Bar #
 *
 *   ### Baz ###
 *
 *   <!-- Valid when `consistent` or `setext` -->
 *   Foo
 *   ===
 *
 *   Bar
 *   ---
 *
 *   ### Baz
 *
 *   <!-- Invalid -->
 *   Foo
 *   ===
 *
 *   ## Bar
 *
 *   ### Baz ###
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var style = require('mdast-util-heading-style');
var position = require('mdast-util-position');

/*
 * Types.
 */

var TYPES = ['atx', 'atx-closed', 'setext'];

/**
 * Warn when a heading does not conform to a given style.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string} [preferred='consistent'] - Preferred
 *   style, one of `atx`, `atx-closed`, or `setext`.
 *   Other values default to `'consistent'`, which will
 *   detect the first used style.
 * @param {Function} done - Callback.
 */
function headingStyle(ast, file, preferred, done) {
    preferred = TYPES.indexOf(preferred) === -1 ? null : preferred;

    visit(ast, 'heading', function (node) {
        if (position.generated(node)) {
            return;
        }

        if (preferred) {
            if (style(node, preferred) !== preferred) {
                file.warn('Headings should use ' + preferred, node);
            }
        } else {
            preferred = style(node, preferred);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = headingStyle;

},{"mdast-util-heading-style":61,"mdast-util-position":62,"unist-util-visit":66}],20:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module Rules
 * @fileoverview Map of rule id’s to rules.
 */

'use strict';

/*
 * Expose.
 */

module.exports = {
    'no-auto-link-without-protocol': require('./no-auto-link-without-protocol'),
    'no-literal-urls': require('./no-literal-urls'),
    'no-consecutive-blank-lines': require('./no-consecutive-blank-lines'),
    'no-missing-blank-lines': require('./no-missing-blank-lines'),
    'blockquote-indentation': require('./blockquote-indentation'),
    'no-blockquote-without-caret': require('./no-blockquote-without-caret'),
    'code-block-style': require('./code-block-style'),
    'checkbox-content-indent': require('./checkbox-content-indent'),
    'checkbox-character-style': require('./checkbox-character-style'),
    'definition-case': require('./definition-case'),
    'definition-spacing': require('./definition-spacing'),
    'no-emphasis-as-heading': require('./no-emphasis-as-heading'),
    'emphasis-marker': require('./emphasis-marker'),
    'fenced-code-flag': require('./fenced-code-flag'),
    'fenced-code-marker': require('./fenced-code-marker'),
    'file-extension': require('./file-extension'),
    'final-newline': require('./final-newline'),
    'no-file-name-articles': require('./no-file-name-articles'),
    'no-file-name-consecutive-dashes': require('./no-file-name-consecutive-dashes'),
    'no-file-name-irregular-characters': require('./no-file-name-irregular-characters'),
    'no-file-name-mixed-case': require('./no-file-name-mixed-case'),
    'no-file-name-outer-dashes': require('./no-file-name-outer-dashes'),
    'final-definition': require('./final-definition'),
    'hard-break-spaces': require('./hard-break-spaces'),
    'heading-increment': require('./heading-increment'),
    'no-heading-content-indent': require('./no-heading-content-indent'),
    'no-heading-indent': require('./no-heading-indent'),
    'first-heading-level': require('./first-heading-level'),
    'maximum-heading-length': require('./maximum-heading-length'),
    'no-heading-punctuation': require('./no-heading-punctuation'),
    'heading-style': require('./heading-style'),
    'no-multiple-toplevel-headings': require('./no-multiple-toplevel-headings'),
    'no-duplicate-headings': require('./no-duplicate-headings'),
    'no-duplicate-definitions': require('./no-duplicate-definitions'),
    'no-html': require('./no-html'),
    'no-inline-padding': require('./no-inline-padding'),
    'maximum-line-length': require('./maximum-line-length'),
    'link-title-style': require('./link-title-style'),
    'list-item-bullet-indent': require('./list-item-bullet-indent'),
    'list-item-content-indent': require('./list-item-content-indent'),
    'list-item-indent': require('./list-item-indent'),
    'list-item-spacing': require('./list-item-spacing'),
    'ordered-list-marker-style': require('./ordered-list-marker-style'),
    'ordered-list-marker-value': require('./ordered-list-marker-value'),
    'no-shortcut-reference-image': require('./no-shortcut-reference-image'),
    'no-shortcut-reference-link': require('./no-shortcut-reference-link'),
    'rule-style': require('./rule-style'),
    'no-shell-dollars': require('./no-shell-dollars'),
    'strong-marker': require('./strong-marker'),
    'no-table-indentation': require('./no-table-indentation'),
    'table-pipe-alignment': require('./table-pipe-alignment'),
    'table-cell-padding': require('./table-cell-padding'),
    'table-pipes': require('./table-pipes'),
    'no-tabs': require('./no-tabs'),
    'unordered-list-marker-style': require('./unordered-list-marker-style')
};

},{"./blockquote-indentation":4,"./checkbox-character-style":5,"./checkbox-content-indent":6,"./code-block-style":7,"./definition-case":8,"./definition-spacing":9,"./emphasis-marker":10,"./fenced-code-flag":11,"./fenced-code-marker":12,"./file-extension":13,"./final-definition":14,"./final-newline":15,"./first-heading-level":16,"./hard-break-spaces":17,"./heading-increment":18,"./heading-style":19,"./link-title-style":21,"./list-item-bullet-indent":22,"./list-item-content-indent":23,"./list-item-indent":24,"./list-item-spacing":25,"./maximum-heading-length":26,"./maximum-line-length":27,"./no-auto-link-without-protocol":28,"./no-blockquote-without-caret":29,"./no-consecutive-blank-lines":30,"./no-duplicate-definitions":31,"./no-duplicate-headings":32,"./no-emphasis-as-heading":33,"./no-file-name-articles":34,"./no-file-name-consecutive-dashes":35,"./no-file-name-irregular-characters":36,"./no-file-name-mixed-case":37,"./no-file-name-outer-dashes":38,"./no-heading-content-indent":39,"./no-heading-indent":40,"./no-heading-punctuation":41,"./no-html":42,"./no-inline-padding":43,"./no-literal-urls":44,"./no-missing-blank-lines":45,"./no-multiple-toplevel-headings":46,"./no-shell-dollars":47,"./no-shortcut-reference-image":48,"./no-shortcut-reference-link":49,"./no-table-indentation":50,"./no-tabs":51,"./ordered-list-marker-style":52,"./ordered-list-marker-value":53,"./rule-style":54,"./strong-marker":55,"./table-cell-padding":56,"./table-pipe-alignment":57,"./table-pipes":58,"./unordered-list-marker-style":59}],21:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module link-title-style
 * @fileoverview
 *   Warn when link and definition titles occur with incorrect quotes.
 *
 *   Options: `string`, either `'consistent'`, `'"'`, `'\''`, or
 *   `'()'`, default: `'consistent'`.
 *
 *   The default value, `consistent`, detects the first used quote
 *   style, and will warn when a subsequent titles use a different
 *   style.
 * @example
 *   <!-- Valid when `consistent` or `"` -->
 *   [Example](http://example.com "Example Domain")
 *   [Example](http://example.com "Example Domain")
 *
 *   <!-- Valid when `consistent` or `'` -->
 *   [Example](http://example.com 'Example Domain')
 *   [Example](http://example.com 'Example Domain')
 *
 *   <!-- Valid when `consistent` or `()` -->
 *   [Example](http://example.com (Example Domain))
 *   [Example](http://example.com (Example Domain))
 *
 *   <!-- Always invalid -->
 *   [Example](http://example.com "Example Domain")
 *   [Example](http://example.com 'Example Domain')
 *   [Example](http://example.com (Example Domain))
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Map of valid markers.
 */

var MARKERS = {
    '"': true,
    '\'': true,
    ')': true,
    'null': true
};

/*
 * Methods.
 */

var end = position.end;

/**
 * Warn for fenced code blocks without language flag.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} [preferred='consistent'] - Preferred
 *   marker, either `'"'`, `'\''`, `'()'`, or `'consistent'`.
 * @param {Function} done - Callback.
 */
function linkTitleStyle(ast, file, preferred, done) {
    var contents = file.toString();

    preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

    if (preferred === '()' || preferred === '(') {
        preferred = ')';
    }

    if (MARKERS[preferred] !== true) {
        file.fail('Invalid link title style marker `' + preferred + '`: use either `\'consistent\'`, `\'"\'`, `\'\\\'\'`, or `\'()\'`');

        return;
    }

    /**
     * Validate a single node.
     *
     * @param {Node} node - Node.
     */
    function validate(node) {
        var last = end(node).offset - 1;
        var character;
        var pos;

        if (position.generated(node)) {
            return;
        }

        if (node.type !== 'definition') {
            last--;
        }

        while (last) {
            character = contents.charAt(last);

            if (/\s/.test(character)) {
                last--;
            } else {
                break;
            }
        }

        /*
         * Not a title.
         */

        if (!(character in MARKERS)) {
            return;
        }

        if (!preferred) {
            preferred = character;
        } else if (preferred !== character) {
            pos = file.offsetToPosition(last + 1);
            file.warn('Titles should use `' + (preferred === ')' ? '()' : preferred) + '` as a quote', pos);
        }
    }

    visit(ast, 'link', validate);
    visit(ast, 'image', validate);
    visit(ast, 'definition', validate);

    done();
}

/*
 * Expose.
 */

module.exports = linkTitleStyle;

},{"mdast-util-position":62,"unist-util-visit":66}],22:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module list-item-bullet-indent
 * @fileoverview
 *   Warn when list item bullets are indented.
 * @example
 *   <!-- Valid -->
 *   * List item
 *   * List item
 *
 *   <!-- Invalid -->
 *     * List item
 *     * List item
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');
var plural = require('plur');

/*
 * Methods.
 */

var start = position.start;

/**
 * Warn when list item bullets are indented.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function listItemBulletIndent(ast, file, preferred, done) {
    var contents = file.toString();

    visit(ast, 'list', function (node) {
        var items = node.children;

        items.forEach(function (item) {
            var head = item.children[0];
            var initial = start(item).offset;
            var final = start(head).offset;
            var indent;

            if (position.generated(node)) {
                return;
            }

            indent = contents.slice(initial, final).match(/^\s*/)[0].length;

            if (indent !== 0) {
                initial = start(head);

                file.warn('Incorrect indentation before bullet: remove ' + indent + ' ' + plural('space', indent), {
                    'line': initial.line,
                    'column': initial.column - indent
                });
            }
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = listItemBulletIndent;

},{"mdast-util-position":62,"plur":65,"unist-util-visit":66}],23:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module list-item-content-indent
 * @fileoverview
 *   Warn when the content of a list item has mixed indentation.
 * @example
 *   <!-- Valid -->
 *   *   List item
 *
 *       *   Nested list item indented by 4 spaces
 *
 *   <!-- Invalid -->
 *   *   List item
 *
 *      *   Nested list item indented by 3 spaces
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');
var plural = require('plur');

/*
 * Methods.
 */

var start = position.start;

/**
 * Warn when the content of a list item has mixed
 * indentation.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function listItemContentIndent(ast, file, preferred, done) {
    var contents = file.toString();

    visit(ast, 'listItem', function (node) {
        var style;

        node.children.forEach(function (item, index) {
            var begin = start(item);
            var column = begin.column;
            var char;
            var diff;
            var word;

            if (position.generated(item)) {
                return;
            }

            /*
             * Get indentation for the first child.
             * Only the first item can have a checkbox,
             * so here we remove that from the column.
             */

            if (index === 0) {
                if (Boolean(node.checked) === node.checked) {
                    char = begin.offset;

                    while (contents.charAt(char) !== '[') {
                        char--;
                    }

                    column -= begin.offset - char;
                }

                style = column;

                return;
            }

            /*
             * Warn for violating children.
             */

            if (column !== style) {
                diff = style - column;
                word = diff > 0 ? 'add' : 'remove';

                diff = Math.abs(diff);

                file.warn(
                    'Don’t use mixed indentation for children, ' + word +
                    ' ' + diff + ' ' + plural('space', diff),
                    {
                        'line': start(item).line,
                        'column': column
                    }
                );
            }
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = listItemContentIndent;

},{"mdast-util-position":62,"plur":65,"unist-util-visit":66}],24:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module list-item-indent
 * @fileoverview
 *   Warn when the spacing between a list item’s bullet and its content
 *   violates a given style.
 *
 *   Options: `string`, either `'tab-size'`, `'mixed'`, or `'space'`,
 *   default: `'tab-size'`.
 * @example
 *   <!-- Valid when `tab-size` -->
 *   *   List
 *       item.
 *
 *   11. List
 *       item.
 *
 *   <!-- Valid when `mixed` -->
 *   * List item.
 *
 *   11. List item
 *
 *   *   List
 *       item.
 *
 *   11. List
 *       item.
 *
 *   <!-- Valid when `space` -->
 *   * List item.
 *
 *   11. List item
 *
 *   * List
 *     item.
 *
 *   11. List
 *       item.
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');
var plural = require('plur');

/*
 * Methods.
 */

var start = position.start;

/*
 * Styles.
 */

var STYLES = {
    'tab-size': true,
    'mixed': true,
    'space': true
};

/**
 * Warn when the spacing between a list item’s bullet and
 * its content violates a given style.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} [preferred='tab-size'] - Either
 *   `'tab-size'`, `'space'`, or `'mixed'`, defaulting
 *   to the first.
 * @param {Function} done - Callback.
 */
function listItemIndent(ast, file, preferred, done) {
    var contents = file.toString();

    preferred = typeof preferred !== 'string' ? 'tab-size' : preferred;

    if (STYLES[preferred] !== true) {
        file.fail('Invalid list-item indent style `' + preferred + '`: use either `\'tab-size\'`, `\'space\'`, or `\'mixed\'`');

        return;
    }

    visit(ast, 'list', function (node) {
        var items = node.children;
        var isOrdered = node.ordered;
        var offset = node.start || 1;

        if (position.generated(node)) {
            return;
        }

        items.forEach(function (item, index) {
            var head = item.children[0];
            var bulletSize = isOrdered ? String(offset + index).length + 1 : 1;
            var tab = Math.ceil(bulletSize / 4) * 4;
            var initial = start(item).offset;
            var final = start(head).offset;
            var marker;
            var shouldBe;
            var diff;
            var word;

            marker = contents.slice(initial, final);

            /*
             * Support checkboxes.
             */

            marker = marker.replace(/\[[x ]?\]\s*$/i, '');

            if (preferred === 'tab-size') {
                shouldBe = tab;
            } else if (preferred === 'space') {
                shouldBe = bulletSize + 1;
            } else {
                shouldBe = node.loose ? tab : bulletSize + 1;
            }

            if (marker.length !== shouldBe) {
                diff = shouldBe - marker.length;
                word = diff > 0 ? 'add' : 'remove';

                diff = Math.abs(diff);

                file.warn(
                    'Incorrect list-item indent: ' + word +
                    ' ' + diff + ' ' + plural('space', diff),
                    start(head)
                );
            }
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = listItemIndent;

},{"mdast-util-position":62,"plur":65,"unist-util-visit":66}],25:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module list-item-spacing
 * @fileoverview
 *   Warn when list looseness is incorrect, such as being tight
 *   when it should be loose, and vice versa.
 * @example
 *   <!-- Valid: -->
 *   -   Wrapped
 *       item
 *
 *   -   item 2
 *
 *   -   item 3
 *
 *   <!-- Valid: -->
 *   -   item 1
 *   -   item 2
 *   -   item 3
 *
 *   <!-- Invalid: -->
 *   -   Wrapped
 *       item
 *   -   item 2
 *   -   item 3
 *
 *   <!-- Invalid: -->
 *   -   item 1
 *
 *   -   item 2
 *
 *   -   item 3
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;
var end = position.end;

/**
 * Warn when list items looseness is incorrect, such as
 * being tight when it should be loose, and vice versa.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function listItemSpacing(ast, file, preferred, done) {
    visit(ast, 'list', function (node) {
        var items = node.children;
        var isTightList = true;
        var indent = start(node).column;
        var type;

        if (position.generated(node)) {
            return;
        }

        items.forEach(function (item) {
            var content = item.children;
            var head = content[0];
            var tail = content[content.length - 1];
            var isLoose = (end(tail).line - start(head).line) > 0;

            if (isLoose) {
                isTightList = false;
            }
        });

        type = isTightList ? 'tight' : 'loose';

        items.forEach(function (item, index) {
            var next = items[index + 1];
            var isTight = end(item).column > indent;

            /*
             * Ignore last.
             */

            if (!next) {
                return;
            }

            /*
             * Check if the list item's state does (not)
             * match the list's state.
             */

            if (isTight !== isTightList) {
                file.warn('List item should be ' + type + ', isn’t', {
                    'start': end(item),
                    'end': start(next)
                });
            }
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = listItemSpacing;

},{"mdast-util-position":62,"unist-util-visit":66}],26:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module maximum-heading-length
 * @fileoverview
 *   Warn when headings are too long.
 *
 *   Options: `number`, default: `60`.
 *
 *   Ignores markdown syntax, only checks the plain text content.
 * @example
 *   <!-- Valid, when set to `40` -->
 *   # Alpha bravo charlie delta echo
 *   # ![Alpha bravo charlie delta echo](http://example.com/nato.png)
 *
 *   <!-- Invalid, when set to `40` -->
 *   # Alpha bravo charlie delta echo foxtrot
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var toString = require('mdast-util-to-string');
var position = require('mdast-util-position');

/**
 * Warn when headings are too long.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {number?} [preferred=60] - Maximum content
 *   length.
 * @param {Function} done - Callback.
 */
function maximumHeadingLength(ast, file, preferred, done) {
    preferred = isNaN(preferred) || typeof preferred !== 'number' ? 60 : preferred;

    visit(ast, 'heading', function (node) {
        if (position.generated(node)) {
            return;
        }

        if (toString(node).length > preferred) {
            file.warn('Use headings shorter than `' + preferred + '`', node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = maximumHeadingLength;

},{"mdast-util-position":62,"mdast-util-to-string":63,"unist-util-visit":66}],27:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module maximum-line-length
 * @fileoverview
 *   Warn when lines are too long.
 *
 *   Options: `number`, default: `80`.
 *
 *   Ignores nodes which cannot be wrapped, such as heasings, tables,
 *   code, link, images, and definitions.
 * @example
 *   <!-- Valid, when set to `40` -->
 *   Alpha bravo charlie delta echo.
 *
 *   Alpha bravo charlie delta echo [foxtrot](./foxtrot.html).
 *
 *   # Alpha bravo charlie delta echo foxtrot golf hotel.
 *
 *       # Alpha bravo charlie delta echo foxtrot golf hotel.
 *
 *   | A     | B     | C       | D     | E    | F       | F    | H     |
 *   | ----- | ----- | ------- | ----- | ---- | ------- | ---- | ----- |
 *   | Alpha | bravo | charlie | delta | echo | foxtrot | golf | hotel |
 *
 *   <!-- Invalid, when set to `40` -->
 *   Alpha bravo charlie delta echo foxtrot golf.
 *
 *   Alpha bravo charlie delta echo [foxtrot](./foxtrot.html) golf.
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;
var end = position.end;

/**
 * Check if `node` is applicable, as in, if it should be
 * ignored.
 *
 * @param {Node} node - Node to test.
 * @return {boolean} - Whether or not `node` should be
 *   ignored.
 */
function isIgnored(node) {
    return node.type === 'heading' ||
        node.type === 'table' ||
        node.type === 'code' ||
        node.type === 'definition';
}

/**
 * Warn when lines are too long.  This rule is forgiving
 * about lines which cannot be wrapped, such as code,
 * tables, and headings, or links at the enc of a line.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {number?} [preferred=80] - Maximum line length.
 * @param {Function} done - Callback.
 */
function maximumLineLength(ast, file, preferred, done) {
    var style = preferred && preferred !== true ? preferred : 80;
    var content = file.toString();
    var matrix = content.split('\n');
    var index = -1;
    var length = matrix.length;
    var lineLength;

    /**
     * Whitelist from `initial` to `final`, zero-based.
     *
     * @param {number} initial - Start.
     * @param {number} final - End.
     */
    function whitelist(initial, final) {
        initial--;

        while (++initial < final) {
            matrix[initial] = '';
        }
    }

    /*
     * Next, white list nodes which cannot be wrapped.
     */

    visit(ast, function (node) {
        var applicable = isIgnored(node);
        var initial = applicable && start(node).line;
        var final = applicable && end(node).line;

        if (!applicable || position.generated(node)) {
            return;
        }

        whitelist(initial - 1, final);
    });

    /**
     * Finally, whitelist URLs, but only if they occur at
     * or after the wrap.  However, when they do, and
     * there’s white-space after it, they are not
     * whitelisted.
     *
     * @param {Node} node - Node.
     * @param {number} pos - Position of `node` in `parent`.
     * @param {Node} parent - Parent of `node`.
     */
    function validateLink(node, pos, parent) {
        var next = parent.children[pos + 1];
        var initial = start(node);
        var final = end(node);

        /*
         * Nothing to whitelist when generated.
         */

        if (position.generated(node)) {
            return;
        }

        /*
         * No whitelisting when starting after the border,
         * or ending before it.
         */

        if (initial.column > style || final.column < style) {
            return;
        }

        /*
         * No whitelisting when there’s white-space after
         * the link.
         */

        if (
            next &&
            start(next).line === initial.line &&
            (!next.value || /^(.+?[ \t].+?)/.test(next.value))
        ) {
            return;
        }

        whitelist(initial.line - 1, final.line);
    }

    visit(ast, 'link', validateLink);
    visit(ast, 'image', validateLink);

    /*
     * Iterate over every line, and warn for
     * violating lines.
     */

    while (++index < length) {
        lineLength = matrix[index].length;

        if (lineLength > style) {
            file.warn('Line must be at most ' + style + ' characters', {
                'line': index + 1,
                'column': lineLength + 1
            });
        }
    }

    done();
}

/*
 * Expose.
 */

module.exports = maximumLineLength;

},{"mdast-util-position":62,"unist-util-visit":66}],28:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-auto-link-without-protocol
 * @fileoverview
 *   Warn for angle-bracketed links without protocol.
 * @example
 *   <!-- Valid: -->
 *   <http://www.example.com>
 *   <mailto:foo@bar.com>
 *
 *   <!-- Invalid: -->
 *   <www.example.com>
 *   <foo@bar.com>
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var toString = require('mdast-util-to-string');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;
var end = position.end;

/**
 * Protocol expression.
 *
 * @type {RegExp}
 * @see http://en.wikipedia.org/wiki/URI_scheme#Generic_syntax
 */

var PROTOCOL = /^[a-z][a-z+.-]+:\/?/i;

/**
 * Assert `node`s reference starts with a protocol.
 *
 * @param {Node} node - Node to test.
 * @return {boolean}
 */
function hasProtocol(node) {
    return PROTOCOL.test(toString(node));
}

/**
 * Warn for angle-bracketed links without protocol.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noAutoLinkWithoutProtocol(ast, file, preferred, done) {
    visit(ast, 'link', function (node) {
        var head = start(node.children[0]).column;
        var tail = end(node.children[node.children.length - 1]).column;
        var initial = start(node).column;
        var final = end(node).column;

        if (position.generated(node)) {
            return;
        }

        if (initial === head - 1 && final === tail + 1 && !hasProtocol(node)) {
            file.warn('All automatic links must start with a protocol', node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noAutoLinkWithoutProtocol;

},{"mdast-util-position":62,"mdast-util-to-string":63,"unist-util-visit":66}],29:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-blockquote-without-caret
 * @fileoverview
 *   Warn when blank lines without carets are found in a blockquote.
 * @example
 *   <!-- Valid: -->
 *   > Foo...
 *   >
 *   > ...Bar.
 *
 *   <!-- Invalid: -->
 *   > Foo...
 *
 *   > ...Bar.
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/**
 * Warn when blank lines without carets are found in a
 * blockquote.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noBlockquoteWithoutCaret(ast, file, preferred, done) {
    var contents = file.toString();
    var last = contents.length;

    visit(ast, 'blockquote', function (node) {
        var start = position.start(node).line;
        var indent = node.position && node.position.indent;

        if (position.generated(node) || !indent || !indent.length) {
            return;
        }

        indent.forEach(function (column, n) {
            var character;
            var line = start + n + 1;
            var offset = file.positionToOffset({
                'line': line,
                'column': column
            }) - 1;

            while (++offset < last) {
                character = contents.charAt(offset);

                if (character === '>') {
                    return;
                }

                /* istanbul ignore else - just for safety */
                if (character !== ' ' && character !== '\t') {
                    break;
                }
            }

            file.warn('Missing caret in blockquote', {
                'line': line,
                'column': column
            });
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = noBlockquoteWithoutCaret;

},{"mdast-util-position":62,"unist-util-visit":66}],30:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-consecutive-blank-lines
 * @fileoverview
 *   Warn for too many consecutive blank lines.  Knows about the extra line
 *   needed between a list and indented code, and two lists.
 * @example
 *   <!-- Valid: -->
 *   Foo...
 *
 *   ...Bar.
 *
 *   <!-- Invalid: -->
 *   Foo...
 *
 *
 *   ...Bar.
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');
var plural = require('plur');

/*
 * Constants.
 */

var MAX = 2;

/**
 * Warn for too many consecutive blank lines.  Knows
 * about the extra line needed between a list and
 * indented code, and two lists.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noConsecutiveBlankLines(ast, file, preferred, done) {
    /**
     * Compare the difference between `start` and `end`,
     * and warn when that difference exceeds `max`.
     *
     * @param {Position} start - Initial.
     * @param {Position} end - Final.
     */
    function compare(start, end, max) {
        var diff = end.line - start.line;
        var word = diff > 0 ? 'before' : 'after';

        diff = Math.abs(diff) - max;

        if (diff > 0) {
            file.warn('Remove ' + diff + ' ' + plural('line', diff) + ' ' + word + ' node', end);
        }
    }

    visit(ast, function (node) {
        var children = node.children;

        if (position.generated(node)) {
            return;
        }

        if (children && children[0]) {
            /*
             * Compare parent and first child.
             */

            compare(position.start(node), position.start(children[0]), 0);

            /*
             * Compare between each child.
             */

            children.forEach(function (child, index) {
                var prev = children[index - 1];
                var max = MAX;

                if (
                    !prev ||
                    position.generated(prev) ||
                    position.generated(child)
                ) {
                    return;
                }

                if (
                    (
                        prev.type === 'list' &&
                        child.type === 'list'
                    ) ||
                    (
                        child.type === 'code' &&
                        prev.type === 'list' &&
                        !child.lang
                    )
                ) {
                    max++;
                }

                compare(position.end(prev), position.start(child), max);
            });

            /*
             * Compare parent and last child.
             */

            compare(position.end(node), position.end(children[children.length - 1]), 1);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noConsecutiveBlankLines;

},{"mdast-util-position":62,"plur":65,"unist-util-visit":66}],31:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-duplicate-definitions
 * @fileoverview
 *   Warn when duplicate definitions are found.
 * @example
 *   <!-- Valid: -->
 *   [foo]: bar
 *   [baz]: qux
 *
 *   <!-- Invalid: -->
 *   [foo]: bar
 *   [foo]: qux
 */

'use strict';

/*
 * Dependencies.
 */

var position = require('mdast-util-position');
var visit = require('unist-util-visit');

/**
 * Warn when definitions with equal content are found.
 *
 * Matches case-insensitive.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noDuplicateDefinitions(ast, file, preferred, done) {
    var map = {};

    /**
     * Check `node`.
     *
     * @param {Node} node - Node.
     */
    function validate(node) {
        var duplicate = map[node.identifier];
        var pos;

        if (position.generated(node)) {
            return;
        }

        if (duplicate && duplicate.type) {
            pos = position.start(duplicate);

            file.warn(
                'Do not use definitions with the same identifier (' +
                pos.line + ':' + pos.column + ')',
                node
            );
        }

        map[node.identifier] = node;
    }

    visit(ast, 'definition', validate);
    visit(ast, 'footnoteDefinition', validate);

    done();
}

/*
 * Expose.
 */

module.exports = noDuplicateDefinitions;

},{"mdast-util-position":62,"unist-util-visit":66}],32:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-duplicate-headings
 * @fileoverview
 *   Warn when duplicate headings are found.
 * @example
 *   <!-- Valid: -->
 *   # Foo
 *
 *   ## Bar
 *
 *   <!-- Invalid: -->
 *   # Foo
 *
 *   ## Foo
 *
 *   ## [Foo](http://foo.com/bar)
 */

'use strict';

/*
 * Dependencies.
 */

var position = require('mdast-util-position');
var visit = require('unist-util-visit');
var toString = require('mdast-util-to-string');

/**
 * Warn when headings with equal content are found.
 *
 * Matches case-insensitive.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noDuplicateHeadings(ast, file, preferred, done) {
    var map = {};

    visit(ast, 'heading', function (node) {
        var value = toString(node).toUpperCase();
        var duplicate = map[value];
        var pos;

        if (position.generated(node)) {
            return;
        }

        if (duplicate && duplicate.type === 'heading') {
            pos = position.start(duplicate);

            file.warn(
                'Do not use headings with similar content (' +
                pos.line + ':' + pos.column + ')',
                node
            );
        }

        map[value] = node;
    });

    done();
}

/*
 * Expose.
 */

module.exports = noDuplicateHeadings;

},{"mdast-util-position":62,"mdast-util-to-string":63,"unist-util-visit":66}],33:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-emphasis-as-heading
 * @fileoverview
 *   Warn when emphasis (including strong), instead of a heading, introduces
 *   a paragraph.
 *
 *   Currently, only warns when a colon (`:`) is also included, maybe that
 *   could be omitted.
 * @example
 *   <!-- Valid: -->
 *   # Foo:
 *
 *   Bar.
 *
 *   <!-- Invalid: -->
 *   *Foo:*
 *
 *   Bar.
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var toString = require('mdast-util-to-string');
var position = require('mdast-util-position');

/**
 * Warn when a section (a new paragraph) is introduced
 * by emphasis (or strong) and a colon.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noEmphasisAsHeading(ast, file, preferred, done) {
    visit(ast, 'paragraph', function (node, index, parent) {
        var children = node.children;
        var child = children[0];
        var prev = parent.children[index - 1];
        var next = parent.children[index + 1];
        var value;

        if (position.generated(node)) {
            return;
        }

        if (
            (!prev || prev.type !== 'heading') &&
            next &&
            next.type === 'paragraph' &&
            children.length === 1 &&
            (child.type === 'emphasis' || child.type === 'strong')
        ) {
            value = toString(child);

            /*
             * TODO: See if removing the punctuation
             * necessity is possible?
             */

            if (value.charAt(value.length - 1) === ':') {
                file.warn('Don’t use emphasis to introduce a section, use a heading', node);
            }
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noEmphasisAsHeading;

},{"mdast-util-position":62,"mdast-util-to-string":63,"unist-util-visit":66}],34:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-file-name-articles
 * @fileoverview
 *   Warn when file name start with an article.
 * @example
 *   Valid: article.md
 *   Invalid: an-article.md, a-article.md, , the-article.md
 */

'use strict';

/**
 * Warn when file name start with an article.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noFileNameArticles(ast, file, preferred, done) {
    var match = file.filename && file.filename.match(/^(the|an?)\b/i);

    if (match) {
        file.warn('Do not start file names with `' + match[0] + '`');
    }

    done();
}

/*
 * Expose.
 */

module.exports = noFileNameArticles;

},{}],35:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-file-name-consecutive-dashes
 * @fileoverview
 *   Warn when file names contain consecutive dashes.
 * @example
 *   Invalid: docs/plug--ins.md
 *   Valid: docs/plug-ins.md
 */

'use strict';

/**
 * Warn when file names contain consecutive dashes.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noFileNameConsecutiveDashes(ast, file, preferred, done) {
    if (file.filename && /-{2,}/.test(file.filename)) {
        file.warn('Do not use consecutive dashes in a file name');
    }

    done();
}

/*
 * Expose.
 */

module.exports = noFileNameConsecutiveDashes;

},{}],36:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-file-name-irregular-characters
 * @fileoverview
 *   Warn when file names contain irregular characters: characters other
 *   than alpha-numericals, dashes, and dots (full-stops).
 * @example
 *   Invalid: plug_ins.md, plug ins.md.
 *   Valid: plug-ins.md, plugins.md.
 */

'use strict';

/**
 * Warn when file names contain characters other than
 * alpha-numericals, dashes, and dots (full-stops).
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noFileNameIrregularCharacters(ast, file, preferred, done) {
    var match = file.filename && file.filename.match(/[^.a-zA-Z0-9-]/);

    if (match) {
        file.warn('Do not use `' + match[0] + '` in a file name');
    }

    done();
}

/*
 * Expose.
 */

module.exports = noFileNameIrregularCharacters;

},{}],37:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-file-name-mixed-case
 * @fileoverview
 *   Warn when a file name uses mixed case: both upper- and lower case
 *   characters.
 * @example
 *   Invalid: Readme.md
 *   Valid: README.md, readme.md
 */

'use strict';

/**
 * Warn when a file name uses mixed case: both upper- and
 * lower case characters.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noFileNameMixedCase(ast, file, preferred, done) {
    var name = file.filename;

    if (name && !(name === name.toLowerCase() || name === name.toUpperCase())) {
        file.warn('Do not mix casing in file names');
    }

    done();
}

/*
 * Expose.
 */

module.exports = noFileNameMixedCase;

},{}],38:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-file-name-outer-dashes
 * @fileoverview
 *   Warn when file names contain initial or final dashes.
 * @example
 *   Invalid: -readme.md, readme-.md
 *   Valid: readme.md
 */

'use strict';

/**
 * Warn when file names contain initial or final dashes.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noFileNameOuterDashes(ast, file, preferred, done) {
    if (file.filename && /^-|-$/.test(file.filename)) {
        file.warn('Do not use initial or final dashes in a file name');
    }

    done();
}

/*
 * Expose.
 */

module.exports = noFileNameOuterDashes;

},{}],39:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-heading-content-indent
 * @fileoverview
 *   Warn when a heading’s content is indented.
 * @example
 *   <!-- Note: the middle-dots represent spaces -->
 *   <!-- Invalid: -->
 *   #··Foo
 *
 *   ## Bar··##
 *
 *     ##··Baz
 *
 *   <!-- Valid: -->
 *   #·Foo
 *
 *   ## Bar·##
 *
 *     ##·Baz
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var style = require('mdast-util-heading-style');
var plural = require('plur');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;
var end = position.end;

/**
 * Warn when a (closed) ATX-heading has too much space
 * between the initial hashes and the content, or the
 * content and the final hashes.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noHeadingContentIndent(ast, file, preferred, done) {
    var contents = file.toString();

    visit(ast, 'heading', function (node) {
        var depth = node.depth;
        var children = node.children;
        var type = style(node, 'atx');
        var initial;
        var final;
        var diff;
        var word;
        var index;

        if (position.generated(node)) {
            return;
        }

        if (type === 'atx' || type === 'atx-closed') {
            initial = start(node);
            index = initial.offset;

            while (contents.charAt(index) !== '#') {
                index++;
            }

            index = depth + (index - initial.offset);
            diff = start(children[0]).column - initial.column - 1 - index;

            if (diff) {
                word = diff > 0 ? 'Remove' : 'Add';
                diff = Math.abs(diff);

                file.warn(
                    word + ' ' + diff + ' ' + plural('space', diff) +
                    ' before this heading’s content',
                    start(children[0])
                );
            }
        }

        /*
         * Closed ATX-heading always must have a space
         * between their content and the final hashes,
         * thus, there is no `add x spaces`.
         */

        if (type === 'atx-closed') {
            final = end(children[children.length - 1]);
            diff = end(node).column - final.column - 1 - depth;

            if (diff) {
                file.warn(
                    'Remove ' + diff + ' ' + plural('space', diff) +
                    ' after this heading’s content',
                    final
                );
            }
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noHeadingContentIndent;

},{"mdast-util-heading-style":61,"mdast-util-position":62,"plur":65,"unist-util-visit":66}],40:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-heading-indent
 * @fileoverview
 *   Warn when a heading is indented.
 * @example
 *   <!-- Note: the middle-dots represent spaces -->
 *   <!-- Invalid: -->
 *   ···# Hello world
 *
 *   ·Foo
 *   -----
 *
 *   ·# Hello world #
 *
 *   ···Bar
 *   =====
 *
 *   <!-- Valid: -->
 *   # Hello world
 *
 *   Foo
 *   -----
 *
 *   # Hello world #
 *
 *   Bar
 *   =====
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var plural = require('plur');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;

/**
 * Warn when a heading has too much space before the
 * initial hashes.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noHeadingIndent(ast, file, preferred, done) {
    var contents = file.toString();
    var length = contents.length;

    visit(ast, 'heading', function (node) {
        var initial = start(node);
        var begin = initial.offset;
        var index = begin - 1;
        var character;
        var diff;

        if (position.generated(node)) {
            return;
        }

        while (++index < length) {
            character = contents.charAt(index);

            if (character !== ' ' && character !== '\t') {
                break;
            }
        }

        diff = index - begin;

        if (diff) {
            file.warn(
                'Remove ' + diff + ' ' + plural('space', diff) +
                ' before this heading',
                {
                    'line': initial.line,
                    'column': initial.column + diff
                }
            );
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noHeadingIndent;

},{"mdast-util-position":62,"plur":65,"unist-util-visit":66}],41:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-heading-punctuation
 * @fileoverview
 *   Warn when a heading ends with a a group of characters.
 *   Defaults to `'.,;:!?'`.
 *
 *   Options: `string`, default: `'.,;:!?'`.
 *
 *   Note that these are added to a regex, in a group (`'[' + char + ']'`),
 *   be careful for escapes and dashes.
 * @example
 *   <!-- Invalid: -->
 *   # Hello:
 *
 *   # Hello?
 *
 *   # Hello!
 *
 *   # Hello,
 *
 *   # Hello;
 *
 *   <!-- Valid: -->
 *   # Hello
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');
var toString = require('mdast-util-to-string');

/**
 * Warn when headings end in some characters.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} [preferred='\\.,;:!?'] - Group of characters.
 * @param {Function} done - Callback.
 */
function noHeadingPunctuation(ast, file, preferred, done) {
    preferred = typeof preferred === 'string' ? preferred : '\\.,;:!?';

    visit(ast, 'heading', function (node) {
        var value = toString(node);

        if (position.generated(node)) {
            return;
        }

        value = value.charAt(value.length - 1);

        if (new RegExp('[' + preferred + ']').test(value)) {
            file.warn('Don’t add a trailing `' + value + '` to headings', node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noHeadingPunctuation;

},{"mdast-util-position":62,"mdast-util-to-string":63,"unist-util-visit":66}],42:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-html
 * @fileoverview
 *   Warn when HTML nodes are used.
 *
 *   Ignores comments, because they are used by this tool, mdast, and
 *   because markdown doesn’t have native comments.
 * @example
 *   <!-- Invalid: -->
 *   <h1>Hello</h1>
 *
 *   <!-- Valid: -->
 *   # Hello
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/**
 * Warn when HTML nodes are used.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function html(ast, file, preferred, done) {
    visit(ast, 'html', function (node) {
        if (!position.generated(node) && !/^\s*<!--/.test(node.value)) {
            file.warn('Do not use HTML in markdown', node);
        }
    });

    done();
}

module.exports = html;

},{"mdast-util-position":62,"unist-util-visit":66}],43:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-inline-padding
 * @fileoverview
 *   Warn when inline nodes are padded with spaces between markers and
 *   content.
 *
 *   Warns for emphasis, strong, delete, image, and link.
 * @example
 *   <!-- Invalid: -->
 *   * Hello *, [ world ](http://foo.bar/baz)
 *
 *   <!-- Valid: -->
 *   *Hello*, [world](http://foo.bar/baz)
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');
var toString = require('mdast-util-to-string');

/**
 * Warn when inline nodes are padded with spaces between
 * markers and content.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noInlinePadding(ast, file, preferred, done) {
    visit(ast, function (node) {
        var type = node.type;
        var contents;

        if (position.generated(node)) {
            return;
        }

        if (
            type === 'emphasis' ||
            type === 'strong' ||
            type === 'delete' ||
            type === 'image' ||
            type === 'link'
        ) {
            contents = toString(node);

            if (contents.charAt(0) === ' ' || contents.charAt(contents.length - 1) === ' ') {
                file.warn('Don’t pad `' + type + '` with inner spaces', node);
            }
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noInlinePadding;

},{"mdast-util-position":62,"mdast-util-to-string":63,"unist-util-visit":66}],44:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-literal-urls
 * @fileoverview
 *   Warn when URLs without angle-brackets are used.
 * @example
 *   <!-- Invalid: -->
 *   http://foo.bar/baz
 *
 *   <!-- Valid: -->
 *   <http://foo.bar/baz>
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;
var end = position.end;

/**
 * Warn for literal URLs without angle-brackets.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noLiteralURLs(ast, file, preferred, done) {
    visit(ast, 'link', function (node) {
        var head = start(node.children[0]).column;
        var tail = end(node.children[node.children.length - 1]).column;
        var initial = start(node).column;
        var final = end(node).column;

        if (position.generated(node)) {
            return;
        }

        if (initial === head && final === tail) {
            file.warn('Don’t use literal URLs without angle brackets', node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noLiteralURLs;

},{"mdast-util-position":62,"unist-util-visit":66}],45:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-missing-blank-lines
 * @fileoverview
 *   Warn for missing blank lines before a block node.
 * @example
 *   <!-- Invalid: -->
 *   # Foo
 *   ## Bar
 *
 *   <!-- Valid: -->
 *   # Foo
 *
 *   ## Bar
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/**
 * Check if `node` is an applicable block-level node.
 *
 * @param {Node} node - Node to test.
 * @return {boolean} - Whether or not `node` is applicable.
 */
function isApplicable(node) {
    return [
        'paragraph',
        'blockquote',
        'heading',
        'code',
        'yaml',
        'html',
        'list',
        'table',
        'horizontalRule'
    ].indexOf(node.type) !== -1;
}

/**
 * Warn when there is no empty line between two block
 * nodes.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noMissingBlankLines(ast, file, preferred, done) {
    visit(ast, function (node, index, parent) {
        var next = parent && parent.children[index + 1];

        if (position.generated(node)) {
            return;
        }

        if (
            next &&
            isApplicable(node) &&
            isApplicable(next) &&
            position.start(next).line === position.end(node).line + 1
        ) {
            file.warn('Missing blank line before block node', next);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noMissingBlankLines;

},{"mdast-util-position":62,"unist-util-visit":66}],46:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-multiple-toplevel-headings
 * @fileoverview
 *   Warn when multiple top-level headings are used.
 * @example
 *   <!-- Invalid: -->
 *   # Foo
 *
 *   # Bar
 *
 *   <!-- Valid: -->
 *   # Foo
 *
 *   ## Bar
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/**
 * Warn when multiple top-level headings are used.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noMultipleToplevelHeadings(ast, file, preferred, done) {
    var topLevelheading = false;

    visit(ast, 'heading', function (node) {
        var pos;

        if (position.generated(node)) {
            return;
        }

        if (node.depth === 1) {
            if (topLevelheading) {
                pos = position.start(node);

                file.warn('Don’t use multiple top level headings (' + pos.line + ':' + pos.column + ')', node);
            }

            topLevelheading = node;
        }
    });

    done();
}

module.exports = noMultipleToplevelHeadings;

},{"mdast-util-position":62,"unist-util-visit":66}],47:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-shell-dollars
 * @fileoverview
 *   Warn when shell code is prefixed by dollar-characters.
 *
 *   Ignored indented code blocks and fenced code blocks without language
 *   flag.
 * @example
 *   <!-- Invalid: -->
 *   ```bash
 *   $ echo a
 *   $ echo a > file
 *   ```
 *
 *   <!-- Valid: -->
 *   ```sh
 *   echo a
 *   echo a > file
 *   ```
 *
 *   <!-- Also valid: -->
 *   ```zsh
 *   $ echo a
 *   a
 *   $ echo a > file
 *   ```
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/**
 * List of shell script file extensions (also used as code
 * flags for syntax highlighting on GitHub):
 *
 * @see https://github.com/github/linguist/blob/5bf8cf5/lib/linguist/languages.yml#L3002
 */

var flags = [
    'sh',
    'bash',
    'bats',
    'cgi',
    'command',
    'fcgi',
    'ksh',
    'tmux',
    'tool',
    'zsh'
];

/**
 * Warn when shell code is prefixed by dollar-characters.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noShellDollars(ast, file, preferred, done) {
    visit(ast, 'code', function (node) {
        var language = node.lang;
        var value = node.value;
        var warn;

        if (!language || position.generated(node)) {
            return;
        }

        /*
         * Check both known shell-code and unknown code.
         */

        if (flags.indexOf(language) !== -1) {
            warn = value.length && value.split('\n').every(function (line) {
                return Boolean(!line.trim() || line.match(/^\s*\$\s*/));
            });

            if (warn) {
                file.warn('Do not use dollar signs before shell-commands', node);
            }
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noShellDollars;

},{"mdast-util-position":62,"unist-util-visit":66}],48:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-shortcut-reference-image
 * @fileoverview
 *   Warn when shortcut reference images are used.
 * @example
 *   <!-- Invalid: -->
 *   ![foo]
 *
 *   [foo]: http://foo.bar/baz.png
 *
 *   <!-- Valid: -->
 *   ![foo][]
 *
 *   [foo]: http://foo.bar/baz.png
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/**
 * Warn when shortcut reference images are used.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noShortcutReferenceImage(ast, file, preferred, done) {
    visit(ast, 'imageReference', function (node) {
        if (position.generated(node)) {
            return;
        }

        if (node.referenceType === 'shortcut') {
            file.warn('Use the trailing [] on reference images', node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noShortcutReferenceImage;

},{"mdast-util-position":62,"unist-util-visit":66}],49:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-shortcut-reference-link
 * @fileoverview
 *   Warn when shortcut reference links are used.
 * @example
 *   <!-- Invalid: -->
 *   [foo]
 *
 *   [foo]: http://foo.bar/baz
 *
 *   <!-- Valid: -->
 *   [foo][]
 *
 *   [foo]: http://foo.bar/baz
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/**
 * Warn when shortcut reference links are used.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noShortcutReferenceLink(ast, file, preferred, done) {
    visit(ast, 'linkReference', function (node) {
        if (position.generated(node)) {
            return;
        }

        if (node.referenceType === 'shortcut') {
            file.warn('Use the trailing [] on reference links', node);
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = noShortcutReferenceLink;

},{"mdast-util-position":62,"unist-util-visit":66}],50:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-table-indentation
 * @fileoverview
 *   Warn when tables are indented.
 * @example
 *   <!-- Invalid: -->
 *       | A     | B     |
 *       | ----- | ----- |
 *       | Alpha | Bravo |
 *
 *   <!-- Valid: -->
 *   | A     | B     |
 *   | ----- | ----- |
 *   | Alpha | Bravo |
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/**
 * Warn when a table has a too much indentation.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noTableIndentation(ast, file, preferred, done) {
    visit(ast, 'table', function (node) {
        var contents = file.toString();

        if (position.generated(node)) {
            return;
        }

        node.children.forEach(function (row) {
            var fence = contents.slice(position.start(row).offset, position.start(row.children[0]).offset);

            if (fence.indexOf('|') > 1) {
                file.warn('Do not indent table rows', row);
            }
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = noTableIndentation;

},{"mdast-util-position":62,"unist-util-visit":66}],51:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-tabs
 * @fileoverview
 *   Warn when hard-tabs instead of spaces
 * @example
 *   <!-- Note: the double guillemet (`»`) and middle-dots represent a tab -->
 *   <!-- Invalid: -->
 *   Foo»Bar
 *
 *   »···Foo
 *
 *   <!-- Valid: -->
 *   Foo Bar
 *
 *       Foo
 */

'use strict';

/**
 * Warn when hard-tabs instead of spaces are used.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function noTabs(ast, file, preferred, done) {
    var content = file.toString();
    var index = -1;
    var length = content.length;

    while (++index < length) {
        if (content.charAt(index) === '\t') {
            file.warn('Use spaces instead of hard-tabs', file.offsetToPosition(index));
        }
    }

    done();
}

/*
 * Expose.
 */

module.exports = noTabs;

},{}],52:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module ordered-list-marker-style
 * @fileoverview
 *   Warn when the list-item marker style of ordered lists violate a given
 *   style.
 *
 *   Options: `string`, either `'consistent'`, `'.'`, or `')'`,
 *   default: `'consistent'`.
 *
 *   Note that `)` is only supported in CommonMark.
 *
 *   The default value, `consistent`, detects the first used list
 *   style, and will warn when a subsequent list uses a different
 *   style.
 * @example
 *   <!-- Valid when set to `consistent` or `.` -->
 *   1.  Foo
 *
 *   2.  Bar
 *
 *   <!-- Valid when set to `consistent` or `)` -->
 *   1)  Foo
 *
 *   2)  Bar
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;

/*
 * Valid styles.
 */

var STYLES = {
    ')': true,
    '.': true,
    'null': true
};

/**
 * Warn when the list-item marker style of ordered lists
 * violate a given style.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} [preferred='consistent'] - Ordered list
 *   marker style, either `'.'` or `')'`, defaulting to the
 *   first found style.
 * @param {Function} done - Callback.
 */
function orderedListMarkerStyle(ast, file, preferred, done) {
    var contents = file.toString();

    preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

    if (STYLES[preferred] !== true) {
        file.fail('Invalid ordered list-item marker style `' + preferred + '`: use either `\'.\'` or `\')\'`');

        return;
    }

    visit(ast, 'list', function (node) {
        var items = node.children;

        if (!node.ordered) {
            return;
        }

        items.forEach(function (item) {
            var head = item.children[0];
            var initial = start(item).offset;
            var final = start(head).offset;
            var marker;

            if (position.generated(item)) {
                return;
            }

            marker = contents.slice(initial, final).replace(/\s|\d/g, '');

            /*
             * Support checkboxes.
             */

            marker = marker.replace(/\[[x ]?\]\s*$/i, '');

            if (!preferred) {
                preferred = marker;
            } else if (marker !== preferred) {
                file.warn('Marker style should be `' + preferred + '`', item);
            }
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = orderedListMarkerStyle;

},{"mdast-util-position":62,"unist-util-visit":66}],53:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module ordered-list-marker-value
 * @fileoverview
 *   Warn when the list-item marker values of ordered lists violate a
 *   given style.
 *
 *   Options: `string`, either `'single'`, `'one'`, or `'ordered'`,
 *   default: `'ordered'`.
 *
 *   When set to `'ordered'`, list-item bullets should increment by one,
 *   relative to the starting point.  When set to `'single'`, bullets should
 *   be the same as the relative starting point.  When set to `'one'`, bullets
 *   should always be `1`.
 * @example
 *   <!-- Valid when set to `one`: -->
 *   1.  Foo
 *   1.  Bar
 *   1.  Baz
 *
 *   1.  Alpha
 *   1.  Bravo
 *   1.  Charlie
 *
 *   <!-- Valid when set to `single`: -->
 *   1.  Foo
 *   1.  Bar
 *   1.  Baz
 *
 *   3.  Alpha
 *   3.  Bravo
 *   3.  Charlie
 *
 *   <!-- Valid when set to `ordered`: -->
 *   1.  Foo
 *   2.  Bar
 *   3.  Baz
 *
 *   3.  Alpha
 *   4.  Bravo
 *   5.  Charlie
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;

/*
 * Valid styles.
 */

var STYLES = {
    'ordered': true,
    'single': true,
    'one': true
};

/**
 * Warn when the list-item markers values of ordered lists
 * violate a given style.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} [preferred='ordered'] - Ordered list
 *   marker value, either `'one'` or `'ordered'`,
 *   defaulting to the latter.
 * @param {Function} done - Callback.
 */
function orderedListMarkerValue(ast, file, preferred, done) {
    var contents = file.toString();

    preferred = typeof preferred !== 'string' ? 'ordered' : preferred;

    if (STYLES[preferred] !== true) {
        file.fail('Invalid ordered list-item marker value `' + preferred + '`: use either `\'ordered\'` or `\'one\'`');

        return;
    }

    visit(ast, 'list', function (node) {
        var items = node.children;
        var shouldBe = (preferred === 'one' ? 1 : node.start) || 1;

        /*
         * Ignore unordered lists.
         */

        if (!node.ordered) {
            return;
        }

        items.forEach(function (item, index) {
            var head = item.children[0];
            var initial = start(item).offset;
            var final = start(head).offset;
            var marker;

            /*
             * Ignore first list item.
             */

            if (index === 0) {
                return;
            }

            /*
             * Increase the expected line number when in
             * `ordered` mode.
             */

            if (preferred === 'ordered') {
                shouldBe++;
            }

            /*
             * Ignore generated nodes.
             */

            if (position.generated(item)) {
                return;
            }

            marker = contents.slice(initial, final).replace(/[\s\.\)]/g, '');

            /*
             * Support checkboxes.
             */

            marker = Number(marker.replace(/\[[x ]?\]\s*$/i, ''));

            if (marker !== shouldBe) {
                file.warn('Marker should be `' + shouldBe + '`, was `' + marker + '`', item);
            }
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = orderedListMarkerValue;

},{"mdast-util-position":62,"unist-util-visit":66}],54:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module rule-style
 * @fileoverview
 *   Warn when the horizontal rules violate a given or detected style.
 *
 *   Options: `string`, either a valid markdown rule, or `consistent`,
 *   default: `'consistent'`.
 * @example
 *   <!-- Valid when set to `consistent` or `* * *`: -->
 *   * * *
 *
 *   * * *
 *
 *   <!-- Valid when set to `consistent` or `_______`: -->
 *   _______
 *
 *   _______
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;
var end = position.end;

/**
 * Warn when a given style is invalid.
 *
 * @param {*} style - `*`, `_`, ` ` (space), or `-`.
 * @return {boolean} - Whether or not `style` is a
 *   valid rule style.
 */
function validateRuleStyle(style) {
    return style === null || !/[^-_* ]/.test(style);
}

/**
 * Warn when the horizontal rules violate a given or
 * detected style.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} [preferred='consistent'] - A valid
 *   horizontal rule, defaulting to the first found style.
 * @param {Function} done - Callback.
 */
function ruleStyle(ast, file, preferred, done) {
    var contents = file.toString();

    preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

    if (validateRuleStyle(preferred) !== true) {
        file.fail('Invalid preferred rule-style: provide a valid markdown rule, or `\'consistent\'`');

        return;
    }

    visit(ast, 'horizontalRule', function (node) {
        var initial = start(node).offset;
        var final = end(node).offset;
        var hr;

        if (position.generated(node)) {
            return;
        }

        hr = contents.slice(initial, final);

        if (preferred) {
            if (hr !== preferred) {
                file.warn('Horizontal rules should use `' + preferred + '`', node);
            }
        } else {
            preferred = hr;
        }
    });

    done();
}

/*
 * Expose.
 */

module.exports = ruleStyle;

},{"mdast-util-position":62,"unist-util-visit":66}],55:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module blockquote-indentation
 * @fileoverview
 *   Warn for violating strong markers.
 *
 *   Options: `string`, either `'consistent'`, `'*'`, or `'_'`,
 *   default: `'consistent'`.
 *
 *   The default value, `consistent`, detects the first used strong
 *   style, and will warn when a subsequent strong uses a different
 *   style.
 * @example
 *   <!-- Valid when set to `consistent` or `*` -->
 *   **foo**
 *   **bar**
 *
 *   <!-- Valid when set to `consistent` or `_` -->
 *   __foo__
 *   __bar__
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Map of valid markers.
 */

var MARKERS = {
    '*': true,
    '_': true,
    'null': true
};

/**
 * Warn when a `strong` node has an incorrect marker.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} [preferred='consistent'] - Preferred
 *   marker, either `"*"` or `"_"`, or `"consistent"`.
 * @param {Function} done - Callback.
 */
function strongMarker(ast, file, preferred, done) {
    preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

    if (MARKERS[preferred] !== true) {
        file.fail('Invalid strong marker `' + preferred + '`: use either `\'consistent\'`, `\'*\'`, or `\'_\'`');
    } else {
        visit(ast, 'strong', function (node) {
            var marker = file.toString().charAt(position.start(node).offset);

            if (position.generated(node)) {
                return;
            }

            if (preferred) {
                if (marker !== preferred) {
                    file.warn('Strong should use `' + preferred + '` as a marker', node);
                }
            } else {
                preferred = marker;
            }
        });
    }

    done();
}

/*
 * Expose.
 */

module.exports = strongMarker;

},{"mdast-util-position":62,"unist-util-visit":66}],56:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module table-cell-padding
 * @fileoverview
 *   Warn when table cells are incorrectly padded.
 *
 *   Options: `string`, either `'consistent'`, `'padded'`, or `'compact'`,
 *   default: `'consistent'`.
 *
 *   The default value, `consistent`, detects the first used cell padding
 *   style, and will warn when a subsequent cells uses a different
 *   style.
 * @example
 *   <!-- Valid when set to `consistent` or `padded` -->
 *   | A     | B     |
 *   | ----- | ----- |
 *   | Alpha | Bravo |
 *
 *   <!-- Valid when set to `consistent` or `compact` -->
 *   |A    |B    |
 *   |-----|-----|
 *   |Alpha|Bravo|
 *
 *   <!-- Invalid: -->
 *   |   A    | B    |
 *   |   -----| -----|
 *   |   Alpha| Bravo|
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;
var end = position.end;

/*
 * Valid styles.
 */

var STYLES = {
    'null': true,
    'padded': true,
    'compact': true
};

/**
 * Warn when table cells are incorrectly padded.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} preferred - Either `padded` (for
 *   at least a space), `compact` (for no spaces when
 *   possible), or `consistent`, which defaults to the
 *   first found style.
 * @param {Function} done - Callback.
 */
function tableCellPadding(ast, file, preferred, done) {
    preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

    if (STYLES[preferred] !== true) {
        file.fail('Invalid table-cell-padding style `' + preferred + '`');
    }

    visit(ast, 'table', function (node) {
        var children = node.children;
        var contents = file.toString();
        var starts = [];
        var ends = [];
        var locations;
        var positions;
        var style;
        var type;
        var warning;

        if (position.generated(node)) {
            return;
        }

        /**
         * Check a fence. Checks both its initial spacing
         * (between a cell and the fence), and its final
         * spacing (between the fence and the next cell).
         */
        function check(initial, final, cell, next, index) {
            var fence = contents.slice(initial, final);
            var pos = fence.indexOf('|');

            if (
                cell &&
                pos !== -1 &&
                (
                    ends[index] === undefined ||
                    pos < ends[index]
                )
            ) {
                ends[index] = pos;
            }

            if (next && pos !== -1) {
                pos = fence.length - pos - 1;

                if (starts[index + 1] === undefined || pos < starts[index + 1]) {
                    starts[index + 1] = pos;
                }
            }
        }

        children.forEach(function (row) {
            var cells = row.children;

            check(start(row).offset, start(cells[0]).offset, null, cells[0], -1);

            cells.forEach(function (cell, index) {
                var next = cells[index + 1] || null;
                var final = start(next).offset || end(row).offset;

                check(end(cell).offset, final, cell, next, index);
            });
        });

        positions = starts.concat(ends);

        style = preferred === 'padded' ? 1 : preferred === 'compact' ? 0 : null;

        if (preferred === 'padded') {
            style = 1;
        } else if (preferred === 'compact') {
            style = 0;
        } else {
            positions.some(function (pos) {
                /*
                 * `some` skips non-existant indices, so
                 * there's no need to check for `!isNaN`.
                 */

                style = Math.min(pos, 1);

                return true;
            });
        }

        locations = children[0].children.map(function (cell) {
            return start(cell);
        }).concat(children[0].children.map(function (cell) {
            return end(cell);
        }));

        type = style === 1 ? 'padded' : 'compact';
        warning = 'Cell should be ' + type + ', isn’t';

        positions.forEach(function (diff, index) {
            if (diff !== style && diff !== undefined && diff !== null) {
                file.warn(warning, locations[index]);
            }
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = tableCellPadding;

},{"mdast-util-position":62,"unist-util-visit":66}],57:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module table-pipe-alignment
 * @fileoverview
 *   Warn when table pipes are not aligned.
 * @example
 *   <!-- Valid: -->
 *   | A     | B     |
 *   | ----- | ----- |
 *   | Alpha | Bravo |
 *
 *   <!-- Invalid: -->
 *   | A | B |
 *   | -- | -- |
 *   | Alpha | Bravo |
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;
var end = position.end;

/**
 * Warn when table pipes are not aligned.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function tablePipeAlignment(ast, file, preferred, done) {
    visit(ast, 'table', function (node) {
        var contents = file.toString();
        var indices = [];
        var offset;
        var line;

        if (position.generated(node)) {
            return;
        }

        /**
         * Check all pipes after each column are at
         * aligned.
         */
        function check(initial, final, index) {
            var pos = initial + contents.slice(initial, final).indexOf('|') - offset + 1;

            if (indices[index] === undefined || indices[index] === null) {
                indices[index] = pos;
            } else if (pos !== indices[index]) {
                file.warn('Misaligned table fence', {
                    'start': {
                        'line': line,
                        'column': pos
                    },
                    'end': {
                        'line': line,
                        'column': pos + 1
                    }
                });
            }
        }

        node.children.forEach(function (row) {
            var cells = row.children;

            line = start(row).line;
            offset = start(row).offset;

            check(start(row).offset, start(cells[0]).offset, 0);

            row.children.forEach(function (cell, index) {
                var next = start(cells[index + 1]).offset || end(row).offset;

                check(end(cell).offset, next, index + 1);
            });
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = tablePipeAlignment;

},{"mdast-util-position":62,"unist-util-visit":66}],58:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module table-pipes
 * @fileoverview
 *   Warn when table rows are not fenced with pipes.
 * @example
 *   <!-- Valid: -->
 *   | A     | B     |
 *   | ----- | ----- |
 *   | Alpha | Bravo |
 *
 *   <!-- Invalid: -->
 *   A     | B
 *   ----- | -----
 *   Alpha | Bravo
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;
var end = position.end;

/**
 * Warn when a table rows are not fenced with pipes.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {*} preferred - Ignored.
 * @param {Function} done - Callback.
 */
function tablePipes(ast, file, preferred, done) {
    visit(ast, 'table', function (node) {
        var contents = file.toString();

        node.children.forEach(function (row) {
            var cells = row.children;
            var head = cells[0];
            var tail = cells[cells.length - 1];
            var initial = contents.slice(start(row).offset, start(head).offset);
            var final = contents.slice(end(tail).offset, end(row).offset);

            if (position.generated(row)) {
                return;
            }

            if (initial.indexOf('|') === -1) {
                file.warn('Missing initial pipe in table fence', start(row));
            }

            if (final.indexOf('|') === -1) {
                file.warn('Missing final pipe in table fence', end(row));
            }
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = tablePipes;

},{"mdast-util-position":62,"unist-util-visit":66}],59:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module unordered-list-marker-style
 * @fileoverview
 *   Warn when the list-item marker style of unordered lists violate a given
 *   style.
 *
 *   Options: `string`, either `'consistent'`, `'-'`, `'*'`, or `'*'`,
 *   default: `'consistent'`.
 *
 *   The default value, `consistent`, detects the first used list
 *   style, and will warn when a subsequent list uses a different
 *   style.
 * @example
 *   <!-- Valid when set to `consistent` or `-` -->
 *   -   Foo
 *   -   Bar
 *
 *   <!-- Valid when set to `consistent` or `*` -->
 *   *   Foo
 *   *   Bar
 *
 *   <!-- Valid when set to `consistent` or `+` -->
 *   +   Foo
 *   +   Bar
 *
 *   <!-- Never valid: -->
 *   +   Foo
 *   -   Bar
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var position = require('mdast-util-position');

/*
 * Methods.
 */

var start = position.start;

/*
 * Valid styles.
 */

var STYLES = {
    '-': true,
    '*': true,
    '+': true,
    'null': true
};

/**
 * Warn when the list-item marker style of unordered lists
 * violate a given style.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} [preferred='consistent'] - Unordered
 *   list marker style, either `'-'`, `'*'`, or `'+'`,
 *   defaulting to the first found style.
 * @param {Function} done - Callback.
 */
function unorderedListMarkerStyle(ast, file, preferred, done) {
    var contents = file.toString();

    preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

    if (STYLES[preferred] !== true) {
        file.fail('Invalid unordered list-item marker style `' + preferred + '`: use either `\'-\'`, `\'*\'`, or `\'+\'`');

        return;
    }

    visit(ast, 'list', function (node) {
        var items = node.children;

        if (node.ordered) {
            return;
        }

        items.forEach(function (item) {
            var head = item.children[0];
            var initial = start(item).offset;
            var final = start(head).offset;
            var marker;

            if (position.generated(item)) {
                return;
            }

            marker = contents.slice(initial, final).replace(/\s/g, '');

            /*
             * Support checkboxes.
             */

            marker = marker.replace(/\[[x ]?\]\s*$/i, '');

            if (!preferred) {
                preferred = marker;
            } else if (marker !== preferred) {
                file.warn('Marker style should be `' + preferred + '`', item);
            }
        });
    });

    done();
}

/*
 * Expose.
 */

module.exports = unorderedListMarkerStyle;

},{"mdast-util-position":62,"unist-util-visit":66}],60:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:range
 * @fileoverview Patch index-based range on mdast nodes.
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');

/**
 * Calculate offsets for `lines`.
 *
 * @param {Array.<string>} lines - Lines to compile.
 * @return {Array.<number>}
 */
function toOffsets(lines) {
    var total = 0;
    var index = -1;
    var length = lines.length;
    var result = [];

    while (++index < length) {
        result[index] = total += lines[index].length + 1;
    }

    return result;
}

/**
 * Add an offset based on `offsets` to `position`.
 *
 * @param {Object} position - Position.
 */
function addRange(position, fn) {
    position.offset = fn(position);
}

/**
 * Factory to reverse an offset into a line--column
 * tuple.
 *
 * @param {Array.<number>} offsets - Offsets, as returned
 *   by `toOffsets()`.
 * @return {Function} - Bound method.
 */
function positionToOffsetFactory(offsets) {
    /**
     * Calculate offsets for `lines`.
     *
     * @param {Object} position - Position.
     * @return {Object} - Object with `line` and `colymn`
     *   properties based on the bound `offsets`.
     */
    function positionToOffset(position) {
        var line = position && position.line;
        var column = position && position.column;

        if (!isNaN(line) && !isNaN(column)) {
            return ((offsets[line - 2] || 0) + column - 1) || 0;
        }

        return -1;
    }

    return positionToOffset;
}

/**
 * Factory to reverse an offset into a line--column
 * tuple.
 *
 * @param {Array.<number>} offsets - Offsets, as returned
 *   by `toOffsets()`.
 * @return {Function} - Bound method.
 */
function offsetToPositionFactory(offsets) {
    /**
     * Calculate offsets for `lines`.
     *
     * @param {number} offset - Offset.
     * @return {Object} - Object with `line` and `colymn`
     *   properties based on the bound `offsets`.
     */
    function offsetToPosition(offset) {
        var index = -1;
        var length = offsets.length;

        if (offset < 0) {
            return {};
        }

        while (++index < length) {
            if (offsets[index] > offset) {
                return {
                    'line': index + 1,
                    'column': (offset - (offsets[index - 1] || 0)) + 1
                };
            }
        }

        return {};
    }

    return offsetToPosition;
}

/**
 * Add ranges for `ast`.
 *
 * @param {Node} ast - Context to patch.
 * @param {VFile} file - Virtual file.
 */
function transformer(ast, file) {
    var contents = String(file).split('\n');
    var positionToOffset;

    /*
     * Invalid.
     */

    if (!file || typeof file.contents !== 'string') {
        throw new Error('Missing `file` for mdast-range');
    }

    /*
     * Construct.
     */

    contents = toOffsets(contents);
    positionToOffset = positionToOffsetFactory(contents);

    /*
     * Expose methods.
     */

    file.offsetToPosition = offsetToPositionFactory(contents);
    file.positionToOffset = positionToOffset;

    /*
     * Add `offset` on both `start` and `end`.
     */

    visit(ast, function (node) {
        var position = node.position;

        if (position && position.start) {
            addRange(position.start, positionToOffset);
        }

        if (position && position.end) {
            addRange(position.end, positionToOffset);
        }
    });
}

/**
 * Attacher.
 *
 * @return {Function} - `transformer`.
 */
function attacher() {
    return transformer;
}

/*
 * Expose.
 */

module.exports = attacher;

},{"unist-util-visit":66}],61:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module mdast:util:heading-style
 * @fileoverview Utility to get the style of an mdast heading.
 */

'use strict';

/**
 * Get the probable style of an atx-heading, depending on
 * preferred style.
 *
 * @example
 *   consolidate(1, 'setext') // 'atx'
 *   consolidate(1, 'atx') // 'atx'
 *   consolidate(3, 'setext') // 'setext'
 *   consolidate(3, 'atx') // 'atx'
 *
 * @private
 * @param {number} depth - Depth of heading.
 * @param {string?} relative - Preferred style.
 * @return {string?} - Type.
 */
function consolidate(depth, relative) {
    return depth < 3 ? 'atx' :
        relative === 'atx' || relative === 'setext' ? relative : null;
}

/**
 * Check the style of a heading.
 *
 * @example
 *   style(); // null
 *
 *   style(mdast.parse('# foo').children[0]); // 'atx'
 *
 *   style(mdast.parse('# foo #').children[0]); // 'atx-closed'
 *
 *   style(mdast.parse('foo\n===').children[0]); // 'setext'
 *
 * @param {Node} node - Node to check.
 * @param {string?} relative - Heading type which we'd wish
 *   this to be.
 * @return {string?} - Type, either `'atx-closed'`,
 *   `'atx'`, or `'setext'`.
 */
function style(node, relative) {
    var last = node.children[node.children.length - 1];
    var depth = node.depth;
    var pos = node && node.position && node.position.end;
    var final = last && last.position && last.position.end;

    if (!pos) {
        return null;
    }

    /*
     * This can only occur for atx and `'atx-closed'`
     * headings.  This might incorrectly match `'atx'`
     * headings with lots of trailing white space as an
     * `'atx-closed'` heading.
     */

    if (!last) {
        if (pos.column - 1 <= depth * 2) {
            return consolidate(depth, relative);
        }

        return 'atx-closed';
    }

    if (final.line + 1 === pos.line) {
        return 'setext';
    }

    if (final.column + depth < pos.column) {
        return 'atx-closed';
    }

    return consolidate(depth, relative);
}

/*
 * Expose.
 */

module.exports = style;

},{}],62:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module mdast:util:position
 * @fileoverview Utility to get either the starting or the
 *   ending position of a node, and if its generated or not.
 */

'use strict';

/**
 * Factory to get a position at `type`.
 *
 * @example
 *   positionFactory('start'); // Function
 *
 *   positionFactory('end'); // Function
 *
 * @param {string} type - Either `'start'` or `'end'`.
 * @return {function(Node): Object}
 */
function positionFactory(type) {
    /**
     * Get a position in `node` at a bound `type`.
     *
     * @example
     *   // When bound to `start`.
     *   start({
     *     start: {
     *       line: 1,
     *       column: 1
     *     }
     *   }); // {line: 1, column: 1}
     *
     *   // When bound to `end`.
     *   end({
     *     end: {
     *       line: 1,
     *       column: 2
     *     }
     *   }); // {line: 1, column: 2}
     *
     * @param {Node} node - Node to check.
     * @return {Object} - Position at `type` in `node`, or
     *   an empty object.
     */
    return function (node) {
        var pos = (node && node.position && node.position[type]) || {};

        return {
            'line': pos.line || null,
            'column': pos.column || null,
            'indent': pos.indent || null,
            'offset': isNaN(pos.offset) ? null : pos.offset
        };
    };
}

/*
 * Getters.
 */

var position = {
    'start': positionFactory('start'),
    'end': positionFactory('end')
};

/**
 * Detect if a node was available in the original document.
 *
 * @example
 *   generated(); // true
 *
 *   generated({
 *     start: {
 *       line: 1,
 *       column: 1
 *     },
 *     end: {
 *       line: 1,
 *       column: 2
 *     }
 *   }); // false
 *
 * @param {Node} node - Node to test.
 * @return {boolean} - Whether or not `node` is generated.
 */
function generated(node) {
    var initial = position.start(node);
    var final = position.end(node);

    return initial.line === null || initial.column === null ||
        final.line === null || final.column === null;
}

position.generated = generated;

/*
 * Expose.
 */

module.exports = position;

},{}],63:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module mdast:util:to-string
 * @fileoverview Utility to get the text value of a node.
 */

'use strict';

/**
 * Get the value of `node`.  Checks, `value`,
 * `alt`, and `title`, in that order.
 *
 * @param {Node} node - Node to get the internal value of.
 * @return {string} - Textual representation.
 */
function valueOf(node) {
    return node &&
        (node.value ? node.value :
        (node.alt ? node.alt : node.title)) || '';
}

/**
 * Returns the text content of a node.  If the node itself
 * does not expose plain-text fields, `toString` will
 * recursivly try its children.
 *
 * @param {Node} node - Node to transform to a string.
 * @return {string} - Textual representation.
 */
function toString(node) {
    return valueOf(node) ||
        (node.children && node.children.map(toString).join('')) ||
        '';
}

/*
 * Expose.
 */

module.exports = toString;

},{}],64:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:zone
 * @fileoverview HTML comments as ranges or markers in mdast.
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');

/*
 * Methods.
 */

var splice = [].splice;

/*
 * Expression for parsing parameters.
 */

var PARAMETERS = new RegExp(
    '\\s*' +
    '(' +
        '[-a-z09_]+' +
    ')' +
    '(?:' +
        '=' +
        '(?:' +
            '"' +
            '(' +
                '(?:' +
                    '\\\\[\\s\\S]' +
                    '|' +
                    '[^"]' +
                ')+' +
            ')' +
            '"' +
            '|' +
            '\'' +
            '(' +
                '(?:' +
                    '\\\\[\\s\\S]' +
                    '|' +
                    '[^\']' +
                ')+' +
            ')' +
            '\'' +
            '|' +
            '(' +
                '(?:' +
                    '\\\\[\\s\\S]' +
                    '|' +
                    '[^"\'\\s]' +
                ')+' +
            ')' +
        ')' +
    ')?' +
    '\\s*',
    'gi'
);

/**
 * Create an expression which matches a marker.
 *
 * @param {string} name - Plug-in name.
 * @return {RegExp}
 */
function marker(name) {
    return new RegExp(
        '(' +
            '\\s*' +
            '<!--' +
            '\\s*' +
            '(' +
                name +
            ')' +
            '\\s*' +
            '(' +
                'start' +
                '|' +
                'end' +
            ')?' +
            '\\s*' +
            '(' +
                '[\\s\\S]*?' +
            ')' +
            '\\s*' +
            '-->' +
            '\\s*' +
        ')'
    );
}

/**
 * Parse `value` into an object.
 *
 * @param {string} value - HTML comment.
 * @return {Object}
 */
function parameters(value) {
    var attributes = {};

    value.replace(PARAMETERS, function ($0, $1, $2, $3, $4) {
        var result = $2 || $3 || $4 || '';

        if (result === 'true' || result === '') {
            result = true;
        } else if (result === 'false') {
            result = false;
        } else if (!isNaN(result)) {
            result = Number(result);
        }

        attributes[$1] = result;

        return '';
    });

    return attributes;
}

/**
 * Factory to test if `node` matches `settings`.
 *
 * @param {Object} settings - Configuration.
 * @param {Function} callback - Invoked iwht a matching
 *   HTML node.
 * @return {Function}
 */
function testFactory(settings, callback) {
    var name = settings.name;
    var expression = marker(name);

    /**
     * Test if `node` matches the bound settings.
     *
     * @param {MDASTNode} node - Node to check.
     * @param {Parser|Compiler} [context] - Context class.
     * @return {Object?}
     */
    function test(node, context) {
        var value = node.value;
        var match;
        var result;

        if (node.type !== 'html') {
            return null;
        }

        match = value.match(expression);

        if (
            !match ||
            match[1].length !== value.length ||
            match[2] !== settings.name
        ) {
            return null;
        }

        result = {
            'type': match[3] || 'marker',
            'attributes': match[4] || '',
            'parameters': parameters(match[4] || ''),
            'node': node
        };

        if (callback) {
            callback(result, context);
        }

        return result;
    }

    return test;
}

/**
 * Parse factory.
 *
 * @param {Function} tokenize - Previous parser.
 * @param {Object} settings - Configuration.
 */
function parse(tokenize, settings) {
    var callback = settings.onparse;
    var test = testFactory(settings, function (result, context) {
        if (result.type === 'marker') {
            callback(result, context);
        }
    });

    /**
     * Parse HTML.
     *
     * @return {Node}
     */
    return function () {
        var node = tokenize.apply(this, arguments);

        test(node, this);

        return node;
    };
}

/**
 * Stringify factory.
 *
 * @param {Function} compile - Previous compiler.
 * @param {Object} settings - Configuration.
 */
function stringify(compile, settings) {
    var callback = settings.onstringify;
    var test = testFactory(settings, function (result, context) {
        if (result.type === 'marker') {
            callback(result, context);
        }
    });

    /**
     * Stringify HTML.
     *
     * @param {MDASTHTMLNode} node - HTML node.
     * @return {string}
     */
    return function (node) {
        test(node, this);

        return compile.apply(this, arguments);
    };
}

/**
 * Run factory.
 *
 * @param {Object} settings - Configuration.
 */
function run(settings) {
    var callback = settings.onrun;
    var test = testFactory(settings);
    var nodes = [];
    var start = null;
    var scope = null;
    var level = 0;
    var position;

    /**
     * Gather one dimensional zones.
     *
     * Passed intto `visit`.
     *
     * @param {MDASTNode} node - node to check.
     * @param {number} index - Position of `node` in
     *   `parent`.
     * @param {MDASTNode} parent - Parent of `node`.
     */
    function gather(node, index, parent) {
        var result = test(node);
        var type = result && result.type;

        if (scope && parent === scope) {
            if (type === 'start') {
                level++;
            }

            if (type === 'end') {
                level--;
            }

            if (type === 'end' && level === 0) {
                nodes = callback(start, nodes, result, {
                    'start': index - nodes.length - 1,
                    'end': index,
                    'parent': scope
                });

                if (nodes) {
                    splice.apply(
                        scope.children, [position, index + 1].concat(nodes)
                    );
                }

                start = null;
                scope = null;
                position = null;
                nodes = [];
            } else {
                nodes.push(node);
            }
        }

        if (!scope && type === 'start') {
            level = 1;
            position = index;
            start = result;
            scope = parent;
        }
    }

    /**
     * Modify AST.
     *
     * @param {MDASTNode} node - Root node.
     */
    return function (node) {
        visit(node, gather);
    };
}

/**
 * Modify mdast to invoke callbacks when HTML commnts are
 * found.
 *
 * @param {MDAST} mdast - Instance.
 * @param {Object?} [options] - Configuration.
 * @return {Function?}
 */
function attacher(mdast, options) {
    var blockTokenizers = mdast.Parser.prototype.blockTokenizers;
    var inlineTokenizers = mdast.Parser.prototype.inlineTokenizers;
    var stringifiers = mdast.Compiler.prototype;

    if (options.onparse) {
        blockTokenizers.html = parse(blockTokenizers.html, options);
        inlineTokenizers.tag = parse(inlineTokenizers.tag, options);
    }

    if (options.onstringify) {
        stringifiers.html = stringify(stringifiers.html, options);
    }

    if (options.onrun) {
        return run(options);
    }

    return null;
}

/**
 * Wrap `zone` to be passed into `mdast.use()`.
 *
 * Reason for this is that **mdast** only allows a single
 * function to be `use`d once.
 *
 * @param {Object} options - Plugin configuration.
 * @return {Function}
 */
function wrapper(options) {
    if (!options || !options.name) {
        throw new Error('Missing `name` in `options`');
    }

    return function (mdast) {
        return attacher(mdast, options);
    };
}

/*
 * Expose.
 */

module.exports = wrapper;

},{"unist-util-visit":66}],65:[function(require,module,exports){
'use strict';
module.exports = function (str, plural, count) {
	if (typeof plural === 'number') {
		count = plural;

		plural = (str.replace(/(?:s|x|z|ch|sh)$/i, '$&e').replace(/y$/i, 'ie') + 's')
			.replace(/i?e?s$/i, function (m) {
				var isTailLowerCase = str.slice(-1) === str.slice(-1).toLowerCase();
				return isTailLowerCase ? m.toLowerCase() : m.toUpperCase();
			});
	}

	return count === 1 ? str : plural;
};

},{}],66:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module unist:util:visit
 * @fileoverview Utility to recursively walk over unist nodes.
 */

'use strict';

/**
 * Walk forwards.
 *
 * @param {Array.<*>} values - Things to iterate over,
 *   forwards.
 * @param {function(*, number): boolean} callback - Function
 *   to invoke.
 * @return {boolean} - False if iteration stopped.
 */
function forwards(values, callback) {
    var index = -1;
    var length = values.length;

    while (++index < length) {
        if (callback(values[index], index) === false) {
            return false;
        }
    }

    return true;
}

/**
 * Walk backwards.
 *
 * @param {Array.<*>} values - Things to iterate over,
 *   backwards.
 * @param {function(*, number): boolean} callback - Function
 *   to invoke.
 * @return {boolean} - False if iteration stopped.
 */
function backwards(values, callback) {
    var index = values.length;
    var length = -1;

    while (--index > length) {
        if (callback(values[index], index) === false) {
            return false;
        }
    }

    return true;
}

/**
 * Visit.
 *
 * @param {Node} tree - Root node
 * @param {string} [type] - Node type.
 * @param {function(node): boolean?} callback - Invoked
 *   with each found node.  Can return `false` to stop.
 * @param {boolean} [reverse] - By default, `visit` will
 *   walk forwards, when `reverse` is `true`, `visit`
 *   walks backwards.
 */
function visit(tree, type, callback, reverse) {
    var iterate;
    var one;
    var all;

    if (typeof type === 'function') {
        reverse = callback;
        callback = type;
        type = null;
    }

    iterate = reverse ? backwards : forwards;

    /**
     * Visit `children` in `parent`.
     */
    all = function (children, parent) {
        return iterate(children, function (child, index) {
            return child && one(child, index, parent);
        });
    };

    /**
     * Visit a single node.
     */
    one = function (node, index, parent) {
        var result;

        index = index || (parent ? 0 : null);

        if (!type || node.type === type) {
            result = callback(node, index, parent || null);
        }

        if (node.children && result !== false) {
            return all(node.children, node);
        }

        return result;
    };

    one(tree);
}

/*
 * Expose.
 */

module.exports = visit;

},{}],67:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module vfile:sort
 * @fileoverview Sort VFile messages by line/column.
 */

'use strict';

/**
 * Compare a single property.
 *
 * @param {VFileMessage} a - Original.
 * @param {VFileMessage} b - Comparison.
 * @param {string} property - Property to compare.
 * @return {number}
 */
function check(a, b, property) {
    return (a[property] || 0) - (b[property] || 0);
}

/**
 * Comparator.
 *
 * @param {VFileMessage} a - Original.
 * @param {VFileMessage} b - Comparison.
 * @return {number}
 */
function comparator(a, b) {
    return check(a, b, 'line') || check(a, b, 'column') || -1;
}

/**
 * Sort all `file`s messages by line/column.
 *
 * @param {VFile} file - Virtual file.
 * @return {VFile} - `file`.
 */
function sort(file) {
    file.messages.sort(comparator);
    return file;
}

/*
 * Expose.
 */

module.exports = sort;

},{}]},{},[1])(1)
});