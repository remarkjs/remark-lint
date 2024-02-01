/**
 * Preset of remark-lint rules to warn for inconsistencies.
 *
 * ## What is this?
 *
 * This package is a preset containing `remark-lint` rules.
 * Lint rules check markdown code style.
 *
 * ## When should I use this?
 *
 * You can use this package to check that markdown is consistent.
 *
 * ## API
 *
 * ### `unified().use(remarkPresetLintConsistent)`
 *
 * Check that markdown is consistent.
 *
 * You can reconfigure rules in the preset by using them afterwards with different
 * options.
 *
 * [api-remark-preset-lint-consistent]: #unifieduseremarkpresetlintconsistent
 */

/**
 * @typedef {import('unified').Preset} Preset
 */

import remarkLint from 'remark-lint'
import remarkLintBlockquoteIndentation from 'remark-lint-blockquote-indentation'
import remarkLintCheckboxCharacterStyle from 'remark-lint-checkbox-character-style'
import remarkLintCodeBlockStyle from 'remark-lint-code-block-style'
import remarkLintEmphasisMarker from 'remark-lint-emphasis-marker'
import remarkLintFencedCodeMarker from 'remark-lint-fenced-code-marker'
import remarkLintHeadingStyle from 'remark-lint-heading-style'
import remarkLintLinkTitleStyle from 'remark-lint-link-title-style'
import remarkLintListItemContentIndent from 'remark-lint-list-item-content-indent'
import remarkLintOrderedListMarkerStyle from 'remark-lint-ordered-list-marker-style'
import remarkLintOrderedListMarkerValue from 'remark-lint-ordered-list-marker-value'
import remarkLintRuleStyle from 'remark-lint-rule-style'
import remarkLintStrongMarker from 'remark-lint-strong-marker'
import remarkLintTableCellPadding from 'remark-lint-table-cell-padding'

/** @type {Preset} */
const remarkPresetLintConsistent = {
  plugins: [
    remarkLint,
    [remarkLintBlockquoteIndentation, 'consistent'],
    [remarkLintCheckboxCharacterStyle, 'consistent'],
    [remarkLintCodeBlockStyle, 'consistent'],
    [remarkLintEmphasisMarker, 'consistent'],
    [remarkLintFencedCodeMarker, 'consistent'],
    [remarkLintHeadingStyle, 'consistent'],
    [remarkLintLinkTitleStyle, 'consistent'],
    remarkLintListItemContentIndent,
    [remarkLintOrderedListMarkerStyle, 'consistent'],
    [remarkLintOrderedListMarkerValue, 'consistent'],
    [remarkLintRuleStyle, 'consistent'],
    [remarkLintStrongMarker, 'consistent'],
    [remarkLintTableCellPadding, 'consistent']
  ]
}

export default remarkPresetLintConsistent
