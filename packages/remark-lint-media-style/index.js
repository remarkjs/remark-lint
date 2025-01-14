/**
 * remark-lint rule to warn when the style of specifying
 * the URL of images and links is incorrect.
 *
 * ## What is this?
 *
 * This package checks for media (image and link) style:
 * whether references or resources are used.
 *
 * ## When should I use this?
 *
 * You can use this package to check that the style of specifying the URL
 * of images and links is correct.
 *
 * ## API
 *
 * ### `unified().use(remarkLintMediaStyle[, options])`
 *
 * Warn when the style of specifying the URL of images and links is
 * incorrect.
 *
 * ###### Parameters
 *
 * * `options` ([`Options`][api-options], default: `'consistent'`)
 *   — preferred style or whether to detect the first style and warn for
 *   further differences
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * * `'consistent'`
 *   — detect the first used style and warn when further rules differ;
 *   “reference-reuse” cannot be detected
 * * [`Style`][api-style]
 *   — style to prefer
 *
 * ### `Style`
 *
 * Style (TypeScript type).
 *
 * * `'reference'`
 *   — prefer references
 * * `'reference-reuse'`
 *   — allow resources when used once,
 *   prefer references otherwise
 * * `'resource'`
 *   — prefer resources
 *
 * [api-options]: #options
 * [api-remark-lint-media-style]: #unifieduseremarklintmediastyle-options
 * [api-style]: #style
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module media-style
 * @author Titus Wormer
 * @copyright 2025 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok-consistent-reference.md"}
 *
 *   [Mercury][] and [Venus][].
 *
 *   [mercury]: https://example.com/mercury/
 *   [venus]: https://example.com/venus/
 *
 * @example
 *   {"name": "ok-consistent-resource.md"}
 *
 *   [Mercury](https://example.com/mercury/) and
 *   [Venus](https://example.com/venus/).
 *
 * @example
 *   {"config": "reference-reuse", "name": "ok-reference-reuse.md"}
 *
 *   [Mercury](https://example.com/mercury/),
 *   [Venus][], and [Earth][].
 *
 *   **[Venus][]** is the second planet from the Sun.
 *
 *   [venus]: https://example.com/venus/
 *   [earth]: https://example.com/earth/
 *
 * @example
 *   {"config": "reference", "label": "input", "name": "nok-reference.md"}
 *
 *   [Mercury](https://example.com/mercury/),
 *   [Venus](https://example.com/venus/), and
 *   [Earth][].
 *
 *   [earth]: https://example.com/earth/
 * @example
 *   {"config": "reference", "label": "output", "name": "nok-reference.md"}
 *
 *   1:1-1:40: Unexpected resource for url `https://example.com/mercury/`, expected a definition and a reference to it
 *   2:1-2:36: Unexpected resource for url `https://example.com/venus/`, expected a definition and a reference to it
 *
 * @example
 *   {"config": "resource", "label": "input", "name": "nok-resource.md"}
 *
 *   [Mercury](https://example.com/mercury/),
 *   [Venus](https://example.com/venus/), and
 *   [Earth][].
 *
 *   [earth]: https://example.com/earth/
 * @example
 *   {"config": "resource", "label": "output", "name": "nok-resource.md"}
 *
 *   3:1-3:10: Unexpected reference for url `https://example.com/earth/`, expected resource
 *
 * @example
 *   {"config": "reference-reuse", "label": "input", "name": "nok-reference-reuse.md"}
 *
 *   [Mercury](https://example.com/mercury/),
 *   [Venus](https://example.com/venus/), and [Earth][].
 *
 *   **[Venus](https://example.com/venus/)** is the second planet from the Sun.
 *
 *   [earth]: https://example.com/earth/
 * @example
 *   {"config": "reference-reuse", "label": "output", "name": "nok-reference-reuse.md"}
 *
 *   2:1-2:36: Unexpected resource for reused url `https://example.com/venus/`, expected a definition and a reference to it
 *   4:3-4:38: Unexpected resource for reused url `https://example.com/venus/`, expected a definition and a reference to it
 *
 * @example
 *   {"config": "reference-reuse", "label": "input", "name": "reference-reuse-defined.md"}
 *
 *   [Mercury](https://example.com/mercury/).
 *
 *   [mercury]: https://example.com/mercury/
 * @example
 *   {"config": "reference-reuse", "label": "output", "name": "reference-reuse-defined.md"}
 *
 *   1:1-1:40: Unexpected resource for reused url `https://example.com/mercury/`, expected a reference to `mercury`
 *
 * @example
 *   {"config": "🌍", "label": "output", "name": "not-ok.md", "positionless": true}
 *
 *   1:1: Unexpected value `🌍` for `options`, expected `'reference-reuse'`, `'reference'`, `'resource'`, or `'consistent'`
 *
 * @example
 *   {"name": "definitions.md"}
 *
 *   [mercury]: https://example.com/mercury/
 *   [venus]: https://example.com/venus/
 */

/**
 * @import {ImageReference, Image, LinkReference, Link, Nodes, Parents, Reference, Resource, Root} from 'mdast'
 */

/**
 * @typedef {Style | 'consistent'} Options
 *   Configuration.
 *
 * @typedef {'reference-reuse' | 'reference' | 'resource'} Style
 *   Style.
 */

import {lintRule} from 'unified-lint-rule'
import {visitParents} from 'unist-util-visit-parents'

const remarkLintMediaStyle = lintRule(
  {
    origin: 'remark-lint:media-style',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-media-style#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @param {Options | null | undefined} [options='consistent']
   *   Configuration (default: `'consistent'`).
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file, options) {
    /** @type {Style | undefined} */
    let expected

    if (
      options === 'reference-reuse' ||
      options === 'reference' ||
      options === 'resource'
    ) {
      expected = options
    } else if (
      options === 'consistent' ||
      options === null ||
      options === undefined
    ) {
      // Empty
    } else {
      file.fail(
        'Unexpected value `' +
          options +
          "` for `options`, expected `'reference-reuse'`, `'reference'`, `'resource'`, or `'consistent'`"
      )
    }

    /** @type {Map<string, Array<[node: Extract<Nodes, Reference>, parents: Array<Parents>]>>} */
    const references = new Map()
    /** @type {Map<string, Array<[node: Extract<Nodes, Resource>, parents: Array<Parents>]>>} */
    const resources = new Map()

    visitParents(tree, function (node, parents) {
      if ('url' in node) {
        if (!expected && node.type !== 'definition') expected = 'resource'
        const current = resources.get(node.url)
        if (current) {
          current.push([node, parents])
        } else {
          resources.set(node.url, [[node, parents]])
        }
      }

      if ('referenceType' in node) {
        if (!expected) expected = 'reference'
        const current = references.get(node.identifier)
        if (current) {
          current.push([node, parents])
        } else {
          references.set(node.identifier, [[node, parents]])
        }
      }
    })

    // No media found.
    if (!expected) return

    for (const [url, nodes] of resources.entries()) {
      /** @type {Array<[node: Extract<Nodes, Reference>, parents: Array<Parents>]>} */
      const reference = []
      /** @type {Array<[node: Image | Link, parents: Array<Parents>]>} */
      const resource = []
      /** @type {string | undefined} */
      let identifier

      for (const [node, parents] of nodes) {
        if (node.position) {
          if (node.type === 'definition') {
            identifier = node.identifier
            const results = references.get(identifier)
            if (results) reference.push(...results)
          } else {
            resource.push([node, parents])
          }
        }
      }

      /** @type {Array<[node: ImageReference | Image | LinkReference | Link, parents: Array<Parents>]>} */
      const problems = []

      if (expected === 'reference') {
        problems.push(...resource)
      } else if (expected === 'reference-reuse') {
        // If there is a definition,
        // there should not be *any* resource to that same url.
        if (resource.length > 1 || identifier) {
          problems.push(...resource)
        }
      } else {
        problems.push(...reference)
      }

      for (const [node, parents] of problems) {
        file.message(
          'Unexpected ' +
            ('url' in node ? 'resource' : 'reference') +
            ' for' +
            (expected === 'reference-reuse' ? ' reused' : '') +
            ' url `' +
            url +
            '`' +
            ', expected ' +
            (expected === 'reference-reuse' || expected === 'reference'
              ? identifier
                ? 'a reference to `' + identifier + '`'
                : 'a definition and a reference to it'
              : expected),
          {ancestors: [...parents, node], place: node.position}
        )
      }
    }
  }
)

export default remarkLintMediaStyle
