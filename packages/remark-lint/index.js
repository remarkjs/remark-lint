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
