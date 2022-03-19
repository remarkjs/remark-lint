import path from 'node:path'
import process from 'node:process'
import {zone} from 'mdast-zone'
import {repoUrl} from '../util/repo-url.js'
import {rule} from '../util/rule.js'
import {rules} from '../util/rules.js'

const root = path.join(process.cwd(), 'packages')

/** @type {import('unified').Plugin<Array<void>, import('mdast').Root>} */
export default function listOfSettings() {
  const rows = rules(root).flatMap((basename) =>
    Array.from(
      new Set(
        Object.keys(rule(path.join(root, basename)).tests).flatMap(
          (configuration) => {
            /** @type {{settings: Record<string, unknown>}} */
            const {settings} = JSON.parse(configuration)
            return Object.keys(settings || {})
          }
        )
      ),
      (name) => [name, basename]
    )
  )
  rows.sort()
  /** @type {import('mdast').Table} */
  const table = {
    type: 'table',
    children: [
      {
        type: 'tableRow',
        children: [
          {type: 'tableCell', children: [{type: 'text', value: 'Setting'}]},
          {type: 'tableCell', children: [{type: 'text', value: 'Rule'}]}
        ]
      },
      .../** @type {Array<import('mdast').TableRow>} */ (
        rows.map(([name, basename]) => ({
          type: 'tableRow',
          children: [
            {
              type: 'tableCell',
              children: [
                {
                  type: 'link',
                  url: `https://github.com/remarkjs/remark/tree/main/packages/remark-stringify#options${name.toLowerCase()}`,
                  children: [{type: 'inlineCode', value: `settings.${name}`}]
                }
              ]
            },
            {
              type: 'tableCell',
              children: [
                {
                  type: 'link',
                  url: repoUrl(path.join(root, basename, 'package.json')),
                  children: [{type: 'inlineCode', value: basename}]
                }
              ]
            }
          ]
        }))
      )
    ]
  }

  return (tree) => {
    zone(tree, 'settings', (start, _, end) => [start, table, end])
  }
}
