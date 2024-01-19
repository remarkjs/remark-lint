/**
 * remark-lint rule to warn when URLs are also defined identifiers.
 *
 * ## What is this?
 *
 * This package checks for likely broken URLs that should probably have been
 * references.
 *
 * ## When should I use this?
 *
 * You can use this package to check links.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoReferenceLikeUrl)`
 *
 * Warn when URLs are also defined identifiers.
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
 * While full URLs for definition identifiers are okay
 * (`[https://example.com]: https://example.com`),
 * and what looks like an identifier could be an actual URL (`[text](alpha)`),
 * the more common case is that,
 * assuming a definition `[alpha]: https://example.com`,
 * then a link `[text](alpha)` should instead have been `[text][alpha]`.
 *
 * [api-remark-lint-no-reference-like-url]: #unifieduseremarklintnoreferencelikeurl
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-reference-like-url
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   [**Mercury**][mercury] is the first planet from the sun.
 *
 *   [mercury]: https://example.com/mercury/
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   [**Mercury**](mercury) is the first planet from the sun.
 *
 *   [mercury]: https://example.com/mercury/
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *   1:1-1:23: Unexpected resource link (`[text](url)`) with URL that matches a definition identifier (as `mercury`), expected reference (`[text][id]`)
 *
 * @example
 *   {"label": "input", "name": "image.md"}
 *
 *   ![**Mercury** is a planet](mercury).
 *
 *   [mercury]: https://example.com/mercury.jpg
 * @example
 *   {"label": "output", "name": "image.md"}
 *
 *   1:1-1:36: Unexpected resource image (`![text](url)`) with URL that matches a definition identifier (as `mercury`), expected reference (`![text][id]`)
 */

/**
 * @typedef {import('mdast').Nodes} Nodes
 * @typedef {import('mdast').Root} Root
 */

import {ok as assert} from 'devlop'
import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'
import {VFileMessage} from 'vfile-message'

const remarkLintNoReferenceLikeUrl = lintRule(
  {
    origin: 'remark-lint:no-reference-like-url',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-reference-like-url#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    /** @type {Map<string, Array<Nodes>>} */
    const definitions = new Map()
    /** @type {Array<Array<Nodes>>} */
    const references = []

    visitParents(tree, function (node, ancestors) {
      if (node.type === 'definition') {
        definitions.set(node.identifier.toLowerCase(), [...ancestors, node])
      } else if (node.type === 'image' || node.type === 'link') {
        references.push([...ancestors, node])
      }
    })

    for (const ancestors of references) {
      const node = ancestors.at(-1)
      assert(node) // Always defined.
      assert(node.type === 'image' || node.type === 'link') // Always media.
      const maybeIdentifier = node.url.toLowerCase()
      const definitionAncestors = definitions.get(maybeIdentifier)

      if (node.position && definitionAncestors) {
        const definition = definitionAncestors.at(-1)
        assert(definition) // Always defined.
        assert(definition.type === 'definition') // Always definition.
        const prefix = node.type === 'image' ? '!' : ''

        file.message(
          'Unexpected resource ' +
            node.type +
            ' (`' +
            prefix +
            '[text](url)`) with URL that matches a definition identifier (as `' +
            definition.identifier +
            '`), expected reference (`' +
            prefix +
            '[text][id]`)',
          {
            ancestors,
            cause: new VFileMessage('Definition defined here', {
              ancestors: definitionAncestors,
              place: definition.position,
              source: 'remark-lint',
              ruleId: 'no-reference-like-url'
            }),
            place: node.position
          }
        )
      }
    }
  }
)

export default remarkLintNoReferenceLikeUrl
