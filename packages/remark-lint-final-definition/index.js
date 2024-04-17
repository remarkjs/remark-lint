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
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   Mercury.
 *
 *   [venus]: http://example.com
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   [mercury]: http://example.com/mercury/
 *   [venus]: http://example.com/venus/
 *
 * @example
 *   {"name": "ok-html-comments.md"}
 *
 *   Mercury.
 *
 *   [venus]: http://example.com/venus/
 *
 *   <!-- HTML comments in markdown are ignored. -->
 *
 *   [earth]: http://example.com/earth/
 *
 * @example
 *   {"name": "ok-mdx-comments.mdx", "mdx": true}
 *
 *   Mercury.
 *
 *   [venus]: http://example.com/venus/
 *
 *   {/* Comments in expressions in MDX are ignored. *␀/}
 *
 *   [earth]: http://example.com/earth/
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   Mercury.
 *
 *   [venus]: https://example.com/venus/
 *
 *   Earth.
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   3:1-3:36: Unexpected definition before last content, expected definitions after line `5`
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "gfm-nok.md"}
 *
 *   Mercury.
 *
 *   [^venus]:
 *       **Venus** is the second planet from
 *       the Sun.
 *
 *   Earth.
 * @example
 *   {"gfm": true, "label": "output", "name": "gfm-nok.md"}
 *
 *   3:1-5:13: Unexpected footnote definition before last content, expected definitions after line `7`
 *
 * @example
 *   {"gfm": true, "name": "gfm-ok.md"}
 *
 *   Mercury.
 *
 *   Earth.
 *
 *   [^venus]:
 *       **Venus** is the second planet from
 *       the Sun.
 */

/**
 * @typedef {import('mdast').Nodes} Nodes
 * @typedef {import('mdast').Root} Root
 */

/// <reference types="mdast-util-mdx" />

import {ok as assert} from 'devlop'
import {phrasing} from 'mdast-util-phrasing'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

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
    /** @type {Array<Array<Nodes>>} */
    const definitionStacks = []
    /** @type {Array<Nodes> | undefined} */
    let contentAncestors

    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type === 'definition' || node.type === 'footnoteDefinition') {
        definitionStacks.push([...parents, node])
        // Do not enter footnote definitions.
        return SKIP
      }

      if (
        node.type === 'root' ||
        // Ignore HTML comments.
        (node.type === 'html' && /^[\t ]*<!--/.test(node.value)) ||
        // Ignore MDX comments.
        (node.type === 'mdxFlowExpression' && /^\s*\/\*/.test(node.value))
      ) {
        return
      }

      contentAncestors = [...parents, node]
    })

    const content = contentAncestors ? contentAncestors.at(-1) : undefined
    const contentEnd = pointEnd(content)

    if (contentEnd) {
      assert(content) // Always defined.
      assert(contentAncestors) // Always defined.

      for (const definitionAncestors of definitionStacks) {
        const definition = definitionAncestors.at(-1)
        assert(definition) // Always defined.

        const definitionStart = pointStart(definition)

        if (definitionStart && definitionStart.line < contentEnd.line) {
          file.message(
            'Unexpected ' +
              (definition.type === 'footnoteDefinition' ? 'footnote ' : '') +
              'definition before last content, expected definitions after line `' +
              contentEnd.line +
              '`',
            {
              ancestors: definitionAncestors,
              cause: new VFileMessage('Last content defined here', {
                ancestors: contentAncestors,
                place: content.position,
                ruleId: 'final-definition',
                source: 'remark-lint'
              }),
              place: definition.position
            }
          )
        }
      }
    }
  }
)

export default remarkLintFinalDefinition
