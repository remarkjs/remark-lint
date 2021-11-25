/**
 * ## When should I use this?
 *
 * You can use this package to check that markdown follows some best practices.
 *
 * @summary
 *   Preset of remark-lint rules to warn for some likely problems.
 */

/**
 * @typedef {import('unified').Preset} Preset
 */

import remarkLint from 'remark-lint'
import remarkLintFinalNewline from 'remark-lint-final-newline'
import remarkLintListItemBulletIndent from 'remark-lint-list-item-bullet-indent'
import remarkLintListItemIndent from 'remark-lint-list-item-indent'
import remarkLintNoBlockquoteWithoutMarker from 'remark-lint-no-blockquote-without-marker'
import remarkLintNoLiteralUrls from 'remark-lint-no-literal-urls'
import remarkLintOrderedListMarkerStyle from 'remark-lint-ordered-list-marker-style'
import remarkLintHardBreakSpaces from 'remark-lint-hard-break-spaces'
import remarkLintNoDuplicateDefinitions from 'remark-lint-no-duplicate-definitions'
import remarkLintNoHeadingContentIndent from 'remark-lint-no-heading-content-indent'
import remarkLintNoInlinePadding from 'remark-lint-no-inline-padding'
import remarkLintNoShortcutReferenceImage from 'remark-lint-no-shortcut-reference-image'
import remarkLintNoShortcutReferenceLink from 'remark-lint-no-shortcut-reference-link'
import remarkLintNoUndefinedReferences from 'remark-lint-no-undefined-references'
import remarkLintNoUnusedDefinitions from 'remark-lint-no-unused-definitions'

/** @type {Preset} */
const remarkPresetLintRecommended = {
  plugins: [
    remarkLint,
    // Unix compatibility.
    remarkLintFinalNewline,
    // Rendering across vendors differs greatly if using other styles.
    remarkLintListItemBulletIndent,
    [remarkLintListItemIndent, 'tab-size'],
    remarkLintNoBlockquoteWithoutMarker,
    remarkLintNoLiteralUrls,
    [remarkLintOrderedListMarkerStyle, '.'],
    // Mistakes.
    remarkLintHardBreakSpaces,
    remarkLintNoDuplicateDefinitions,
    remarkLintNoHeadingContentIndent,
    remarkLintNoInlinePadding,
    remarkLintNoShortcutReferenceImage,
    remarkLintNoShortcutReferenceLink,
    remarkLintNoUndefinedReferences,
    remarkLintNoUnusedDefinitions
  ]
}

export default remarkPresetLintRecommended
