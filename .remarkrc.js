import remarkCommentConfig from 'remark-comment-config'
import remarkGfm from 'remark-gfm'
import remarkGithub from 'remark-github'
import remarkPresetLintConsistent from 'remark-preset-lint-consistent'
import remarkPresetLintRecommended from 'remark-preset-lint-recommended'
import remarkToc from 'remark-toc'
import remarkValidateLinks from 'remark-validate-links'
import remarkLintListItemIndent from 'remark-lint-list-item-indent'
import remarkLintFencedCodeFlag, {
  checkGithubLinguistFlag
} from 'remark-lint-fenced-code-flag'
import listOfPlugins from './script/plugin/list-of-plugins.js'
import listOfPresets from './script/plugin/list-of-presets.js'

export default {
  plugins: [
    remarkCommentConfig,
    [remarkGfm, {tablePipeAlign: false}],
    remarkGithub,
    remarkPresetLintConsistent,
    remarkPresetLintRecommended,
    [remarkLintFencedCodeFlag, checkGithubLinguistFlag],
    [remarkLintListItemIndent, 'one'],
    [remarkToc, {maxDepth: 3}],
    remarkValidateLinks,
    listOfPlugins,
    listOfPresets
  ]
}
