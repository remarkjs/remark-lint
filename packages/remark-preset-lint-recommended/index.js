/**
 * Preset of remark-lint rules to warn for likely problems.
 *
 * ## What is this?
 *
 * This package is a preset containing `remark-lint` rules.
 * Lint rules check markdown code style.
 *
 * ## When should I use this?
 *
 * You can use this package to check that markdown follows some best practices.
 *
 * ## API
 *
 * ### `unified().use(remarkPresetLintRecommended)`
 *
 * Check that markdown follows some best practices.
 *
 * You can reconfigure rules in the preset by using them afterwards with different
 * options.
 *
 * [api-remark-preset-lint-recommended]: #unifieduseremarkpresetlintrecommended
 */

/**
 * @typedef {import('unified').Preset} Preset
 */

import remarkLint from 'remark-lint'
import remarkLintFinalNewline from 'remark-lint-final-newline'
import remarkLintHardBreakSpaces from 'remark-lint-hard-break-spaces'
import remarkLintListItemBulletIndent from 'remark-lint-list-item-bullet-indent'
import remarkLintListItemIndent from 'remark-lint-list-item-indent'
import remarkLintNoBlockquoteWithoutMarker from 'remark-lint-no-blockquote-without-marker'
import remarkLintNoDuplicateDefinitions from 'remark-lint-no-duplicate-definitions'
import remarkLintNoHeadingContentIndent from 'remark-lint-no-heading-content-indent'
import remarkLintNoLiteralUrls from 'remark-lint-no-literal-urls'
import remarkLintNoShortcutReferenceImage from 'remark-lint-no-shortcut-reference-image'
import remarkLintNoShortcutReferenceLink from 'remark-lint-no-shortcut-reference-link'
import remarkLintNoUndefinedReferences from 'remark-lint-no-undefined-references'
import remarkLintNoUnusedDefinitions from 'remark-lint-no-unused-definitions'
import remarkLintOrderedListMarkerStyle from 'remark-lint-ordered-list-marker-style'

/** @type {Preset} */
const remarkPresetLintRecommended = {
  plugins: [
    remarkLint,
    // Unix compatibility.
    remarkLintFinalNewline,
    // Rendering across vendors differs greatly if using other styles.
    remarkLintListItemBulletIndent,
    [remarkLintListItemIndent, 'one'],
    remarkLintNoBlockquoteWithoutMarker,
    remarkLintNoLiteralUrls,
    [remarkLintOrderedListMarkerStyle, '.'],
    // Mistakes.
    remarkLintHardBreakSpaces,
    remarkLintNoDuplicateDefinitions,
    remarkLintNoHeadingContentIndent,
    remarkLintNoShortcutReferenceImage,
    remarkLintNoShortcutReferenceLink,
    remarkLintNoUndefinedReferences,
    remarkLintNoUnusedDefinitions
  ]
}

export default remarkPresetLintRecommended
