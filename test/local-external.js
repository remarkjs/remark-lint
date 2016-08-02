/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module remark:lint
 * @fileoverview Example local externals.
 */

'use strict';

/* eslint-disable max-params */

module.exports = {
  'trailing-slash': require('remark-lint-no-url-trailing-slash')['trailing-slash']
};
