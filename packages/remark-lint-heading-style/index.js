/**
 * ## When should I use this?
 *
 * You can use this package to check that headings are consistent.
 *
 * ## API
 *
 * The following options (default: `'consistent'`) are accepted:
 *
 * *   `'atx'`
 *     — prefer ATX headings:
 *     ```markdown
 *     ## Hello
 *     ```
 * *   `'atx-closed'`
 *     — prefer ATX headings with a closing sequence:
 *     ```markdown
 *     ## Hello ##
 *     ```
 * *   `'setext'`
 *     — prefer setext headings:
 *     ```markdown
 *     Hello
 *     -----
 *     ```
 * *   `'consistent'`
 *     — detect the first used style and warn when further headings differ
 *
 * ## Recommendation
 *
 * Setext headings are limited in that they can only construct headings with a
 * rank of one and two.
 * On the other hand, they do allow multiple lines of content whereas ATX only
 * allows one line.
 * The number of used markers in their underline does not matter, leading to
 * either:
 *
 * *   1 marker (`Hello\n-`), which is the bare minimum, and for rank 2 headings
 *     looks suspiciously like an empty list item
 * *   using as many markers as the content (`Hello\n-----`), which is hard to
 *     maintain
 * *   an arbitrary number (`Hello\n---`), which for rank 2 headings looks
 *     suspiciously like a thematic break
 *
 * Setext headings are also rather uncommon.
 * Using a sequence of hashes at the end of ATX headings is even more uncommon.
 * Due to this, it’s recommended to prefer ATX headings.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * formats headings as ATX by default.
 * The other styles can be configured with
 * [`setext: true`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionssetext)
 * or
 * [`closeAtx: true`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionscloseatx).
 *
 * @module heading-style
 * @summary
 *   remark-lint rule to warn when headings violate a given style.
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
 * @typedef {Type | 'consistent'} Options
 *   Configuration.
 *
 * @typedef {'atx' | 'atx-closed' | 'setext'} Type
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
