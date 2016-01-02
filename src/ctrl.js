import data from './data';
import * as roles from './roles';
import * as levels from './levels';

export default function(levelData) {
  this.data = data();

  this.move = (dir) => {
    const data = this.data;
    data.inputs[dir] = true;
  };

  this.clearMove = (dir) => {
    const data = this.data;
    data.inputs[dir] = false;
  };

  this.init = () => {
    const data = this.data;
    data.tiles = levels.read(levelData.levels[3].data),

    data.tiles.map((tile, pos) => {
      if (tile.role === 'MURPHY') {
        roles.viewportCenter(data, roles.key2pos(pos));
      }
    });
  };

  this.init();

  this.update = () => {
    const data = this.data;
    const tiles = data.tiles;

    data.frame++;

    tiles.map((tile, pos) => {
      roles.clearTrail(data, pos);
    });

    tiles.map((tile, pos) => {
      if (data.frame === tile.frame) return;
      roles.actRole(data, pos);
    });
  };

  this.updateTweens = (rest) => {
    const data = this.data;
    const newTweens = {};


    const now = Date.now();
    Object.keys(data.tweens).map((key) => {
      const tween = data.tweens[key];
      const nowOrPause = tween.pause?tween.pause:now;
      const rest = 1 - (nowOrPause - tween.start) / (data.updateDuration * 2);
      tween[1] = [Math.round(tween[0][0] * rest),
                  Math.round(tween[0][1] * rest)];

      if (tween.pause || rest > 0) {
        newTweens[key] = tween;
      }
    });

    if (data.viewTween) {
      updateTween(data.viewTween, now, data.updateDuration);
    }

    if (data.edgeTween) {
      updateTween(data.edgeTween, now, data.updateDuration);
    }

    data.tweens = newTweens;
  };
}

function updateTween(tween, now, duration) {
  let rest = 1 - (now - tween.start) / (duration * 2);

  if (rest < 0) {
    rest = 0;
  }

  tween[1] = [Math.round(tween[0][0] * rest),
              Math.round(tween[0][1] * rest)];
}
