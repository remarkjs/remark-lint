var mdast = require('mdast');
var lint = require('./index.js');

var processor = mdast().use(lint);

// Example document.
var doc = '* Hello\n' +
    '\n' +
    '-   World\n';

// Process.
processor.process(doc, function (err, res, file) {
    // Yields:
    var messages = file.messages;
    console.log('json', JSON.stringify(messages, 0, 2));
});
