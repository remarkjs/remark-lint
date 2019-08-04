// TypeScript Version: 3.4

import {Transformer} from 'unified'

declare namespace remarkLintCodeBlockStyle {
  type Options = 'consistent' | 'fenced' | 'indented'
}

declare function remarkLintCodeBlockStyle(
  options?: remarkLintCodeBlockStyle.Options
): Transformer

export = remarkLintCodeBlockStyle
