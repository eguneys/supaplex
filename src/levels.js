const initial = [0, 4, 3, 2, 1, 0, 0, 0,
                 0, 5, 6, 7, 8, 9, 0, 0,
                 0, 0, 0, 0, 0, 0, 0, 0,
                 0, 0, 0, 0, 0, 0, 0, 0,
                 0, 0, 0, 0, 0, 0, 0, 0];

function read(tiles) {
  tiles = tiles.map((tile) => {
    return {
      role: tile,
      facing: 'left',
      moving: 0
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
  setChar(frame, tiles, pos, {});
}

function moveChar(data, pos, dirS) {
  const dir = Move[dirS];
  const nextPos = pos + dir.v;

  moveCharBase(data.frame, data.tiles, pos, nextPos);
  data.tweens[nextPos] = [dir.a, dir.a];
  data.tweens[nextPos].start = data.lastUpdateTime;
}

function move1(data, pos) {
  const tile = data.tiles[pos];
  const facing = tile.facing;

  moveChar(data, pos, tile.facing);
  tile.moving = 1;
}

function move2(data, pos) {
  const tile = data.tiles[pos];
  tile.moving = 2;
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

const Move = {
  left: {
    i: 0,
    a: [36, 0],
    v: -1
  },
  down: {
    i: 1,
    a: [0, -36],
    v: +8
  },
  right: {
    i: 2,
    a: [-36, 0],
    v: +1
  },
  up: {
    i: 3,
    a: [0, +36],
    v: -8
  }
};

const moves = ['left', 'down', 'right', 'up'];

export {
  initial,
  read,
  moveChar,
  move0,
  move1,
  move2,
  move3,
  isTurning
};
