/**
 * remark-lint rule to warn when spaces are used for hard breaks.
 * Either optionally spaces at all,
 * or more spaces than the needed 2.
 *
 * ## What is this?
 *
 * This package checks whitespace hard breaks.
 *
 * ## When should I use this?
 *
 * You can use this package to check that the spaces in hard breaks are
 * consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintHardBreakSpaces[, options])`
 *
 * Warn when more spaces are used than needed for hard breaks.
 *
 * ###### Parameters
 *
 * * `options` ([`Options`][api-options], default: `'consistent'`)
 *   — either a preferred indent or whether to detect the first style
 *   and warn for further differences
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * ###### Fields
 *
 * * `allowSpaces` (`boolean`, default: `true`)
 *   — allow trailing space hard breaks at all;
 *   use escape hard breaks otherwise
 *
 * ## Recommendation
 *
 * Less than two spaces do not create a hard breaks and more than two spaces
 * have no effect.
 * Due to this, it’s recommended to turn this rule on.
 *
 * With CommonMark,
 * it is now possible to use a backslash (`\`) at the end of a line to create a
 * hard break.
 * It is now recommended to pass `allowSpaces: false`.
 *
 * [api-options]: #options
 * [api-remark-lint-hard-break-spaces]: #unifieduseremarklinthardbreakspaces-options
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module hard-break-spaces
 * @author Titus Wormer
 * @copyright Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   **Mercury** is the first planet from the Sun␠␠
 *   and the smallest in the Solar System.
 *   **Venus** is the second planet from\
 *   the Sun.
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   **Mercury** is the first planet from the Sun␠␠␠
 *   and the smallest in the Solar System.
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:45-2:1: Unexpected `3` spaces for hard break, expected `2` spaces
 *
 * @example
 *   {"config": {"allowSpaces": false}, "label": "input", "name": "escape.md"}
 *
 *   **Mercury** is the first planet from the Sun␠␠
 *   and the smallest in the Solar System.
 *   **Venus** is the second planet from the\
 *   Sun.
 * @example
 *   {"config": {"allowSpaces": false}, "label": "output", "name": "escape.md"}
 *
 *   1:45-2:1: Unexpected `2` spaces for hard break, expected escape
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "containers.md"}
 *
 *   [^mercury]:
 *       > * > * **Mercury** is the first planet from the Sun␠␠␠
 *       >   >   and the smallest in the Solar System.
 * @example
 *   {"gfm": true, "label": "output", "name": "containers.md"}
 *
 *   2:57-3:1: Unexpected `3` spaces for hard break, expected `2` spaces
 *
 * @example
 *   {"config": "🌍", "label": "output", "name": "not-ok-options.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected object
 *
 * @example
 *   {"config": {"allowSpaces": "🌍"}, "label": "output", "name": "not-ok-options-field.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options.allowSpaces`, expected `boolean`
 */

/**
 * @import {Root} from 'mdast'
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {boolean | null | undefined} [allowSpaces]
 *   Allow trailing space hard breaks at all (default: `false`).
 *   Use escape hard breaks otherwise
 */

import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintHardBreakSpaces = lintRule(
  {
    origin: 'remark-lint:hard-break-spaces',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-hard-break-spaces#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {Options | null | undefined} [options]
   *   Configuration.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    const value = String(file)
    // To do: next major: flip default.
    let allowSpaces = true

    if (options === null || options === undefined) {
      // Empty.
    } else if (typeof options === 'object') {
      if (typeof options.allowSpaces === 'boolean') {
        allowSpaces = options.allowSpaces
      } else if (
        options.allowSpaces !== null &&
        options.allowSpaces !== undefined
      ) {
        file.fail(
          'Unexpected value `' +
            options.allowSpaces +
            '` for `options.allowSpaces`, expected `boolean`'
        )
      }
    } else {
      file.fail(
        'Unexpected value `' + options + '` for `options`, expected object'
      )
    }

    visit(tree, 'break', function (node) {
      const end = pointEnd(node)
      const start = pointStart(node)

      if (
        end &&
        start &&
        typeof end.offset === 'number' &&
        typeof start.offset === 'number'
      ) {
        const slice = value.slice(start.offset, end.offset)

        let actual = 0
        while (slice.charCodeAt(actual) === 32) actual++

        if (allowSpaces ? actual > 2 : actual) {
          file.message(
            'Unexpected `' +
              actual +
              '` spaces for hard break, expected ' +
              (allowSpaces ? '`2` spaces' : 'escape'),
            node
          )
        }
      }
    })
  }
)

export default remarkLintHardBreakSpaces
