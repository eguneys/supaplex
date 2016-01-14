import * as decisions from './decisions';

/*
 // still // fall 2 // roll 2
   // can fall
     // fall 1
     // still
 // fall 1
   // fall 2
 // roll 1
   // can roll
     // roll 2
 */

function decisionFall(data, pos) {
  const tile = data.tiles[pos];

  if (decisions.canFall(data, pos)) {
    fall1(data, pos);
  } else if (decisions.canRoll(data, pos, 'left')) {
    roll1(data, pos, 'left', 1);
  } else if (decisions.canRoll(data, pos, 'right')) {
    roll1(data, pos, 'right', 1);
  } else {
    still(data, pos);
  }
}

function decisionFall2(data, pos) {
  fall2(data, pos);
}

function decisionRoll2(data, pos) {
  const tile = data.tiles[pos];

  if (tile.toFall === 0 || decisions.canFall(data, pos)) {
    roll2(data, pos);
  } else {
    roll3(data, pos);
  }
}

function fall1(data, pos) {
  const tile = data.tiles[pos];

  decisions.moveChar(data, pos, 'down');

  tile.rolling = 0;
  tile.falling = 1;
  tile.moving = 1;
  tile.nextDecision = decisionFall2;
}

function fall2(data, pos) {
  const tile = data.tiles[pos];

  tile.moving = 2;
  tile.falling = 2;
  tile.nextDecision = decisionFall;
}

function roll1(data, pos, dir, toFall = 0) {
  const tile = data.tiles[pos];

  decisions.moveChar(data, pos, dir);

  tile.toFall = toFall;
  tile.moving = 1;
  tile.rolling = 1;
  tile.facing = dir;
  tile.nextDecision = decisionRoll2;
}

function roll2(data, pos) {
  const tile = data.tiles[pos];

  if (data.tweens[pos].pause) {
    data.tweens[pos].start += data.lastUpdateTime - data.tweens[pos].pause;
    delete data.tweens[pos].pause;
  }

  tile.moving = 2;
  tile.rolling = 2;
  tile.nextDecision = decisionFall;
}

function roll3(data, pos) {
  const tile = data.tiles[pos];

  if (!data.tweens[pos].pause) {
    data.tweens[pos].pause = data.lastUpdateTime;
  }
  tile.rolling = 3;
  tile.nextDecision = decisionRoll2;
}

function still(data, pos) {
  const tile = data.tiles[pos];

  tile.moving = 0;
  tile.rolling = 0;
  tile.toFall = 0;
  tile.facing = 0;
  tile.falling = 0;
  tile.nextDecision = decisionFall;
}

export {
  decisionFall,
  roll1
};
