import data from './data';
import * as levels from './levels';

export default function(cfg) {
  this.data = data(cfg);

  this.move = (dir) => {
    const data = this.data;
    data.inputs[dir] = true;
  };

  this.clearMove = (dir) => {
    const data = this.data;
    data.inputs[dir] = false;
  };

  this.update = () => {
    const data = this.data;
    const tiles = data.tiles;

    data.frame++;

    tiles.map((tile, pos) => {
      if (data.frame === tile.frame) return;

      levels.actRole(data, pos);
    });
  };

  this.updateTweens = (rest) => {
    const data = this.data;
    const newTweens = {};


    const now = Date.now();
    Object.keys(data.tweens).map((key) => {
      const tween = data.tweens[key];
      const rest = 1 - (now - tween.start) / (data.updateDuration * 2);
      tween[1] = [Math.round(tween[0][0] * rest),
                  Math.round(tween[0][1] * rest)];

      if (rest > 0) {
        newTweens[key] = tween;
      }
    });

    const _tween = data.viewTween;
    if (_tween) {
    const _rest = 1 - (now - _tween.start) / (data.updateDuration * 2);
    _tween[1] = [Math.round(_tween[0][0] * _rest),
                Math.round(_tween[0][1] * _rest)];

      if (_rest <= 0) {
        delete data.viewTween;
      }
    }

    data.tweens = newTweens;
  };
}
