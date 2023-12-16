/**
 * remark-lint rule to warn when definitions are used *in* the
 * document instead of at the end.
 *
 * ## What is this?
 *
 * This package checks where definitions are placed.
 *
 * ## When should I use this?
 *
 * You can use this package to check that definitions are consistently at the
 * end of the document.
 *
 * ## API
 *
 * ### `unified().use(remarkLintFinalDefinition)`
 *
 * Warn when definitions are used *in* the document instead of at the end.
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
 * There are different strategies for placing definitions.
 * The simplest is perhaps to place them all at the bottem of documents.
 * If you prefer that, turn on this rule.
 *
 * [api-remark-lint-final-definition]: #unifieduseremarklintfinaldefinition
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module final-definition
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   Paragraph.
 *
 *   [example]: http://example.com "Example Domain"
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   Paragraph.
 *
 *   [example]: http://example.com "Example Domain"
 *
 *   Another paragraph.
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   3:1-3:47: Move definitions to the end of the file (after `5:19`)
 *
 * @example
 *   {"name": "ok-html-comments.md"}
 *
 *   Paragraph.
 *
 *   [example-1]: http://example.com/one/
 *
 *   <!-- Comments are fine between and after definitions. -->
 *
 *   [example-2]: http://example.com/two/
 *
 * @example
 *   {"name": "ok-mdx-comments.mdx", "mdx": true}
 *
 *   Paragraph.
 *
 *   [example-1]: http://example.com/one/
 *
 *   {/* Comments are fine in MDX. *␀/}
 *
 *   [example-2]: http://example.com/two/
 */

/**
 * @typedef {import('mdast').Definition} Definition
 * @typedef {import('mdast').FootnoteDefinition} FootnoteDefinition
 * @typedef {import('mdast').Root} Root
 *
 * @typedef {import('unist').Point} Point
 */

/// <reference types="mdast-util-mdx" />

import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {stringifyPosition} from 'unist-util-stringify-position'
import {visit} from 'unist-util-visit'

const remarkLintFinalDefinition = lintRule(
  {
    origin: 'remark-lint:final-definition',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-final-definition#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    /** @type {Array<Definition | FootnoteDefinition>} */
    const definitions = []
    /** @type {Point | undefined} */
    let last

    visit(tree, function (node) {
      if (node.type === 'definition' || node.type === 'footnoteDefinition') {
        definitions.push(node)
      } else if (
        node.type === 'root' ||
        // Ignore HTML comments.
        (node.type === 'html' && /^[\t ]*<!--/.test(node.value)) ||
        // Ignore MDX comments.
        ((node.type === 'mdxFlowExpression' ||
          node.type === 'mdxTextExpression') &&
          /^\s*\/\*/.test(node.value))
      ) {
        // Empty.
      } else {
        const place = pointEnd(node)

        if (place) {
          last = place
        }
      }
    })

    for (const node of definitions) {
      const point = pointStart(node)

      if (point && last && point.line < last.line) {
        file.message(
          'Move definitions to the end of the file (after `' +
            stringifyPosition(last) +
            '`)',
          node
        )
      }
    }
  }
)

export default remarkLintFinalDefinition
