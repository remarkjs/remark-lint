/**
 * remark-lint rule to warn when there are no blank lines between blocks.
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
 * Warn when there are no blank lines between blocks.
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
 * @example
 *   {"name": "ok.md"}
 *
 *   # Foo
 *
 *   ## Bar
 *
 *   - Paragraph
 *
 *     + List.
 *
 *   Paragraph.
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   # Foo
 *   ## Bar
 *
 *   - Paragraph
 *     + List.
 *
 *   Paragraph.
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   2:1-2:7: Missing blank line before block node
 *   5:3-5:10: Missing blank line before block node
 *
 * @example
 *   {"name": "tight.md", "config": {"exceptTightLists": true}, "label": "input"}
 *
 *   # Foo
 *   ## Bar
 *
 *   - Paragraph
 *     + List.
 *
 *   Paragraph.
 *
 * @example
 *   {"name": "tight.md", "config": {"exceptTightLists": true}, "label": "output"}
 *
 *   2:1-2:7: Missing blank line before block node
 *
 * @example
 *   {"name": "containers.md", "label": "input"}
 *
 *   > # Alpha
 *   >
 *   > Bravo.
 *
 *   - charlie.
 *   - delta.
 *
 *   + # Echo
 *     Foxtrot.
 * @example
 *   {"name": "containers.md", "label": "output"}
 *
 *   9:3-9:11: Missing blank line before block node
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "gfm.md"}
 *
 *   GFM tables and footnotes are also checked[^e]
 *
 *   | Alpha   | Bravo |
 *   | ------- | ----- |
 *   | Charlie | Delta |
 *
 *   [^e]: Echo
 *   [^f]: Foxtrot.
 *
 * @example
 *   {"gfm": true, "label": "output", "name": "gfm.md"}
 *
 *   8:1-8:15: Missing blank line before block node
 *
 * @example
 *   {"label": "input", "mdx": true, "name": "mdx.mdx"}
 *
 *   MDX JSX flow elements and expressions are also checked.
 *
 *   <Tip kind="info">
 *     # Alpha
 *     Bravo.
 *   </Tip>
 *   {Math.PI}
 *
 * @example
 *   {"label": "output", "mdx": true, "name": "mdx.mdx"}
 *
 *   5:3-5:9: Missing blank line before block node
 *   7:1-7:10: Missing blank line before block node
 *
 * @example
 *   {"label": "input", "math": true, "name": "math.md"}
 *
 *   Math is also checked.
 *
 *   $$
 *   \frac{1}{2}
 *   $$
 *   $$
 *   \frac{2}{3}
 *   $$
 *
 * @example
 *   {"label": "output", "math": true, "name": "math.md"}
 *
 *   6:1-8:3: Missing blank line before block node
 *
 * @example
 *   {"directive": true, "label": "input", "name": "directive.md"}
 *
 *   Directives are also checked.
 *
 *   ::video{#123}
 *   :::tip
 *   Tip!
 *   :::
 *
 * @example
 *   {"directive": true, "label": "output", "name": "directive.md"}
 *
 *   4:1-6:4: Missing blank line before block node
 */

/**
 * @typedef {import('mdast').Nodes} Nodes
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {boolean | null | undefined} [exceptTightLists=false]
 *   Allow tight list items (default: `false`).
 */

/// <reference types="mdast-util-directive" />
/// <reference types="mdast-util-math" />
/// <reference types="mdast-util-mdx" />

import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

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

    visit(tree, function (node, index, parent) {
      if (
        parent &&
        typeof index === 'number' &&
        types.includes(node.type) &&
        (parent.type !== 'listItem' || !exceptTightLists)
      ) {
        const start = pointStart(node)
        const previous = parent.children[index - 1]
        const previousEnd = pointEnd(previous)

        if (
          start &&
          previousEnd &&
          types.includes(previous.type) &&
          start.line === previousEnd.line + 1
        ) {
          file.message('Missing blank line before block node', node)
        }
      }
    })
  }
)

export default remarkLintNoMissingBlankLines
