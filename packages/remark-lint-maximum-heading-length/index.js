/**
 * remark-lint rule to warn when headings are too long.
 *
 * ## What is this?
 *
 * This package checks the length of heading text.
 *
 * ## When should I use this?
 *
 * You can use this package to check that heading text is within reason.
 *
 * ## API
 *
 * ### `unified().use(remarkLintMaximumHeadingLength[, options])`
 *
 * Warn when headings are too long.
 *
 * ###### Parameters
 *
 * * `options` (`number`, default: `60`)
 *   — preferred max size
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ## Recommendation
 *
 * While this rule is sometimes annoying,
 * reasonable size headings do help SEO purposes (bots prefer reasonable
 * headings),
 * visual users (headings are typically displayed quite large),
 * and users of screen readers (who use “jump to heading” features that read
 * every heading out loud to navigate within a page).
 *
 * [api-remark-lint-maximum-heading-length]: #unifieduseremarklintmaximumheadinglength-options
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module maximum-heading-length
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   # Alpha bravo charlie delta echo foxtrot golf hotel
 *
 *   # ![Alpha bravo charlie delta echo foxtrot golf hotel](http://example.com/nato.png)
 *
 * @example
 *   {"name": "not-ok.md", "config": 40, "label": "input"}
 *
 *   # Alpha bravo charlie delta echo foxtrot golf hotel
 *
 * @example
 *   {"name": "not-ok.md", "config": 40, "label": "output"}
 *
 *   1:1-1:52: Use headings shorter than `40`
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {toString} from 'mdast-util-to-string'
import {lintRule} from 'unified-lint-rule'
import {position} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintMaximumHeadingLength = lintRule(
  {
    origin: 'remark-lint:maximum-heading-length',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-maximum-heading-length#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {number | null | undefined} [options=60]
   *   Configuration (default: `60`).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    const option = options || 60

    visit(tree, 'heading', function (node) {
      const place = position(node)

      if (place && toString(node).length > option) {
        file.message('Use headings shorter than `' + option + '`', place)
      }
    })
  }
)

export default remarkLintMaximumHeadingLength
