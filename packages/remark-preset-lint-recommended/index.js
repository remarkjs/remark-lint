/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module remark:preset:lint-recommended
 * @fileoverview remark preset to configure remark-lint with
 *   settings that prevent mistakes or syntaxes that do not
 *   work correctly across vendors.
 */

'use strict';

module.exports.plugins = {
  lint: {
    /* Unix compatibility. */
    finalNewline: true,

    /* Rendering across vendors differs greatly
     * if using other styles. */
    listItemBulletIndent: true,
    listItemIndent: 'tab-size',

    /* Differs or unsupported across vendors. */
    noAutoLinkWithoutProtocol: true,
    noBlockquoteWithoutCaret: true,
    noLiteralUrls: true,
    orderedListMarkerStyle: '.',

    /* Mistakes. */
    hardBreakSpaces: true,
    noDuplicateDefinitions: true,
    noHeadingContentIndent: true,
    noInlinePadding: true,
    noShortcutReferenceImage: true,
    noShortcutReferenceLink: true,
    noUndefinedReferences: true,
    noUnusedDefinitions: true
  }
};
