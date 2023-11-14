/**
 * @typedef {import('mdast').List} List
 * @typedef {import('mdast').ListItem} ListItem
 * @typedef {import('mdast').Root} Root
 *
 * @typedef {import('type-fest').PackageJson} PackageJson
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import structuredClone from '@ungap/structured-clone'
import {zone} from 'mdast-zone'
import {packagesUrl, plugins} from '../info.js'

/**
 * @type {Array<ListItem | undefined>}
 *   List items.
 */
const items = await Promise.all(
  plugins.map(async function (info) {
    const packageUrl = new URL(info.name + '/', packagesUrl)
    /** @type {PackageJson} */
    const pack = JSON.parse(
      String(await fs.readFile(new URL('package.json', packageUrl)))
    )
    const description = String(pack.description || '').replace(
      /^remark-lint rule to ?/i,
      ''
    )

    if (/^deprecated/i.test(description)) return

    assert(pack.repository && typeof pack.repository === 'object')
    assert(pack.repository.directory)

    return {
      type: 'listItem',
      spread: false,
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'link',
              url:
                pack.repository.url + '/tree/main/' + pack.repository.directory,
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
const list = {
  type: 'list',
  ordered: false,
  spread: false,
  // @ts-expect-error: filter is correct.
  children: items.filter(Boolean)
}

/**
 * List rules.
 *
 * @returns
 *   Transform.
 */
export default function remarkListOfRules() {
  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    zone(tree, 'rules', function (start, _, end) {
      return [start, structuredClone(list), end]
    })
  }
}
