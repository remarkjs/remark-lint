import remark = require('remark')
import remarkLint = require('remark-lint')
import remarkLintBlockquoteIndentation = require('remark-lint-blockquote-indentation')
import remarkLintCheckboxCharacterStyle = require('remark-lint-checkbox-character-style')
import remarkLintCheckboxContentIndent = require('remark-lint-checkbox-content-indent')

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
