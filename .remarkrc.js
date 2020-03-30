exports.settings = {bullet: '*', tablePipeAlign: false}

exports.plugins = [
  require('./packages/remark-preset-lint-recommended'),
  require('./packages/remark-preset-lint-consistent'),
  [require('remark-toc'), {tight: true, maxDepth: 2, heading: 'contents'}],
  require('remark-comment-config'),
  require('remark-github'),
  require('remark-validate-links'),
  require('./script/plugin/list-of-presets'),
  require('./script/plugin/list-of-rules')
]
