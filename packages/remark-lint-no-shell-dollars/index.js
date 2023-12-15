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
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   ```bash
 *   echo a
 *   ```
 *
 *   ```sh
 *   echo a
 *   echo a > file
 *   ```
 *
 *   ```zsh
 *   $ echo a
 *   a
 *   $ echo a > file
 *   ```
 *
 *   Some empty code:
 *
 *   ```command
 *   ```
 *
 *   It’s fine to use dollars in non-shell code.
 *
 *   ```js
 *   $('div').remove()
 *   ```
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   ```sh
 *   $ echo a
 *   ```
 *
 *   ```bash
 *   $ echo a
 *   $ echo a > file
 *   ```
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-3:4: Do not use dollar signs before shell commands
 *   5:1-8:4: Do not use dollar signs before shell commands
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {collapseWhiteSpace} from 'collapse-white-space'
import {lintRule} from 'unified-lint-rule'
import {position} from 'unist-util-position'
import {visit} from 'unist-util-visit'

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
    visit(tree, 'code', function (node) {
      const place = position(node)

      // Check known shell code.
      if (place && node.lang && flags.has(node.lang)) {
        const lines = node.value.split('\n')
        let index = -1

        let hasLines = false

        while (++index < lines.length) {
          const line = collapseWhiteSpace(lines[index], {style: 'html'})

          if (!line) continue

          hasLines = true

          if (!/^\$/.test(line)) {
            return
          }
        }

        if (!hasLines) {
          return
        }

        file.message('Do not use dollar signs before shell commands', place)
      }
    })
  }
)

export default remarkLintNoShellDollars
