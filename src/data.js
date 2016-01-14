const TILE_SIZE = 32;

const MAP_WIDTH = 60 - 2;
const MAP_HEIGHT = 24 - 2;

const VIEW_HEIGHT = 6 * 2;
const VIEW_WIDTH = 10 * 2;

const RENDER_HEIGHT = VIEW_HEIGHT + 3;
const RENDER_WIDTH = VIEW_WIDTH + 3;

const UPDATE_DURATION = 100;

export {
  TILE_SIZE,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  RENDER_HEIGHT,
  RENDER_WIDTH,
  MAP_WIDTH,
  MAP_HEIGHT,
  UPDATE_DURATION
};

export default function(cfg) {
  var defaults = {
    // MENU
    selectedLevel: 1,
    // GAME
    updateDuration: UPDATE_DURATION,
    lastUpdateTime: 0,
    frame: 0,
    viewOffset: [0, 0],
    edgeOffset: [0, 0],
    topEdgeOffset: 1, // 1 or (1 / 3),
    showHUD: true,
    mapHeight: MAP_HEIGHT,
    mapWidth: MAP_WIDTH,
    viewHeight: VIEW_HEIGHT * TILE_SIZE + (TILE_SIZE / 2),
    viewWidth: VIEW_WIDTH * TILE_SIZE,
    tileSize: TILE_SIZE,
    tweens: {},
    inputs: {},
    transition: {
      opacity: 1,
      time: 0
    }
  };


  return defaults;
}
