import * as util from './levels';

/*
 // still // fall 2 // roll 2
   // can fall
     // fall 1
     // still
 // fall 1
   // fall 2
 // roll 1
   // roll 2
 */

function decisionFall(data, pos) {
  const tile = data.tiles[pos];

  if (util.canFall(data, pos)) {
    fall1(data, pos);
  } else {
    still(data, pos);
  }
}

function decisionFall2(data, pos) {
  fall2(data, pos);
}

function decisionRoll2(data, pos) {
  roll2(data, pos);
}

function fall1(data, pos) {
  const tile = data.tiles[pos];

  util.moveChar(data, pos, 'down');

  tile.falling = 1;
  tile.nextDecision = decisionFall2;
}

function fall2(data, pos) {
  const tile = data.tiles[pos];

  tile.falling = 2;
  tile.nextDecision = decisionFall;
}

function roll1(data, pos, dir) {
  const tile = data.tiles[pos];

  util.moveChar(data, pos, dir);

  tile.rolling = 1;
  tile.facing = dir;
  tile.nextDecision = decisionRoll2;
}

function roll2(data, pos) {
  const tile = data.tiles[pos];

  tile.rolling = 2;
  tile.nextDecision = decisionFall;
}

function still(data, pos) {
  const tile = data.tiles[pos];

  tile.rolling = 0;
  tile.facing = 0;
  tile.falling = 0;
  tile.nextDecision = decisionFall;
}

export {
  decisionFall,
  roll1
};
