/**
 * @import {ListItem, List, Root} from 'mdast'
 * @import {PackageJson} from 'type-fest'
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import structuredClone from '@ungap/structured-clone'
import {zone} from 'mdast-zone'
import {packagesUrl, presets} from '../info.js'

/**
 * @type {Array<ListItem>}
 *   List items.
 */
const items = await Promise.all(
  presets.map(async function (info) {
    const packageUrl = new URL(info.name + '/', packagesUrl)
    /** @type {PackageJson} */
    const pack = JSON.parse(
      await fs.readFile(new URL('package.json', packageUrl), 'utf8')
    )

    const description = String(pack.description || '').replace(
      /^remark preset to configure remark-lint with ?/i,
      ''
    )

    assert(typeof pack.repository === 'string')

    return {
      type: 'listItem',
      spread: false,
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'link',
              url: pack.repository,
              children: [{type: 'inlineCode', value: info.name}]
            },
            {type: 'text', value: ' — ' + description}
          ]
        }
      ]
    }
  })
)

/** @type {List} */
const list = {type: 'list', ordered: false, spread: false, children: items}

/**
 * List presets.
 *
 * @returns
 *   Transform.
 */
export default function remarkListOfPresets() {
  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    zone(tree, 'presets', function (start, _, end) {
      return [start, structuredClone(list), end]
    })
  }
}
