import * as levels from './levels';

export default function(cfg) {
  var defaults = {
    frameRate: 60,
    frame: 0,
    tiles: levels.read(levels.initial),
    tweens: {}
  };


  return defaults;
}
