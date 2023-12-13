import {relative} from 'node:path'
import {reporter} from 'vfile-reporter'
import {compareFile} from 'vfile-sort'
import {write} from 'to-vfile'
import {plugins, presets} from './info.js'
import {pipelinePackage} from './pipeline-package.js'

const results = await Promise.all(
  [...plugins, ...presets].map(function (d) {
    return pipelinePackage(d.name)
  })
)

const files = results.flat()

// Write files.
const writable = files.filter(function (d) {
  return d.data.changed
})

await Promise.all(
  writable.map(function (file) {
    file.stored = true
    return write(file)
  })
)

// Clean paths and report.
for (const file of files) {
  file.path = relative(file.cwd, file.path)
  file.history = [file.path]
}

files.sort(compareFile)

console.error(reporter(files))
