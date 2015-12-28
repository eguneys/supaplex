import * as levels from './levels';

export default function(cfg) {
  var defaults = {
    updateDuration: 60,
    frame: 0,
    tiles: levels.read(levels.initial),
    viewOffset: [0, 0],
    mapWidth: 60,
    mapHeight: 24,
    viewWidth: 22,
    viewHeight: 14,
    tileSize: 32,
    tweens: {},
    inputs: {}
  };


  return defaults;
}
