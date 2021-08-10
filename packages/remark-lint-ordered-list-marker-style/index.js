/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module ordered-list-marker-style
 * @fileoverview
 *   Warn when the list item marker style of ordered lists violate a given style.
 *
 *   Options: `'consistent'`, `'.'`, or `')'`, default: `'consistent'`.
 *
 *   `'consistent'` detects the first used list style and warns when subsequent
 *   lists use different styles.
 *
 * @example {"name": "ok.md"}
 *
 *   1.  Foo
 *
 *
 *   1.  Bar
 *
 *   Unordered lists are not affected by this rule.
 *
 *   * Foo
 *
 * @example {"name": "ok.md", "setting": "."}
 *
 *   1.  Foo
 *
 *   2.  Bar
 *
 * @example {"name": "ok.md", "setting": ")"}
 *
 *   1)  Foo
 *
 *   2)  Bar
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   1.  Foo
 *
 *   2)  Bar
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   3:1-3:8: Marker style should be `.`
 *
 * @example {"name": "not-ok.md", "label": "output", "setting": "💩", "positionless": true}
 *
 *   1:1: Incorrect ordered list item marker style `💩`: use either `'.'` or `')'`
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const remarkLintOrderedListMarkerStyle = lintRule(
  'remark-lint:ordered-list-marker-style',
  orderedListMarkerStyle
)

export default remarkLintOrderedListMarkerStyle

var styles = {
  ')': true,
  '.': true,
  null: true
}

function orderedListMarkerStyle(tree, file, option) {
  var contents = String(file)
  var preferred =
    typeof option !== 'string' || option === 'consistent' ? null : option

  if (styles[preferred] !== true) {
    file.fail(
      'Incorrect ordered list item marker style `' +
        preferred +
        "`: use either `'.'` or `')'`"
    )
  }

  visit(tree, 'list', visitor)

  function visitor(node) {
    var children = node.children
    var length = node.ordered ? children.length : 0
    var index = -1
    var marker
    var child

    while (++index < length) {
      child = children[index]

      if (!generated(child)) {
        marker = contents
          .slice(pointStart(child).offset, pointStart(child.children[0]).offset)
          .replace(/\s|\d/g, '')
          .replace(/\[[x ]?]\s*$/i, '')

        if (preferred) {
          if (marker !== preferred) {
            file.message('Marker style should be `' + preferred + '`', child)
          }
        } else {
          preferred = marker
        }
      }
    }
  }
}
