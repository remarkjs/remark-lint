// TypeScript Version: 3.4

declare namespace remarkLintBlockquoteIndentation {
  type Options = 'consistent' | number
}

declare function remarkLintBlockquoteIndentation(
  options?: remarkLintBlockquoteIndentation.Options
): void

export = remarkLintBlockquoteIndentation
