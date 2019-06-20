/**
 * @fileoverview
 *   remark preset to configure `remark-lint` with settings that enforce
 *   consistency.
 */

'use strict'

module.exports.plugins = [
  require('remark-lint'),
  [require('remark-lint-blockquote-indentation'), 'consistent'],
  [require('remark-lint-checkbox-character-style'), 'consistent'],
  [require('remark-lint-code-block-style'), 'consistent'],
  [require('remark-lint-emphasis-marker'), 'consistent'],
  [require('remark-lint-fenced-code-marker'), 'consistent'],
  [require('remark-lint-heading-style'), 'consistent'],
  [require('remark-lint-link-title-style'), 'consistent'],
  require('remark-lint-list-item-content-indent'),
  [require('remark-lint-ordered-list-marker-style'), 'consistent'],
  [require('remark-lint-rule-style'), 'consistent'],
  [require('remark-lint-strong-marker'), 'consistent'],
  [require('remark-lint-table-cell-padding'), 'consistent']
]
