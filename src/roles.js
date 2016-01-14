import * as levels from './levels';
import * as decisions from './decisions';
import * as rolls from './rolls';

const decisionMap = {
  'decisionTurn': decisions.decisionTurn,
  'decisionBug': decisions.decisionBug,
  'decisionInput': decisions.decisionInput,
  'decisionFall': rolls.decisionFall
};

function noop() {}

function actRole(data, pos) {
  const tile = data.tiles[pos];

  const decision = tile.nextDecision?
          tile.nextDecision:
          (tile.decision?decisionMap[tile.decision]
           :noop);

  decision(data, pos);
}

function clearTrail(data, pos) {
  const tile = data.tiles[pos];
  if (tile.moving === 2) {
    const trailTile = data.tiles[tile.trailPos];
    trailTile.isTrail = false;
    delete tile.trailPos;
    tile.moving = 0;
    delete tile.eatingRole;
  }
  if (tile.snapping === 2) {
    tile.snapping = 0;
  }
}

function initGame(data) {
  const levelNo = data.selectedLevel;
  const level = data.levelData.levels[levelNo - 1];

  data.levelNo = levelNo;
  data.levelTitle = level.title;
  data.infotronsNeeded = level.infotronsNeeded;
  data.gravity = level.gravity;

  data.tiles = levels.read(level.data);
  //data.tiles = levels.read(levels.initial);

  decisions.centerScroll(data);
};

export {
  actRole,
  clearTrail,
  initGame
}
