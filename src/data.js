import * as levels from './levels';

export const Constants = {
  viewHeight: 5 * 2 + 3,
  viewWidth: 10 * 2 + 3
};

export default function(cfg) {
  var defaults = {
    updateDuration: 100,
    lastUpdateTime: 0,
    frame: 0,
    viewOffset: [0, 0],
    edgeOffset: [0, 0],
    mapWidth: 60,
    mapHeight: 24,
    viewWidth: Constants.viewWidth,
    viewHeight: Constants.viewHeight,
    tileSize: 32,
    tweens: {},
    inputs: {}
  };


  return defaults;
}
