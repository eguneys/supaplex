import * as levels from './levels';

export default function(levelData) {
  var defaults = {
    updateDuration: 100,
    lastUpdateTime: 0,
    frame: 0,
    tiles: levels.read(levelData.levels[0].data),
    viewOffset: [0, 0],
    edgeOffset: [0, 0],
    mapWidth: 60,
    mapHeight: 24,
    viewWidth: 26,
    viewHeight: 16,
    tileSize: 32,
    tweens: {},
    inputs: {}
  };


  return defaults;
}
