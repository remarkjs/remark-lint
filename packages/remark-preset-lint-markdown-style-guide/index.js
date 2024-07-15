/**
 * Preset of remark-lint rules that follow an opinionated style guide.
 *
 * ## What is this?
 *
 * This package is a preset containing `remark-lint` rules.
 * Lint rules check markdown code style.
 *
 * ## When should I use this?
 *
 * You can use this package to check that markdown follows the
 * [Markdown Style Guide](https://cirosantilli.com/markdown-style-guide/).
 *
 * This uses the following style guide option system: `wrap:space`,
 * `header:atx`, `list-marker:hyphen`, `list-space:mixed`, and `code:fenced`.
 *
 * ###### `space-sentence`
 *
 * Both `space-sentence:1` and `space-sentence:2` are not supported by
 * `remark-lint` as they relate to prose rather than markdown syntax.
 * You could set-up
 * [`remark-retext`](https://github.com/remarkjs/remark-retext)
 * with
 * [`retext-sentence-spacing`](https://github.com/retextjs/retext-sentence-spacing)
 * to check this.
 *
 * ###### `wrap`
 *
 * `wrap:inner-sentence` and `wrap:sentence` are not supported by `remark-lint`.
 *
 * The default is `wrap:space`.
 * To use `wrap:no`, turn off `remark-lint-maximum-line-length` like so:
 *
 * ```diff
 *  "plugins": [
 *    …
 *    "remark-preset-lint-markdown-style-guide",
 * +  ["remark-lint-maximum-line-length", false],
 *    …
 *  ]
 * ```
 *
 * ###### `header`
 *
 * The default is `header:atx`.
 * To use `header:setext`, change the setting for `remark-lint-heading-style`
 * like so:
 *
 * ```diff
 *  "plugins": [
 *    …
 *    "remark-preset-lint-markdown-style-guide",
 * +  ["remark-lint-heading-style", "setext"],
 *    …
 *  ]
 * ```
 *
 * ###### `list-marker`
 *
 * The default is `list-marker:hyphen`.
 * For `list-marker:asterisk` or `list-marker:plus`, change the setting for
 * `remark-lint-unordered-list-marker-style` like so:
 *
 * ```diff
 *  "plugins": [
 *    …
 *    "remark-preset-lint-markdown-style-guide",
 * +  ["remark-lint-unordered-list-marker-style", "*"],
 *    …
 *  ]
 * ```
 *
 * ###### `list-space`
 *
 * The default is `list-space:mixed`.
 * For `list-space:1`, change the setting for `remark-lint-list-item-indent`
 * like so:
 *
 * ```diff
 *  "plugins": [
 *    …
 *    "remark-preset-lint-markdown-style-guide",
 * +  ["remark-lint-list-item-indent", "space"],
 *    …
 *  ]
 * ```
 *
 * ###### `code`
 *
 * The default is `code:fenced`.
 * For `code:indented`, change the setting for `remark-lint-code-block-style`
 * like so:
 *
 * ```diff
 *  "plugins": [
 *    …
 *    "remark-preset-lint-markdown-style-guide",
 * +  ["remark-lint-code-block-style", "indented"],
 *    …
 *  ]
 * ```
 *
 * ## API
 *
 * ### `unified().use(remarkPresetLintMarkdownStyleGuide)`
 *
 * Check that markdown follows “Markdown Style Guide”.
 *
 * You can reconfigure rules in the preset by using them afterwards with different
 * options.
 *
 * [api-remark-preset-lint-markdown-style-guide]: #unifieduseremarkpresetlintmarkdownstyleguide
 */

/**
 * @import {Preset} from 'unified'
 */

import remarkLint from 'remark-lint'
import remarkLintBlockquoteIndentation from 'remark-lint-blockquote-indentation'
import remarkLintCodeBlockStyle from 'remark-lint-code-block-style'
import remarkLintDefinitionCase from 'remark-lint-definition-case'
import remarkLintDefinitionSpacing from 'remark-lint-definition-spacing'
import remarkLintEmphasisMarker from 'remark-lint-emphasis-marker'
import remarkLintFencedCodeFlag from 'remark-lint-fenced-code-flag'
import remarkLintFencedCodeMarker from 'remark-lint-fenced-code-marker'
import remarkLintFileExtension from 'remark-lint-file-extension'
import remarkLintFinalDefinition from 'remark-lint-final-definition'
import remarkLintHardBreakSpaces from 'remark-lint-hard-break-spaces'
import remarkLintHeadingIncrement from 'remark-lint-heading-increment'
import remarkLintHeadingStyle from 'remark-lint-heading-style'
import remarkLintLinkTitleStyle from 'remark-lint-link-title-style'
import remarkLintListItemContentIndent from 'remark-lint-list-item-content-indent'
import remarkLintListItemIndent from 'remark-lint-list-item-indent'
import remarkLintListItemSpacing from 'remark-lint-list-item-spacing'
import remarkLintMaximumHeadingLength from 'remark-lint-maximum-heading-length'
import remarkLintMaximumLineLength from 'remark-lint-maximum-line-length'
import remarkLintNoBlockquoteWithoutMarker from 'remark-lint-no-blockquote-without-marker'
import remarkLintNoConsecutiveBlankLines from 'remark-lint-no-consecutive-blank-lines'
import remarkLintNoDuplicateHeadings from 'remark-lint-no-duplicate-headings'
import remarkLintNoEmphasisAsHeading from 'remark-lint-no-emphasis-as-heading'
import remarkLintNoFileNameArticles from 'remark-lint-no-file-name-articles'
import remarkLintNoFileNameConsecutiveDashes from 'remark-lint-no-file-name-consecutive-dashes'
import remarkLintNoFileNameIrregularCharacters from 'remark-lint-no-file-name-irregular-characters'
import remarkLintNoFileNameMixedCase from 'remark-lint-no-file-name-mixed-case'
import remarkLintNoFileNameOuterDashes from 'remark-lint-no-file-name-outer-dashes'
import remarkLintNoHeadingPunctuation from 'remark-lint-no-heading-punctuation'
import remarkLintNoLiteralUrls from 'remark-lint-no-literal-urls'
import remarkLintNoMultipleToplevelHeadings from 'remark-lint-no-multiple-toplevel-headings'
import remarkLintNoShellDollars from 'remark-lint-no-shell-dollars'
import remarkLintNoShortcutReferenceImage from 'remark-lint-no-shortcut-reference-image'
import remarkLintNoShortcutReferenceLink from 'remark-lint-no-shortcut-reference-link'
import remarkLintNoTableIndentation from 'remark-lint-no-table-indentation'
import remarkLintOrderedListMarkerStyle from 'remark-lint-ordered-list-marker-style'
import remarkLintOrderedListMarkerValue from 'remark-lint-ordered-list-marker-value'
import remarkLintUnorderedListMarkerStyle from 'remark-lint-unordered-list-marker-style'
import remarkLintRuleStyle from 'remark-lint-rule-style'
import remarkLintStrongMarker from 'remark-lint-strong-marker'
import remarkLintTableCellPadding from 'remark-lint-table-cell-padding'
import remarkLintTablePipeAlignment from 'remark-lint-table-pipe-alignment'
import remarkLintTablePipes from 'remark-lint-table-pipes'

/** @type {Preset} */
const remarkPresetLintMarkdownStyleGuide = {
  plugins: [
    remarkLint,

    // https://cirosantilli.com/markdown-style-guide/#file-extension
    [remarkLintFileExtension, 'md'],

    // https://cirosantilli.com/markdown-style-guide/#file-name
    remarkLintNoFileNameMixedCase,
    remarkLintNoFileNameArticles,
    remarkLintNoFileNameIrregularCharacters,
    remarkLintNoFileNameConsecutiveDashes,
    remarkLintNoFileNameOuterDashes,

    // https://cirosantilli.com/markdown-style-guide/#newlines
    // https://cirosantilli.com/markdown-style-guide/#empty-lines-around-lists
    // https://cirosantilli.com/markdown-style-guide/#tables
    remarkLintNoConsecutiveBlankLines,

    // https://cirosantilli.com/markdown-style-guide/#spaces-after-sentences.
    // Not enforced, cannot be done properly without false positives, if you
    // want this, use remark-retext and retext-sentence-spacing.

    // https://cirosantilli.com/markdown-style-guide/#line-wrapping
    [remarkLintMaximumLineLength, 80],

    // https://cirosantilli.com/markdown-style-guide/#dollar-signs-in-shell-code
    remarkLintNoShellDollars,

    // https://cirosantilli.com/markdown-style-guide/#what-to-mark-as-code.
    // This is a tip, not a rule.

    // https://cirosantilli.com/markdown-style-guide/#spelling-and-grammar.
    // Spelling is not in the scope of remark-lint.  If you want this,
    // use remark-retext and retext-spell.

    // https://cirosantilli.com/markdown-style-guide/#line-breaks
    remarkLintHardBreakSpaces,

    // https://cirosantilli.com/markdown-style-guide/#headers
    [remarkLintHeadingStyle, 'atx'],
    remarkLintHeadingIncrement,
    remarkLintNoDuplicateHeadings,

    // https://cirosantilli.com/markdown-style-guide/#top-level-header
    remarkLintNoMultipleToplevelHeadings,

    // https://cirosantilli.com/markdown-style-guide/#header-case.
    // Heading case isn’t tested yet: new rules to fix this are ok though!

    // https://cirosantilli.com/markdown-style-guide/#end-of-a-header.
    // Cannot be checked?

    // https://cirosantilli.com/markdown-style-guide/#header-length
    remarkLintMaximumHeadingLength,

    // https://cirosantilli.com/markdown-style-guide/#punctuation-at-the-end-of-headers
    [remarkLintNoHeadingPunctuation, ':.'],

    // https://cirosantilli.com/markdown-style-guide/#header-synonyms.
    // Cannot be checked?

    // https://cirosantilli.com/markdown-style-guide/#blockquotes
    [remarkLintBlockquoteIndentation, 2],
    remarkLintNoBlockquoteWithoutMarker,

    // https://cirosantilli.com/markdown-style-guide/#unordered
    [remarkLintUnorderedListMarkerStyle, '-'],

    // https://cirosantilli.com/markdown-style-guide/#ordered
    [remarkLintOrderedListMarkerStyle, '.'],
    [remarkLintOrderedListMarkerValue, 'one'],

    // https://cirosantilli.com/markdown-style-guide/#spaces-after-list-marker
    [remarkLintListItemIndent, 'mixed'],

    // https://cirosantilli.com/markdown-style-guide/#indentation-of-content-inside-lists
    remarkLintListItemContentIndent,

    // https://cirosantilli.com/markdown-style-guide/#empty-lines-inside-lists
    remarkLintListItemSpacing,

    // https://cirosantilli.com/markdown-style-guide/#case-of-first-letter-of-list-item
    // Not checked.

    // https://cirosantilli.com/markdown-style-guide/#punctuation-at-the-end-of-list-items.
    // Not checked.

    // https://cirosantilli.com/markdown-style-guide/#definition-lists.
    // Not checked.

    // https://cirosantilli.com/markdown-style-guide/#code-blocks
    [remarkLintCodeBlockStyle, 'fenced'],
    [remarkLintFencedCodeFlag, {allowEmpty: false}],
    [remarkLintFencedCodeMarker, '`'],

    // https://cirosantilli.com/markdown-style-guide/#horizontal-rules
    [remarkLintRuleStyle, '---'],

    // https://cirosantilli.com/markdown-style-guide/#tables
    remarkLintNoTableIndentation,
    remarkLintTablePipes,
    remarkLintTablePipeAlignment,
    [remarkLintTableCellPadding, 'padded'],

    // https://cirosantilli.com/markdown-style-guide/#separate-consecutive-elements.
    // Not checked.

    // https://cirosantilli.com/markdown-style-guide/#reference-style-links
    remarkLintNoShortcutReferenceImage,
    remarkLintNoShortcutReferenceLink,
    remarkLintFinalDefinition,
    remarkLintDefinitionCase,
    remarkLintDefinitionSpacing,

    // https://cirosantilli.com/markdown-style-guide/#single-or-double-quote-titles
    [remarkLintLinkTitleStyle, '"'],

    // https://cirosantilli.com/markdown-style-guide/#bold
    [remarkLintStrongMarker, '*'],

    // https://cirosantilli.com/markdown-style-guide/#italic
    [remarkLintEmphasisMarker, '*'],

    // https://cirosantilli.com/markdown-style-guide/#uppercase-for-emphasis.
    // Not checked.

    // https://cirosantilli.com/markdown-style-guide/#emphasis-vs-headers
    remarkLintNoEmphasisAsHeading,

    // https://cirosantilli.com/markdown-style-guide/#automatic-links-without-angle-brackets
    remarkLintNoLiteralUrls

    // https://cirosantilli.com/markdown-style-guide/#email-automatic-links.
    // Not checked.
  ]
}

export default remarkPresetLintMarkdownStyleGuide
