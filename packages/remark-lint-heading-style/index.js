/**
 * remark-lint rule to warn when headings violate a given style.
 *
 * ## What is this?
 *
 * This package checks the style of headings.
 *
 * ## When should I use this?
 *
 * You can use this package to check that the style of headings is consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintHeadingStyle[, options])`
 *
 * Warn when headings violate a given style.
 *
 * ###### Parameters
 *
 * * `options` ([`Options`][api-options], default: `'consistent'`)
 *   — preferred style or whether to detect the first style and warn for
 *   further differences
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * ###### Type
 *
 * ```ts
 * type Options = Style | 'consistent'
 * ```
 *
 * ### `Style`
 *
 * Style (TypeScript type).
 *
 * ###### Type
 *
 * ```ts
 * type Style = 'atx' | 'atx-closed' | 'setext'
 * ```
 *
 * ## Recommendation
 *
 * Setext headings are limited in that they can only construct headings with a
 * rank of one and two.
 * They do allow multiple lines of content where ATX only allows one line.
 * The number of used markers in their underline does not matter,
 * leading to either:
 *
 * * 1 marker (`Hello\n-`),
 *   which is the bare minimum,
 *   and for rank 2 headings looks suspiciously like an empty list item
 * * using as many markers as the content (`Hello\n-----`),
 *   which is hard to maintain and diff
 * * an arbitrary number (`Hello\n---`), which for rank 2 headings looks
 *   suspiciously like a thematic break
 *
 * Setext headings are also uncommon.
 * Using a sequence of hashes at the end of ATX headings is even more uncommon.
 * Due to this,
 * it’s recommended to use ATX headings, without closing hashes.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] formats headings as ATX by default.
 * The other styles can be configured with `setext: true` or `closeAtx: true`.
 *
 * [api-options]: #options
 * [api-remark-lint-heading-style]: #unifieduseremarklintheadingstyle-options
 * [api-style]: #style
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module heading-style
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md", "config": "atx"}
 *
 *   # Alpha
 *
 *   ## Bravo
 *
 *   ### Charlie
 *
 * @example
 *   {"name": "ok.md", "config": "atx-closed"}
 *
 *   # Delta ##
 *
 *   ## Echo ##
 *
 *   ### Foxtrot ###
 *
 * @example
 *   {"name": "ok.md", "config": "setext"}
 *
 *   Golf
 *   ====
 *
 *   Hotel
 *   -----
 *
 *   ### India
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   Juliett
 *   =======
 *
 *   ## Kilo
 *
 *   ### Lima ###
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   4:1-4:8: Headings should use setext
 *   6:1-6:13: Headings should use setext
 *
 * @example
 *   {"name": "not-ok.md", "config": "💩", "label": "output", "positionless": true}
 *
 *   1:1: Incorrect heading style type `💩`: use either `'consistent'`, `'atx'`, `'atx-closed'`, or `'setext'`
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {Style | 'consistent'} Options
 *   Configuration.
 *
 * @typedef {'atx' | 'atx-closed' | 'setext'} Style
 *   Styles.
 */

import {headingStyle} from 'mdast-util-heading-style'
import {lintRule} from 'unified-lint-rule'
import {position} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const remarkLintHeadingStyle = lintRule(
  {
    origin: 'remark-lint:heading-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-heading-style#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {Options | null | undefined} [options='consistent']
   *   Configuration (default: `'consistent'`).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    let option = options || 'consistent'

    if (
      option !== 'atx' &&
      option !== 'atx-closed' &&
      option !== 'consistent' &&
      option !== 'setext'
    ) {
      file.fail(
        'Incorrect heading style type `' +
          option +
          "`: use either `'consistent'`, `'atx'`, `'atx-closed'`, or `'setext'`"
      )
    }

    visit(tree, 'heading', function (node) {
      const place = position(node)

      if (place) {
        if (option === 'consistent') {
          /* c8 ignore next -- funky nodes perhaps cannot be detected. */
          option = headingStyle(node) || 'consistent'
        } else if (headingStyle(node, option) !== option) {
          file.message('Headings should use ' + option, place)
        }
      }
    })
  }
)

export default remarkLintHeadingStyle
