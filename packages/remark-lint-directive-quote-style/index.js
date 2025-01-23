/**
 * remark-lint rule to warn when directive attribute value
 * markers violate a given style.
 *
 * ## What is this?
 *
 * This package checks the style of directive attribute value markers.
 *
 * ## When should I use this?
 *
 * You can use this package to check that the style of directive
 * attribute value markers is consistent.
 *
 * ## API
 *
 * ### `inferAttributes(node, document)`
 *
 * Internal API to get offsets of where attributes occur.
 * Shared with other lint rules to work with attributes.
 *
 * ###### Parameters
 *
 * * `node`
 *   ([`Directive`][github-mdast-util-directive-nodes])
 * * `document`
 *   (`string`)
 *
 * ###### Returns
 *
 * [`Array<Attribute>`][api-attribute].
 *
 * ### `unified().use(remarkLintDirectiveQuoteStyle[, options])`
 *
 * Warn when directive attribute value markers violate a given style.
 *
 * ###### Parameters
 *
 * * `options`
 *   ([`Options`][api-options], default: `'consistent'`)
 *   — configuration
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ### `Attribute`
 *
 * Internal attribute tokens (TypeScript type).
 *
 * ###### Type
 *
 * ```ts
 * export interface Attribute {
 *   key: Token
 *   value: Token | undefined
 * }
 * ```
 *
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * ###### Properties
 *
 * * `allowUnquoted`
 *   (`boolean`, default: `true`)
 *   — whether to allow unquoted attributes;
 *   otherwise attribute values must be quoted
 * * `quote`
 *   ([`Style`][api-style] or `'consistent'`, default: `'consistent'`)
 *   — quote
 *
 * ### `Style`
 *
 * Style (TypeScript type).
 *
 * ###### Type
 *
 * ```ts
 * type Style = '"' | '\''
 * ```
 *
 * ### `Token`
 *
 * Info on an internal token (TypeScript type).
 *
 * ###### Type
 *
 * ```ts
 * type Token = [value: string, start: number, end: number]
 * ```
 *
 * ## Recommendation
 *
 * In HTML,
 * attributes are commonly written with double quotes.
 * It’s recommended to go with that.
 * To configure this rule with `'"'`.
 *
 * ## Fix
 *
 * [`remark-directive`][github-remark-directive] typically formats
 * attributes with double quotes.
 * It can be passed several options to influence which quote it uses.
 * The options `quote` and `quoteSmart` can be used together with this
 * lint rule.
 *
 * [api-attribute]: #attribute
 * [api-options]: #options
 * [api-infer-attributes]: #inferattributesnode-document
 * [api-remark-lint-directive-quote-style]: #unifieduseremarklintdirectivequotestyle-options
 * [api-style]: #style
 * [api-token]: #token
 * [github-mdast-util-directive-nodes]: https://github.com/syntax-tree/mdast-util-directive#nodes
 * [github-remark-directive]: https://github.com/remarkjs/remark-directive
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module directive-quote-style
 * @author Titus Wormer
 * @copyright 2025 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"directive": true, "name": "ok-consistent.md"}
 *
 *   :planet[Venus]{aphelion="0.728213" perihelion="0.718440" symbol=♀︎}
 *
 * @example
 *   {"directive": true, "label": "input", "name": "not-ok-consistent.md"}
 *
 *   :planet[Venus]{aphelion="0.728213" perihelion='0.718440' symbol=♀︎}
 * @example
 *   {"directive": true, "label": "output", "name": "not-ok-consistent.md"}
 *
 *   1:47-1:57: Unexpected directive attribute quote markers `'`, expected `"`
 *
 * @example
 *   {"config": "\"", "directive": true, "label": "input", "name": "double-quote.md"}
 *
 *   :planet[Venus]{aphelion="0.728213" perihelion='0.718440' symbol=♀︎}
 * @example
 *   {"config": "\"", "directive": true, "label": "output", "name": "double-quote.md"}
 *
 *   1:47-1:57: Unexpected directive attribute quote markers `'`, expected `"`
 *
 * @example
 *   {"config": "'", "directive": true, "label": "input", "name": "single-quote.md"}
 *
 *   :planet[Venus]{aphelion="0.728213" perihelion='0.718440' symbol=♀︎}
 * @example
 *   {"config": "'", "directive": true, "label": "output", "name": "single-quote.md"}
 *
 *   1:25-1:35: Unexpected directive attribute quote markers `"`, expected `'`
 *
 * @example
 *   {"config": "\"", "directive": true, "name": "other-attributes.md"}
 *
 *   :planet[Jupiter]{#jupiter.fifth.gas-giant symbol=♃ .zeus}
 *
 * @example
 *   {"config": "\"", "directive": true, "label": "input", "name": "whitespace.md"}
 *
 *   :planet[Mars]{ aphelion = "249261000" perihelion = '206650000' symbol = ♂ }.
 * @example
 *   {"config": "\"", "directive": true, "label": "output", "name": "whitespace.md"}
 *
 *   1:52-1:63: Unexpected directive attribute quote markers `'`, expected `"`
 *
 * @example
 *   {"config": "\"", "directive": true, "label": "input", "name": "text-directive.md"}
 *
 *   :planet{}
 *
 *   :planet[Venus]{aphelion="0.728213" perihelion='0.718440'}
 *
 *   :planet{symbol='♂'}
 *
 *   :planet[]
 * @example
 *   {"config": "\"", "directive": true, "label": "output", "name": "text-directive.md"}
 *
 *   3:47-3:57: Unexpected directive attribute quote markers `'`, expected `"`
 *   5:16-5:19: Unexpected directive attribute quote markers `'`, expected `"`
 *
 * @example
 *   {"config": "\"", "directive": true, "label": "input", "name": "leaf-directive.md"}
 *
 *   ::planet{}
 *
 *   ::planet[Venus]{aphelion="0.728213" perihelion='0.718440'}
 *
 *   ::planet{symbol='♂'}
 *
 *   ::planet[]
 * @example
 *   {"config": "\"", "directive": true, "label": "output", "name": "leaf-directive.md"}
 *
 *   3:48-3:58: Unexpected directive attribute quote markers `'`, expected `"`
 *   5:17-5:20: Unexpected directive attribute quote markers `'`, expected `"`
 *
 * @example
 *   {"config": "\"", "directive": true, "label": "input", "name": "container-directive.md"}
 *
 *   :::planet{}
 *   :::
 *
 *   :::planet[Venus]{aphelion="0.728213" perihelion='0.718440'}
 *   :::
 *
 *   :::planet{symbol='♃'}
 *   Jupiter
 *   :::
 *
 *   :::planet{symbol='🜨'}
 *   :::
 *
 *   :::planet[]
 *   :::
 * @example
 *   {"config": "\"", "directive": true, "label": "output", "name": "container-directive.md"}
 *
 *   4:49-4:59: Unexpected directive attribute quote markers `'`, expected `"`
 *   7:18-7:21: Unexpected directive attribute quote markers `'`, expected `"`
 *   11:18-11:22: Unexpected directive attribute quote markers `'`, expected `"`
 *
 * @example
 *   {"config": {"allowUnquoted": false}, "directive": true, "label": "input", "name": "allow-unquoted.md"}
 *
 *   :planet[Venus]{aphelion=0.728213}
 *
 *   :planet[Mars]{aphelion="249261000" symbol=♂}.
 * @example
 *   {"config": {"allowUnquoted": false}, "directive": true, "label": "output", "name": "allow-unquoted.md"}
 *
 *   1:25-1:33: Unexpected unquoted directive attribute, expected quote around value
 *   3:43-3:44: Unexpected unquoted directive attribute, expected `"` around value
 *
 * @example
 *   {"config": "🌍", "directive": true, "label": "output", "name": "not-ok.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected `'"'`, `"'"`, or `'consistent'`
 */

/**
 * @import {Directives} from 'mdast-util-directive'
 * @import {Root} from 'mdast'
 * @import {Point} from 'unist'
 */

/**
 * @typedef Attribute
 *   Internal attribute tokens.
 * @property {Token} key
 *   Name.
 * @property {Token | undefined} value
 *   Value.
 *
 * @typedef Options
 *   Configuration.
 * @property {boolean | null | undefined} [allowUnquoted=true]
 *   Whether to allow unquoted attributes (default: `true`).
 *   Otherwise attribute values must be quoted.
 * @property {Style | 'consistent' | null | undefined} [quote]
 *   Quote.
 *
 * @typedef {'"' | '\''} Style
 *   Styles.
 *
 * @typedef {[value: string, start: number, end: number]} Token
 *   Info on an internal token.
 */

import {asciiAlphanumeric, markdownSpace} from 'micromark-util-character'
import {codes} from 'micromark-util-symbol'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {visitParents} from 'unist-util-visit-parents'
import {location} from 'vfile-location'
import {VFileMessage} from 'vfile-message'

const remarkLintDirectiveQuoteStyle = lintRule(
  {
    origin: 'remark-lint:directive-quote-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-directive-quote-style#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {Options | Style | 'consistent' | null | undefined} [options='consistent']
   *   Configuration (default: `'consistent'`).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    const value = String(file)
    const toPoint = location(file).toPoint
    let allowUnquoted = true
    /** @type {VFileMessage | undefined} */
    let cause
    /** @type {Style | undefined} */
    let expected
    /** @type {Options['quote']} */
    let preferredQuote

    if (options && typeof options === 'object') {
      preferredQuote = options.quote
      allowUnquoted = options.allowUnquoted !== false
    } else {
      preferredQuote = options
    }

    if (
      preferredQuote === 'consistent' ||
      preferredQuote === null ||
      preferredQuote === undefined
    ) {
      // Empty.
    } else if (preferredQuote === '"' || preferredQuote === "'") {
      expected = preferredQuote
    } else {
      file.fail(
        'Unexpected value `' +
          preferredQuote +
          "` for `options`, expected `'\"'`, `\"'\"`, or `'consistent'`"
      )
    }

    visitParents(tree, function (node, parents) {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const attributes = inferAttributes(node, value)

        for (const attribute of attributes) {
          if (attribute.value) {
            const code = value.charCodeAt(attribute.value[1])
            /** @type {Style | undefined} */
            const actual =
              code === codes.quotationMark
                ? '"'
                : code === codes.apostrophe
                  ? "'"
                  : undefined

            const start = toPoint(attribute.value[1])
            const end = toPoint(attribute.value[2])
            /* c8 ignore next 2 -- should be there. */
            const place = start && end ? {start, end} : undefined
            if (!place) continue

            if (actual === undefined) {
              if (!allowUnquoted) {
                file.message(
                  'Unexpected unquoted directive attribute, expected ' +
                    (expected ? displayStyle(expected) : 'quote') +
                    ' around value',
                  {ancestors: [...parents, node], cause, place}
                )
              }
            } else if (expected) {
              if (actual !== expected) {
                file.message(
                  'Unexpected directive attribute quote markers ' +
                    displayStyle(actual) +
                    ', expected ' +
                    displayStyle(expected),
                  {ancestors: [...parents, node], cause, place}
                )
              }
            } else {
              expected = actual
              cause = new VFileMessage(
                'Directive quote marker style ' +
                  displayStyle(expected) +
                  " first defined for `'consistent'` here",
                {
                  ancestors: [...parents, node],
                  place,
                  ruleId: 'directive-quote-style',
                  source: 'remark-lint'
                }
              )
            }
          }
        }
      }
    })
  }
)

export default remarkLintDirectiveQuoteStyle

/**
 * @param {Style} style
 *   Style.
 * @returns {string}
 *   Display.
 */
function displayStyle(style) {
  return style === '"' ? '`"`' : "`'`"
}

/**
 * Internal API to get offsets of where attributes occur.
 * Shared with other lint rules to work with attributes.
 *
 * @param {Directives} node
 * @param {string} document
 * @returns {Array<Attribute>}
 */
export function inferAttributes(node, document) {
  /** @type {Array<Attribute>} */
  const attributes = []
  /** @type {Point | undefined} */
  let start

  // Children of leaf and text are *inside* `[` and `]`,
  // so before attributes.
  if (node.type === 'leafDirective' || node.type === 'textDirective') {
    const tail = node.children.at(-1)
    start = tail ? pointEnd(tail) : pointStart(node)
  }
  // Children of container can be both before and after attributes.
  else {
    const head = node.children[0]

    start =
      head && head.type === 'paragraph' && head.data && head.data.directiveLabel
        ? pointEnd(head)
        : pointStart(node)
  }

  if (!start) return attributes

  const brace = document.indexOf('{', start.offset)
  let lineFeed = document.indexOf('\n', start.offset)
  if (lineFeed === -1) lineFeed = document.length

  if (brace === -1 || brace > lineFeed) return attributes

  let index = brace + 1

  while (index < document.length) {
    // Skip whitespaces.
    while (markdownSpace(document.charCodeAt(index))) index++

    const code = document.charCodeAt(index)

    // Done.
    if (code === codes.rightCurlyBrace) break

    /** @type {Token} */
    let key
    /** @type {Token | undefined} */
    let value

    // Shortcut.
    if (code === codes.numberSign || code === codes.dot) {
      key = [document.charAt(index), index, index + 1]
      index++
      const valueStart = index
      while (shortcut(document.charCodeAt(index))) index++
      /* c8 ignore next -- exit if bogus, there should be a value, `##` or `#}` are not allowed to parse. */
      if (valueStart === index) break
      value = [document.slice(valueStart, index), valueStart, index]
    }
    // Key.
    else {
      const keyStart = index
      while (name(document.charCodeAt(index))) index++
      key = [document.slice(keyStart, index), keyStart, index]
      /* c8 ignore next -- exit if bogus, there should be a key. */
      if (keyStart === index) break

      while (markdownSpace(document.charCodeAt(index))) index++

      // Value.
      if (document.charCodeAt(index) === codes.equalsTo) {
        index++

        while (markdownSpace(document.charCodeAt(index))) index++

        const quoteCharacter = document.charCodeAt(index)
        const quote =
          quoteCharacter === codes.quotationMark
            ? codes.quotationMark
            : quoteCharacter === codes.apostrophe
              ? codes.apostrophe
              : undefined
        const valueStart = index

        if (quote) {
          index++
          while (document.charCodeAt(index) !== quote) index++
          index++
          value = [document.slice(valueStart + 1, index - 1), valueStart, index]
        }
        // Unquoted.
        else {
          while (unquoted(document.charCodeAt(index))) index++
          /* c8 ignore next -- exit if bogus, there should be a value. */
          if (valueStart === index) break
          value = [document.slice(valueStart, index), valueStart, index]
        }
      }
    }

    attributes.push({key, value})
  }

  return attributes
}

/**
 * <https://github.com/micromark/micromark-extension-directive/blob/3be1f50/dev/lib/factory-attributes.js#L168>
 *
 * @param {number} code
 * @returns {boolean}
 */
function name(code) {
  if (
    code === codes.dash ||
    code === codes.dot ||
    code === codes.colon ||
    code === codes.underscore ||
    asciiAlphanumeric(code)
  ) {
    return true
  }

  return false
}

/**
 * <https://github.com/micromark/micromark-extension-directive/blob/3be1f50/dev/lib/factory-attributes.js#L99>
 *
 * @param {number} code
 * @returns {boolean}
 */
function shortcut(code) {
  return code === codes.numberSign || code === codes.dot
    ? false
    : unquoted(code)
}

/**
 * <https://github.com/micromark/micromark-extension-directive/blob/3be1f50/dev/lib/factory-attributes.js#L246>
 *
 * @param {number} code
 * @returns {boolean}
 */
function unquoted(code) {
  if (
    Number.isNaN(code) ||
    code <= codes.space ||
    code === codes.quotationMark ||
    code === codes.apostrophe ||
    code === codes.lessThan ||
    code === codes.equalsTo ||
    code === codes.greaterThan ||
    code === codes.graveAccent ||
    code === codes.rightCurlyBrace
  ) {
    return false
  }

  return true
}
