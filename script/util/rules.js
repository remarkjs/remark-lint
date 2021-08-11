import fs from 'fs'

export function rules(filePath) {
  return fs
    .readdirSync(filePath)
    .filter(
      (basename) => /remark-lint/.test(basename) && basename !== 'remark-lint'
    )
}
