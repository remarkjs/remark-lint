exports.settings = {bullet: '*'};

exports.plugins = [
  require('./packages/remark-preset-lint-recommended'),
  require('./packages/remark-preset-lint-consistent'),
  [require('remark-toc'), {tight: true, maxDepth: 2}],
  require('remark-comment-config'),
  require('remark-github'),
  require('remark-validate-links')
];
