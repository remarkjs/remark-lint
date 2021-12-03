/**
 * ## When should I use this?
 *
 * You can use this package to check that lines in block quotes start with `>`.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * Rules around “lazy” lines are not straightforward and visually confusing,
 * so it’s recommended to start each line with a `>`.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * adds `>` markers to every line in a block quote.
 *
 * @module no-blockquote-without-marker
 * @summary
 *   remark-lint rule to warn when lines in block quotes start without `>`.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   > Foo…
 *   > …bar…
 *   > …baz.
 *
 * @example
 *   {"name": "ok-tabs.md"}
 *
 *   >»Foo…
 *   >»…bar…
 *   >»…baz.
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   > Foo…
 *   …bar…
 *   > …baz.
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   2:1: Missing marker in block quote
 *
 * @example
 *   {"name": "not-ok-tabs.md", "label": "input"}
 *
 *   >»Foo…
 *   »…bar…
 *   …baz.
 *
 * @example
 *   {"name": "not-ok-tabs.md", "label": "output"}
 *
 *   2:1: Missing marker in block quote
 *   3:1: Missing marker in block quote
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {location} from 'vfile-location'
import {visit} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const remarkLintNoBlockquoteWithoutMarker = lintRule(
  {
    origin: 'remark-lint:no-blockquote-without-marker',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-blockquote-without-marker#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    const value = String(file)
    const loc = location(file)

    visit(tree, 'blockquote', (node) => {
      let index = -1

      while (++index < node.children.length) {
        const child = node.children[index]

        if (child.type === 'paragraph' && !generated(child)) {
          const end = pointEnd(child).line
          const column = pointStart(child).column
          let line = pointStart(child).line

          // Skip past the first line.
          while (++line <= end) {
            const offset = loc.toOffset({line, column})

            if (/>[\t ]+$/.test(value.slice(offset - 5, offset))) {
              continue
            }

            // Roughly here.
            file.message('Missing marker in block quote', {
              line,
              column: column - 2
            })
          }
        }
      }
    })
  }
)

export default remarkLintNoBlockquoteWithoutMarker
