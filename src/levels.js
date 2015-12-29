import * as rolls from './rolls';

const Role = {
  1: {
    role: 1,
    facing: 'left',
    preFace: 'left',
    moving: 0,
    nextDecision: decisionTurn
  },
  2: {
    role: 2,
    moving: 0,
    pushable: true,
    nextDecision: rolls.decisionFall
  },
  9: {
    role: 9,
    facing: 'left',
    preFace: 'left',
    moving: 0,
    nextDecision: decisionTurn
  },
  10: {
    role: 10,
    active: 16,
    nextDecision: decisionBug
  },
  12: {
    role: 12,
    facing: 'left',
    moving: 0,
    nextDecision: decisionInput
  },
  13: {
    role: 13,
    portable: {left: true, right: true, up: true, down: true }
  }
};

function roleMaker() {
  let id = 1;

  return function(role) {
    id++;
    const result = {key: id};

    const obj = Role[role] || { role: role };

    Object.keys(obj).map((key) => {
      result[key] = obj[key];
    });

    return result;
  };
}

const makeRole = roleMaker();

const _initial = [0, 0, 0, 0, 0, 1, 13, 0, 13, 0,
                 0, 0, 0, 2, 0, 0, 0, 0, 0, 0,
                 0, 8, 8, 8, 13, 8, 8, 8, 8, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
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
      for (var j = 0; j < 4; j++) {
        var dstKey = (j + J) * 60 + i + I;
        var srcKey = j * 10 + i;

        result[dstKey] = arr[srcKey];
      }
    }
  }

  for (var i = 0; i<60; i+=10) {
    for (var j = 0; j<24;j+= 4) {
      cloneAt(i, j);
    }
  }

  result[0] = 12;

  return result;
}


function key2pos(key) {
  return [key % 60, Math.floor(key / 60)];
}

function read(tiles) {
  tiles = tiles.map((tile) => {
    return makeRole(tile);
  });
  return tiles;
}

function actRole(data, pos) {
  const tile = data.tiles[pos];
  if (tile.nextDecision) {
    tile.nextDecision(data, pos);
  }
}

/*
   // port 1
     // port 2
   // port 2
     // clear
 */

function decisionPort2(data, pos) {
  port2(data, pos);
}

function decisionPortClear(data, pos) {
  portClear(data, pos);
}

function port1(data, pos, dir, portPos) {
  const tile = data.tiles[pos];
  const portTile = data.tiles[portPos];

  tile.frame = data.frame;
  tile.porting = 1;
  tile.portTile = portTile;
  addTween(data, `port${tile.key}`, Move[dir].a);

  tile.nextDecision = decisionPort2;
}

function port2(data, pos) {
  const tile = data.tiles[pos];

  tile.porting = 2;
  tile.nextDecision = decisionPortClear;
}

function portClear(data, pos) {
  const tile = data.tiles[pos];

  tile.porting = 0;
  delete tile.nextDecision;
}

/*
   // morphyStand // move 2 // push 2 // push move 2
     // switch input
       // move
       // push
       // stand
   // move
     // move 2
   // push
     // push 2
   // push move
     // push move 2
 */


function decisionInput(data, pos) {
  const tile = data.tiles[pos];

  const inputs = data.inputs;

  const dirs = ['left', 'right', 'up', 'down'];

  let handled =
  dirs.some((dir) => {
    if (inputs[dir]) {
      if (canGo(data, pos, dir)) {
        morphyMove(data, pos, dir);
      } else if (canPort(data, pos, dir)) {
        const portPos = posNeighbor(pos, dir);
        const nextPos = posNeighbor(portPos, dir);
        morphyMove(data, pos, dir, nextPos);

        port1(data, portPos, dir, nextPos);
      } else if (canPush(data, pos, dir)) {
        if (canPushMove(data, pos, dir)) {
          morphyPushMove(data, pos, dir);
        } else {
          morphyPush(data, pos, dir);
        }
      } else {
        return false;
      }
      return true;
    }
    return false;
  });

  if (!handled) {
    morphyStand(data, pos);
  }
}

function decisionMurphyMove2(data, pos) {
  morphyMove2(data, pos);
}

function decisionMurphyPushMove2(data, pos) {
  morphyPushMove2(data, pos);
}

function decisionMurphyPush2(data, pos) {
  morphyPush2(data, pos);
}

function morphyStand(data, pos) {
  const tile = data.tiles[pos];

  tile.pushing = 0;
  tile.moving = 0;
  tile.nextDecision = decisionInput;
}

function morphyMoveBase(data, pos, facing, nextPos) {
  const dir = Move[facing];
  nextPos = nextPos || (pos + dir.v);

  moveChar(data, pos, facing, nextPos);

  data.morphyPosKey = nextPos;

  const preMorphyPos = key2pos(pos);
  const morphyPos = key2pos(nextPos);

  viewportCenter(data, preMorphyPos, morphyPos);
}

function morphyMove(data, pos, dir, nextPos) {
  const tile = data.tiles[pos];

  morphyMoveBase(data, pos, dir, nextPos);

  tile.facing = dir;
  tile.pushing = 0;
  tile.moving = 1;
  tile.nextDecision = decisionMurphyMove2;
}

 function morphyPush(data, pos, dir) {
  const tile = data.tiles[pos];

  tile.facing = dir;
  tile.moving = 0;
  tile.pushing = 1;
  tile.nextDecision = decisionMurphyPush2;
}

function morphyPushMove(data, pos, dir) {
  const tile = data.tiles[pos];

  const pushPos = posNeighbor(pos, dir);

  rolls.roll1(data, pushPos, dir);
  morphyMoveBase(data, pos, dir);

  tile.facing = dir;
  tile.pushing = 3;
  tile.nextDecision = decisionMurphyPushMove2;
}

function morphyMove2(data, pos) {
  const tile = data.tiles[pos];

  tile.moving = 2;
  tile.nextDecision = decisionInput;
}

function morphyPush2(data, pos) {
  const tile = data.tiles[pos];

  tile.pushing = 2;
  tile.nextDecision = decisionInput;
}

function morphyPushMove2(data, pos) {
  const tile = data.tiles[pos];

  tile.pushing = 4;
  tile.nextDecision = decisionInput;
}

function viewportCenter(data, preMorphyPos, morphyPos) {
  const tileSize = data.tileSize;
  const mapWidth = data.mapWidth;
  const mapHeight = data.mapHeight;
  const viewWidth = data.viewWidth;
  const viewHeight = data.viewHeight;

  function inBetween(min, max, val) {
    return Math.max(Math.min(max, val), min);
  }

  const halfViewWidth = viewWidth / 2 - 1;
  const halfViewHeight = viewHeight / 2 -1;

  const leftEdge = halfViewWidth;
  const rightEdge = mapWidth - halfViewWidth;
  const topEdge = halfViewHeight;
  const bottomEdge = mapHeight - halfViewHeight;

  const edgeOffset = [inBetween(0, 2, morphyPos[0] - leftEdge) +
                      inBetween(0, 1, morphyPos[0] - rightEdge),
                      inBetween(0, 2, morphyPos[1] - topEdge) +
                      inBetween(0, 1, morphyPos[1] - bottomEdge)];

  const edgeDiff = [(edgeOffset[0] - data.edgeOffset[0]) * tileSize,
                    (edgeOffset[1] - data.edgeOffset[1]) * tileSize];

  data.edgeOffset = edgeOffset;

  data.edgeTween = [edgeDiff, edgeDiff];
  data.edgeTween.start = data.lastUpdateTime;

  const viewOffset = [inBetween(0, mapWidth - viewWidth,
                                morphyPos[0] - halfViewWidth - 2),
                      inBetween(0, mapHeight - viewHeight,
                                morphyPos[1] - halfViewHeight - 2)];

  const viewDiff = [(viewOffset[0] - data.viewOffset[0]) * tileSize,
                    (viewOffset[1] - data.viewOffset[1]) * tileSize];

  data.viewOffset = viewOffset;

  data.viewTween = [viewDiff, viewDiff];
  data.viewTween.start = data.lastUpdateTime;
}

/*
   // debug // debug start
     // can bug
       // bug start
       // debug
   // bug  // bug start
     // can debug
       // debug start
       // bug
 */
function decisionDebug(data, pos) {
  const tile = data.tiles[pos];

  if (canBug(tile)) {
    bugStart(tile);
  } else {
    debug(tile);
  }
}

function decisionBugStart(data, pos) {
  const tile = data.tiles[pos];
  bug(tile);
}

function decisionBug(data, pos) {
  const tile = data.tiles[pos];

  if (canDebug(tile)) {
    debugStart(tile);
  } else {
    bug(tile);
  }
}

function decisionDebugStart(data, pos) {
  const tile = data.tiles[pos];
  debug(tile);
}

function bug(tile) {
  tile.active--;
  tile.nextDecision = decisionBug;
}

function debug(tile) {
  tile.deactive--;
  tile.nextDecision = decisionDebug;
}

function bugStart(tile) {
  tile.active = 16;
  tile.nextDecision = decisionBug;
}

function debugStart(tile) {
  tile.deactive = (Math.round(Math.random() * 4) + 1) * 16;
  tile.nextDecision = decisionDebug;
}

function canBug(tile) {
  return tile.deactive <= 0;
}

function canDebug(tile) {
  return tile.active <= 0;
}

/*
  // still // move 2
    // can left
      // turn left
    // can ahead
      // move 1
    // can right
      // turn right
    // turn left
  // turn
    // can ahead
      // move 1
      // still
  // move 1
    // move 2
 */
function actRole1(data, pos) {
  const tile = data.tiles[pos];

  tile.nextDecision(data, pos);
}

function decisionTurn(data, pos) {
  const tile = data.tiles[pos];

  const dirLeft = ofLeft(tile.facing);
  const dirAhead = tile.facing;
  const dirRight = ofRight(tile.facing);

  if (canGo(data, pos, dirLeft)) {
    turn(data, pos, dirLeft);
  } else if (canGo(data, pos, dirAhead)) {
    move1(data, pos);
  } else if (canGo(data, pos, dirRight)) {
    turn(data, pos, dirRight);
  } else {
    turn(data, pos, dirLeft);
  }
}

function decisionMove(data, pos) {
  const tile = data.tiles[pos];

  const dirAhead = tile.facing;

  if (canGo(data, pos, dirAhead)) {
    move1(data, pos);
  } else {
    still(data, pos);
  }
}

function decisionMove2(data, pos) {
  move2(data, pos);
}

function still(data, pos) {
  const tile = data.tiles[pos];
  const facing = tile.facing;


  tile.moving = 0;
  tile.preFace = facing;
  tile.nextDecision = decisionTurn;
}

function move1(data, pos) {
  const tile = data.tiles[pos];
  const facing = tile.facing;

  moveChar(data, pos, tile.facing);

  tile.moving = 1;
  tile.nextDecision = decisionMove2;
}

function move2(data, pos) {
  const tile = data.tiles[pos];

  tile.moving = 2;
  tile.nextDecision = decisionTurn;
}

function turn(data, pos, dir) {
  const tile = data.tiles[pos];
  const facing = tile.facing;

  tile.moving = 0;
  tile.preFace = facing;
  tile.facing = dir;

  tile.nextDecision = decisionMove;
}

function canGo(data, pos, dir) {
  const rows = data.mapWidth;
  const cols = data.mapHeight;
  const mapLength = rows * cols;

  const neighbor = posNeighbor(pos, dir);


  if (!isLegitNeighbor(data, pos, dir, neighbor)) {
        return false;
  }

  const tile = data.tiles[neighbor];
  return tile.role === 0;
}

function canPort(data, pos, dir) {
  const neighbor = posNeighbor(pos, dir);

  if (!isLegitNeighbor(data, pos, dir, neighbor)) {
        return false;
  }

  const tile = data.tiles[neighbor];
  if (!tile.portable || !tile.portable[dir]) {
    return false;
  }

  return canGo(data, neighbor, dir);
}

function canFall(data, pos) {
  return canGo(data, pos, 'down');
}

function canPushMove(data, pos, dir) {
  const tile = data.tiles[pos];

  return tile.pushing === 2;
}

function canPush(data, pos, dir) {
  const neighbor = posNeighbor(pos, dir);
  if (!isLegitNeighbor(data, pos, dir, neighbor)) {
    return false;
  }

  const tile = data.tiles[neighbor];

  if (!tile.pushable) {
    return false;
  }

  return canGo(data, neighbor, dir);
}

function isHorizontal(dir) {
  return dir === 'left' || dir === 'right';
}

function isSameRow(rows, pos1, pos2) {
  return row(rows, pos1) === row(rows, pos2);
}

function row(rows, pos) {
  return Math.floor(pos / rows);
}

function isLegitNeighbor(data, pos, dir, neighbor) {
  const rows = data.mapWidth;
  const cols = data.mapHeight;
  const mapLength = rows * cols;

  return !(neighbor < 0 || neighbor >= mapLength ||
           (isHorizontal(dir) && !isSameRow(rows, pos, neighbor)));
}

function posNeighbor(pos, dir) {
  return pos + Move[dir].v;
}

function ofLeft(dir) {
  return moves[(Move[dir].i + 1) % 4];
}

function ofRight(dir) {
  return moves[(Move[dir].i + 3) % 4];
}

function setChar(frame, tiles, pos, char) {
  tiles[pos] = char;
  char.frame = frame;
}

function addTween(data, key, arr) {
  data.tweens[key] = [arr, arr];
  data.tweens[key].start = data.lastUpdateTime;
}

function tweenCharBase(data, pos, arr) {
  addTween(data, pos, arr);
}

function moveCharBase(frame, tiles, pos, nextPos) {
  const oldPos = tiles[nextPos];
  setChar(frame, tiles, nextPos, tiles[pos]);
  setChar(frame, tiles, pos, oldPos);
}

function moveChar(data, pos, dirS, nextPos) {
  const dir = Move[dirS];
  nextPos = nextPos || pos + dir.v;

  moveCharBase(data.frame, data.tiles, pos, nextPos);
  tweenCharBase(data, nextPos, dir.a);
}

const Move = {
  left: {
    i: 0,
    a: [32, 0],
    v: -1
  },
  down: {
    i: 1,
    a: [0, -32],
    v: +60
  },
  right: {
    i: 2,
    a: [-32, 0],
    v: +1
  },
  up: {
    i: 3,
    a: [0, +32],
    v: -60
  }
};

const moves = ['left', 'down', 'right', 'up'];

export {
  initial,
  read,
  actRole,
  moveChar,
  canFall
};
