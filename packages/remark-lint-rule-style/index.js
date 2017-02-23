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
 *
 * @example {"name": "valid.md", "setting": "* * *"}
 *
 *   <!-- This is also valid when `consistent`. -->
 *
 *   * * *
 *
 *   * * *
 *
 * @example {"name": "valid.md", "setting": "_______"}
 *
 *   <!-- This is also valid when `consistent`. -->
 *
 *   _______
 *
 *   _______
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   <!-- Always invalid. -->
 *
 *   ***
 *
 *   * * *
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   5:1-5:6: Rules should use `***`
 *
 * @example {"name": "invalid.md", "label": "output", "setting": "!!!", "config": {"positionless": true}}
 *
 *   1:1: Invalid preferred rule-style: provide a valid markdown rule, or `'consistent'`
 */

'use strict';

var rule = require('unified-lint-rule');
var visit = require('unist-util-visit');
var position = require('unist-util-position');
var generated = require('unist-util-generated');

module.exports = rule('remark-lint:rule-style', ruleStyle);

var start = position.start;
var end = position.end;

function ruleStyle(ast, file, preferred) {
  var contents = file.toString();

  preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

  if (validateRuleStyle(preferred) !== true) {
    file.fail('Invalid preferred rule-style: provide a valid markdown rule, or `\'consistent\'`');
  }

  visit(ast, 'thematicBreak', visitor);

  function visitor(node) {
    var initial = start(node).offset;
    var final = end(node).offset;
    var hr;

    if (generated(node)) {
      return;
    }

    hr = contents.slice(initial, final);

    if (preferred) {
      if (hr !== preferred) {
        file.message('Rules should use `' + preferred + '`', node);
      }
    } else {
      preferred = hr;
    }
  }
}

function validateRuleStyle(style) {
  return style === null || !/[^-_* ]/.test(style);
}
