/**
 * remark-lint rule to warn when blank lines are missing.
 *
 * ## What is this?
 *
 * This package checks missing blank lines.
 *
 * ## When should I use this?
 *
 * You can use this package to check blank lines.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoMissingBlankLines[, options])`
 *
 * Warn when blank lines are missing.
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
 * * `exceptTightLists` (`boolean`, default: `false`)
 *   — allow omitting blank lines in list items
 *
 * ## Recommendation
 *
 * Blank lines are required in certain sometimes confusing cases.
 * So it’s recommended to always use blank lines between blocks.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] always uses blank lines
 * between blocks.
 * It has a `join` function to customize such behavior.
 *
 * [api-options]: #options
 * [api-remark-lint-no-missing-blank-lines]: #unifieduseremarklintnomissingblanklines-options
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-missing-blank-lines
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   # Mercury
 *
 *   ## Venus
 *
 *   * Earth.
 *
 *     * Mars.
 *
 *   > # Jupiter
 *   >
 *   > Saturn.
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   # Mercury
 *   ## Venus
 *
 *   * Earth
 *     * Mars.
 *
 *   > # Jupiter
 *   > Saturn.
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *    2:1-2:9: Unexpected `0` blank lines between nodes, expected `1` or more blank lines, add `1` blank line
 *    5:3-5:10: Unexpected `0` blank lines between nodes, expected `1` or more blank lines, add `1` blank line
 *    8:3-8:10: Unexpected `0` blank lines between nodes, expected `1` or more blank lines, add `1` blank line
 *
 * @example
 *   {"config": {"exceptTightLists": true}, "name": "tight.md"}
 *
 *   * Venus.
 *
 *     * Mars.
 *
 * @example
 *   {"label": "input", "name": "containers.md"}
 *
 *   > # Venus
 *   >
 *   > Mercury.
 *
 *   - earth.
 *   - mars.
 *
 *   * # Jupiter
 *     Saturn.
 * @example
 *   {"label": "output", "name": "containers.md"}
 *
 *   9:3-9:10: Unexpected `0` blank lines between nodes, expected `1` or more blank lines, add `1` blank line
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "gfm.md"}
 *
 *   | Planet  | Diameter |
 *   | ------- | -------- |
 *   | Mercury | 4 880 km |
 *
 *   [^Mercury]:
 *       **Mercury** is the first planet from the Sun and the smallest
 *       in the Solar System.
 *   [^Venus]:
 *       **Venus** is the second planet from the Sun.
 * @example
 *   {"gfm": true, "label": "output", "name": "gfm.md"}
 *
 *   8:1-9:49: Unexpected `0` blank lines between nodes, expected `1` or more blank lines, add `1` blank line
 *
 * @example
 *   {"label": "input", "mdx": true, "name": "mdx.mdx"}
 *
 *   <Tip kind="info">
 *     # Venus
 *     Mars.
 *   </Tip>
 *   {Math.PI}
 * @example
 *   {"label": "output", "mdx": true, "name": "mdx.mdx"}
 *
 *    3:3-3:8: Unexpected `0` blank lines between nodes, expected `1` or more blank lines, add `1` blank line
 *    5:1-5:10: Unexpected `0` blank lines between nodes, expected `1` or more blank lines, add `1` blank line
 *
 * @example
 *   {"label": "input", "math": true, "name": "math.md"}
 *
 *   $$
 *   \frac{1}{2}
 *   $$
 *   $$
 *   \frac{2}{3}
 *   $$
 * @example
 *   {"label": "output", "math": true, "name": "math.md"}
 *
 *   4:1-6:3: Unexpected `0` blank lines between nodes, expected `1` or more blank lines, add `1` blank line
 *
 * @example
 *   {"directive": true, "label": "input", "name": "directive.md"}
 *
 *   Directives are also checked.
 *
 *   ::video{#mercury}
 *   :::planet
 *   Venus.
 *   :::
 * @example
 *   {"directive": true, "label": "output", "name": "directive.md"}
 *
 *   4:1-6:4: Unexpected `0` blank lines between nodes, expected `1` or more blank lines, add `1` blank line
 */

/**
 * @import {Nodes, Root} from 'mdast'
 * @import {} from 'mdast-util-directive'
 * @import {} from 'mdast-util-math'
 * @import {} from 'mdast-util-mdx'
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {boolean | null | undefined} [exceptTightLists=false]
 *   Allow tight list items (default: `false`).
 */

import {phrasing} from 'mdast-util-phrasing'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'

/** @type {ReadonlyArray<Nodes['type']>} */
// eslint-disable-next-line unicorn/prefer-set-has
const types = [
  'blockquote',
  'code',
  'containerDirective',
  'definition',
  'footnoteDefinition',
  'heading',
  'html',
  'leafDirective',
  'list',
  'math',
  'mdxFlowExpression',
  'mdxJsxFlowElement',
  'paragraph',
  'table',
  'thematicBreak',
  // @ts-expect-error: `remark-frontmatter`.
  'toml',
  'yaml'
]

const remarkLintNoMissingBlankLines = lintRule(
  {
    origin: 'remark-lint:no-missing-blank-lines',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-missing-blank-lines#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {Options | null | undefined} [options]
   *   Configuration (optional).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    const exceptTightLists = options ? options.exceptTightLists : false

    visitParents(tree, function (node, parents) {
      const parent = parents[parents.length - 1]

      if (!parent) return

      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (
        // Children of list items are normally checked.
        (!exceptTightLists || parent.type !== 'listItem') &&
        // Known block:
        types.includes(node.type)
      ) {
        const start = pointStart(node)
        const siblings = /** @type {Array<Nodes>} */ (parent.children)
        const previous = siblings[siblings.indexOf(node) - 1]
        const previousEnd = pointEnd(previous)

        if (
          !previous ||
          !previousEnd ||
          !start ||
          // Other known block:
          !types.includes(previous.type)
        ) {
          return
        }

        if (previousEnd.line + 1 === start.line) {
          file.message(
            'Unexpected `0` blank lines between nodes, expected `1` or more blank lines, add `1` blank line',
            {ancestors: [...parents, node], place: node.position}
          )
        }
      }
    })
  }
)

export default remarkLintNoMissingBlankLines
