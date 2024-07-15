/**
 * remark-lint rule to warn when lines are too long.
 *
 * ## What is this?
 *
 * This package checks the length of lines.
 *
 * ## When should I use this?
 *
 * You can use this package to check that lines are within reason.
 *
 * ## API
 *
 * ### `unified().use(remarkLintMaximumLineLength[, options])`
 *
 * Warn when lines are too long.
 *
 * Nodes that cannot be wrapped are ignored, such as JSX, HTML, code (flow),
 * definitions, headings, and tables.
 *
 * When code (phrasing), images, and links start before the wrap,
 * end after the wrap,
 * and contain no whitespace,
 * they are also ignored.
 *
 * ###### Parameters
 *
 * * `options` (`number`, default: `80`)
 *   — preferred max size
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ## Recommendation
 *
 * Whether to wrap prose or not is a stylistic choice.
 *
 * [api-remark-lint-maximum-line-length]: #unifieduseremarklintmaximumlinelength-options
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module maximum-line-length
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md", "positionless": true}
 *
 *   Mercury mercury mercury mercury mercury mercury mercury mercury mercury mercury
 *   mercury.
 *
 *   Mercury mercury mercury mercury mercury mercury mercury mercury mercury `mercury()`.
 *
 *   Mercury mercury mercury mercury mercury mercury mercury mercury mercury <http://localhost>.
 *
 *   Mercury mercury mercury mercury mercury mercury mercury mercury mercury [mercury](http://localhost).
 *
 *   Mercury mercury mercury mercury mercury mercury mercury mercury mercury ![mercury](http://localhost).
 *
 *   <div>Mercury mercury mercury mercury mercury mercury mercury mercury mercury</div>
 *
 *   [foo]: http://localhost/mercury/mercury/mercury/mercury/mercury/mercury/mercury/mercury
 *
 * @example
 *   {"config": 20, "label": "input", "name": "not-ok.md", "positionless": true}
 *
 *   Mercury mercury mercury
 *   mercury.
 *
 *   Mercury mercury mercury `mercury()`.
 *
 *   Mercury mercury mercury <http://localhost>.
 *
 *   Mercury mercury mercury [m](example.com).
 *
 *   Mercury mercury mercury ![m](example.com).
 *
 *   `mercury()` mercury mercury mercury.
 *
 *   <http://localhost> mercury.
 *
 *   [m](example.com) mercury.
 *
 *   ![m](example.com) mercury.
 *
 *   Mercury mercury ![m](example.com) mercury.
 *
 * @example
 *   {"config": 20, "label": "output", "name": "not-ok.md", "positionless": true}
 *
 *   1:24: Unexpected `23` character line, expected at most `20` characters, remove `3` characters
 *   4:37: Unexpected `36` character line, expected at most `20` characters, remove `16` characters
 *   6:44: Unexpected `43` character line, expected at most `20` characters, remove `23` characters
 *   8:42: Unexpected `41` character line, expected at most `20` characters, remove `21` characters
 *   10:43: Unexpected `42` character line, expected at most `20` characters, remove `22` characters
 *   12:37: Unexpected `36` character line, expected at most `20` characters, remove `16` characters
 *   14:28: Unexpected `27` character line, expected at most `20` characters, remove `7` characters
 *   16:26: Unexpected `25` character line, expected at most `20` characters, remove `5` characters
 *   18:27: Unexpected `26` character line, expected at most `20` characters, remove `6` characters
 *   20:43: Unexpected `42` character line, expected at most `20` characters, remove `22` characters
 *
 * @example
 *   {"config": 20, "name": "long-autolinks-ok.md", "positionless": true}
 *
 *   <http://localhost/mercury/>
 *
 *   <http://localhost/mercury/>
 *   mercury.
 *
 *   Mercury
 *   <http://localhost/mercury/>.
 *
 *   Mercury
 *   <http://localhost/mercury/>
 *   mercury.
 *
 *   Mercury
 *   <http://localhost/mercury/>
 *   mercury mercury.
 *
 *   Mercury mercury
 *   <http://localhost/mercury/>
 *   mercury mercury.
 *
 * @example
 *   {"config": 20, "label": "input", "name": "long-autolinks-nok.md", "positionless": true}
 *
 *   <http://localhost/mercury/> mercury.
 *
 *   Mercury <http://localhost/mercury/>.
 *
 *   Mercury
 *   <http://localhost/mercury/> mercury.
 *
 *   Mercury <http://localhost/mercury/>
 *   mercury.
 * @example
 *   {"config": 20, "label": "output", "name": "long-autolinks-nok.md"}
 *
 *   1:37: Unexpected `36` character line, expected at most `20` characters, remove `16` characters
 *   6:37: Unexpected `36` character line, expected at most `20` characters, remove `16` characters
 *
 * @example
 *   {"config": 20, "frontmatter": true, "name": "ok.md", "positionless": true}
 *
 *   ---
 *   description: Mercury mercury mercury mercury.
 *   ---
 *
 * @example
 *   {"config": 20, "gfm": true, "name": "ok.md", "positionless": true}
 *
 *   | Mercury | Mercury | Mercury |
 *   | ------- | ------- | ------- |
 *
 * @example
 *   {"config": 20, "math": true, "name": "ok.md", "positionless": true}
 *
 *   $$
 *   L = \frac{1}{2} \rho v^2 S C_L
 *   $$
 *
 * @example
 *   {"config": 20, "mdx": true, "name": "ok.md", "positionless": true}
 *
 *   export const description = 'Mercury mercury mercury mercury.'
 *
 *   {description}
 *
 * @example
 *   {"config": 10, "name": "ok-mixed-line-endings.md", "positionless": true}
 *
 *   0123456789␍␊0123456789␊01234␍␊01234␊
 *
 * @example
 *   {"config": 10, "label": "input", "name": "not-ok-mixed-line-endings.md", "positionless": true}
 *
 *   012345678901␍␊012345678901␊01234567890␍␊01234567890␊
 *
 * @example
 *   {"config": 10, "label": "output", "name": "not-ok-mixed-line-endings.md", "positionless": true}
 *
 *   1:13: Unexpected `12` character line, expected at most `10` characters, remove `2` characters
 *   2:13: Unexpected `12` character line, expected at most `10` characters, remove `2` characters
 *   3:12: Unexpected `11` character line, expected at most `10` characters, remove `1` character
 *   4:12: Unexpected `11` character line, expected at most `10` characters, remove `1` character
 *
 * @example
 *   {"config": "🌍", "label": "output", "name": "not-ok.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected `number`
 */

/**
 * @import {Root} from 'mdast'
 * @import {} from 'mdast-util-mdx'
 */

import pluralize from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {SKIP, visit} from 'unist-util-visit'

const remarkLintMaximumLineLength = lintRule(
  {
    origin: 'remark-lint:maximum-line-length',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-maximum-line-length#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {number | null | undefined} [options=80]
   *   Configuration (default: `80`).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    const value = String(file)
    const lines = value.split(/\r?\n/)
    let expected = 80

    if (options === null || options === undefined) {
      // Empty.
    } else if (typeof options === 'number') {
      expected = options
    } else {
      file.fail(
        'Unexpected value `' + options + '` for `options`, expected `number`'
      )
    }

    // eslint-disable-next-line complexity
    visit(tree, function (node, index, parent) {
      // Allow nodes that cannot be wrapped.
      if (
        node.type === 'code' ||
        node.type === 'definition' ||
        node.type === 'heading' ||
        node.type === 'html' ||
        node.type === 'math' ||
        node.type === 'mdxjsEsm' ||
        node.type === 'mdxFlowExpression' ||
        node.type === 'mdxTextExpression' ||
        node.type === 'table' ||
        // @ts-expect-error: TOML from frontmatter.
        node.type === 'toml' ||
        node.type === 'yaml'
      ) {
        const end = pointEnd(node)
        const start = pointStart(node)

        if (end && start) {
          let line = start.line - 1
          while (line < end.line) {
            lines[line++] = ''
          }
        }

        return SKIP
      }

      // Allow text spans to cross the border.
      if (
        node.type === 'image' ||
        node.type === 'inlineCode' ||
        node.type === 'link'
      ) {
        const end = pointEnd(node)
        const start = pointStart(node)

        if (end && start && parent && typeof index === 'number') {
          // Not allowing when starting after the border.
          if (start.column > expected) return

          // Not allowing when ending before it.
          if (end.column < expected) return

          const next = parent.children[index + 1]
          const nextStart = pointStart(next)

          // Not allowing when there’s a following child with a break
          // opportunity on the line.
          if (
            next &&
            nextStart &&
            nextStart.line === start.line &&
            // Either something with children:
            (!('value' in next) ||
              // Or with whitespace:
              /^([^\r\n]*)[ \t]/.test(next.value))
          ) {
            return
          }

          let line = start.line - 1
          while (line < end.line) {
            lines[line++] = ''
          }
        }
      }
    })

    // Iterate over every line and warn for violating lines.
    let index = -1

    while (++index < lines.length) {
      const actualBytes = lines[index].length
      const actualCharacters = Array.from(lines[index]).length
      const difference = actualCharacters - expected

      if (difference > 0) {
        file.message(
          'Unexpected `' +
            actualCharacters +
            '` character line, expected at most `' +
            expected +
            '` characters, remove `' +
            difference +
            '` ' +
            pluralize('character', difference),
          {
            line: index + 1,
            column: actualBytes + 1
          }
        )
      }
    }
  }
)

export default remarkLintMaximumLineLength
