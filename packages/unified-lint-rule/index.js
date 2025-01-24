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
 * ### `Label`
 *
 * Severity label (TypeScript type);
 * `'off'`: `0`, `'on'` and `warn`: `1`, `'error'`: `2`.
 *
 * ###### Type
 *
 * ```ts
 * type Label = 'error' | 'on' | 'off' | 'warn'
 * ```
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
 * ### `Next`
 *
 * Callback passed to rules (TypeScript type).
 *
 * If the signature of a rule accepts a fourth argument,
 * the rule may perform asynchronous operations,
 * and must call it.
 *
 * ###### Parameters
 *
 * * `error` (`Error`, optional)
 *   — fatal error to stop linting
 *
 * ###### Returns
 *
 * Nothing (`undefined`).
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
 * * `options` (`unknown`, optional)
 *   — parameter
 *
 * ###### Returns
 *
 * Nothing (`Promise<undefined>` or `undefined`).
 *
 * ### `Severity`
 *
 * Severity number (TypeScript type);
 * `0`: `'off'`, `1`: `'on'` and `warn`, `2`: `'error'`.
 *
 * ###### Type
 *
 * ```ts
 * type Severity = 0 | 1 | 2
 * ```
 *
 * [api-label]: #label
 * [api-meta]: #meta
 * [api-next]: #next
 * [api-rule]: #rule
 * [api-severity]: #severity
 * [api-lint-rule]: #lintrulemeta-rule
 * [github-unist-node]: https://github.com/syntax-tree/unist#node
 * [github-unified-plugin]: https://github.com/unifiedjs/unified#plugin
 * [github-vfile]: https://github.com/vfile/vfile
 */

/**
 * @import {TransformCallback} from 'unified'
 * @import {Node} from 'unist'
 * @import {VFile} from 'vfile'
 */

// To do: define somewhere else.
/**
 * @typedef {import('./lib/index.js').Label} Label
 * @typedef {import('./lib/index.js').Meta} Meta
 * @typedef {import('./lib/index.js').Severity} Severity
 */

/**
 * @callback Next
 *   Callback passed to rules.
 *
 *   If the signature of a rule accepts a fourth argument,
 *   the rule may perform asynchronous operations,
 *   and must call it.
 * @param {Error | undefined} [error]
 *   Fatal error to stop linting (optional).
 * @returns {undefined}
 *   Nothing.
 */

/**
 * @template {Node} [Tree=Node]
 *   Node kind (optional).
 * @template {unknown} [Option=unknown]
 *   Parameter kind (optional).
 * @callback Rule
 *   Rule.
 * @param {Tree} tree
 *   Tree.
 * @param {VFile} file
 *   File.
 * @param {Option} option
 *   Parameter.
 * @param {Next} next
 *   Parameter.
 * @returns {Promise<undefined | void> | undefined | void}
 *   Nothing.
 */

/**
 * @template {Node} [Tree=Node]
 *   Node kind (optional).
 * @template {unknown} [Option=unknown]
 *   Parameter kind (optional).
 * @typedef {(config?: [level: Label | Severity | boolean, option?: Option] | Label | Option | Severity) => ((tree: Tree, file: VFile, next: TransformCallback<Tree>) => undefined) | undefined} Plugin
 */

export {lintRule} from './lib/index.js'
