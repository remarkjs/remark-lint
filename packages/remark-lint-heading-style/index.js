/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module heading-style
 * @fileoverview
 *   Warn when a heading does not conform to a given style.
 *
 *   Options: `'consistent'`, `'atx'`, `'atx-closed'`, or `'setext'`,
 *   default: `'consistent'`.
 *
 *   `'consistent'` detects the first used heading style and warns when
 *   subsequent headings use different styles.
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify)
 *   formats headings as ATX by default.
 *   This can be configured with the
 *   [`setext`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify#optionssetext)
 *   and
 *   [`closeAtx`](https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify#optionscloseatx)
 *   options.
 *
 *   See [Using remark to fix your Markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example {"name": "ok.md", "setting": "atx"}
 *
 *   # Alpha
 *
 *   ## Bravo
 *
 *   ### Charlie
 *
 * @example {"name": "ok.md", "setting": "atx-closed"}
 *
 *   # Delta ##
 *
 *   ## Echo ##
 *
 *   ### Foxtrot ###
 *
 * @example {"name": "ok.md", "setting": "setext"}
 *
 *   Golf
 *   ====
 *
 *   Hotel
 *   -----
 *
 *   ### India
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   Juliett
 *   =======
 *
 *   ## Kilo
 *
 *   ### Lima ###
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   4:1-4:8: Headings should use setext
 *   6:1-6:13: Headings should use setext
 */

import {lintRule} from 'unified-lint-rule'
import visit from 'unist-util-visit'
import headingStyle from 'mdast-util-heading-style'
import generated from 'unist-util-generated'

var types = ['atx', 'atx-closed', 'setext']

const remarkLintHeadingStyle = lintRule(
  'remark-lint:heading-style',
  function (tree, file, option) {
    var preferred = types.indexOf(option) === -1 ? null : option

    visit(tree, 'heading', visitor)

    function visitor(node) {
      if (!generated(node)) {
        if (preferred) {
          if (headingStyle(node, preferred) !== preferred) {
            file.message('Headings should use ' + preferred, node)
          }
        } else {
          preferred = headingStyle(node, preferred)
        }
      }
    }
  }
)

export default remarkLintHeadingStyle
