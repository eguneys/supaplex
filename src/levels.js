import * as Constants from './data';
import * as util from './util';

const { MAP_HEIGHT, MAP_WIDTH } = Constants;

const RoleCode = {
  0: 'EMPTY',
  1: 'ZONK',
  2: 'BASE',
  3: 'MURPHY',
  4: 'INFOTRON',
  5: 'CHIP',
  6: 'WALL',
  7: 'EXIT',
  8: 'FLOPPY_ORANGE',
  9: 'PORT_RIGHT',
  10: 'PORT_DOWN',
  11: 'PORT_LEFT',
  12: 'PORT_UP',
  13: 'GPORT_RIGHT',
  14: 'GPORT_DOWN',
  15: 'GPORT_LEFT',
  16: 'GPORT_UP',
  17: 'SNIKSNAK',
  18: 'FLOPPY_YELLOW',
  19: 'TERMINAL',
  20: 'FLOPPY_RED',
  21: 'PORT_VERTICAL',
  22: 'PORT_HORIZONTAL',
  23: 'PORT_ALL',
  24: 'ELECTRON',
  25: 'BUG',
  26: 'CHIP_LEFT',
  27: 'CHIP_RIGHT',
  28: 'HARDWARE1',
  29: 'HARDWARE2',
  30: 'HARDWARE3',
  31: 'HARDWARE4',
  32: 'HARDWARE5',
  33: 'HARDWARE6',
  34: 'HARDWARE7',
  35: 'HARDWARE8',
  36: 'HARDWARE9',
  37: 'HARDWARE10',
  38: 'HARDWARE11',
  39: 'HARDWARE12',
  40: 'CHIP_TOP',
  41: 'CHIP_BOTTOM'
};


const Role = {
  SNIKSNAK: {
    facing: 'left',
    preFace: 'left',
    moving: 0,
    decision: 'decisionTurn'
  },
  ZONK: {
    moving: 0,
    round: true,
    pushable: true,
    decision: 'decisionFall'
  },
  INFOTRON: {
    moving: 0,
    round: true,
    eatable: true,
    decision: 'decisionFall'
  },
  BASE: {
    eatable: true
  },
  CHIP: {
    round: true
  },
  CHIP_LEFT: {
    round: true
  },
  CHIP_RIGHT: {
    round: true
  },
  CHIP_TOP: {
    round: true
  },
  CHIP_BOTTOM: {
    round: true
  },
  ELECTRON: {
    facing: 'left',
    preFace: 'left',
    moving: 0,
    decision: 'decisionTurn'
  },
  BUG: {
    active: 1000 / Constants.UPDATE_DURATION,
    decision: 'decisionBug'
  },
  MURPHY: {
    facingHorizontal: 'left',
    facing: 'left',
    moving: 0,
    decision: 'decisionInput'
  },
  PORT_ALL: {
    portable: {left: true, right: true, up: true, down: true }
  },
  PORT_LEFT: {
    portable: {left: true }
  },
  PORT_TOP: {
    portable: { up: true }
  },
  PORT_RIGHT: {
    portable: { right: true }
  },
  PORT_DOWN: {
    portable: { down: true }
  },
  PORT_HORIZONTAL: {
    portable: {left: true, right: true }
  },
  PORT_VERTICAL: {
    portable: { up: true, down: true }
  }
};

function roleMaker() {
  let id = 1;

  return function(roleCode) {
    id++;
    const result = {key: id};

    const role = RoleCode[roleCode];
    const obj = Role[role] || {};

    obj.role = role;

    Object.keys(obj).map((key) => {
      result[key] = obj[key];
    });

    return result;
  };
}

const makeRole = roleMaker();

const _initial = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  39, 0, 0, 0, 0, 0, 1, 0, 0, 0,
                  0, 19, 0, 0, 9, 2, 24, 0, 0, 0,
                  24, 0, 21, 0, 0, 10, 0, 25, 0, 0,
                  0, 0, 0, 0, 0, 1, 0, 11, 38, 0,
                  0, 4, 7, 21, 0, 0, 0, 0, 13, 39,
                  0, 30, 18, 8, 13, 0, 0, 0, 0, 20,
                  26, 31, 35, 0, 0, 0, 0, 0, 0, 0,
                  27, 32, 36, 0, 0, 0, 0, 0, 0, 0,
                  28, 33, 37, 0, 0, 0, 0, 0, 0, 0,
                  29, 34, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const initial = enhance(_initial);

function enhance2(arr) {
  var by = 24;

  var result = [];

  while (by--) {
    result = result.concat(arr);
  }

  return result;
}

function enhance(arr) {
  var result = [];

  function cloneAt(I, J) {
    for (var i = 0; i<10; i++) {
      for (var j = 0; j < 12; j++) {
        var dstKey = (j + J) * 60 + i + I;
        var srcKey = j * 10 + i;

        result[dstKey] = arr[srcKey];
      }
    }
  }

  for (var i = 0; i<60; i+=10) {
    for (var j = 0; j<24;j+= 12) {
      cloneAt(i, j);
    }
  }

  result[util.pos2key([1, 7])] = 3;

  return result;
}

function read(tiles) {
  const result = [];

  for (var i = 0; i < MAP_HEIGHT; i++) {
    for (var j = 0; j < MAP_WIDTH; j++) {
      const dstKey = util.pos2key([j, i]);
      const srcKey = (i + 1) * 60 + (j + 1);
      result[dstKey] = makeRole(tiles[srcKey]);
    }
  }

  // tiles = tiles.map((tile) => {
  //   return makeRole(tile);
  // });

  return result;
}

export {
  read,
  makeRole,
  initial
};
