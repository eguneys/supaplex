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

fs.readFile('./assets/data/levels.dat', function(err, data) {
  var result = levelsParser.parse(data);

  result = JSON.stringify(result);
  fs.writeFile('./build/levels.json', result, function(err) {
    if (err) {
      throw err;
    }
  });
});
