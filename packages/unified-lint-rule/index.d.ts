import type {Node} from 'unist'
import type {VFile} from 'vfile'
import type {Plugin} from 'unified'
import type {Label, Severity} from './lib/index.js'

export function lintRule<Tree extends Node = Node, Settings = unknown>(
  name: string,
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
