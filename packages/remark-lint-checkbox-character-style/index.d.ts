// TypeScript Version: 3.4

import {Transformer} from 'unified'

declare namespace remarkLintCheckboxCharacterStyle {
  interface Style {
    checked?: string
    unchecked?: string
  }
  type Options = Style | 'consistent'
}

declare function remarkLintCheckboxCharacterStyle(
  option?: remarkLintCheckboxCharacterStyle.Options
): Transformer

export = remarkLintCheckboxCharacterStyle
