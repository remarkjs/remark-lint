/**
 * @import {Grammar} from '@wooorm/starry-night'
 */

/**
 * @typedef Info
 * @property {Array<string> | undefined} extensionsWithDot
 * @property {Array<string> | undefined} extensions
 * @property {Array<string>} names
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'

const languages = new URL(
  '../node_modules/@wooorm/starry-night/lang',
  import.meta.url
)

const basenames = await fs.readdir(languages)
/** @type {Array<Info>} */
const results = []

for (const basename of basenames) {
  const extname = path.extname(basename)
  const name = path.basename(basename, extname)

  if (
    // Dotfile.
    !name ||
    // Source map.
    extname === '.map' ||
    // Types.
    extname === '.ts'
  ) {
    continue
  }

  assert(extname === '.js') // Should be a JS file.

  /** @type {{default: Grammar}} */
  const module = await import('@wooorm/starry-night/' + name)
  const grammar = module.default
  const {extensions, extensionsWithDot, names} = grammar

  // Ignore if these scopes can only be used from other grammars.
  if (names.length === 0) {
    // Currently, nameless grammars are also w/o extensions.
    assert.equal(extensions.length, 0)
    assert(!extensionsWithDot)
    continue
  }

  results.push({
    extensionsWithDot,
    extensions: extensions.length === 0 ? undefined : extensions,
    names
  })
}

await fs.writeFile(
  new URL(
    '../packages/remark-lint-fenced-code-flag/github-linguist-info.js',
    import.meta.url
  ),
  [
    '/**',
    ' * @typedef Info',
    ' * @property {Array<string>} [extensionsWithDot]',
    ' * @property {Array<string>} [extensions]',
    ' * @property {Array<string>} names',
    ' */',
    '',
    '/** @type {Array<Info>} */',
    'export const githubLinguistInfo = ' +
      JSON.stringify(results, undefined, 2),
    ''
  ].join('\n')
)
