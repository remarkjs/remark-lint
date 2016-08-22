/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module remark:preset:lint-recommended
 * @fileoverview remark preset to configure remark-lint with
 *   settings that enforce consistency.
 */

'use strict';

module.exports.plugins = {
  lint: {
    blockquoteIndentation: 'consistent',
    checkboxCharacterStyle: 'consistent',
    codeBlockStyle: 'consistent',
    emphasisMarker: 'consistent',
    fencedCodeMarker: 'consistent',
    headingStyle: 'consistent',
    linkTitleStyle: 'consistent',
    listItemContentIndent: true,
    orderedListMarkerStyle: 'consistent',
    ruleStyle: 'consistent',
    strongMarker: 'consistent',
    tableCellPadding: 'consistent'
  }
};
