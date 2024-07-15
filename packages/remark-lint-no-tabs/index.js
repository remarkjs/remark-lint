/**
 * remark-lint rule to warn when tabs are used.
 *
 * ## What is this?
 *
 * This package checks for tabs.
 *
 * ## When should I use this?
 *
 * You can use this package to check tabs.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoTabs)`
 *
 * Warn when tabs are used.
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
 * Regardless of the debate in other languages of whether to use tabs versus
 * spaces,
 * when it comes to markdown,
 * tabs do not work as expected.
 * Largely around things such as block quotes, lists, and indented code.
 *
 * Take for example block quotes: `>\ta` gives a paragraph with the text `a`
 * in a blockquote,
 * so one might expect that `>\t\ta` results in indented code with the text `a`
 * in a block quote.
 *
 * ```markdown
 * >\ta
 *
 * >\t\ta
 * ```
 *
 * Yields:
 *
 * ```html
 * <blockquote>
 * <p>a</p>
 * </blockquote>
 * <blockquote>
 * <pre><code>  a
 * </code></pre>
 * </blockquote>
 * ```
 *
 * Because markdown uses a hardcoded tab size of 4,
 * the first tab could be represented as 3 spaces (because there’s a `>`
 * before).
 * One of those “spaces” is taken because block quotes allow the `>` to be
 * followed by one space,
 * leaving 2 spaces.
 * The next tab can be represented as 4 spaces,
 * so together we have 6 spaces.
 * The indented code uses 4 spaces, so there are two spaces left, which are
 * shown in the indented code.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * uses spaces exclusively for indentation.
 *
 * [api-remark-lint-no-tabs]: #unifieduseremarklintnotabs
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-tabs
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   ␠␠␠␠mercury()
 *
 * @example
 *   {"label": "input", "name": "not-ok.md", "positionless": true}
 *
 *   ␉mercury()
 *
 *   Venus␉and Earth.
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:1: Unexpected tab (`\t`), expected spaces
 *   3:6: Unexpected tab (`\t`), expected spaces
 */

/**
 * @import {Root} from 'mdast'
 */

import {lintRule} from 'unified-lint-rule'
import {location} from 'vfile-location'

const remarkLintNoTabs = lintRule(
  {
    origin: 'remark-lint:no-tabs',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-tabs#readme'
  },
  /**
   * @param {Root} _
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (_, file) {
    const value = String(file)
    const toPoint = location(file).toPoint
    let index = value.indexOf('\t')

    while (index !== -1) {
      file.message('Unexpected tab (`\\t`), expected spaces', {
        place: toPoint(index)
      })

      index = value.indexOf('\t', index + 1)
    }
  }
)

export default remarkLintNoTabs
