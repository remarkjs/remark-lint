import remarkCommentConfig from 'remark-comment-config'
import remarkGfm from 'remark-gfm'
import remarkGithub from 'remark-github'
import remarkPresetLintConsistent from 'remark-preset-lint-consistent'
import remarkPresetLintRecommended from 'remark-preset-lint-recommended'
import remarkToc from 'remark-toc'
import remarkValidateLinks from 'remark-validate-links'
import remarkLintCorrectMediaSyntax from 'remark-lint-correct-media-syntax'
import remarkLintDefinitionSort from 'remark-lint-definition-sort'
import remarkLintFencedCodeFlag, {
  checkGithubLinguistFlag
} from 'remark-lint-fenced-code-flag'
import remarkLintHardBreakSpaces from 'remark-lint-hard-break-spaces'
import remarkLintListItemIndent from 'remark-lint-list-item-indent'
import remarkLintMediaStyle from 'remark-lint-media-style'
import remarkLintNoHiddenTableCell from 'remark-lint-no-hidden-table-cell'
import listOfPlugins from './script/plugin/list-of-plugins.js'
import listOfPresets from './script/plugin/list-of-presets.js'

export default {
  plugins: [
    remarkCommentConfig,
    [remarkGfm, {tablePipeAlign: false}],
    remarkGithub,
    remarkPresetLintConsistent,
    remarkPresetLintRecommended,
    remarkLintCorrectMediaSyntax,
    remarkLintDefinitionSort,
    [remarkLintFencedCodeFlag, checkGithubLinguistFlag],
    [remarkLintHardBreakSpaces, {allowSpaces: false}],
    [remarkLintListItemIndent, 'one'],
    [remarkLintMediaStyle, 'reference-reuse'],
    remarkLintNoHiddenTableCell,
    [remarkToc, {maxDepth: 3}],
    remarkValidateLinks,
    listOfPlugins,
    listOfPresets
  ]
}
