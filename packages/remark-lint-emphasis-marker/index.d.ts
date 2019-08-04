// TypeScript Version: 3.4

import {Transformer} from 'unified'

declare namespace remarkLintEmphasisMarker {
  type Options = 'consistent' | '*' | '_'
}

declare function remarkLintEmphasisMarker(
  options?: remarkLintEmphasisMarker.Options
): Transformer

export = remarkLintEmphasisMarker
