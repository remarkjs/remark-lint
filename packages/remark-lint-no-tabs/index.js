/**
 * ## When should I use this?
 *
 * You can use this package to check that tabs are not used.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * Regardless of the debate in other languages of whether to use tabs vs.
 * spaces, when it comes to markdown, tabs do not work as expected.
 * Largely around contains such as block quotes and lists.
 * Take for example block quotes: `>\ta` gives a paragraph with the text `a`
 * in a blockquote, so one might expect that `>\t\ta` results in indented code
 * with the text `a` in a block quote.
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
 * Because markdown uses a hardcoded tab size of 4, the first tab could be
 * represented as 3 spaces (because there’s a `>` before).
 * One of those “spaces” is taken because block quotes allow the `>` to be
 * followed by one space, leaving 2 spaces.
 * The next tab can be represented as 4 spaces, so together we have 6 spaces.
 * The indented code uses 4 spaces, so there are two spaces left, which are
 * shown in the indented code.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * uses spaces exclusively for indentation.
 *
 * @module no-tabs
 * @summary
 *   remark-lint rule to warn when tabs are used.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   Foo Bar
 *
 *   ····Foo
 *
 * @example
 *   {"name": "not-ok.md", "label": "input", "positionless": true}
 *
 *   »Here's one before a code block.
 *
 *   Here's a tab:», and here is another:».
 *
 *   And this is in `inline»code`.
 *
 *   >»This is in a block quote.
 *
 *   *»And…
 *
 *   »1.»in a list.
 *
 *   And this is a tab as the last character.»
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1: Use spaces instead of tabs
 *   3:14: Use spaces instead of tabs
 *   3:37: Use spaces instead of tabs
 *   5:23: Use spaces instead of tabs
 *   7:2: Use spaces instead of tabs
 *   9:2: Use spaces instead of tabs
 *   11:1: Use spaces instead of tabs
 *   11:4: Use spaces instead of tabs
 *   13:41: Use spaces instead of tabs
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {location} from 'vfile-location'

const remarkLintNoTabs = lintRule(
  {
    origin: 'remark-lint:no-tabs',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-tabs#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (_, file) => {
    const value = String(file)
    const toPoint = location(file).toPoint
    let index = value.indexOf('\t')

    while (index !== -1) {
      file.message('Use spaces instead of tabs', toPoint(index))
      index = value.indexOf('\t', index + 1)
    }
  }
)

export default remarkLintNoTabs
