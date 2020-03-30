/**
 * @author Titus Wormer
 * @copyright 2020 Titus Wormer
 * @license MIT
 * @module no-duplicate-defined-urls
 * @fileoverview
 *   Warn when definitions define the same URL.
 *
 * @example {"name": "ok.md"}
 *
 *   [alpha]: alpha.com
 *   [bravo]: bravo.com
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   [alpha]: alpha.com
 *   [bravo]: alpha.com
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   2:1-2:19: Do not use different definitions with the same URL (1:1)
 */

'use strict'

var rule = require('unified-lint-rule')
var position = require('unist-util-position')
var generated = require('unist-util-generated')
var stringify = require('unist-util-stringify-position')
var visit = require('unist-util-visit')

module.exports = rule(
  'remark-lint:no-duplicate-defined-urls',
  noDuplicateDefinedUrls
)

var reason = 'Do not use different definitions with the same URL'

function noDuplicateDefinedUrls(tree, file) {
  var map = {}

  visit(tree, 'definition', check)

  function check(node) {
    var url
    var duplicate

    if (!generated(node) && node.url) {
      url = String(node.url).toUpperCase()
      duplicate = map[url]

      if (duplicate && duplicate.type) {
        file.message(
          reason + ' (' + stringify(position.start(duplicate)) + ')',
          node
        )
      }

      map[url] = node
    }
  }
}
