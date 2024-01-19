/**
 * remark-lint rule to warn when GFM autolink literals are used.
 *
 * ## What is this?
 *
 * This package checks that regular autolinks or full links are used.
 * Literal autolinks is a GFM feature enabled with
 * [`remark-gfm`][github-remark-gfm].
 *
 * ## When should I use this?
 *
 * You can use this package to check that links are consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoLiteralUrls)`
 *
 * Warn when GFM autolink literals are used.
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
 * GFM autolink literals (just a raw URL) are a feature enabled by GFM.
 * They don’t work everywhere.
 * So,
 * it’s recommended to instead use regular autolinks (`<https://url>`) or full
 * links (`[text](url)`).
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] never generates GFM autolink
 * literals.
 * It always generates regular autolinks or full links.
 *
 * [api-remark-lint-no-literal-urls]: #unifieduseremarklintnoliteralurls
 * [github-remark-gfm]: https://github.com/remarkjs/remark-gfm
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-literal-urls
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md", "gfm": true}
 *
 *   <https://example.com/mercury/>
 *
 *   ![Venus](http://example.com/venus/).
 *
 * @example
 *   {"name": "not-ok.md", "label": "input", "gfm": true}
 *
 *   https://example.com/mercury/
 *
 *   www.example.com/venus/
 *
 *   earth@mars.planets
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "gfm": true}
 *
 *   1:1-1:29: Unexpected GFM autolink literal, expected regular autolink, add `<` before and `>` after
 *   3:1-3:23: Unexpected GFM autolink literal, expected regular autolink, add `<http://` before and `>` after
 *   5:1-5:19: Unexpected GFM autolink literal, expected regular autolink, add `<mailto:` before and `>` after
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {toString} from 'mdast-util-to-string'
import {asciiPunctuation} from 'micromark-util-character'
import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {visitParents} from 'unist-util-visit-parents'

const defaultHttp = 'http://'
const defaultMailto = 'mailto:'

const remarkLintNoLiteralUrls = lintRule(
  {
    origin: 'remark-lint:no-literal-urls',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-literal-urls#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    const value = String(file)

    visitParents(tree, 'link', function (node, parents) {
      const start = pointStart(node)

      if (!start || typeof start.offset !== 'number') return

      const raw = toString(node)

      /** @type {string | undefined} */
      let protocol
      let otherwiseFine = false

      if (raw === node.url) {
        otherwiseFine = true
      } else if (defaultHttp + raw === node.url) {
        protocol = defaultHttp
      } else if (defaultMailto + raw === node.url) {
        protocol = defaultMailto
      }

      if (
        // If the url is the same as the content…
        (protocol || otherwiseFine) &&
        // …and it doesn’t start with a marker.
        !asciiPunctuation(value.charCodeAt(start.offset))
      ) {
        file.message(
          'Unexpected GFM autolink literal, expected regular autolink, add ' +
            (protocol ? '`<' + protocol + '`' : '`<`') +
            ' before and `>` after',
          {ancestors: [...parents, node], place: node.position}
        )
      }
    })
  }
)

export default remarkLintNoLiteralUrls
