import fs from 'fs'

export function rules(filePath) {
  return fs.readdirSync(filePath).filter(filter)
}

function filter(basename) {
  return /remark-lint/.test(basename) && basename !== 'remark-lint'
}
