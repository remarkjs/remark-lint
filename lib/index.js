/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:lint:library
 * @fileoverview remark plug-in providing warnings when
 *   detecting style violations.
 */

'use strict';

/* eslint-env commonjs */

/*
 * Constants.
 */

var SOURCE = 'remark-lint';

/*
 * Dependencies.
 */

var decamelize = require('decamelize');
var sort = require('vfile-sort');
var control = require('remark-message-control');
var internals = require('./rules');
var npmPrefix = require('npm-prefix')();

/*
 * Needed for plug-in resolving.
 */

var path = require('path');
var fs = require('fs');
var exists = fs && fs.existsSync;
var resolve = path && path.resolve;
var isWindows;
var isElectron;
var isGlobal;
var globals;
var cwd;

var MODULES = 'node_modules';

/* istanbul ignore else */
if (typeof global !== 'undefined') {
    /* global global */
    cwd = global.process.cwd();

    /* Detect whether we’re running as a globally installed package. */
    isWindows = global.process.platform === 'win32';
    isElectron = global.process.versions.electron !== undefined;
    isGlobal = isElectron || global.process.argv[1].indexOf(npmPrefix) === 0;

    /* istanbul ignore next */
    globals = resolve(npmPrefix, isWindows ? '' : 'lib', MODULES);
}

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
                    messages[scope.index].source = SOURCE;

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
 * When using a globally installed executable, the
 * following are also included:
 *
 * -  `$globals/$pathlike`.
 *
 * Where `$globals` is the directory of globally installed
 * npm packages.
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
    var globalPath = resolve(globals, pathlike);
    var plugin;

    if (exists(local) || exists(local + '.js')) {
        plugin = local;
    /* istanbul ignore else - for globals */
    } else if (exists(current)) {
        plugin = current;
    } else if (isGlobal && exists(globalPath)) {
        plugin = globalPath;
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
    var rules = loadExternals(settings.external);
    var reset = options && options.reset;
    var enable = [];
    var disable = [];
    var known = [];
    var setting;
    var id;

    /*
     * Add each rule as a seperate plugin.
     */

    for (id in rules) {
        setting = settings[id];

        known.push(id);

        if (!(setting === null || setting === undefined)) {
            if (setting === false) {
                disable.push(id);
            } else {
                enable.push(id);
            }
        }

        remark.use(attachFactory(id, rules[id], setting));
    }

    /*
     * Allow comments to toggle messages.
     */

    remark.use(control, {
        'name': 'lint',
        'source': SOURCE,
        'reset': reset,
        'known': known,
        'enable': enable,
        'disable': disable
    });

    /**
     * Transformer sort messages.
     *
     * @param {Node} node - Syntax tree.
     * @param {VFile} file - Virtual file.
     */
    return function (node, file) {
        sort(file);
    };
}

/*
 * Expose.
 */

module.exports = lint;
