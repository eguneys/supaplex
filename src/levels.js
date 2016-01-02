import * as rolls from './rolls';
import * as roles from './roles';

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
  9: 'PORT-RIGHT',
  10: 'PORT_DOWN',
  11: 'PORT_LEFT',
  12: 'PORT_UP',
  13: 'GPORT_RIGHT',
  14: 'GPORT_DOWN',
  15: 'GPORT_LEFT',
  16: 'GPORT_UP',
  17: 'SNIKSNAK',
  18: 'FLOPPY_YELLOW',
  19: 'PORT_VERTICAL',
  20: 'PORT_HORIZONTAL',
  21: 'PORT-ALL',
  22: 'ELECTRON',
  23: 'BUG',
  24: 'CHIP_LEFT',
  25: 'CHIP_RIGHT',
  26: 'HARDWARE1',
  27: 'HARDWARE2',
  28: 'HARDWARE3',
  29: 'HARDWARE4',
  30: 'HARDWARE5',
  31: 'HARDWARE6',
  32: 'HARDWARE7',
  33: 'HARDWARE8',
  34: 'HARDWARE9',
  35: 'HARDWARE10',
  36: 'HARDWARE11',
  37: 'HARDWARE12',
  38: 'CHIP_TOP',
  39: 'CHIP_BOTTOM'
};


const Role = {
  SNIKSNAK: {
    facing: 'left',
    preFace: 'left',
    moving: 0,
    nextDecision: roles.decisionTurn
  },
  ZONK: {
    moving: 0,
    round: true,
    pushable: true,
    nextDecision: rolls.decisionFall
  },
  INFOTRON: {
    moving: 0,
    round: true,
    eatable: true,
    nextDecision: rolls.decisionFall
  },
  BASE: {
    eatable: true
  },
  ELECTRON: {
    facing: 'left',
    preFace: 'left',
    moving: 0,
    nextDecision: roles.decisionTurn
  },
  BUG: {
    active: 16,
    nextDecision: roles.decisionBug
  },
  MURPHY: {
    facing: 'left',
    moving: 0,
    nextDecision: roles.decisionInput
  },
  PORT_ALL: {
    portable: {left: true, right: true, up: true, down: true }
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

const _initial = [2, 0, 3, 0, 0, 0, 0, 0, 0, 0,
                  2, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  2, 0, 2, 0, 0, 0, 0, 0, 0, 0,
                  9, 0, 0, 2, 0, 0, 0, 0, 0, 0,
                  9, 2, 2, 0, 3, 1, 13, 0, 13, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  9, 0, 0, 0, 13, 8, 8, 8, 8, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  9, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  9, 0, 0, 0, 0, 0, 0, 0, 0, 0,
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

  result[roles.pos2key([1, 7])] = 12;

  return result;
}

function read(tiles) {
  tiles = tiles.map((tile) => {
    return makeRole(tile);
  });
  return tiles;
}

export {
  read,
  makeRole,
  initial
};
