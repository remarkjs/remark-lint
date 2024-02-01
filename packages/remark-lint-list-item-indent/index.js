/**
 * remark-lint rule to warn when the whitespace after list item markers violate
 * a given style.
 *
 * ## What is this?
 *
 * This package checks the style of whitespace after list item markers.
 *
 * ## When should I use this?
 *
 * You can use this package to check that the style of whitespace after list
 * item markers and before content is consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkLintListItemIndent[, options])`
 *
 * Warn when the whitespace after list item markers violate a given style.
 *
 * ###### Parameters
 *
 * * `options` ([`Options`][api-options], default: `'one'`)
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
 * * `'mixed'`
 *   — prefer `'one'` for tight lists and `'tab'` for loose lists
 * * `'one'`
 *   — prefer the size of the bullet and a single space
 * * `'tab'`
 *   — prefer the size of the bullet and a single space to the next tab stop
 *
 * ###### Type
 *
 * ```ts
 * type Options = 'mixed' | 'one' | 'tab'
 * ```
 *
 * ## Recommendation
 *
 * First some background.
 * The number of spaces that occur after list markers (`*`, `-`, and `+` for
 * unordered lists and `.` and `)` for unordered lists) and before the content
 * on the first line,
 * defines how much indentation can be used for further lines.
 * At least one space is required and up to 4 spaces are allowed.
 * If there is no further content after the marker then it’s a blank line which
 * is handled as if there was one space.
 * If there are 5 or more spaces and then content then it’s also seen as one
 * space and the rest is seen as indented code.
 *
 * Regardless of ordered and unordered,
 * there are two kinds of lists in markdown,
 * tight and loose.
 * Lists are tight by default but if there is a blank line between two list
 * items or between two blocks inside an item,
 * that turns the whole list into a loose list.
 * When turning markdown into HTML,
 * paragraphs in tight lists are not wrapped in `<p>` tags.
 *
 * How indentation of lists works in markdown has historically been a mess,
 * especially with how they interact with indented code.
 * CommonMark made that a *lot* better,
 * but there remain (documented but complex) edge cases and some behavior
 * intuitive.
 * Due to this, `'tab'` works the best in most markdown parsers *and* in
 * CommonMark.
 * Currently the situation between markdown parsers is better,
 * so the default `'one'`,
 * which seems to be the most common style used by authors,
 * is okay.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] uses `listItemIndent: 'one'`
 * by default.
 * `listItemIndent: 'mixed'` or `listItemIndent: 'tab'` is also supported.
 *
 * [api-options]: #options
 * [api-remark-lint-list-item-indent]: #unifieduseremarklintlistitemindent-options
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module list-item-indent
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   *␠Mercury.
 *   *␠Venus.
 *
 *   111.␠Earth
 *   ␠␠␠␠␠and Mars.
 *
 *   *␠**Jupiter**.
 *
 *   ␠␠Jupiter is the fifth planet from the Sun and the largest in the Solar
 *   ␠␠System.
 *
 *   *␠Saturn.
 *
 *   ␠␠Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter.
 *
 * @example
 *   {"config": "mixed", "name": "ok.md"}
 *
 *   *␠Mercury.
 *   *␠Venus.
 *
 *   111.␠Earth
 *   ␠␠␠␠␠and Mars.
 *
 *   *␠␠␠**Jupiter**.
 *
 *   ␠␠␠␠Jupiter is the fifth planet from the Sun and the largest in the Solar
 *   ␠␠␠␠System.
 *
 *   *␠␠␠Saturn.
 *
 *   ␠␠␠␠Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter.
 *
 * @example
 *   {"config": "mixed", "label": "input", "name": "not-ok.md"}
 *
 *   *␠␠␠Mercury.
 *   *␠␠␠Venus.
 *
 *   111.␠␠␠␠Earth
 *   ␠␠␠␠␠␠␠␠and Mars.
 *
 *   *␠**Jupiter**.
 *
 *   ␠␠Jupiter is the fifth planet from the Sun and the largest in the Solar
 *   ␠␠System.
 *
 *   *␠Saturn.
 *
 *   ␠␠Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter.
 * @example
 *   {"config": "mixed", "label": "output", "name": "not-ok.md"}
 *
 *   1:5: Unexpected `3` spaces between list item marker and content in tight list, expected `1` space, remove `2` spaces
 *   2:5: Unexpected `3` spaces between list item marker and content in tight list, expected `1` space, remove `2` spaces
 *   4:9: Unexpected `4` spaces between list item marker and content in tight list, expected `1` space, remove `3` spaces
 *   7:3: Unexpected `1` space between list item marker and content in loose list, expected `3` spaces, add `2` spaces
 *   12:3: Unexpected `1` space between list item marker and content in loose list, expected `3` spaces, add `2` spaces
 *
 * @example
 *   {"config": "one", "name": "ok.md"}
 *
 *   *␠Mercury.
 *   *␠Venus.
 *
 *   111.␠Earth
 *   ␠␠␠␠␠and Mars.
 *
 *   *␠**Jupiter**.
 *
 *   ␠␠Jupiter is the fifth planet from the Sun and the largest in the Solar
 *   ␠␠System.
 *
 *   *␠Saturn.
 *
 *   ␠␠Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter.
 *
 * @example
 *   {"config": "one", "label": "input", "name": "not-ok.md"}
 *
 *   *␠␠␠Mercury.
 *   *␠␠␠Venus.
 *
 *   111.␠␠␠␠Earth
 *   ␠␠␠␠␠␠␠␠and Mars.
 *
 *   *␠␠␠**Jupiter**.
 *
 *   ␠␠␠␠Jupiter is the fifth planet from the Sun and the largest in the Solar
 *   ␠␠␠␠System.
 *
 *   *␠␠␠Saturn.
 *
 *   ␠␠␠␠Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter.
 * @example
 *   {"config": "one", "label": "output", "name": "not-ok.md"}
 *
 *   1:5: Unexpected `3` spaces between list item marker and content, expected `1` space, remove `2` spaces
 *   2:5: Unexpected `3` spaces between list item marker and content, expected `1` space, remove `2` spaces
 *   4:9: Unexpected `4` spaces between list item marker and content, expected `1` space, remove `3` spaces
 *   7:5: Unexpected `3` spaces between list item marker and content, expected `1` space, remove `2` spaces
 *   12:5: Unexpected `3` spaces between list item marker and content, expected `1` space, remove `2` spaces
 *
 * @example
 *   {"config": "tab", "name": "ok.md"}
 *
 *   *␠␠␠Mercury.
 *   *␠␠␠Venus.
 *
 *   111.␠␠␠␠Earth
 *   ␠␠␠␠␠␠␠␠and Mars.
 *
 *   *␠␠␠**Jupiter**.
 *
 *   ␠␠␠␠Jupiter is the fifth planet from the Sun and the largest in the Solar
 *   ␠␠␠␠System.
 *
 *   *␠␠␠Saturn.
 *
 *   ␠␠␠␠Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter.
 *
 * @example
 *   {"config": "tab", "label": "input", "name": "not-ok.md"}
 *
 *   *␠Mercury.
 *   *␠Venus.
 *
 *   111.␠Earth
 *   ␠␠␠␠␠and Mars.
 *
 *   *␠**Jupiter**.
 *
 *   ␠␠Jupiter is the fifth planet from the Sun and the largest in the Solar
 *   ␠␠System.
 *
 *   *␠Saturn.
 *
 *   ␠␠Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter.
 * @example
 *   {"config": "tab", "label": "output", "name": "not-ok.md"}
 *
 *   1:3: Unexpected `1` space between list item marker and content, expected `3` spaces, add `2` spaces
 *   2:3: Unexpected `1` space between list item marker and content, expected `3` spaces, add `2` spaces
 *   4:6: Unexpected `1` space between list item marker and content, expected `4` spaces, add `3` spaces
 *   7:3: Unexpected `1` space between list item marker and content, expected `3` spaces, add `2` spaces
 *   12:3: Unexpected `1` space between list item marker and content, expected `3` spaces, add `2` spaces
 *
 * @example
 *   {"config": "🌍", "label": "output", "name": "not-ok.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected `'mixed'`, `'one'`, or `'tab'`
 *
 * @example
 *   {"config": "mixed", "gfm": true, "label": "input", "name": "gfm.md"}
 *
 *   *␠[x] Mercury.
 *
 *   1.␠␠[ ] Venus.
 *
 *   2.␠␠[ ] Earth.
 *
 * @example
 *   {"config": "one", "gfm": true, "name": "gfm.md"}
 *
 *   *␠[x] Mercury.
 *
 *   1.␠[ ] Venus.
 *
 *   2.␠[ ] Earth.
 *
 * @example
 *   {"config": "tab", "gfm": true, "name": "gfm.md"}
 *
 *   *␠␠␠[x] Mercury.
 *
 *   1.␠␠[ ] Venus.
 *
 *   2.␠␠[ ] Earth.
 *
 * @example
 *   {"config": "mixed", "name": "loose-tight.md"}
 *
 *   Loose lists have blank lines between items:
 *
 *   *␠␠␠Mercury.
 *
 *   *␠␠␠Venus.
 *
 *   …or between children of items:
 *
 *   1.␠␠Earth.
 *
 *   ␠␠␠␠Earth is the third planet from the Sun and the only astronomical
 *   ␠␠␠␠object known to harbor life.
 */

/**
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {'mixed' | 'one' | 'tab'} Options
 *   Configuration.
 */

import {phrasing} from 'mdast-util-phrasing'
import pluralize from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'

const remarkLintListItemIndent = lintRule(
  {
    origin: 'remark-lint:list-item-indent',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-list-item-indent#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {Options | null | undefined} [options='one']
   *   Configuration (default: `'one'`).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    const value = String(file)
    /** @type {Options} */
    let expected

    if (options === null || options === undefined) {
      expected = 'one'
      /* c8 ignore next 10 -- previous names. */
      // @ts-expect-error: old name.
    } else if (options === 'space') {
      file.fail(
        'Unexpected value `' + options + "` for `options`, expected `'one'`"
      )
      // @ts-expect-error: old name.
    } else if (options === 'tab-size') {
      file.fail(
        'Unexpected value `' + options + "` for `options`, expected `'tab'`"
      )
    } else if (options === 'mixed' || options === 'one' || options === 'tab') {
      expected = options
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          "` for `options`, expected `'mixed'`, `'one'`, or `'tab'`"
      )
    }

    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type !== 'list') return

      let loose = node.spread

      if (!loose) {
        for (const child of node.children) {
          if (child.spread) {
            loose = true
            break
          }
        }
      }

      for (const child of node.children) {
        const head = child.children[0]
        const itemStart = pointStart(child)
        const headStart = pointStart(head)

        if (
          itemStart &&
          headStart &&
          typeof itemStart.offset === 'number' &&
          typeof headStart.offset === 'number'
        ) {
          let slice = value.slice(itemStart.offset, headStart.offset)

          // GFM tasklist.
          const checkboxIndex = slice.indexOf('[')
          if (checkboxIndex !== -1) slice = slice.slice(0, checkboxIndex)

          const actualIndent = slice.length

          // To do: actual hard tabs?
          // Remove whitespace.
          let end = actualIndent
          let previous = slice.charCodeAt(end - 1)

          while (previous === 9 || previous === 32) {
            end--
            previous = slice.charCodeAt(end - 1)
          }

          let expectedIndent = end + 1 // One space needed after marker.

          if (expected === 'tab' || (expected === 'mixed' && loose)) {
            expectedIndent = Math.ceil(expectedIndent / 4) * 4
          }

          const expectedSpaces = expectedIndent - end
          const actualSpaces = actualIndent - end

          if (actualSpaces !== expectedSpaces) {
            const difference = expectedSpaces - actualSpaces
            const differenceAbsolute = Math.abs(difference)

            file.message(
              'Unexpected `' +
                actualSpaces +
                '` ' +
                pluralize('space', actualSpaces) +
                ' between list item marker and content' +
                (expected === 'mixed'
                  ? ' in ' + (loose ? 'loose' : 'tight') + ' list'
                  : '') +
                ', expected `' +
                expectedSpaces +
                '` ' +
                pluralize('space', expectedSpaces) +
                ', ' +
                (difference > 0 ? 'add' : 'remove') +
                ' `' +
                differenceAbsolute +
                '` ' +
                pluralize('space', differenceAbsolute),
              {ancestors: [...parents, node, child], place: headStart}
            )
          }
        }
      }
    })
  }
)

export default remarkLintListItemIndent
