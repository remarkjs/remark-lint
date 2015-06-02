/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module Lint
 * @fileoverview mdast plug-in providing warnings when
 *   detecting style violations.
 */

'use strict';

/*
 * Dependencies.
 */

var range = require('mdast-range');
var zone = require('mdast-zone');
var rules = require('./rules');
var sort = require('./sort');
var filter = require('./filter');

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
    var id;
    var setting;

    /*
     * Ensure offset information is added.
     */

    mdast.use(range);

    /**
     * Get the latest state of a rule.
     *
     * @param {string} ruleId
     * @param {File} [file]
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
     * @param {File} file
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
     * @param {Object} marker
     * @param {Object} parser
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
     * Sort messages.
     */

    mdast.use(sort);

    /*
     * Filter.
     */

    mdast.use(filter);
}

/*
 * Expose.
 */

module.exports = lint;
