import remark = require('remark')
import remarkLint = require('remark-lint')
import remarkLintBlockquoteIndentation = require('remark-lint-blockquote-indentation')
import remarkLintCheckboxCharacterStyle = require('remark-lint-checkbox-character-style')
import remarkLintCheckboxContentIndent = require('remark-lint-checkbox-content-indent')
import remarkLintCodeBlockStyle = require('remark-lint-code-block-style')
import remarkLintDefinitionCase = require('remark-lint-definition-case')
import remarkLintDefinitionSpacing = require('remark-lint-definition-spacing')
import remarkLintEmphasisMarker = require('remark-lint-emphasis-marker')
import remarkLintFencedCodeFlag = require('remark-lint-fenced-code-flag')

remark()
  .use(remarkLint)
  // $ExpectError
  .use(remarkLint, 'dne')

remark()
  .use(remarkLintBlockquoteIndentation)
  .use(remarkLintBlockquoteIndentation, 'consistent')
  .use(remarkLintBlockquoteIndentation, 2)
  // $ExpectError
  .use(remarkLintBlockquoteIndentation, 'dne')

remark()
  .use(remarkLintCheckboxCharacterStyle)
  .use(remarkLintCheckboxCharacterStyle, 'consistent')
  .use(remarkLintCheckboxCharacterStyle, {checked: 'X', unchecked: ' '})
  .use(remarkLintCheckboxCharacterStyle, {unchecked: ' '})
  .use(remarkLintCheckboxCharacterStyle, {checked: 'X'})
  // $ExpectError
  .use(remarkLintCheckboxCharacterStyle, 'dne')

remark()
  .use(remarkLintCheckboxContentIndent)
  // $ExpectError
  .use(remarkLintCheckboxContentIndent, 'dne')

remark()
  .use(remarkLintCodeBlockStyle)
  .use(remarkLintCodeBlockStyle, 'consistent')
  .use(remarkLintCodeBlockStyle, 'fenced')
  .use(remarkLintCodeBlockStyle, 'indented')
  // $ExpectError
  .use(remarkLintCodeBlockStyle, 'dne')

remark()
  .use(remarkLintDefinitionCase)
  // $ExpectError
  .use(remarkLintDefinitionCase, 'dne')

remark()
  .use(remarkLintDefinitionSpacing)
  // $ExpectError
  .use(remarkLintDefinitionSpacing, 'dne')

remark()
  .use(remarkLintEmphasisMarker)
  .use(remarkLintEmphasisMarker, 'consistent')
  .use(remarkLintEmphasisMarker, '*')
  .use(remarkLintEmphasisMarker, '_')
  // $ExpectError
  .use(remarkLintEmphasisMarker, 'dne')

remark()
  .use(remarkLintFencedCodeFlag)
  .use(remarkLintFencedCodeFlag, ['bravo'])
  .use(remarkLintFencedCodeFlag, {allowEmpty: true})
  .use(remarkLintFencedCodeFlag, {allowEmpty: false})
  .use(remarkLintFencedCodeFlag, {allowEmpty: true, flags: ['bravo']})
  .use(remarkLintFencedCodeFlag, {allowEmpty: false, flags: ['bravo']})
  // $ExpectError
  .use(remarkLintFencedCodeFlag, 'dne')
