/**
 * remark plugin to support configuration comments for
 * remark-lint rules.
 *
 * ## What is this?
 *
 * This plugin adds support for configuration comments to control remark lint
 * rule messages.
 *
 * ## When should I use this?
 *
 * This project is useful when you’re using remark lint rules and want to let
 * authors ignore messages in certain cases.
 * This package is already included in all our presets.
 * If you’re building a preset yourself, you should include this package.
 *
 * ## API
 *
 * ### `unified().use(remarkLint)`
 *
 * Add support for configuration comments.
 *
 * See [Ignore warnings][mono-ignore] in the monorepo readme for how to use it.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * [api-remark-lint]: #unifieduseremarklint
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 * [mono-ignore]: https://github.com/remarkjs/remark-lint#ignore-warnings
 */

import remarkMessageControl from 'remark-message-control'

/**
 * The core plugin for `remark-lint`.
 *
 * This adds support for ignoring stuff from messages (`<!--lint ignore-->`).
 * All rules are in their own packages and presets.
 *
 * @this {import('unified').Processor}
 */
export default function remarkLint() {
  this.use(lintMessageControl)
}

/**
 * @returns
 *   Transform.
 */
function lintMessageControl() {
  return remarkMessageControl({name: 'lint', source: 'remark-lint'})
}
