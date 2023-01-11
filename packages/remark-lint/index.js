/**
 * @typedef {import('mdast').Root} Root
 */

import remarkMessageControl from 'remark-message-control'

/**
 * The core plugin for `remark-lint`.
 * This adds support for ignoring stuff from messages (`<!--lint ignore-->`).
 * All rules are in their own packages and presets.
 *
 * @this {import('unified').Processor}
 * @type {import('unified').Plugin<Array<void>, Root>}
 */
export default function remarkLint() {
  this.use(lintMessageControl)
}

/** @type {import('unified').Plugin<Array<void>, Root>} */
function lintMessageControl() {
  return remarkMessageControl({name: 'lint', source: 'remark-lint'})
}
