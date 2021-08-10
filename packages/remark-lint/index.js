import remarkMessageControl from 'remark-message-control'

// `remark-lint`.
// This adds support for ignoring stuff from messages (`<!--lint ignore-->`).
// All rules are in their own packages and presets.
export default function remarkLint() {
  this.use(lintMessageControl)
}

function lintMessageControl() {
  return remarkMessageControl({name: 'lint', source: 'remark-lint'})
}
