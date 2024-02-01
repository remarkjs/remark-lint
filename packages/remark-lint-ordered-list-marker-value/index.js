/**
 * remark-lint rule to warn when ordered list values are inconsistent.
 *
 * ## What is this?
 *
 * This package checks ordered list values.
 *
 * ## When should I use this?
 *
 * You can use this package to check ordered lists.
 *
 * ## API
 *
 * ### `unified().use(remarkLintOrderedListMarkerValue[, options])`
 *
 * Warn when ordered list values are inconsistent.
 *
 * ###### Parameters
 *
 * * `options` ([`Options`][api-options], default: `'consistent'`)
 *   — preferred style
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * `consistent` looks at the first list with two or more items, and
 * infer `'single'` if both are the same, and `'ordered'` otherwise.
 *
 * ###### Type
 *
 * ```ts
 * type Options = Style | 'consistent'
 * ```
 *
 * ### `Style`
 *
 * Counter style (TypeScript type).
 *
 * * `'one'`
 *   — values should always be exactly `1`
 * * `'ordered'`
 *   — values should increment by one from the first item
 * * `'single'`
 *   — values should stay the same as the first item
 *
 * ###### Type
 *
 * ```ts
 * type Style = 'one' | 'ordered' | 'single'
 * ```
 *
 * ## Recommendation
 *
 * While `'single'` might be the smartest style,
 * as it makes it easier to move items around without having to renumber
 * everything and doesn’t have problems with aligning content of the 9th and
 * the 10th item,
 * it’s not used a lot and arguably looks unnatural.
 * `'one'` is like `'single'` but forces every list to start at `1`.
 * While not often needed,
 * starting lists at other values is sometimes useful.
 * So `'ordered'` is recommended,
 * although `'single'` is also a viable choice.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] retains the value of the first
 * item and increments further items by default.
 * Pass `incrementListMarker: false` to not increment further items.
 *
 * [api-options]: #options
 * [api-style]: #style
 * [api-remark-lint-ordered-list-marker-value]: #unifieduseremarklintorderedlistmarkervalue-options
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module ordered-list-marker-value
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   1. Mercury
 *   2. Venus
 *
 *   ***
 *
 *   3. Earth
 *   4. Mars
 *
 *   ***
 *
 *   * Jupiter
 *
 * @example
 *   {"name": "ok-infer-single.md"}
 *
 *   2. Mercury
 *   2. Venus
 *
 *   ***
 *
 *   3. Earth
 *   3. Mars
 *
 * @example
 *   {"label": "input", "name": "nok-chaotic.md"}
 *
 *   2. Mercury
 *   1. Venus
 *
 *   ***
 *
 *   1. Earth
 *   1. Mars
 * @example
 *   {"label": "output", "name": "nok-chaotic.md"}
 *
 *   2:2: Unexpected ordered list item value `1`, expected `3`
 *   7:2: Unexpected ordered list item value `1`, expected `2`
 *
 * @example
 *   {"config": "one", "name": "ok.md"}
 *
 *   1. Mercury
 *   1. Venus
 *
 * @example
 *   {"name": "ok.md", "config": "ordered"}
 *
 *   1. Mercury
 *   2. Venus
 *
 *   ***
 *
 *   3. Earth
 *   4. Mars
 *
 *   ***
 *
 *   0. Jupiter
 *   1. Saturn
 *
 * @example
 *   {"config": "single", "name": "ok.md"}
 *
 *   1. Mercury
 *   1. Venus
 *
 *   ***
 *
 *   3. Earth
 *   3. Mars
 *
 *   ***
 *
 *   0. Jupiter
 *   0. Saturn
 *
 * @example
 *   {"config": "one", "label": "input", "name": "not-ok.md"}
 *
 *   1. Mercury
 *   2. Venus
 *
 *   ***
 *
 *   3. Earth
 *
 *   ***
 *
 *   2. Mars
 *   1. Jupiter
 * @example
 *   {"config": "one", "label": "output", "name": "not-ok.md"}
 *
 *   2:2: Unexpected ordered list item value `2`, expected `1`
 *   6:2: Unexpected ordered list item value `3`, expected `1`
 *   10:2: Unexpected ordered list item value `2`, expected `1`
 *
 * @example
 *   {"config": "ordered", "label": "input", "name": "not-ok.md"}
 *
 *   1. Mercury
 *   1. Venus
 *
 *   ***
 *
 *   2. Mars
 *   1. Jupiter
 * @example
 *   {"config": "ordered", "label": "output", "name": "not-ok.md"}
 *
 *   2:2: Unexpected ordered list item value `1`, expected `2`
 *   7:2: Unexpected ordered list item value `1`, expected `3`
 *
 * @example
 *   {"config": "single", "label": "input", "name": "not-ok.md"}
 *
 *   1. Mercury
 *   2. Venus
 *
 *   ***
 *
 *   2. Mars
 *   1. Jupiter
 * @example
 *   {"config": "single", "label": "output", "name": "not-ok.md"}
 *
 *   2:2: Unexpected ordered list item value `2`, expected `1`
 *   7:2: Unexpected ordered list item value `1`, expected `2`
 *
 * @example
 *   {"name": "not-ok.md", "config": "🌍", "label": "output", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected `'one'`, `'ordered'`, `'single'`, or `'consistent'`
 */

/**
 * @typedef {import('mdast').Nodes} Nodes
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {Style | 'consistent'} Options
 *   Configuration.

 * @typedef {'one' | 'ordered' | 'single'} Style
 *   Counter style.
*/

import {ok as assert} from 'devlop'
import {phrasing} from 'mdast-util-phrasing'
import {asciiDigit} from 'micromark-util-character'
import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

const remarkLintOrderedListMarkerValue = lintRule(
  {
    origin: 'remark-lint:ordered-list-marker-value',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-ordered-list-marker-value#readme'
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
    const value = String(file)
    /** @type {Style | undefined} */
    let style
    /** @type {VFileMessage | undefined} */
    let cause

    if (options === null || options === undefined || options === 'consistent') {
      // Empty.
    } else if (
      options === 'one' ||
      options === 'ordered' ||
      options === 'single'
    ) {
      style = options
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          "` for `options`, expected `'one'`, `'ordered'`, `'single'`, or `'consistent'`"
      )
    }

    /** @type {Array<{ancestors: Array<Nodes>, counters: Array<string | undefined>}>} */
    const lists = []

    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type !== 'list') return

      if (!node.ordered) return

      /** @type {Array<string | undefined>} */
      const values = []

      for (const item of node.children) {
        const start = pointStart(item)
        /** @type {string | undefined} */
        let counter

        if (start && typeof start.offset === 'number') {
          let index = start.offset
          let code = value.charCodeAt(index)

          while (asciiDigit(code)) {
            index++
            code = value.charCodeAt(index)
          }

          counter = value.slice(start.offset, index)
        }

        values.push(counter)
      }

      lists.push({ancestors: [...parents, node], counters: values})
    })

    // Infer style.
    if (!style) {
      for (const info of lists) {
        // Could be `undefined` for short lists *or* w/o positional info.
        const [first, second] = info.counters

        if (first && second) {
          const inferredStyle =
            second === String(Number(first) + 1)
              ? 'ordered'
              : second === first
                ? 'single'
                : undefined

          if (inferredStyle) {
            const node = info.ancestors.at(-1)
            assert(node) // Always defined.
            assert(node.type === 'list') // Always list.
            style = inferredStyle
            cause = new VFileMessage(
              'Ordered list marker style `' +
                style +
                "` first defined for `'consistent'` here",
              {
                ancestors: info.ancestors,
                place: node.position,
                ruleId: 'ordered-list-marker-value',
                source: 'remark-lint'
              }
            )
          }

          break
        }
      }
    }

    if (!style) {
      style = 'ordered'
      cause = new VFileMessage(
        "Ordered list marker style `ordered` assumed for `'consistent'`",
        {ruleId: 'ordered-list-marker-value', source: 'remark-lint'}
      )
    }

    for (const info of lists) {
      const startValue = style === 'one' ? 1 : info.counters[0]
      const node = info.ancestors.at(-1)
      assert(node) // Always defined.
      assert(node.type === 'list') // Always list.

      // No positional info on first item.
      if (!startValue) continue

      const start = Number(startValue)
      let index = -1

      while (++index < info.counters.length) {
        const item = node.children[index]
        const actual = info.counters[index]
        if (!actual) continue

        const startPoint = pointStart(item)
        assert(startPoint) // Always defined, we checked when we found items.
        assert(typeof startPoint.offset === 'number') // Same.

        const expected = String(
          style === 'one' ? 1 : style === 'single' ? start : start + index
        )

        if (actual !== expected) {
          file.message(
            'Unexpected ordered list item value `' +
              actual +
              '`, expected `' +
              expected +
              '`',
            {
              ancestors: [...info.ancestors, item],
              cause,
              place: {
                line: startPoint.line,
                column: startPoint.column + actual.length,
                offset: startPoint.offset + actual.length
              }
            }
          )
        }
      }
    }
  }
)

export default remarkLintOrderedListMarkerValue
