/**
 * unified helper to help make lint rules.
 *
 * ## What is this?
 *
 * This package is a helper that makes it a bit easier to create linting rules.
 *
 * ## When should I use this?
 *
 * You can use this package when you want to make custom lint rules.
 *
 * ## Use
 *
 * ```js
 * import {lintRule} from 'unified-lint-rule'
 *
 * const remarkLintFileExtension = lintRule(
 *   'remark-lint:file-extension',
 *   function (tree, file, options) {
 *     const ext = file.extname
 *     const option = options || 'md'
 *
 *     if (ext && ext.slice(1) !== option) {
 *       file.message('Incorrect extension: use `' + option + '`')
 *     }
 *   }
 * )
 *
 * export default remarkLintFileExtension
 * ```
 *
 * ## API
 *
 * ### `lintRule(meta, rule)`
 *
 * Create a plugin.
 *
 * ###### Parameters
 *
 * * `meta` ([`Meta`][api-meta] or `string`)
 *   — info or origin
 * * `rule` ([`Rule`][api-rule])
 *   — rule
 *
 * ###### Returns
 *
 * Plugin ([`Plugin` from `unified`][github-unified-plugin]).
 *
 * ### `Meta`
 *
 * Rule metadata (TypeScript type).
 *
 * ###### Fields
 *
 * * `origin` (`string`)
 *   — name of the lint rule
 * * `url` (`string`, optional)
 *   — link to documentation
 *
 * ### `Rule`
 *
 * Rule (TypeScript type).
 *
 * ###### Parameters
 *
 * * `tree` ([`Node` from `unist`][github-unist-node])
 *   — tree
 * * `file` ([`VFile`][github-vfile])
 *   — file
 * * `options` (`any`, optional)
 *   — parameter
 *
 * ###### Returns
 *
 * Nothing (`Promise<undefined>` or `undefined`).
 *
 * ### `RuleMeta`
 *
 * Deprecated.
 *
 * <!-- To do: remove. -->
 *
 * [api-meta]: #meta
 * [api-rule]: #rule
 * [api-rule-meta]: #rulemeta
 * [api-lint-rule]: #lintrulemeta-rule
 * [github-unist-node]: https://github.com/syntax-tree/unist#node
 * [github-unified-plugin]: https://github.com/unifiedjs/unified#plugin
 * [github-vfile]: https://github.com/vfile/vfile
 */

/**
 * @typedef {import('unist').Node} Node
 */

/**
 * @typedef {import('./lib/index.js').Meta} RuleMeta
 *   To do: deprecate.
 *
 * @typedef {import('./lib/index.js').Meta} Meta
 */

/**
 * @template {Node} [Tree=Node]
 * @template {any} [Options=unknown]
 * @typedef {import('./lib/index.js').Rule<Tree, Options>} Rule
 */

export {lintRule} from './lib/index.js'
