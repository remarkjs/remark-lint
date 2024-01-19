/**
 * remark-lint rule to warn when undefined definitions are referenced.
 *
 * ## What is this?
 *
 * This package checks that referenced definitions are defined.
 *
 * ## When should I use this?
 *
 * You can use this package to check for broken references.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoUndefinedReferences[, options])`
 *
 * Warn when undefined definitions are referenced.
 *
 * ###### Parameters
 *
 * * `options` ([`Options`][api-options], optional)
 *   — configuration
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * ###### Fields
 *
 * * `allow` (`Array<RegExp | string>`, optional)
 *   — list of values to allow between `[` and `]`
 * * `allowShortcutLink` (`boolean`, default: `false`)
 *   — allow shortcut references, which are just brackets such as `[text]`
 *
 * ## Recommendation
 *
 * Shortcut references use an implicit syntax that could also occur as plain
 * text.
 * To illustrate,
 * it is reasonable to expect an author adding `[…]` to abbreviate some text
 * somewhere in a document:
 *
 * ```markdown
 * > Some […] quote.
 * ```
 *
 * This isn’t a problem,
 * but it might become one when an author later adds a definition:
 *
 * ```markdown
 * Some new text […][].
 *
 * […]: #read-more
 * ```
 *
 * The second author might expect only their newly added text to form a link,
 * but their changes also result in a link for the text by the first author.
 *
 * [api-options]: #options
 * [api-remark-lint-no-undefined-references]: #unifieduseremarklintnoundefinedreferences-options
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-undefined-references
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   [Mercury][] is the first planet from the Sun and the smallest in the Solar
 *   System.
 *
 *   Venus is the second planet from the [Sun.
 *
 *   Earth is the third planet from the \[Sun] and the only astronomical object
 *   known to harbor life\.
 *
 *   Mars is the fourth planet from the Sun: [].
 *
 *   [mercury]: https://example.com/mercury/
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   [Mercury] is the first planet from the Sun and the smallest in the Solar
 *   System.
 *
 *   [Venus][] is the second planet from the Sun.
 *
 *   [Earth][earth] is the third planet from the Sun and the only astronomical
 *   object known to harbor life.
 *
 *   ![Mars] is the fourth planet from the Sun in the [Solar
 *   System].
 *
 *   > Jupiter is the fifth planet from the Sun and the largest in the [Solar
 *   > System][].
 *
 *   [Saturn][ is the sixth planet from the Sun and the second-largest
 *   in the Solar System, after Jupiter.
 *
 *   [*Uranus*][] is the seventh planet from the Sun.
 *
 *   [Neptune][neptune][more] is the eighth and farthest planet from the Sun.
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:1-1:10: Unexpected reference to undefined definition, expected corresponding definition (`mercury`) for a link or escaped opening bracket (`\[`) for regular text
 *   4:1-4:10: Unexpected reference to undefined definition, expected corresponding definition (`venus`) for a link or escaped opening bracket (`\[`) for regular text
 *   6:1-6:15: Unexpected reference to undefined definition, expected corresponding definition (`earth`) for a link or escaped opening bracket (`\[`) for regular text
 *   9:2-9:8: Unexpected reference to undefined definition, expected corresponding definition (`mars`) for an image or escaped opening bracket (`\[`) for regular text
 *   9:50-10:8: Unexpected reference to undefined definition, expected corresponding definition (`solar system`) for a link or escaped opening bracket (`\[`) for regular text
 *   12:67-13:12: Unexpected reference to undefined definition, expected corresponding definition (`solar > system`) for a link or escaped opening bracket (`\[`) for regular text
 *   15:1-15:9: Unexpected reference to undefined definition, expected corresponding definition (`saturn`) for a link or escaped opening bracket (`\[`) for regular text
 *   18:1-18:13: Unexpected reference to undefined definition, expected corresponding definition (`*uranus*`) for a link or escaped opening bracket (`\[`) for regular text
 *   20:1-20:19: Unexpected reference to undefined definition, expected corresponding definition (`neptune`) for a link or escaped opening bracket (`\[`) for regular text
 *   20:19-20:25: Unexpected reference to undefined definition, expected corresponding definition (`more`) for a link or escaped opening bracket (`\[`) for regular text
 *
 * @example
 *   {"config": {"allow": ["…"]}, "name": "ok-allow.md"}
 *
 *   Mercury is the first planet from the Sun and the smallest in the Solar
 *   System. […]
 *
 * @example
 *   {"config": {"allow": [{"source": "^mer"}, "venus"]}, "name": "source.md"}
 *
 *   [Mercury][] is the first planet from the Sun and the smallest in the Solar
 *   System.
 *
 *   [Venus][] is the second planet from the Sun.
 *
 * @example
 *   {"gfm": true, "label": "input", "name": "gfm.md"}
 *
 *   Mercury[^mercury] is the first planet from the Sun and the smallest in the
 *   Solar System.
 *
 *   [^venus]:
 *       **Venus** is the second planet from the Sun.
 * @example
 *   {"gfm": true, "label": "output", "name": "gfm.md"}
 *
 *   1:8-1:18: Unexpected reference to undefined definition, expected corresponding definition (`mercury`) for a footnote or escaped opening bracket (`\[`) for regular text
 *
 * @example
 *   {"config": {"allowShortcutLink": true}, "label": "input", "name": "allow-shortcut-link.md"}
 *
 *   [Mercury] is the first planet from the Sun and the smallest in the Solar
 *   System.
 *
 *   [Venus][] is the second planet from the Sun.
 *
 *   [Earth][earth] is the third planet from the Sun and the only astronomical object
 *   known to harbor life.
 * @example
 *   {"config": {"allowShortcutLink": true}, "label": "output", "name": "allow-shortcut-link.md"}
 *
 *   4:1-4:10: Unexpected reference to undefined definition, expected corresponding definition (`venus`) for a link or escaped opening bracket (`\[`) for regular text
 *   6:1-6:15: Unexpected reference to undefined definition, expected corresponding definition (`earth`) for a link or escaped opening bracket (`\[`) for regular text
 */

/**
 * @typedef {import('mdast').Nodes} Nodes
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {ReadonlyArray<RegExp | string> | null | undefined} [allow]
 *   List of values to allow between `[` and `]` (optional)
 * @property {boolean | null | undefined} [allowShortcutLink]
 *   Allow shortcut references, which are just brackets such as `[text]`
 *   (`boolean`, default: `false`)
 */

import {collapseWhiteSpace} from 'collapse-white-space'
import {ok as assert} from 'devlop'
import {normalizeIdentifier} from 'micromark-util-normalize-identifier'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visitParents} from 'unist-util-visit-parents'
import {location} from 'vfile-location'

/** @type {Readonly<Options>} */
const emptyOptions = {}
/** @type {ReadonlyArray<RegExp | string>} */
const emptyAllow = []

const lineEndingExpression = /(\r?\n|\r)[\t ]*(>[\t ]*)*/g

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
    const allowShortcutLink = settings.allowShortcutLink || false
    const value = String(file)
    const toPoint = location(file).toPoint
    /** @type {Set<string>} */
    const definitionIdentifiers = new Set()
    /** @type {Set<string>} */
    const footnoteDefinitionIdentifiers = new Set()
    /** @type {Array<RegExp>} */
    const regexes = []
    /** @type {Set<string>} */
    const strings = new Set()
    /** @type {Array<Array<Nodes>>} */
    const phrasingStacks = []

    let index = -1

    while (++index < allow.length) {
      const value = allow[index]

      if (typeof value === 'string') {
        strings.add(normalizeIdentifier(value))
      } else if (typeof value === 'object' && 'source' in value) {
        regexes.push(new RegExp(value.source, value.flags ?? 'i'))
      }
    }

    visitParents(tree, function (node, parents) {
      if (node.type === 'definition') {
        definitionIdentifiers.add(normalizeIdentifier(node.identifier))
      }

      if (node.type === 'footnoteDefinition') {
        footnoteDefinitionIdentifiers.add(normalizeIdentifier(node.identifier))
      }

      if (node.type === 'heading' || node.type === 'paragraph') {
        phrasingStacks.push([...parents, node])
      }
    })

    for (const ancestors of phrasingStacks) {
      findInPhrasingContainer(ancestors)
    }

    /**
     * @param {Array<Nodes>} ancestors
     *   Ancestors, the last of which a parent of phrasing nodes.
     * @returns {undefined}
     *   Nothing.
     */
    function findInPhrasingContainer(ancestors) {
      /** @type {Array<[ancestors: Array<Nodes>, brackets: Array<number>]>} */
      const bracketRanges = []
      const node = ancestors.at(-1)
      assert(node) // Always defined.
      assert('children' in node) // Always defined.

      for (const child of node.children) {
        if (child.type === 'text') {
          findRangesInText(bracketRanges, [...ancestors, child])
        } else if ('children' in child) {
          findInPhrasingContainer([...ancestors, child])
        }
      }

      // Remaining ranges.
      for (const range of bracketRanges) {
        handleRange(range)
      }
    }

    /**
     * @param {Array<[ancestors: Array<Nodes>, brackets: Array<number>]>} ranges
     * @param {Array<Nodes>} ancestors
     */
    function findRangesInText(ranges, ancestors) {
      const node = ancestors.at(-1)
      assert(node) // Always defined.
      const end = pointEnd(node)
      const start = pointStart(node)

      // Bail if there’s no positional info.
      if (
        !end ||
        !start ||
        typeof start.offset !== 'number' ||
        typeof end.offset !== 'number'
      ) {
        return
      }

      const source = value.slice(start.offset, end.offset)
      /** @type {Array<[number, string]>} */
      const lines = [[start.offset, '']]
      let last = 0

      lineEndingExpression.lastIndex = 0
      let match = lineEndingExpression.exec(source)

      while (match) {
        const index = match.index
        const lineTuple = lines.at(-1)
        assert(lineTuple) // Always defined.
        lineTuple[1] = source.slice(last, index)

        last = index + match[0].length
        lines.push([start.offset + last, ''])
        match = lineEndingExpression.exec(source)
      }

      const lineTuple = lines.at(-1)
      assert(lineTuple) // Always defined.
      lineTuple[1] = source.slice(last)

      for (const lineTuple of lines) {
        const [lineStart, line] = lineTuple
        let index = 0

        while (index < line.length) {
          const code = line.charCodeAt(index)

          // Opening bracket.
          if (code === 91 /* `[` */) {
            ranges.push([ancestors, [lineStart + index]])
            index++
          }
          // Skip escaped brackets.
          else if (code === 92 /* `\` */) {
            const next = line.charCodeAt(index + 1)

            index++

            if (next === 91 /* `[` */ || next === 93 /* `]` */) {
              index++
            }
          }
          // Close bracket.
          else if (code === 93 /* `]` */) {
            const bracketInfo = ranges.at(-1)

            // No opening, ignore.
            if (!bracketInfo) {
              index++
            }
            // `][`.
            else if (
              line.charCodeAt(index + 1) === 91 /* `[` */ &&
              // That would be the end of a reference already.
              bracketInfo[1].length !== 3
            ) {
              index++
              bracketInfo[1].push(lineStart + index, lineStart + index)
              index++
            }
            // `]` with earlier `[`.
            else {
              index++
              bracketInfo[1].push(lineStart + index)
              handleRange(bracketInfo)
              ranges.pop()
            }
          }
          // Anything else.
          else {
            index++
          }
        }
      }
    }

    /**
     * @param {[ancestors: Array<Nodes>, brackets: Array<number>]} bracketRange
     *   Info.
     * @returns {undefined}
     *   Nothing.
     */
    function handleRange(bracketRange) {
      const [ancestors, range] = bracketRange

      // `[`.
      if (range.length === 1) return

      // `[x][`.
      if (range.length === 3) range.length = 2

      // No need to warn for just `[]`.
      if (range.length === 2 && range[0] + 2 === range[1]) return

      const label =
        value.charCodeAt(range[0] - 1) === 33 /* `!` */
          ? 'image'
          : value.charCodeAt(range[0] + 1) === 94 /* `^` */
            ? 'footnote'
            : 'link'

      const offset = range.length === 4 && range[2] + 2 !== range[3] ? 2 : 0

      let id = normalizeIdentifier(
        collapseWhiteSpace(
          value.slice(range[0 + offset] + 1, range[1 + offset] - 1),
          {style: 'html', trim: true}
        )
      )
      let defined = definitionIdentifiers

      if (label === 'footnote') {
        // Footnotes can’t have spaces.
        /* c8 ignore next -- bit superfluous to test. */
        if (id.includes(' ')) return

        defined = footnoteDefinitionIdentifiers
        // Drop the `^`.
        id = id.slice(1)
      }

      if (
        (allowShortcutLink && range.length === 2) ||
        defined.has(id) ||
        strings.has(id) ||
        regexes.some(function (regex) {
          return regex.test(id)
        })
      ) {
        return
      }

      const start = toPoint(range[0])
      const end = toPoint(range[range.length - 1])

      if (end && start) {
        file.message(
          'Unexpected reference to undefined definition, expected corresponding definition (`' +
            id.toLowerCase() +
            '`) for ' +
            (label === 'image' ? 'an' : 'a') +
            ' ' +
            label +
            ' or escaped opening bracket (`\\[`) for regular text',
          {
            ancestors,
            place: {start, end}
          }
        )
      }
    }
  }
)

export default remarkLintNoUndefinedReferences
