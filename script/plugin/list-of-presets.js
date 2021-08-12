/**
 * @typedef {import('type-fest').PackageJson} PackageJson
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').List} List
 * @typedef {import('mdast').ListItem} ListItem
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import {zone} from 'mdast-zone'
import {presets} from '../util/presets.js'

const root = path.join(process.cwd(), 'packages')

/** @type {import('unified').Plugin<void[], Root>} */
export default function listOfPresets() {
  const presetPromise = presets(root)

  return async (tree) => {
    const presetObjects = await presetPromise

    zone(tree, 'presets', (start, _, end) => {
      /** @type {List} */
      const list = {
        type: 'list',
        ordered: false,
        spread: false,
        children: presetObjects.map(({name}) => {
          /** @type {PackageJson} */
          const pack = JSON.parse(
            String(fs.readFileSync(path.join(root, name, 'package.json')))
          )
          const description = String(pack.description || '').replace(
            /^remark preset to configure remark-lint with ?/i,
            ''
          )

          /** @type {ListItem} */
          const item = {
            type: 'listItem',
            spread: false,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'link',
                    url: String(pack.repository || ''),
                    children: [{type: 'inlineCode', value: name}]
                  },
                  {type: 'text', value: ' — ' + description}
                ]
              }
            ]
          }

          return item
        })
      }

      return [start, list, end]
    })
  }
}
