import {Plugin, Settings} from 'unified'
import {Node} from 'unist'
import {VFile} from 'vfile'

declare namespace unifiedLintRule {
  /**
   * Lint rule
   *
   * @param tree AST to check
   * @param file file associated with tree, use `file.message` to report issues
   * @param preferences Settings for lint rule
   * @typeParam S type of preferences
   */
  type Linter<S> = (tree: Node, file: VFile, preferences?: S) => void
}

/**
 * Takes in a lint rule name and a lint rule, returns a unified plugin
 *
 * @param name Name of lint rule
 * @param rule Lint rule
 * @typeParam S Type of linter preferences
 * @returns Unified plugin that applies lint rule
 */
declare function unifiedLintRule<S>(
  name: string,
  rule: unifiedLintRule.Linter<S>
): Plugin<[S?], any>

export = unifiedLintRule
