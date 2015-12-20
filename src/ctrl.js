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
        levels.actRole1(data, pos);

        /*
        if (tile.moving === 0)
        {
          levels.move1(data, pos)
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

        // still
          // can left
            // turn left
          // can ahead
            // move 1
          // can right
            // turn right
          // turn left
        // turn
          // can ahead
            // move 1
            // still
        // move 1
          // move 2
        // move 2
          // same as still
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
