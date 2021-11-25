/**
 * ## When should I use this?
 *
 * You can use this package to check that markdown is consistent.
 *
 * @summary
 *   Preset of remark-lint rules to warn for inconsistencies.
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
    [remarkLintRuleStyle, 'consistent'],
    [remarkLintStrongMarker, 'consistent'],
    [remarkLintTableCellPadding, 'consistent']
  ]
}

export default remarkPresetLintConsistent
