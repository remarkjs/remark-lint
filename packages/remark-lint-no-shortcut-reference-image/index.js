/**
 * ## When should I use this?
 *
 * You can use this package to check that collapsed or full reference images
 * are used.
 *
 * ## API
 *
 * There are no options.
 *
 * ## Recommendation
 *
 * Shortcut references use an implicit style that looks a lot like something
 * that could occur as plain text instead of syntax.
 * In some cases, plain text is intended instead of an image.
 * Due to this, it’s recommended to use collapsed (or full) references
 * instead.
 *
 * @module no-shortcut-reference-image
 * @summary
 *   remark-lint rule to warn when shortcut reference images are used.
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @example
 *   {"name": "ok.md"}
 *
 *   ![foo][]
 *
 *   [foo]: http://foo.bar/baz.png
 *
 * @example
 *   {"name": "not-ok.md", "label": "input"}
 *
 *   ![foo]
 *
 *   [foo]: http://foo.bar/baz.png
 *
 * @example
 *   {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:7: Use the trailing [] on reference images
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'
import {generated} from 'unist-util-generated'

const remarkLintNoShortcutReferenceImage = lintRule(
  {
    origin: 'remark-lint:no-shortcut-reference-image',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-shortcut-reference-image#readme'
  },
  /** @type {import('unified-lint-rule').Rule<Root, void>} */
  (tree, file) => {
    visit(tree, 'imageReference', (node) => {
      if (!generated(node) && node.referenceType === 'shortcut') {
        file.message('Use the trailing [] on reference images', node)
      }
    })
  }
)

export default remarkLintNoShortcutReferenceImage
