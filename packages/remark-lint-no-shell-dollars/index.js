/**
 * remark-lint rule to warn when every line in shell code is preceded by `$`s.
 *
 * ## What is this?
 *
 * This package checks for `$` markers prefixing shell code,
 * which are hard to copy/paste.
 *
 * ## When should I use this?
 *
 * You can use this package to check shell code blocks.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoShellDollars)`
 *
 * Warn when every line in shell code is preceded by `$`s.
 *
 * ###### Parameters
 *
 * There are no options.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ## Recommendation
 *
 * Dollars make copy/pasting hard.
 * Either put dollars in front of some lines (commands) and don’t put them in
 * front of other lines (output),
 * or use different code blocks for commands and output.
 *
 * [api-remark-lint-no-shell-dollars]: #unifieduseremarklintnoshelldollars
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-shell-dollars
 * @author Titus Wormer
 * @copyright Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   ```bash
 *   echo "Mercury and Venus"
 *   ```
 *
 *   ```sh
 *   echo "Mercury and Venus"
 *   echo "Earth and Mars" > file
 *   ```
 *
 *   Mixed dollars for input lines and without for output is also OK:
 *
 *   ```zsh
 *   $ echo "Mercury and Venus"
 *   Mercury and Venus
 *   $ echo "Earth and Mars" > file
 *   ```
 *
 *   ```command
 *   ```
 *
 *   ```js
 *   $('div').remove()
 *   ```
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   ```sh
 *   $ echo "Mercury and Venus"
 *   ```
 *
 *   ```bash
 *   $ echo "Mercury and Venus"
 *   $ echo "Earth and Mars" > file
 *   ```
 *
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:1-3:4: Unexpected shell code with every line prefixed by `$`, expected different code for input and output
 *   5:1-8:4: Unexpected shell code with every line prefixed by `$`, expected different code for input and output
 */

/**
 * @import {Root} from 'mdast'
 */

import {collapseWhiteSpace} from 'collapse-white-space'
import {phrasing} from 'mdast-util-phrasing'
import {lintRule} from 'unified-lint-rule'
import {SKIP, visitParents} from 'unist-util-visit-parents'

// See: <https://github.com/wooorm/starry-night/blob/a3e35db/lang/source.shell.js#L8>
const flags = new Set([
  // Extensions.
  'bash',
  'bats',
  'command',
  'csh',
  'ebuild',
  'eclass',
  'ksh',
  'sh',
  'sh.in',
  'tcsh',
  'tmux',
  'tool',
  'zsh',
  'zsh-theme',
  // Names (w/o extensions).
  'abuild',
  'alpine-abuild',
  'apkbuild',
  'gentoo-ebuild',
  'gentoo-eclass',
  'openrc',
  'openrc-runscript',
  'shell',
  'shell-script'
])

const remarkLintNoShellDollars = lintRule(
  {
    origin: 'remark-lint:no-shell-dollars',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-shell-dollars#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    visitParents(tree, function (node, parents) {
      // Do not walk into phrasing.
      if (phrasing(node)) {
        return SKIP
      }

      if (
        node.type === 'code' &&
        node.position &&
        // Check known shell code.
        node.lang &&
        flags.has(node.lang)
      ) {
        const lines = node.value.split('\n')
        let index = -1

        let some = false

        while (++index < lines.length) {
          const line = collapseWhiteSpace(lines[index], {
            style: 'html',
            trim: true
          })

          if (!line) continue

          // Unprefixed line is fine.
          if (line.charCodeAt(0) !== 36 /* `$` */) return

          some = true
        }

        if (!some) return

        file.message(
          'Unexpected shell code with every line prefixed by `$`, expected different code for input and output',
          {ancestors: [...parents, node], place: node.position}
        )
      }
    })
  }
)

export default remarkLintNoShellDollars
