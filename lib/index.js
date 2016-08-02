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

/* Dependencies. */
var decamelize = require('decamelize');
var sort = require('vfile-sort');
var control = require('remark-message-control');
var loadPlugin = require('load-plugin');
var trough = require('trough');
var wrapped = require('wrapped');
var internals = require('./rules');

/* Expose. */
module.exports = lint;

/* Constants. */
var SOURCE = 'remark-lint';

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
 *     html: false // Ignore HTML warnings.
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
  var pipeline = trough();
  var setting;
  var id;

  /* Add each rule. */
  for (id in rules) {
    setting = settings[id];

    known.push(id);

    if (setting != null) {
      /* Pass turned on rules `undefined`. */
      if (reset && setting === true) {
        setting = undefined;
      }

      if (setting === false) {
        setting = undefined;
        disable.push(id);
      } else {
        enable.push(id);
      }
    }

    pipeline.use(ruleFactory(id, rules[id], setting));
  }

  /* Run all rules. */
  remark.use(function () {
    return function (node, file, next) {
      pipeline.run(node, file, next);
    };
  });

  /* Allow comments to toggle messages. */
  remark.use(control, {
    name: 'lint',
    source: SOURCE,
    reset: reset,
    known: known,
    enable: enable,
    disable: disable
  });

  /**
   * Transformer to sort messages.
   *
   * @param {Node} node - Syntax tree.
   * @param {VFile} file - Virtual file.
   */
  return function (node, file) {
    sort(file);
  };
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
      external = loadPlugin(external, {
        prefix: 'remark-lint-'
      });
    }

    for (ruleId in external) {
      rules[ruleId] = external[ruleId];
    }
  }

  return rules;
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
 * @return {Function} - Trough ware.
 */
function ruleFactory(id, rule, options) {
  var fn = wrapped(rule);

  return function (ast, file, next) {
    var scope = file.namespace('remark-lint');

    /* Track new messages per file. */
    scope.index = file.messages.length;

    fn(ast, file, options, function (err) {
      var messages = file.messages;

      while (scope.index < messages.length) {
        messages[scope.index].ruleId = id;
        messages[scope.index].source = SOURCE;

        scope.index++;
      }

      next(err);
    });
  };
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
