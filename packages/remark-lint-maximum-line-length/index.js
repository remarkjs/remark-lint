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
 * @example
 *   {"name": "ok.md", "positionless": true, "gfm": true}
 *
 *   This line is simply not toooooooooooooooooooooooooooooooooooooooooooo
 *   long.
 *
 *   This is also fine: <http://this-long-url-with-a-long-domain.co.uk/a-long-path?query=variables>
 *
 *   <http://this-link-is-fine.com>
 *
 *   `alphaBravoCharlieDeltaEchoFoxtrotGolfHotelIndiaJuliettKiloLimaMikeNovemberOscarPapaQuebec.romeo()`
 *
 *   [foo](http://this-long-url-with-a-long-domain-is-ok.co.uk/a-long-path?query=variables)
 *
 *   <http://this-long-url-with-a-long-domain-is-ok.co.uk/a-long-path?query=variables>
 *
 *   ![foo](http://this-long-url-with-a-long-domain-is-ok.co.uk/a-long-path?query=variables)
 *
 *   | An | exception | is | line | length | in | long | tables | because | those | can’t | just |
 *   | -- | --------- | -- | ---- | ------ | -- | ---- | ------ | ------- | ----- | ----- | ---- |
 *   | be | helped    |    |      |        |    |      |        |         |       |       | .    |
 *
 *   <a><b><i><p><q><s><u>alpha bravo charlie delta echo foxtrot golf</u></s></q></p></i></b></a>
 *
 *   The following is also fine (note the `.`), because there is no whitespace.
 *
 *   <http://this-long-url-with-a-long-domain-is-ok.co.uk/a-long-path?query=variables>.
 *
 *   In addition, definitions are also fine:
 *
 *   [foo]: <http://this-long-url-with-a-long-domain-is-ok.co.uk/a-long-path?query=variables>
 *
 * @example
 *   {"name": "not-ok.md", "config": 80, "label": "input", "positionless": true}
 *
 *   This line is simply not tooooooooooooooooooooooooooooooooooooooooooooooooooooooo
 *   long.
 *
 *   Just like thiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiis one.
 *
 *   And this one is also very wrong: because the link starts aaaaaaafter the column: <http://line.com>
 *
 *   <http://this-long-url-with-a-long-domain-is-not-ok.co.uk/a-long-path?query=variables> and such.
 *
 *   And this one is also very wrong: because the code starts aaaaaaafter the column: `alpha.bravo()`
 *
 *   `alphaBravoCharlieDeltaEchoFoxtrotGolfHotelIndiaJuliettKiloLimaMikeNovemberOscar.papa()` and such.
 *
 * @example
 *   {"name": "not-ok.md", "config": 80, "label": "output", "positionless": true}
 *
 *   4:86: Line must be at most 80 characters
 *   6:99: Line must be at most 80 characters
 *   8:96: Line must be at most 80 characters
 *   10:97: Line must be at most 80 characters
 *   12:99: Line must be at most 80 characters
 *
 * @example
 *   {"name": "ok-mixed-line-endings.md", "config": 10, "positionless": true}
 *
 *   0123456789␍␊0123456789␊01234␍␊01234␊
 *
 * @example
 *   {"name": "not-ok-mixed-line-endings.md", "config": 10, "label": "input", "positionless": true}
 *
 *   012345678901␍␊012345678901␊01234567890␍␊01234567890␊
 *
 * @example
 *   {"name": "not-ok-mixed-line-endings.md", "config": 10, "label": "output", "positionless": true}
 *
 *   1:13: Line must be at most 10 characters
 *   2:13: Line must be at most 10 characters
 *   3:12: Line must be at most 10 characters
 *   4:12: Line must be at most 10 characters
 */

/// <reference types="mdast-util-mdx" />

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

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
    const option = options || 80

    visit(tree, function (node) {
      if (
        node.type === 'code' ||
        node.type === 'definition' ||
        node.type === 'heading' ||
        node.type === 'html' ||
        node.type === 'mdxJsxTextElement' ||
        node.type === 'mdxTextExpression' ||
        node.type === 'table' ||
        // @ts-expect-error: TOML from frontmatter.
        node.type === 'toml' ||
        node.type === 'yaml'
      ) {
        const end = pointEnd(node)
        const start = pointStart(node)

        if (end && start) {
          allowList(start.line - 1, end.line)
        }
      }
    })

    // Finally, allow some inline spans, but only if they occur at or after
    // the wrap.
    // However, when they do, and there’s whitespace after it, they are not
    // allowed.
    visit(tree, function (node, pos, parent) {
      const final = pointEnd(node)
      const initial = pointStart(node)

      if (
        (node.type === 'image' ||
          node.type === 'inlineCode' ||
          node.type === 'link') &&
        initial &&
        final &&
        parent &&
        typeof pos === 'number'
      ) {
        // Not allowing when starting after the border, or ending before it.
        if (initial.column > option || final.column < option) {
          return
        }

        const next = parent.children[pos + 1]
        const nextStart = pointStart(next)

        // Not allowing when there’s whitespace after the link.
        if (
          next &&
          nextStart &&
          nextStart.line === initial.line &&
          (!('value' in next) || /^(.+?[ \t].+?)/.test(next.value))
        ) {
          return
        }

        allowList(initial.line - 1, final.line)
      }
    })

    // Iterate over every line, and warn for violating lines.
    let index = -1

    while (++index < lines.length) {
      const lineLength = lines[index].length

      if (lineLength > option) {
        file.message('Line must be at most ' + option + ' characters', {
          line: index + 1,
          column: lineLength + 1
        })
      }
    }

    /**
     * Allowlist from `initial` to `final`, zero-based.
     *
     * @param {number} initial
     *   Initial line.
     * @param {number} final
     *   Final line.
     * @returns {undefined}
     *   Nothing.
     */
    function allowList(initial, final) {
      while (initial < final) {
        lines[initial++] = ''
      }
    }
  }
)

export default remarkLintMaximumLineLength
