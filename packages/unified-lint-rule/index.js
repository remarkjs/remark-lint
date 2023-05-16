/**
 * @typedef {import('unist').Node} Node
 */

/**
 * @typedef {import('./lib/index.js').RuleMeta} RuleMeta
 */

/**
 * @template {Node} [Tree=Node]
 * @template {any} [Options=unknown]
 * @typedef {import('./lib/index.js').Rule<Tree, Options>} Rule
 */

export {lintRule} from './lib/index.js'
