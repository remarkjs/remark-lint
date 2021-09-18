/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module ordered-list-marker-value
 * @fileoverview
 *   Warn when the list item marker values of ordered lists violate a given
 *   style.
 *
 *   Options: `'single'`, `'one'`, or `'ordered'`, default: `'ordered'`.
 *
 *   When set to `'ordered'`, list item bullets should increment by one,
 *   relative to the starting point.
 *   When set to `'single'`, bullets should be the same as the relative starting
 *   point.
 *   When set to `'one'`, bullets should always be `1`.
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify)
 *   retains the number of the first list item bullet, and by default
 *   increments the other items.
 *   Pass
 *   [`incrementListMarker: false`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify#optionsincrementlistmarker)
 *   to not increment further list items.
 *
 *   See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   The default value is `ordered`, so unless changed, the below
 *   is OK.
 *
 *   1.  Foo
 *   2.  Bar
 *   3.  Baz
 *
 *   Paragraph.
 *
 *   3.  Alpha
 *   4.  Bravo
 *   5.  Charlie
 *
 *   Unordered lists are not affected by this rule.
 *
 *   *   Anton
 *
 * @example
 *   {"name": "ok.md", "setting": "one"}
 *
 *   1.  Foo
 *   1.  Bar
 *   1.  Baz
 *
 *   Paragraph.
 *
 *   1.  Alpha
 *   1.  Bravo
 *   1.  Charlie
 *
 * @example
 *   {"name": "ok.md", "setting": "single"}
 *
 *   1.  Foo
 *   1.  Bar
 *   1.  Baz
 *
 *   Paragraph.
 *
 *   3.  Alpha
 *   3.  Bravo
 *   3.  Charlie
 *
 *   Paragraph.
 *
 *   0.  Delta
 *   0.  Echo
 *   0.  Foxtrot
 *
 * @example
 *   {"name": "ok.md", "setting": "ordered"}
 *
 *   1.  Foo
 *   2.  Bar
 *   3.  Baz
 *
 *   Paragraph.
 *
 *   3.  Alpha
 *   4.  Bravo
 *   5.  Charlie
 *
 *   Paragraph.
 *
 *   0.  Delta
 *   1.  Echo
 *   2.  Foxtrot
 *
 * @example
 *   {"name": "not-ok.md", "setting": "one", "label": "input"}
 *
 *   1.  Foo
 *   2.  Bar
 *
 * @example
 *   {"name": "not-ok.md", "setting": "one", "label": "output"}
 *
 *   2:1-2:8: Marker should be `1`, was `2`
 *
 * @example
 *   {"name": "also-not-ok.md", "setting": "one", "label": "input"}
 *
 *   2.  Foo
 *   1.  Bar
 *
 * @example
 *   {"name": "also-not-ok.md", "setting": "one", "label": "output"}
 *
 *   1:1-1:8: Marker should be `1`, was `2`
 *
 * @example
 *   {"name": "not-ok.md", "setting": "ordered", "label": "input"}
 *
 *   1.  Foo
 *   1.  Bar
 *
 * @example
 *   {"name": "not-ok.md", "setting": "ordered", "label": "output"}
 *
 *   2:1-2:8: Marker should be `2`, was `1`
 *
 * @example
 *   {"name": "not-ok.md", "setting": "💩", "label": "output", "positionless": true}
 *
 *   1:1: Incorrect ordered list item marker value `💩`: use either `'ordered'`, `'one'`, or `'single'`
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {'single'|'one'|'ordered'} Options
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const remarkLintOrderedListMarkerValue = lintRule(
  {
    origin: 'remark-lint:ordered-list-marker-value',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-ordered-list-marker-value#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  (tree, file, option = 'ordered') => {
    const value = String(file)

    if (option !== 'ordered' && option !== 'one' && option !== 'single') {
      file.fail(
        'Incorrect ordered list item marker value `' +
          option +
          "`: use either `'ordered'`, `'one'`, or `'single'`"
      )
    }

    visit(tree, 'list', (node) => {
      if (!node.ordered) return

      let expected =
        option === 'one' || node.start === null || node.start === undefined
          ? 1
          : node.start
      let index = -1

      while (++index < node.children.length) {
        const child = node.children[index]

        // Ignore generated nodes, first items.
        if (generated(child) || (index === 0 && option !== 'one')) {
          continue
        }

        // Increase the expected line number when in `ordered` mode.
        if (option === 'ordered') {
          expected++
        }

        const marker = Number(
          value
            .slice(
              pointStart(child).offset,
              pointStart(child.children[0]).offset
            )
            .replace(/[\s.)]/g, '')
            .replace(/\[[x ]?]\s*$/i, '')
        )

        if (marker !== expected) {
          file.message(
            'Marker should be `' + expected + '`, was `' + marker + '`',
            child
          )
        }
      }
    })
  }
)

export default remarkLintOrderedListMarkerValue
