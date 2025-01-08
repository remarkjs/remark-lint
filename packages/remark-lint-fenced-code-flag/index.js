/**
 * remark-lint rule to warn when language flags of fenced code
 * are not used or used incorrectly.
 *
 * ## What is this?
 *
 * This package checks the language flags of fenced code blocks,
 * whether they exist,
 * and optionally what values they hold.
 *
 * Particularly,
 * it provides a check according to GitHub Linguist.
 * Which is what GitHub uses to highlight code.
 * So you can make sure that the language flags you use are recognized by
 * GitHub (or [`starry-night`][github-starry-night])
 *
 * ## When should I use this?
 *
 * You can use this package to check that the style of language flags of fenced
 * code blocks is consistent and known.
 *
 * ## API
 *
 * ### `unified().use(remarkLintFencedCodeFlag[, options])`
 *
 * Warn when language flags of fenced code are not used.
 *
 * ###### Parameters
 *
 * * `options` (`Array<string>`, [`CheckFlag`][api-check-flag], or
 *   [`Options`][api-options], optional)
 *   — check, configuration, or flags to allow
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ### `checkGithubLinguistFlag(value)`
 *
 * Check according to GitHub Linguist.
 *
 * ###### Parameters
 *
 * * `value` (`string`)
 *   — language flag to check
 *
 * ###### Returns
 *
 * Whether the flag is valid (`undefined`),
 * or a message to warn about (`string`).
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ### `CheckFlag`
 *
 * Custom check (TypeScript type).
 *
 * ###### Parameters
 *
 * * `value` (`string`)
 *   — language flag to check
 *
 * ###### Returns
 *
 * Whether the flag is valid (`undefined`),
 * or a message to warn about (`string`).
 *
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * ###### Fields
 *
 * * `allowEmpty` (`boolean`, default: `false`)
 *   — allow language flags to be omitted
 * * `flags` (`Array<string>`, optional)
 *   — flags to allow,
 *   other flags will result in a warning
 *
 * ## Recommendation
 *
 * While omitting language flags is fine to signal that code is plain text,
 * it *could* point to a mistake.
 * It’s recommended to instead use a certain flag for plain text (such as
 * `txt`) and to turn this rule on.
 * If possible,
 * stick with what is supported by GitHub.
 *
 * [api-check-flag]: #checkflag
 * [api-options]: #options
 * [api-remark-lint-fenced-code-flag]: #unifieduseremarklintfencedcodeflag-options
 * [api-check-github-linguist-flag]: #checkgithublinguistflagvalue
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 * [github-starry-night]: https://github.com/wooorm/starry-night
 *
 * @module fenced-code-flag
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   Some markdown:
 *
 *   ```markdown
 *   # Mercury
 *   ```
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   ```
 *   mercury()
 *   ```
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:1-3:4: Unexpected missing fenced code language flag in info string, expected keyword
 *
 * @example
 *   {"config": {"allowEmpty": true}, "name": "ok-allow-empty.md"}
 *
 *   ```
 *   mercury()
 *   ```
 *
 * @example
 *   {"config": {"allowEmpty": false}, "label": "input", "name": "not-ok-allow-empty.md"}
 *
 *   ```
 *   mercury()
 *   ```
 * @example
 *   {"config": {"allowEmpty": false}, "label": "output", "name": "not-ok-allow-empty.md"}
 *
 *   1:1-3:4: Unexpected missing fenced code language flag in info string, expected keyword
 *
 * @example
 *   {"config": ["markdown"], "name": "ok-array.md"}
 *
 *   ```markdown
 *   # Mercury
 *   ```
 *
 * @example
 *   {"config": {"flags":["markdown"]}, "name": "ok-options.md"}
 *
 *   ```markdown
 *   # Mercury
 *   ```
 *
 * @example
 *   {"config": ["markdown"], "label": "input", "name": "not-ok-array.md"}
 *
 *   ```javascript
 *   mercury()
 *   ```
 * @example
 *   {"config": ["markdown"], "label": "output", "name": "not-ok-array.md"}
 *
 *   1:1-3:4: Unexpected fenced code language flag `javascript` in info string, expected `markdown`
 *
 * @example
 *   {"config": ["javascript", "markdown", "mdx", "typescript"], "label": "input", "name": "not-ok-long-array.md"}
 *
 *   ```html
 *   <h1>Mercury</h1>
 *   ```
 * @example
 *   {"config": ["javascript", "markdown", "mdx", "typescript"], "label": "output", "name": "not-ok-long-array.md"}
 *
 *   1:1-3:4: Unexpected fenced code language flag `html` in info string, expected `javascript`, `markdown`, `mdx`, …
 *
 * @example
 *   {"config": "🌍", "label": "output", "name": "not-ok-options.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected array or object
 */

/**
 * @import {Root} from 'mdast'
 * @import {Info} from './github-linguist-info.js'
 */

/**
 * @callback CheckFlag
 *   Custom check.
 * @param {string} value
 *   Language flag to check.
 * @returns {string | undefined}
 *   Whether the flag is valid (`undefined`),
 *   or a message to warn about (`string`).
 *
 * @typedef Options
 *   Configuration.
 * @property {boolean | null | undefined} [allowEmpty=false]
 *   Allow language flags to be omitted (default: `false`).
 * @property {ReadonlyArray<string> | null | undefined} [flags]
 *   Flags to allow,
 *   other flags will result in a warning (optional).
 */

import {quotation} from 'quotation'
import {phrasing} from 'mdast-util-phrasing'
import {lintRule} from 'unified-lint-rule'
import {pointEnd, pointStart} from 'unist-util-position'
import {SKIP, visitParents} from 'unist-util-visit-parents'
import {githubLinguistInfo} from './github-linguist-info.js'

const fence = /^ {0,3}([~`])\1{2,}/

const listFormat = new Intl.ListFormat('en', {type: 'disjunction'})
const listFormatUnit = new Intl.ListFormat('en', {type: 'unit'})

const remarkLintFencedCodeFlag = lintRule(
  {
    origin: 'remark-lint:fenced-code-flag',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-fenced-code-flag#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {CheckFlag | Readonly<Options> | ReadonlyArray<string> | null | undefined} [options]
   *   Check, configuration, or flags to allow (optional).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    const value = String(file)
    /** @type {CheckFlag} */
    let check

    if (typeof options === 'function') {
      check = options
    } else if (typeof options === 'object' || options === undefined) {
      check = createCheck(options || {})
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          '` for `options`, expected array or object'
      )
    }

    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (node.type !== 'code') return

      const language = node.lang || ''
      const end = pointEnd(node)
      const start = pointStart(node)

      if (
        end &&
        start &&
        typeof end.offset === 'number' &&
        typeof start.offset === 'number'
      ) {
        if (language) {
          const reason = check(language)
          if (reason) {
            file.message(reason, {
              ancestors: [...parents, node],
              place: node.position
            })
          }
        }
        // Empty, no flag.
        else {
          const slice = value.slice(start.offset, end.offset)

          // To do: indented code shouldn’t be ok either?
          // Then, we can simplify this check.
          if (fence.test(slice)) {
            const reason = check(language)

            if (reason) {
              file.message(reason, {
                ancestors: [...parents, node],
                place: node.position
              })
            }
          }
        }
      }
    })
  }
)

export default remarkLintFencedCodeFlag

/**
 * @param {Readonly<Options> | ReadonlyArray<string>} options
 * @returns {CheckFlag}
 */
function createCheck(options) {
  let allowEmpty = false
  /** @type {ReadonlyArray<string> | undefined} */
  let allowed

  // Note: casts because `isArray` and `readonly` don’t mix.
  if (Array.isArray(options)) {
    const flags = /** @type {ReadonlyArray<string>} */ (options)
    allowed = flags
  } else {
    const settings = /** @type {Options} */ (options)
    allowEmpty = settings.allowEmpty === true

    if (settings.flags) {
      allowed = settings.flags
    }
  }

  /** @type {string} */
  let allowedDisplay

  if (allowed) {
    allowedDisplay =
      allowed.length > 3
        ? listFormatUnit.format([...quotation(allowed.slice(0, 3), '`'), '…'])
        : listFormat.format(quotation(allowed, '`'))
  } else {
    allowedDisplay = 'keyword'
  }

  /** @type {CheckFlag} */
  return function (value) {
    if (value) {
      if (allowed && !allowed.includes(value)) {
        return (
          'Unexpected fenced code language flag `' +
          value +
          '` in info string, expected ' +
          allowedDisplay
        )
      }
    } else if (!allowEmpty) {
      return (
        'Unexpected missing fenced code language flag in info string, expected ' +
        allowedDisplay
      )
    }
  }
}

/**
 * Check according to GitHub Linguist.
 *
 * @param {string} value
 *   Language flag to check.
 * @returns {string | undefined}
 *   Whether the flag is valid (`undefined`),
 *   or a message to warn about (`string`).
 * @satisfies {CheckFlag}
 */
export function checkGithubLinguistFlag(value) {
  const normal = value
    .toLowerCase()
    .replace(/^[ \t]+/, '')
    // eslint-disable-next-line unicorn/prefer-string-replace-all
    .replace(/\/*[ \t]*$/g, '')

  // Ignore a special flag that is not in linguist so that no highlighting will be applied.
  // `txt` is used by adblock, so that would result in some coloring.
  if (normal === 'text') {
    return
  }

  /** @type {Set<Info>} */
  const matches = new Set()
  const dot = normal.lastIndexOf('.')
  let known = false

  for (const info of githubLinguistInfo) {
    if (info.names.includes(normal)) {
      // Normalized name found: valid.
      if (value === normal) return
      known = true
      matches.add(info)
    }

    if (dot === -1) {
      if (info.extensions && info.extensions.includes('.' + normal)) {
        matches.add(info)
      }
    } else {
      const extension = normal.slice(dot)

      if (info.extensions && info.extensions.includes(extension)) {
        matches.add(info)
      }

      if (
        info.extensionsWithDot &&
        info.extensionsWithDot.includes(extension)
      ) {
        matches.add(info)
      }
    }
  }

  /** @type {Array<string>} */
  const suggestions = []

  for (const match of matches) {
    suggestions.push(...match.names)
  }

  suggestions.sort()

  let allowedDisplay = ''

  if (suggestions.length > 0) {
    allowedDisplay =
      ' such as ' +
      (suggestions.length > 5
        ? listFormatUnit.format([
            ...quotation(suggestions.slice(0, 5), '`'),
            '…'
          ])
        : listFormat.format(quotation(suggestions, '`')))
  }

  return (
    'Unexpected ' +
    (known ? '' : 'unknown ') +
    'fenced code language flag `' +
    value +
    '` in info string, expected a known language name' +
    allowedDisplay
  )
}
