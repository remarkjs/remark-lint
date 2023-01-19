import remarkPresetLintRecommended from './packages/remark-preset-lint-recommended/index.js'
import remarkPresetLintConsistent from './packages/remark-preset-lint-consistent/index.js'
import remarkToc from 'remark-toc'
import remarkCommentConfig from 'remark-comment-config'
import remarkGfm from 'remark-gfm'
import remarkGithub from 'remark-github'
import remarkValidateLinks from 'remark-validate-links'
import listOfPresets from './script/plugin/list-of-presets.js'
import listOfRules from './script/plugin/list-of-rules.js'
import listOfSettings from './script/plugin/list-of-settings.js'

const plugins = [
  remarkPresetLintRecommended,
  remarkPresetLintConsistent,
  [remarkToc, {tight: true, maxDepth: 3, heading: 'contents'}],
  remarkCommentConfig,
  [remarkGfm, {tablePipeAlign: false}],
  remarkGithub,
  remarkValidateLinks,
  listOfPresets,
  listOfRules,
  listOfSettings
]

const preset = {plugins}

export default preset
