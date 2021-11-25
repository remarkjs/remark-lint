/**
 * ## When should I use this?
 *
 * You can use this package to check that not all lines in shell code are
 * preceded by dollars (`$`).
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * Dollars make copy/pasting hard.
 * Either put both dollars in front of some lines (to indicate shell commands)
 * and don’t put them in front of other lines, or use fenced code to indicate
 * shell commands on their own, followed by another fenced code that contains
 * just the output.
 *
 * @module no-shell-dollars
 * @summary
 *   remark-lint rule to warn every line in shell code is preceded by `$`s.
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

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {generated} from 'unist-util-generated'

// List of shell script file extensions (also used as code flags for syntax
// highlighting on GitHub):
// See: <https://github.com/github/linguist/blob/40992ba/lib/linguist/languages.yml#L4984>
const flags = new Set([
  'sh',
  'bash',
  'bats',
  'cgi',
  'command',
  'fcgi',
  'ksh',
  'tmux',
  'tool',
  'zsh'
])

const remarkLintNoShellDollars = lintRule(
  {
    origin: 'remark-lint:no-shell-dollars',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-shell-dollars#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    visit(tree, 'code', (node) => {
      // Check both known shell code and unknown code.
      if (!generated(node) && node.lang && flags.has(node.lang)) {
        const lines = node.value
          .split('\n')
          .filter((line) => line.trim().length > 0)
        let index = -1

        if (lines.length === 0) {
          return
        }

        while (++index < lines.length) {
          const line = lines[index]

          if (line.trim() && !/^\s*\$\s*/.test(line)) {
            return
          }
        }

        file.message('Do not use dollar signs before shell commands', node)
      }
    })
  }
)

export default remarkLintNoShellDollars
