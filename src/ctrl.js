import data from './data';
import * as roles from './roles';
import * as levels from './levels';
import * as util from './util';

export default function(levelData) {
  this.data = data();

  this.vm = {
    hud: {}
  };

  this.levelData = levelData;

  this.move = (dir) => {
    const data = this.data;
    data.inputs[dir] = true;
  };

  this.clearMove = (dir) => {
    const data = this.data;
    data.inputs[dir] = false;
  };

  this.toggleHUD = () => {
    const data = this.data;

    data.showHUD = !data.showHUD;

    if (data.showHUD) {
      data.topEdgeOffset = 1;
    } else {
      data.topEdgeOffset = (1 / 3);
    }

    this.centerScroll();

  };

  this.init = (levelNo) => {
    const level = this.levelData.levels[levelNo - 1];

    const data = this.data;

    data.levelNo = levelNo;
    data.levelTitle = level.title;
    data.infotronsNeeded = level.infotronsNeeded;
    data.gravity = level.gravity;

    data.tiles = levels.read(level.data);

    this.centerScroll();
  };

  this.centerScroll = () => {
    const data = this.data;
    data.tiles.map((tile, pos) => {
      if (tile.role === 'MURPHY') {
        roles.viewportCenter(data, roles.key2pos(pos));
      }
    });
  };

  this.updateHUD = () => {
    const data = this.data;
    const vm = this.vm;


    vm.levelNo = util.padZero(data.levelNo, 3);
    vm.levelTitle = data.levelTitle;
    vm.infotronsNeeded = util.padZero(data.infotronsNeeded, 3);
  };

  this.updateGame = () => {
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

  this.update = () => {
    this.updateGame();
    this.updateHUD();
  };

  this.updateTweens = (rest) => {
    const data = this.data;
    const newTweens = {};


    const now = Date.now();
    Object.keys(data.tweens).map((key) => {
      const tween = data.tweens[key];
      const nowOrPause = tween.pause?tween.pause:now;
      const duration = tween.duration?tween.duration:data.updateDuration * 2;
      const rest = 1 - (nowOrPause - tween.start) / duration;
      tween[1] = [Math.round(tween[0][0] * rest),
                  Math.round(tween[0][1] * rest)];

      if (tween.pause || rest > 0) {
        newTweens[key] = tween;
      }
    });

    if (data.viewTween) {
      updateTween(data.viewTween, now, data.updateDuration * 2);
    }

    if (data.edgeTween) {
      updateTween(data.edgeTween, now, data.updateDuration * 2);
    }

    data.tweens = newTweens;
  };

  this.init(1);
}

function updateTween(tween, now, duration) {
  duration = (tween.duration)?tween.duration:duration;
  let rest = 1 - (now - tween.start) / duration;

  if (rest > 1) {
    rest = 1;
  }

  if (rest < 0) {
    rest = 0;
  }

  tween[1] = [Math.round(tween[0][0] * rest),
              Math.round(tween[0][1] * rest)];
}
