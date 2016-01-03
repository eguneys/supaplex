var fs = require('fs');

var Parser = require('binary-parser').Parser;

const levelParser = new Parser()
        .array('data', {
          type: 'int8',
          length: 1440
        })
        .skip(4)
        .int8('gravity')
        .int8('th')
        .string('title', { length: 23 })
        .int8('freezeZonks')
        .int8('infotronsNeeded')
        .int8('gravityPorts')
        .skip(60)
        .skip(4);

const levelsParser = new Parser()
        .array('levels', {
          type: levelParser,
          readUntil: 'eof'
        });

module.exports = function parse(data) {
  var result = levelsParser.parse(data);
  return result;
};
