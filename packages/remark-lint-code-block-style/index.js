/**
 * ## When should I use this?
 *
 * You can use this package to check that code blocks are consistent.
 *
 * ## API
 *
 * The following options (default: [`settings.fences`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionsfences) or `'consistent'`) are accepted:
 *
 * *   `'fenced'`
 *     — prefer fenced code blocks:
 *     ````markdown
 *     ```js
 *     code()
 *     ```
 *     ````
 * *   `'indented'`
 *     — prefer indented code blocks:
 *     ```markdown
 *         code()
 *     ```
 * *   `'consistent'`
 *     — detect the first used style and warn when further code blocks differ
 *
 * ## Recommendation
 *
 * Indentation in markdown is complex, especially because lists and indented
 * code can interfere in unexpected ways.
 * Fenced code has more features than indented code: importantly, specifying a
 * programming language.
 * Since CommonMark took the idea of fenced code from GFM, fenced code became
 * widely supported.
 * Due to this, it’s recommended to configure this rule with `'fenced'`.
 *
 * ## Fix
 *
 * [`remark-stringify`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify)
 * formats code blocks as fenced code when they have a language flag and as
 * indented code otherwise.
 * Pass
 * [`fences: true`](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#optionsfences)
 * to always use fenced code.
 *
 * @module code-block-style
 * @summary
 *   remark-lint rule to warn when code blocks violate a given style.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"settings": {"fences": false}, "name": "ok.md"}
 *
 *       alpha()
 *
 *   Paragraph.
 *
 *       bravo()
 *
 * @example
 *   {"settings": {"fences": false}, "name": "not-ok.md", "label": "input"}
 *
 *   ```
 *   alpha()
 *   ```
 *
 *   Paragraph.
 *
 *   ```
 *   bravo()
 *   ```
 *
 * @example
 *   {"settings": {"fences": false}, "name": "not-ok.md", "label": "output"}
 *
 *   1:1-3:4: Code blocks should be indented
 *   7:1-9:4: Code blocks should be indented
 *
 * @example
 *   {"settings": {"fences": true}, "name": "ok.md"}
 *
 *   ```
 *   alpha()
 *   ```
 *
 *   Paragraph.
 *
 *   ```
 *   bravo()
 *   ```
 *
 * @example
 *   {"settings": {"fences": true}, "name": "not-ok-fenced.md", "label": "input"}
 *
 *       alpha()
 *
 *   Paragraph.
 *
 *       bravo()
 *
 * @example
 *   {"settings": {"fences": true}, "name": "not-ok-fenced.md", "label": "output"}
 *
 *   1:1-1:12: Code blocks should be fenced
 *   5:1-5:12: Code blocks should be fenced
 *
 * @example
 *   {"name": "not-ok-consistent.md", "label": "input"}
 *
 *       alpha()
 *
 *   Paragraph.
 *
 *   ```
 *   bravo()
 *   ```
 *
 * @example
 *   {"name": "not-ok-consistent.md", "label": "output"}
 *
 *   5:1-7:4: Code blocks should be indented
 *
 * @example
 *   {"config": "💩", "name": "not-ok-incorrect.md", "label": "output", "positionless": true}
 *
 *   1:1: Incorrect code block style `💩`: use either `'consistent'`, `'fenced'`, or `'indented'`
 */

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {'fenced'|'indented'} Style
 * @typedef {'consistent'|Style} Options
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'
import {generated} from 'unist-util-generated'

const remarkLintCodeBlockStyle = lintRule(
  {
    origin: 'remark-lint:code-block-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-code-block-style#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, Options>} */
  function (tree, file, option) {
    const value = String(file)

    if (!option) {
      const {settings} = this.data()
      option =
        !settings || settings.fences === undefined
          ? 'consistent'
          : settings.fences
          ? 'fenced'
          : 'indented'
    }

    if (
      option !== 'consistent' &&
      option !== 'fenced' &&
      option !== 'indented'
    ) {
      file.fail(
        'Incorrect code block style `' +
          option +
          "`: use either `'consistent'`, `'fenced'`, or `'indented'`"
      )
    }

    visit(tree, 'code', (node) => {
      if (generated(node)) {
        return
      }

      const initial = pointStart(node).offset
      const final = pointEnd(node).offset

      const current =
        node.lang || /^\s*([~`])\1{2,}/.test(value.slice(initial, final))
          ? 'fenced'
          : 'indented'

      if (option === 'consistent') {
        option = current
      } else if (option !== current) {
        file.message('Code blocks should be ' + option, node)
      }
    })
  }
)

export default remarkLintCodeBlockStyle
