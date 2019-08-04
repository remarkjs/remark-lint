// TypeScript Version: 3.4

import {Transformer} from 'unified'

declare namespace remarkLintFencedCodeFlag {
  type AllowedFlags = string[]
  interface Options {
    allowEmpty?: boolean
    flags?: AllowedFlags
  }
}

declare function remarkLintFencedCodeFlag(
  options?:
    | remarkLintFencedCodeFlag.Options
    | remarkLintFencedCodeFlag.AllowedFlags
): Transformer

export = remarkLintFencedCodeFlag
