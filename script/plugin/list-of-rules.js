/**
 * @typedef {import('type-fest').PackageJson} PackageJson
 * @typedef {import('mdast').ListItem} ListItem
 * @typedef {import('mdast').List} List
 * @typedef {import('mdast').Root} Root
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import {zone} from 'mdast-zone'
import {rules} from '../util/rules.js'
import {repoUrl} from '../util/repo-url.js'

const root = path.join(process.cwd(), 'packages')

/** @type {import('unified').Plugin<Array<void>, Root>} */
export default function listOfRules() {
  return (tree) => {
    zone(tree, 'rules', (start, _, end) => {
      /** @type {List} */
      const list = {
        type: 'list',
        ordered: false,
        spread: false,
        children: rules(root)
          .map((basename) => {
            const name = basename.slice('remark-lint-'.length)
            /** @type {PackageJson} */
            const pack = JSON.parse(
              String(fs.readFileSync(path.join(root, basename, 'package.json')))
            )
            const description = String(pack.description || '').replace(
              /^remark-lint rule to ?/i,
              ''
            )
            const deprecated = /^deprecated/i.test(description)

            /** @type {ListItem} */
            const item = {
              type: 'listItem',
              spread: false,
              children: deprecated
                ? []
                : [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'link',
                          url: repoUrl(pack),
                          children: [{type: 'inlineCode', value: name}]
                        },
                        {type: 'text', value: ' — ' + description}
                      ]
                    }
                  ]
            }

            return item
          })
          .filter((d) => d.children.length > 0)
      }

      return [start, list, end]
    })
  }
}
