/**
 * ## When should I use this?
 *
 * You can use this package to check that referenced definitions are defined.
 *
 * ## API
 *
 * The following options (default: `undefined`) are accepted:
 *
 * * `Object` with the following fields:
 *   * `allow` (`Array<RegExp | {source: string} | string>`,
 *     default: `[]`)
 *     — text or regex that you want to be allowed between `[` and `]`
 *     even though it’s undefined; regex is provided via a `RegExp` object
 *     or via a `{source: string}` object where `source` is the source
 *     text of a case-insensitive regex
 *
 * ## Recommendation
 *
 * Shortcut references use an implicit syntax that could also occur as plain
 * text.
 * For example, it is reasonable to expect an author adding `[…]` to abbreviate
 * some text somewhere in a document:
 *
 * ```markdown
 * > Some […] quote.
 * ```
 *
 * This isn’t a problem, but it might become one when an author later adds a
 * definition:
 *
 * ```markdown
 * Some text. […][]
 *
 * […] #read-more "Read more"
 * ```
 *
 * The second author might expect only their newly added text to form a link,
 * but their changes also result in a link for the first author’s text.
 *
 * @module no-undefined-references
 * @summary
 *   remark-lint rule to warn when undefined definitions are referenced.
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   [foo][]
 *
 *   Just a [ bracket.
 *
 *   Typically, you’d want to use escapes (with a backslash: \\) to escape what
 *   could turn into a \[reference otherwise].
 *
 *   Just two braces can’t link: [].
 *
 *   [foo]: https://example.com
 *
 * @example
 *   {"name": "ok-allow.md", "config": {"allow": ["...", "…"]}}
 *
 *   > Eliding a portion of a quoted passage […] is acceptable.
 *
 * @example
 *   {"name": "ok-allow.md", "config": {"allow": ["a", {"source": "^b\\."}]}}
 *
 *   [foo][b.c]
 *
 *   [bar][a]
 *
 *   Matching is case-insensitive: [bar][B.C]
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   [bar]
 *
 *   [baz][]
 *
 *   [text][qux]
 *
 *   Spread [over
 *   lines][]
 *
 *   > in [a
 *   > block quote][]
 *
 *   [asd][a
 *
 *   Can include [*emphasis*].
 *
 *   Multiple pairs: [a][b][c].
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:6: Found reference to undefined definition
 *   3:1-3:8: Found reference to undefined definition
 *   5:1-5:12: Found reference to undefined definition
 *   7:8-8:9: Found reference to undefined definition
 *   10:6-11:17: Found reference to undefined definition
 *   13:1-13:6: Found reference to undefined definition
 *   15:13-15:25: Found reference to undefined definition
 *   17:17-17:23: Found reference to undefined definition
 *   17:23-17:26: Found reference to undefined definition
 *
 * @example
 *   {"name": "not-ok.md", "label": "input", "config": {"allow": ["a", {"source": "^b\\."}]}}
 *
 *   [foo][a.c]
 *
 *   [bar][b]
 *
 * @example
 *   {"name": "not-ok.md", "label": "output", "config": {"allow": ["a", {"source": "^b\\."}]}}
 *
 *   1:1-1:11: Found reference to undefined definition
 *   3:1-3:9: Found reference to undefined definition
 */

/**
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {Readonly<Array<RegExp | RegexLike | string>> | null | undefined} [allow]
 *   Text or regexes to allow between `[` and `]` even though they’re not
 *   defined (optional).
 *
 * @typedef {Array<number>} Range
 *   Range.
 *
 * @typedef RegexLike
 *   Regex-like object.
 * @property {string} source
 *   Source of regex.
 */

import {normalizeIdentifier} from 'micromark-util-normalize-identifier'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart, position} from 'unist-util-position'
import {EXIT, SKIP, visit} from 'unist-util-visit'
import {location} from 'vfile-location'

/** @type {Readonly<Options>} */
const emptyOptions = {}
/** @type {Readonly<Array<RegExp | RegexLike | string>>} */
const emptyAllow = []

const remarkLintNoUndefinedReferences = lintRule(
  {
    origin: 'remark-lint:no-undefined-references',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-undefined-references#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {Readonly<Options> | null | undefined} [options]
   *   Configuration (optional).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    const settings = options || emptyOptions
    const allow = settings.allow || emptyAllow
    const contents = String(file)
    const loc = location(file)
    const lineEnding = /(\r?\n|\r)[\t ]*(>[\t ]*)*/g
    /** @type {Set<string>} */
    const defined = new Set()
    /** @type {Array<RegExp>} */
    const regexes = []
    /** @type {Set<string>} */
    const strings = new Set()

    let index = -1

    while (++index < allow.length) {
      const value = allow[index]
      if (typeof value === 'string') {
        strings.add(normalizeIdentifier(value))
      } else if (value instanceof RegExp) {
        regexes.push(value)
      } else {
        regexes.push(new RegExp(value.source, 'i'))
      }
    }

    visit(tree, function (node) {
      if (node.type === 'definition' || node.type === 'footnoteDefinition') {
        defined.add(normalizeIdentifier(node.identifier))
      }
    })

    visit(tree, function (node) {
      const place = position(node)
      // CM specifiers that references only form when defined.
      // Still, they could be added by plugins, so let’s keep it.
      /* c8 ignore next 10 */
      if (
        (node.type === 'imageReference' ||
          node.type === 'linkReference' ||
          node.type === 'footnoteReference') &&
        place &&
        !defined.has(normalizeIdentifier(node.identifier)) &&
        !allowed(node.identifier)
      ) {
        file.message('Found reference to undefined definition', place)
      }

      if (node.type === 'paragraph' || node.type === 'heading') {
        findInPhrasing(node)
        return SKIP
      }
    })

    /**
     * @param {Heading | Paragraph} node
     *   Node.
     * @returns {undefined}
     *   Nothing.
     */
    function findInPhrasing(node) {
      /** @type {Array<Range>} */
      let ranges = []

      visit(node, function (child) {
        // Ignore the node itself.
        if (child === node) return

        // Can’t have links in links, so reset ranges.
        if (child.type === 'link' || child.type === 'linkReference') {
          ranges = []
          return SKIP
        }

        // Enter non-text.
        if (child.type !== 'text') return

        const start = pointStart(child)
        const end = pointEnd(child)

        // Bail if there’s no positional info.
        if (
          !start ||
          !end ||
          typeof start.offset !== 'number' ||
          typeof end.offset !== 'number'
        ) {
          return EXIT
        }

        const source = contents.slice(start.offset, end.offset)
        /** @type {Array<[number, string]>} */
        const lines = [[start.offset, '']]
        let last = 0

        lineEnding.lastIndex = 0
        let match = lineEnding.exec(source)

        while (match) {
          const index = match.index
          lines[lines.length - 1][1] = source.slice(last, index)
          last = index + match[0].length
          lines.push([start.offset + last, ''])
          match = lineEnding.exec(source)
        }

        lines[lines.length - 1][1] = source.slice(last)
        let lineIndex = -1

        while (++lineIndex < lines.length) {
          const line = lines[lineIndex][1]
          let index = 0

          while (index < line.length) {
            const code = line.charCodeAt(index)

            // Skip past escaped brackets.
            if (code === 92) {
              const next = line.charCodeAt(index + 1)
              index++

              if (next === 91 || next === 93) {
                index++
              }
            }
            // Opening bracket.
            else if (code === 91) {
              ranges.push([lines[lineIndex][0] + index])
              index++
            }
            // Close bracket.
            else if (code === 93) {
              // No opening.
              if (ranges.length === 0) {
                index++
              } else if (line.charCodeAt(index + 1) === 91) {
                index++

                // Collapsed or full.
                let range = ranges.pop()

                // Range should always exist.
                if (range) {
                  range.push(lines[lineIndex][0] + index)

                  // This is the end of a reference already.
                  if (range.length === 4) {
                    handleRange(range)
                    range = []
                  }

                  range.push(lines[lineIndex][0] + index)
                  ranges.push(range)
                  index++
                }
              } else {
                index++

                // Shortcut or typical end of a reference.
                const range = ranges.pop()

                // Range should always exist.
                if (range) {
                  range.push(lines[lineIndex][0] + index)
                  handleRange(range)
                }
              }
            }
            // Anything else.
            else {
              index++
            }
          }
        }
      })

      let index = -1

      while (++index < ranges.length) {
        handleRange(ranges[index])
      }

      /**
       * @param {Range} range
       *   Range.
       * @returns {undefined}
       *   Nothing.
       */
      function handleRange(range) {
        if (range.length === 1) return
        if (range.length === 3) range.length = 2

        // No need to warn for just `[]`.
        if (range.length === 2 && range[0] + 2 === range[1]) return

        const offset = range.length === 4 && range[2] + 2 !== range[3] ? 2 : 0
        const id = contents
          .slice(range[0 + offset] + 1, range[1 + offset] - 1)
          .replace(lineEnding, ' ')
        const start = loc.toPoint(range[0])
        const end = loc.toPoint(range[range.length - 1])

        if (
          start &&
          end &&
          !defined.has(normalizeIdentifier(id)) &&
          !allowed(id)
        ) {
          file.message('Found reference to undefined definition', {start, end})
        }
      }
    }

    /**
     * @param {string} id
     *   Identifier.
     * @returns {boolean}
     *   Whether `id` is allowed.
     */
    function allowed(id) {
      const normalized = normalizeIdentifier(id)
      return (
        strings.has(normalized) ||
        regexes.some(function (regex) {
          return regex.test(normalized)
        })
      )
    }
  }
)

export default remarkLintNoUndefinedReferences
