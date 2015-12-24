/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:lint:library
 * @fileoverview remark plug-in providing warnings when
 *   detecting style violations.
 */

'use strict';

/*
 * Dependencies.
 */

var decamelize = require('decamelize');
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
     * Attach the rule to a remark instance, unless `false`
     * is passed as an option.
     *
     * @return {Function?} - See `plugin` below.
     */
    function attach() {
        /**
         * Attach the rule to a remark instance, unless `false`
         * is passed as an option.
         *
         * @param {Node} ast - Root node.
         * @param {File} [file] - Virtual file.
         * @param {Function} next - Signal end.
         */
        function plugin(ast, file, next) {
            var scope = file.namespace('remark-lint');

            /*
             * Track new messages per file.
             */

            if (scope.index === undefined || scope.index === null) {
                scope.index = file.messages.length;
            }

            /**
             * Add `ruleId` to each new message.
             *
             * @param {Error?} err - Optional failure.
             */
            function done(err) {
                var messages = file.messages;

                while (scope.index < messages.length) {
                    messages[scope.index].ruleId = id;

                    scope.index++;
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
 * Helper to ensure ruleId’s are dash-cased instead of
 * camel-cased.
 *
 * @param {Object} source - Original settings.
 * @return {Object} - Dash-cased settings.
 */
function decamelizeSettings(source) {
    var result = {};
    var key;

    for (key in source) {
        result[decamelize(key, '-')] = source[key];
    }

    return result;
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
 *   var processor = lint(remark, {
 *     'html': false // Ignore HTML warnings.
 *   });
 *
 * @param {Remark} remark - Host object.
 * @param {Object?} options - Hash of rule names mapping to
 *   rule options.
 */
function lint(remark, options) {
    var settings = decamelizeSettings(options || {});
    var reset = settings.reset;
    var rules = loadExternals(settings.external);
    var id;
    var setting;

    /*
     * Ensure offset information is added.
     */

    remark.use(range);

    /**
     * Get the latest state of a rule.
     *
     * @param {string} ruleId - Unique rule name.
     * @param {File} [file] - File (optional)
     */
    function getState(ruleId, file) {
        var scope = file && file.namespace('remark-lint');
        var ranges = scope && scope.ranges && scope.ranges[ruleId];

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
        var scope = file.namespace('remark-lint');
        var ranges = scope.ranges;
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

            scope.ranges = ranges;
        }
    }

    remark.use(function () {
        return function (ast, file) {
            store(file);
        };
    });

    /*
     * Add each rule as a seperate plugin.
     */

    for (id in rules) {
        remark.use(attachFactory(id, rules[id], settings[id]));
    }

    /**
     * Handle a rule.
     *
     * @param {VFile} file - Virtual file.
     * @param {Object} marker - Marker context.
     * @param {string} type - Type to toggle to.
     * @param {*} ruleId - Rule to toggle.
     */
    function toggle(file, marker, type, ruleId) {
        var scope = file.namespace('remark-lint');
        var markers;
        var currentState;
        var previousState;

        if (!(ruleId in rules)) {
            file.fail('Unknown rule: cannot ' + type + ' `\'' + ruleId + '\'`', marker.node);

            return;
        }

        markers = scope.ranges[ruleId];

        previousState = getState(ruleId, file);
        currentState = type === 'enable';

        if (currentState !== previousState) {
            markers.push({
                'state': currentState,
                'position': marker.node.position.start
            });
        }
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
        var ids = attributes.slice(1);
        var length = ids.length;
        var index = -1;

        if (type !== 'disable' && type !== 'enable') {
            file.fail('Unknown lint keyword `' + type + '`: use either `\'enable\'` or `\'disable\'`', marker.node);

            return;
        }

        store(file);

        while (++index < length) {
            toggle(file, marker, type, ids[index]);
        }
    }

    remark.use(zone({
        'name': 'lint',
        'onparse': onparse
    }));

    /*
     * Filter.
     */

    remark.use(filter);

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
