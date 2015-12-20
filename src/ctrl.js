import data from './data';
import * as levels from './levels';

export default function(cfg) {
  this.data = data(cfg);

  this.update = (data) => {
    const tiles = data.tiles;

    data.frame++;

    tiles.map((tile, pos) => {
      if (data.frame === tile.frame) return;

      if (tile.role === 1) {
        /*
           if (tile.moving === 0) {
           levels.move1(data, pos);
           } else if (tile.moving === 1) {
           levels.move2(data, pos);
           } else {
           levels.move0(data, pos);
           }
        */
        /*
           if (levels.isTurning(tile)) {
           levels.move3(data, pos);
           } else {
           levels.move0(data, pos);
           }
        */
        // scissors
        // turning x
        // moving still
        // moving 1
        // moving 2
      }
    });
  };

  this.updateTweens = (data, rest) => {
    const newTweens = {};


    const now = Date.now();
    Object.keys(data.tweens).map((key) => {
      const tween = data.tweens[key];
      const rest = 1 - (now - tween.start) / (data.frameRate * 2);
      tween[1] = [Math.round(tween[0][0] * rest),
                  Math.round(tween[0][1] * rest)];

      if (rest > 0) {
        newTweens[key] = tween;
      }
    });

    data.tweens = newTweens;
  };
}
