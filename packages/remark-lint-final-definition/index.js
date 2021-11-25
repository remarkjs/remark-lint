/**
 * ## When should I use this?
 *
 * You can use this package to check that definitions are placed at the end of
 * the document.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * There are different strategies for placing definitions.
 * The simplest is perhaps to place them all at the bottem of documents.
 * If you prefer that, turn on this rule.
 *
 * @module final-definition
 * @summary
 *   remark-lint rule to warn when definitions are used *in* the document
 *   instead of at the end.
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
 *   3:1-3:47: Move definitions to the end of the file (after the node at line `5`)
 *
 * @example
 *   {"name": "ok-comments.md"}
 *
 *   Paragraph.
 *
 *   [example-1]: http://example.com/one/
 *
 *   <!-- Comments are fine between and after definitions -->
 *
 *   [example-2]: http://example.com/two/
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const remarkLintFinalDefinition = lintRule(
  {
    origin: 'remark-lint:final-definition',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-final-definition#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    let last = 0

    visit(
      tree,
      (node) => {
        // Ignore generated and HTML comment nodes.
        if (
          node.type === 'root' ||
          generated(node) ||
          (node.type === 'html' && /^\s*<!--/.test(node.value))
        ) {
          return
        }

        const line = pointStart(node).line

        if (node.type === 'definition') {
          if (last && last > line) {
            file.message(
              'Move definitions to the end of the file (after the node at line `' +
                last +
                '`)',
              node
            )
          }
        } else if (last === 0) {
          last = line
        }
      },
      true
    )
  }
)

export default remarkLintFinalDefinition
