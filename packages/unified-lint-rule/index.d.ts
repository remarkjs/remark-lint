import type {Node} from 'unist'
import type {VFile} from 'vfile'
import type {Plugin} from 'unified'
import type {Label, Severity} from './lib/index.js'

export interface RuleMeta {
  /**
   * Name of the lint rule
   */
  origin: string

  /**
   * Link to documentation
   */
  url?: string | undefined
}

export function lintRule<Tree extends Node = Node, Settings = unknown>(
  name: string | RuleMeta,
  rule: Rule<Tree, Settings>
): Plugin<
  | void[]
  | [Settings | Label | Severity]
  | [boolean | Label | Severity, Settings],
  Tree
>

export type Rule<Tree extends Node = Node, Settings = unknown> = (
  node: Tree,
  file: VFile,
  settings: Settings
) => Promise<Tree | undefined | void> | Tree | undefined | void

export type {Severity, Label}
