/**
 * remark-lint rule to warn for accidental bracket and paren
 * mixup for images and links.
 *
 * ## What is this?
 *
 * This package checks for accidental image or link mixup:
 * `(text)[url]` instead of `[text](url)`.
 *
 * ## When should I use this?
 *
 * You can use this package to check that brackets and parentheses
 * that are used to form image and links are not accidentally swapped.
 *
 * ## API
 *
 * ### `unified().use(remarkLintCorrectMediaSyntax)`
 *
 * Warn for accidental bracket and paren mixup for images and links.
 *
 * ###### Parameters
 *
 * There are no parameters.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint-correct-media-syntax]: #unifieduseremarklintcorrectmediasyntax
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module correct-media-syntax
 * @author Titus Wormer
 * @copyright Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   [Mercury](https://example.com/mercury/) and
 *   ![Venus](https://example.com/venus.png).
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   (Mercury)[https://example.com/mercury/] and
 *   !(Venus)[https://example.com/venus.png].
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:9-1:11: Unexpected `)[`, expected `[` and `]` around the text (label) and `(` and `)` around the URL for images and links, or an escape (`)\[`)
 *   2:8-2:10: Unexpected `)[`, expected `[` and `]` around the text (label) and `(` and `)` around the URL for images and links, or an escape (`)\[`)
 */

/**
 * @import {Root} from 'mdast'
 */

import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visitParents} from 'unist-util-visit-parents'
import {location} from 'vfile-location'

const remarkLintCorrectMediaSyntax = lintRule(
  {
    origin: 'remark-lint:correct-media-syntax',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-correct-media-syntax#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    const value = String(file)
    const toPoint = location(file).toPoint

    visitParents(tree, 'text', function (node, parents) {
      const from = pointStart(node)
      const to = pointEnd(node)

      if (
        !from ||
        !to ||
        typeof from.offset !== 'number' ||
        typeof to.offset !== 'number'
      ) {
        return
      }

      const slice = value.slice(from.offset, to.offset)

      let index = slice.indexOf('[')

      while (index !== -1) {
        if (slice.charCodeAt(index - 1) === 41 /* `)` */) {
          const start = toPoint(from.offset + index - 1)
          const end = toPoint(from.offset + index + 1)

          if (start && end) {
            file.message(
              'Unexpected `)[`, expected `[` and `]` around the text (label) and `(` and `)` around the URL for images and links, or an escape (`)\\[`)',
              {ancestors: [...parents, node], place: {start, end}}
            )
          }
        }

        index = slice.indexOf('[', index + 1)
      }
    })
  }
)

export default remarkLintCorrectMediaSyntax
