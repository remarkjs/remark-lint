#!/usr/bin/env node
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module build-rule-documentation
 * @fileoverview Creates documentation for all exposed
 *   rules.
 */

'use strict';

/*
 * Dependencies.
 */

var fs = require('fs');
var path = require('path');
var dox = require('dox');
var mdast = require('mdast');
var toc = require('mdast-toc');
var rules = require('../lib/rules');
var metaRules = require('../lib/rules/meta');

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
 * Add `reset` docs.
 */

children.push({
    'type': 'heading',
    'depth': 3,
    'children': [{
        'type': 'text',
        'value': 'reset'
    }]
}, {
    'type': 'paragraph',
    'children': [{
        'type': 'text',
        'value': 'By default, all rules are turned on unless explicitly\n' +
            'set to `false`. When `reset: true`, the opposite is true:\n' +
            'all rules are turned off, unless when given a non-nully and\n' +
            'non-false value.'
    }]
}, {
    'type': 'paragraph',
    'children': [{
        'type': 'text',
        'value': 'Options: `boolean`, default: `false`.'
    }]
});

/*
 * Add rules.
 */

Object.keys(rules)
.concat(Object.keys(metaRules))
.sort()
.forEach(function (ruleId) {
    var description;
    var filePath;
    var example;
    var code;
    var rule;
    var tags;

    try {
        filePath = path.join('lib', 'rules', ruleId + '.js');
        code = fs.readFileSync(filePath, 'utf-8');
        tags = dox.parseComments(code)[0].tags;
        description = find(tags, 'fileoverview');
        example = find(tags, 'example');

        if (!description) {
            throw new Error(ruleId + ' is missing a `@fileoverview`');
        } else {
            description = description.string;
        }

        if (example) {
            example = example.string;
        }

    } catch (e) {
        // Handle file-less rules
        if (e.code === 'ENOENT') {
            rule = metaRules[ruleId];
            description = rule.description;
            example = rule.example;
        } else {
            throw e;
        }
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

    children = children.concat(mdast().parse(description).children);
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

mdast().use(toc).run(node);

/*
 * Write.
 */

fs.writeFileSync('doc/rules.md', mdast().stringify(node));
