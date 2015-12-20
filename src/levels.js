const initial = [0, 0, 0, 0, 0, 0, 0, 0,
                 0, 0, 0, 0, 0, 0, 0, 0,
                 0, 0, 8, 8, 1, 1, 8, 0,
                 0, 0, 8, 0, 8, 0, 8, 0,
                 0, 0, 0, 1, 0, 0, 8, 0,
                 0, 0, 8, 8, 0, 8, 8, 0,
                 0, 0, 0, 0, 0, 0, 0, 0,
                 0, 0, 0, 0, 0, 0, 0, 0];

function read(tiles) {
  tiles = tiles.map((tile) => {
    return {
      role: tile,
      facing: 'left',
      preFace: 'left',
      moving: 0,
      nextDecision: decisionTurn
    };
  });

  return tiles;
}

function setChar(frame, tiles, pos, char) {
  tiles[pos] = char;
  char.frame = frame;
}

function moveCharBase(frame, tiles, pos, nextPos) {
  setChar(frame, tiles, nextPos, tiles[pos]);
  setChar(frame, tiles, pos, { role: 0 });
}

function moveChar(data, pos, dirS) {
  const dir = Move[dirS];
  const nextPos = pos + dir.v;

  moveCharBase(data.frame, data.tiles, pos, nextPos);

  const arr = dir.a;

  data.tweens[nextPos] = [arr, arr];
  data.tweens[nextPos].start = data.lastUpdateTime;
}

function decisionTurn(data, pos) {
  const tile = data.tiles[pos];

  const dirLeft = ofLeft(tile.facing);
  const dirAhead = tile.facing;
  const dirRight = ofRight(tile.facing);

  const tileLeft = data.tiles[tileNeighbor(pos, dirLeft)];
  const tileAhead = data.tiles[tileNeighbor(pos, dirAhead)];
  const tileRight = data.tiles[tileNeighbor(pos, dirRight)];

  if (canGo(tileLeft)) {
    turn(data, pos, dirLeft);
  } else if (canGo(tileAhead)) {
    move1(data, pos)
  } else if (canGo(tileRight)) {
    turn(data, pos, dirRight);
  } else {
    turn(data, pos, dirLeft);
  }
}

function decisionMove(data, pos) {
  const tile = data.tiles[pos];

  const dirAhead = tile.facing;
  const tileAhead = data.tiles[tileNeighbor(pos, dirAhead)];

  if (canGo(tileAhead)) {
    move1(data, pos);
  } else {
    still(data, pos);
  }
}

function decisionMove2(data, pos) {
  move2(data, pos);
}

function actRole1(data, pos) {
  const tile = data.tiles[pos];

  tile.nextDecision(data, pos);
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

function move0(data, pos) {
  const tile = data.tiles[pos];

  const dirS = tile.facing;
  const leftDir = moves[(Move[dirS].i + 1) % 4];

  tile.moving = 0;
  tile.preFace = dirS;
  tile.facing = leftDir;
}

function move3(data, pos) {
  const tile = data.tiles[pos];

  tile.preFace = tile.facing;
}

function isTurning(tile) {
  return tile.preFace !== tile.facing;
}

function canGo(tile) {
  return tile.role === 0;
}

function tileNeighbor(pos, dir) {
  return pos + Move[dir].v;
}

function ofLeft(dir) {
  return moves[(Move[dir].i + 1) % 4];
}

function ofRight(dir) {
  return moves[(Move[dir].i + 3) % 4];
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
    v: +8
  },
  right: {
    i: 2,
    a: [-32, 0],
    v: +1
  },
  up: {
    i: 3,
    a: [0, +32],
    v: -8
  }
};

const moves = ['left', 'down', 'right', 'up'];

export {
  initial,
  read,
  actRole1
};
