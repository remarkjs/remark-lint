/**
 * remark-lint rule to warn for lazy lines in block quotes.
 *
 * ## What is this?
 *
 * This package checks the style of block quotes.
 *
 * ## When should I use this?
 *
 * You can use this package to check that the style of block quotes is
 * consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoBlockquoteWithoutMarker)`
 *
 * Warn for lazy lines in block quotes.
 *
 * ###### Parameters
 *
 * There are no options.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ## Recommendation
 *
 * Rules around lazy lines are not straightforward and visually confusing,
 * so it’s recommended to start each line with a `>`.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] adds `>` markers to every line
 * in a block quote.
 *
 * [api-remark-lint-no-blockquote-without-marker]: #unifieduseremarklintnoblockquotewithoutmarker
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-blockquote-without-marker
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   > Mercury,
 *   > Venus,
 *   > and Earth.
 *
 *   Mars.
 *
 * @example
 *   {"name": "ok-tabs.md"}
 *
 *   >␉Mercury,
 *   >␉Venus,
 *   >␉and Earth.
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   > Mercury,
 *   Venus,
 *   > and Earth.
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   2:1: Unexpected `0` block quote markers before paragraph line, expected `1` marker, add `1` marker
 *
 * @example
 *   {"label": "input", "name": "not-ok-tabs.md"}
 *
 *   >␉Mercury,
 *   ␉Venus,
 *   and Earth.
 * @example
 *   {"label": "output", "name": "not-ok-tabs.md"}
 *
 *   2:2: Unexpected `0` block quote markers before paragraph line, expected `1` marker, add `1` marker
 *   3:1: Unexpected `0` block quote markers before paragraph line, expected `1` marker, add `1` marker
 *
 * @example
 *   {"label": "input", "name": "containers.md"}
 *
 *   * > Mercury and
 *   Venus.
 *
 *   > * Mercury and
 *     Venus.
 *
 *   * > * Mercury and
 *       Venus.
 *
 *   > * > Mercury and
 *         Venus.
 *
 *   ***
 *
 *   > * > Mercury and
 *   >     Venus.
 * @example
 *   {"label": "output", "name": "containers.md"}
 *
 *   2:1: Unexpected `0` block quote markers before paragraph line, expected `1` marker, add `1` marker
 *   5:3: Unexpected `0` block quote markers before paragraph line, expected `1` marker, add `1` marker
 *   8:5: Unexpected `0` block quote markers before paragraph line, expected `1` marker, add `1` marker
 *   11:7: Unexpected `0` block quote markers before paragraph line, expected `2` markers, add `2` markers
 *   16:7: Unexpected `1` block quote marker before paragraph line, expected `2` markers, add `1` marker
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/// <reference types="mdast-util-directive" />

import {ok as assert} from 'devlop'
import {phrasing} from 'mdast-util-phrasing'
import pluralize from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'
import {location} from 'vfile-location'

const remarkLintNoBlockquoteWithoutMarker = lintRule(
  {
    origin: 'remark-lint:no-blockquote-without-marker',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-blockquote-without-marker#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    const value = String(file)
    const loc = location(file)

    // Only paragraphs can be lazy.
    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type !== 'paragraph') return

      let expected = 0

      for (const parent of parents) {
        if (parent.type === 'blockquote') {
          expected++
        }
        // All known parents that only use whitespace for indent.
        else if (
          parent.type === 'containerDirective' ||
          parent.type === 'footnoteDefinition' ||
          parent.type === 'list' ||
          parent.type === 'listItem' ||
          parent.type === 'root'
        ) {
          // Empty.
          /* c8 ignore next 3 -- exit on unknown nodes. */
        } else {
          return SKIP
        }
      }

      if (!expected) return SKIP

      const end = pointEnd(node)
      const start = pointStart(node)

      if (!end || !start) return SKIP

      let line = start.line

      while (++line <= end.line) {
        // Skip first line.
        const lineStart = loc.toOffset({line, column: 1})
        assert(lineStart !== undefined) // Always defined.
        let actual = 0
        let index = lineStart

        while (index < value.length) {
          const code = value.charCodeAt(index)

          if (code === 9 || code === 32) {
            // Fine.
          } else if (code === 62 /* `>` */) {
            actual++
          } else {
            break
          }

          index++
        }

        const point = loc.toPoint(index)
        assert(point) // Always defined.

        const difference = expected - actual

        // Roughly here.
        if (difference) {
          file.message(
            'Unexpected `' +
              actual +
              '` block quote ' +
              pluralize('marker', actual) +
              ' before paragraph line, expected `' +
              expected +
              '` ' +
              pluralize('marker', expected) +
              ', add `' +
              difference +
              '` ' +
              pluralize('marker', difference),
            {ancestors: [...parents, node], place: point}
          )
        }
      }
    })
  }
)

export default remarkLintNoBlockquoteWithoutMarker
