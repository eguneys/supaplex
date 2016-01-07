import * as levels from './levels';

const TILE_SIZE = 32;

const VIEW_HEIGHT = 6 * 2;
const VIEW_WIDTH = 10 * 2;

const RENDER_HEIGHT = VIEW_HEIGHT + 3;
const RENDER_WIDTH = VIEW_WIDTH + 3;

export {
  TILE_SIZE,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  RENDER_HEIGHT,
  RENDER_WIDTH
};

export default function(cfg) {
  var defaults = {
    updateDuration: 100,
    lastUpdateTime: 0,
    frame: 0,
    viewOffset: [0, 0],
    edgeOffset: [0, 0],
    topEdgeOffset: 1, // 1 or (1 / 3),
    showHUD: true,
    mapHeight: 24,
    mapWidth: 60,
    viewHeight: VIEW_HEIGHT * TILE_SIZE + (TILE_SIZE / 2),
    viewWidth: VIEW_WIDTH * TILE_SIZE,
    tileSize: TILE_SIZE,
    tweens: {},
    inputs: {}
  };


  return defaults;
}
