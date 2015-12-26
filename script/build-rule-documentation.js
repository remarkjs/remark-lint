#!/usr/bin/env node
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:lint:script:build-rule-documentation
 * @fileoverview Creates documentation for all exposed
 *   rules.
 */

'use strict';

/* eslint-env node */

/*
 * Dependencies.
 */

var fs = require('fs');
var path = require('path');
var dox = require('dox');
var remark = require('remark');
var toc = require('remark-toc');
var rules = require('../lib/rules');
var additional = require('./additional.json');

/*
 * Methods.
 */

var exists = fs.existsSync;

/**
 * Find the first tag in `tags` with a type set to `key`.
 *
 * @param {Array.<Object>} tags - List of tags.
 * @param {string} key - Type of tag.
 * @return {Object?} - Tag, when found.
 */
function find(tags, key) {
    var value = null;

    tags.some(function (tag) {
        if (tag && tag.type === key) {
            value = tag;

            return true;
        }
    });

    return value;
}

var children = [];

/*
 * Add main heading.
 */

children.push({
    'type': 'heading',
    'depth': 1,
    'children': [{
        'type': 'text',
        'value': 'List of Rules'
    }]
});

/*
 * Add main description.
 */

children.push({
    'type': 'paragraph',
    'children': [{
        'type': 'text',
        'value': 'This document describes all available rules, what they\n' +
            'check for, examples of what they warn for, and how to\n' +
            'fix their warnings.'
    }]
});

/*
 * Add the table-of-contents heading.
 */

children.push({
    'type': 'heading',
    'depth': 2,
    'children': [{
        'type': 'text',
        'value': 'Table of Contents'
    }]
});

/*
 * Add the rules heading.
 */

children.push({
    'type': 'heading',
    'depth': 2,
    'children': [{
        'type': 'text',
        'value': 'Rules'
    }]
});

/*
 * Add a section on how to turn of rules.
 */

children.push({
    'type': 'paragraph',
    'children': [{
        'type': 'text',
        'value': 'Remember that rules can always be turned off by\n' +
            'passing false. In addition, when reset is given, values can\n' +
            'be null or undefined in order to be ignored.'
    }]
});

/*
 * Add rules.
 */

Object.keys(additional).sort()
.concat(Object.keys(rules).sort())
.forEach(function (ruleId) {
    var description;
    var filePath;
    var example;
    var code;
    var tags;

    filePath = path.join('lib', 'rules', ruleId + '.js');

    if (exists(filePath)) {
        code = fs.readFileSync(filePath, 'utf-8');
        tags = dox.parseComments(code)[0].tags;
        description = find(tags, 'fileoverview');
        example = find(tags, 'example');

        if (!description) {
            throw new Error(ruleId + ' is missing a `@fileoverview`');
        }

        description = description.string;
        example = example && example.string;
    } else {
        description = additional[ruleId].description;
        example = additional[ruleId].example;
    }

    children.push({
        'type': 'heading',
        'depth': 3,
        'children': [{
            'type': 'text',
            'value': ruleId
        }]
    });

    if (example) {
        children.push({
            'type': 'code',
            'lang': 'md',
            'value': example
        });
    }

    children = children.concat(remark().parse(description).children);
});

/*
 * Node.
 */

var node = {
    'type': 'root',
    'children': children
};

/*
 * Add toc.
 */

remark().use(toc).run(node);

/*
 * Write.
 */

fs.writeFileSync('doc/rules.md', remark().stringify(node));
