/**
 * remark-lint rule to warn when closing tags are used without
 * children.
 *
 * ## What is this?
 *
 * This package checks that self-closing MDX JSX tags are used
 * when possible.
 *
 * ## When should I use this?
 *
 * You can use this package to check that self-closing MDX JSX
 * tags are used when possible.
 *
 * ## API
 *
 * ### `unified().use(remarkLintMdxJsxSelfClose)`
 *
 * Warn when closing tags are used without children.
 *
 * ###### Parameters
 *
 * There are no parameters.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-mdx-jsx-self-close]: #unifieduseremarklintmdxjsxselfclose
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module mdx-jsx-self-close
 * @author Titus Wormer
 * @copyright 2025 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"mdx": true, "name": "ok.mdx"}
 *
 *   <strong>Venus</strong> and
 *   <strong children={'Earth'} />.
 *
 * @example
 *   {"label": "input", "mdx": true, "name": "not-ok.mdx"}
 *
 *   <a href="http://example.com/venus/"></a>.
 * @example
 *   {"label": "output", "mdx": true, "name": "not-ok.mdx"}
 *
 *   1:1-1:41: Unexpected closing tag on empty element, expected self-closing opening tag
 *
 * @example
 *   {"mdx": true, "name": "whitespace.mdx"}
 *
 *   Whitespace in tags <Icon / > and whitespace
 *   in elements <code> </code>.
 */

/**
 * @import {Root} from 'mdast'
 * @import {} from 'mdast-util-mdx'
 */

import {unicodeWhitespace} from 'micromark-util-character'
import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'
import {pointEnd} from 'unist-util-position'

const remarkLintMdxJsxSelfClose = lintRule(
  {
    origin: 'remark-lint:mdx-jsx-self-close',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-mdx-jsx-self-close#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    const value = String(file)

    visitParents(tree, function (node, parents) {
      if (
        node.type === 'mdxJsxFlowElement' ||
        node.type === 'mdxJsxTextElement'
      ) {
        const end = pointEnd(node)

        if (!end || !end.offset) return

        let index = end.offset - 1

        /* c8 ignore next -- should be correct but exit if not. */
        if (value.charCodeAt(index) !== 62 /* `>` */) return
        index--

        while (unicodeWhitespace(value.charCodeAt(index))) index--

        const empty = node.children.length === 0
        const selfClosing = value.charCodeAt(index) === 47 /* `/` */

        // Self closing and not empty should not occur.
        if (empty && !selfClosing) {
          file.message(
            'Unexpected closing tag on empty element, expected self-closing opening tag',
            {ancestors: [...parents, node], place: node.position}
          )
        }
      }
    })
  }
)

export default remarkLintMdxJsxSelfClose
