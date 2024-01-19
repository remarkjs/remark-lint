/**
 * remark-lint rule to warn when HTML is used.
 *
 * ## What is this?
 *
 * This package checks HTML.
 *
 * ## When should I use this?
 *
 * You can use this package to check that no HTML is used.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoHtml[, options])`
 *
 * Warn when HTML is used.
 *
 * ###### Parameters
 *
 * * `options` ([`Options`][api-options], optional)
 *   — configuration
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
 * * `allowComments` (`boolean`, default: `true`)
 *   — allow comments or not
 *
 * [api-options]: #options
 * [api-remark-lint-no-html]: #unifieduseremarklintnohtml-options
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-html
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   # Mercury
 *
 *   <!--Venus-->
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   <h1>Mercury</h1>
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:1-1:17: Unexpected HTML, use markdown instead
 *
 * @example
 *   {"config": {"allowComments": false}, "label": "input", "name": "not-ok.md"}
 *
 *   <!--Mercury-->
 * @example
 *   {"config": {"allowComments": false}, "label": "output", "name": "not-ok.md"}
 *
 *   1:1-1:15: Unexpected HTML, use markdown instead
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {boolean | null | undefined} [allowComments=true]
 *   Allow comments or not (default: `true`).
 */

import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'

const remarkLintNoHtml = lintRule(
  {
    origin: 'remark-lint:no-html',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-html#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {Readonly<Options> | null | undefined} [options]
   *   Configuration (optional).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    let allowComments = true

    if (options && typeof options.allowComments === 'boolean') {
      allowComments = options.allowComments
    }

    visitParents(tree, 'html', function (node, parents) {
      if (!node.position) return

      if (allowComments && /^[\t ]*<!--/.test(node.value)) return

      file.message('Unexpected HTML, use markdown instead', {
        ancestors: [...parents, node],
        place: node.position
      })
    })
  }
)

export default remarkLintNoHtml
