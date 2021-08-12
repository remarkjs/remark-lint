import fs from 'node:fs'

/**
 * @param {string} filePath
 * @returns {string[]}
 */
export function rules(filePath) {
  return fs
    .readdirSync(filePath)
    .filter(
      (basename) => /remark-lint/.test(basename) && basename !== 'remark-lint'
    )
}
