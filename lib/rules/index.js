/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module Rules
 * @fileoverview Map of rule id’s to rules.
 */

'use strict';

/* eslint-env commonjs */

/*
 * Expose.
 */

module.exports = {
    'no-auto-link-without-protocol': require('./no-auto-link-without-protocol'),
    'no-literal-urls': require('./no-literal-urls'),
    'no-consecutive-blank-lines': require('./no-consecutive-blank-lines'),
    'no-missing-blank-lines': require('./no-missing-blank-lines'),
    'blockquote-indentation': require('./blockquote-indentation'),
    'no-blockquote-without-caret': require('./no-blockquote-without-caret'),
    'code-block-style': require('./code-block-style'),
    'checkbox-content-indent': require('./checkbox-content-indent'),
    'checkbox-character-style': require('./checkbox-character-style'),
    'definition-case': require('./definition-case'),
    'definition-spacing': require('./definition-spacing'),
    'no-emphasis-as-heading': require('./no-emphasis-as-heading'),
    'emphasis-marker': require('./emphasis-marker'),
    'fenced-code-flag': require('./fenced-code-flag'),
    'fenced-code-marker': require('./fenced-code-marker'),
    'file-extension': require('./file-extension'),
    'final-newline': require('./final-newline'),
    'no-file-name-articles': require('./no-file-name-articles'),
    'no-file-name-consecutive-dashes': require('./no-file-name-consecutive-dashes'),
    'no-file-name-irregular-characters': require('./no-file-name-irregular-characters'),
    'no-file-name-mixed-case': require('./no-file-name-mixed-case'),
    'no-file-name-outer-dashes': require('./no-file-name-outer-dashes'),
    'final-definition': require('./final-definition'),
    'hard-break-spaces': require('./hard-break-spaces'),
    'heading-increment': require('./heading-increment'),
    'no-heading-content-indent': require('./no-heading-content-indent'),
    'no-heading-indent': require('./no-heading-indent'),
    'first-heading-level': require('./first-heading-level'),
    'maximum-heading-length': require('./maximum-heading-length'),
    'no-heading-punctuation': require('./no-heading-punctuation'),
    'heading-style': require('./heading-style'),
    'no-multiple-toplevel-headings': require('./no-multiple-toplevel-headings'),
    'no-duplicate-headings': require('./no-duplicate-headings'),
    'no-duplicate-definitions': require('./no-duplicate-definitions'),
    'no-html': require('./no-html'),
    'no-inline-padding': require('./no-inline-padding'),
    'maximum-line-length': require('./maximum-line-length'),
    'link-title-style': require('./link-title-style'),
    'list-item-bullet-indent': require('./list-item-bullet-indent'),
    'list-item-content-indent': require('./list-item-content-indent'),
    'list-item-indent': require('./list-item-indent'),
    'list-item-spacing': require('./list-item-spacing'),
    'ordered-list-marker-style': require('./ordered-list-marker-style'),
    'ordered-list-marker-value': require('./ordered-list-marker-value'),
    'no-shortcut-reference-image': require('./no-shortcut-reference-image'),
    'no-shortcut-reference-link': require('./no-shortcut-reference-link'),
    'rule-style': require('./rule-style'),
    'no-shell-dollars': require('./no-shell-dollars'),
    'strong-marker': require('./strong-marker'),
    'no-table-indentation': require('./no-table-indentation'),
    'table-pipe-alignment': require('./table-pipe-alignment'),
    'table-cell-padding': require('./table-cell-padding'),
    'table-pipes': require('./table-pipes'),
    'no-tabs': require('./no-tabs'),
    'unordered-list-marker-style': require('./unordered-list-marker-style'),
    'no-undefined-references': require('./no-undefined-references.js'),
    'no-unused-definitions': require('./no-unused-definitions.js')
};
