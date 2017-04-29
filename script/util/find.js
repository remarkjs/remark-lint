'use strict';

module.exports = find;

find.all = findAll;

/* Find the first tag in `tags` with a type set to `key`. */
function find(tags, key) {
  var value = null;

  tags.some(function (tag) {
    if (tag && tag.type === key) {
      value = tag;

      return true;
    }

    return false;
  });

  return value && value.string;
}

/* Find the first tag in `tags` with a type set to `key`. */
function findAll(tags, key) {
  return tags
    .filter(function (tag) {
      return tag && tag.type === key;
    })
    .map(function (tag) {
      return tag.string;
    });
}
