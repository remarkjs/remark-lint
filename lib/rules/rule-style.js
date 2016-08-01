/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module rule-style
 * @fileoverview
 *   Warn when the horizontal rules violate a given or detected style.
 *
 *   Note that horizontal rules are also called “thematic break”.
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

/* Dependencies. */
var visit = require('unist-util-visit');
var position = require('unist-util-position');

/* Expose. */
module.exports = ruleStyle;

/* Methods. */
var start = position.start;
var end = position.end;

/**
 * Warn when the horizontal rules violate a given or
 * detected style.
 *
 * @param {Node} ast - Root node.
 * @param {File} file - Virtual file.
 * @param {string?} [preferred='consistent'] - A valid
 *   horizontal rule, defaulting to the first found style.
 */
function ruleStyle(ast, file, preferred) {
  var contents = file.toString();

  preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

  if (validateRuleStyle(preferred) !== true) {
    file.fail('Invalid preferred rule-style: provide a valid markdown rule, or `\'consistent\'`');
    return;
  }

  visit(ast, 'thematicBreak', function (node) {
    var initial = start(node).offset;
    var final = end(node).offset;
    var hr;

    if (position.generated(node)) {
      return;
    }

    hr = contents.slice(initial, final);

    if (preferred) {
      if (hr !== preferred) {
        file.warn('Rules should use `' + preferred + '`', node);
      }
    } else {
      preferred = hr;
    }
  });
}

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
