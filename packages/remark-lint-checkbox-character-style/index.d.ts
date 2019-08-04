// TypeScript Version: 3.4

declare namespace remarkLintCheckboxCharacterStyle {
  interface Style {
    checked?: string
    unchecked?: string
  }
  type Options = Style | 'consistent'
}

declare function remarkLintCheckboxCharacterStyle(
  option?: remarkLintCheckboxCharacterStyle.Options
): void

export = remarkLintCheckboxCharacterStyle
