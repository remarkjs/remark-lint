import remarkPresetLintRecommended from './packages/remark-preset-lint-recommended/index.js'
import remarkPresetLintConsistent from './packages/remark-preset-lint-consistent/index.js'
import remarkLintListItemIndent from './packages/remark-lint-list-item-indent/index.js'
import remarkToc from 'remark-toc'
import remarkCommentConfig from 'remark-comment-config'
import remarkGfm from 'remark-gfm'
import remarkGithub from 'remark-github'
import remarkValidateLinks from 'remark-validate-links'
import listOfPresets from './script/plugin/list-of-presets.js'
import listOfRules from './script/plugin/list-of-rules.js'

const plugins = [
  remarkPresetLintRecommended,
  remarkPresetLintConsistent,
  // To do: change.
  [remarkLintListItemIndent, 'tab-size'],
  [remarkToc, {tight: true, maxDepth: 3, heading: 'contents'}],
  remarkCommentConfig,
  [remarkGfm, {tablePipeAlign: false}],
  remarkGithub,
  remarkValidateLinks,
  listOfPresets,
  listOfRules
]

const preset = {
  plugins,
  // To do: change.
  settings: {listItemIndent: 'tab'}
}

export default preset
