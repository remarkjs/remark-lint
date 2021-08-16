import fs from 'node:fs'

/**
 * @typedef {import('type-fest').PackageJson} PackageJson
 */

/**
 * @param {string | PackageJson} pathOrJson
 * @returns {string}
 */
export function repoUrl(pathOrJson) {
  const pkg =
    typeof pathOrJson === 'string' ? readPackageJson(pathOrJson) : pathOrJson

  if (
    pkg.repository === undefined ||
    typeof pkg.repository !== 'object' ||
    typeof pkg.repository.url !== 'string'
  ) {
    throw new TypeError(
      `Expected \`string\` for \`repository.url\` in \`${pathOrJson}\``
    )
  }

  if (pkg.repository.directory) {
    return pkg.repository.url + `/tree/main/${pkg.repository.directory}`
  }

  return pkg.repository.url
}

/**
 * @param {string} filePath
 * @returns {PackageJson}
 */
function readPackageJson(filePath) {
  return JSON.parse(String(fs.readFileSync(filePath)))
}
