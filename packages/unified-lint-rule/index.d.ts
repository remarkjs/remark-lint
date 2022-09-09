import type {Node} from 'unist'
import type {VFile} from 'vfile'
import type {Plugin} from 'unified'
import type {Label, Severity} from './lib/index.js'

export type RuleMeta = {
  /**
   * Name of the lint rule
   */
  origin: string

  /**
   * Link to documentation
   */
  url?: string | undefined
}

export function lintRule<Tree extends Node = Node, Options = unknown>(
  name: string | RuleMeta,
  rule: Rule<Tree, Options>
): Plugin<
  void[] | [Options | [boolean | Label | Severity, (Options | undefined)?]],
  Tree
>

export type Rule<Tree extends Node = Node, Options = unknown> = (
  node: Tree,
  file: VFile,
  options: Options
) => Promise<Tree | undefined | void> | Tree | undefined | void

export type {Severity, Label} from './lib/index.js'
