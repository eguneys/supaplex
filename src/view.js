import m from 'mithril';

function transformProp() {
  return 'transform';
}

function translate(pos) {
  return `translate(${pos[0]}px, ${pos[1]}px)`;
}

/*
 *  { 'className': true }
 */
function classSet(classes) {
  const arr = [];

  for (var i in classes) {
    if (classes[i]) arr.push[i];
  }

  return arr.join(' ');
}

function tileAnimation(role, tile){
  const animations = {
    1: (tile) => {
      return tile.moving > 0 ?
             [role, 'go', tile.facing].join('-'):
             [role, tile.facing, tile.preFace].join('-');
    },
    10: (tile) => {
      return tile.active > 0 ? `active`:'';
    },
    12: (tile) => {
      return tile.moving > 0 ?
             [role, 'go', tile.facing].join('-'):
             [role].join('-');
    }
  };

  const animation = animations[tile.role];

  if (!animation) return '';

  return animation(tile);
}


function tileClass(tile) {
  const roles = {
    0: 'empty',
    1: 'scissors',
    2: 'zonks',
    3: 'infotron',
    4: 'explosion',
    5: 'reddisk',
    6: 'redterminal',
    7: 'greenterminal',
    8: 'base',
    9: 'electron',
    10: 'base',
    12: 'morphy'
  };

  if (!tile) return '';
  const role = roles[tile.role];

  const animation = tileAnimation(role, tile);

  return `tile ${role} ${animation}`;
}

function renderTile(ctrl, tile, pos, key) {

  if (!tile || tile.role === 0) {
    return;
  }

  const attrs = {
    key: tile.key,
    style: {
      left: pos[0] * 32,
      top: pos[1] * 32
    },
    class: tileClass(tile)
  }

  if (ctrl.data.tweens) {
    const tween = ctrl.data.tweens[key];

    if (tween) {
      attrs.style[transformProp()] = translate(tween[1]);
    }
  }

  return m('div', attrs);
}

function renderContent(ctrl) {
  const children = [];
  const electrons = [];

  const allPos = (function(width, height) {
    const ps = [];
    for (var y = 0; y<height; y++) {
      for (var x = 0; x<width; x++) {
        ps.push([x, y]);
      }
    }
    return ps;
  })(ctrl.data.viewWidth, ctrl.data.viewHeight);

  const positions = allPos;

  const viewOffset = ctrl.data.viewOffset;

  for (var i = 0; i < positions.length; i++) {
    const pos = positions[i];
    const key = (viewOffset[1] + pos[1]) * 60 + pos[0] + viewOffset[0];
    const tile = ctrl.data.tiles[key];

    const newTile = renderTile(ctrl, tile, pos, key);

    if (tile.role === 9 || tile.role === 1) {
      electrons.push(newTile);
    } else if (newTile)
      children.push(newTile);
  }

  const attrs = { style: {} };

  if (ctrl.data.viewTween) {
    attrs.style[transformProp()] = translate(ctrl.data.viewTween[1]);
  }

  return m('div', attrs,
           m('div', {class: 'static'}, children),
           m('div', {class: 'electrons'}, electrons));
}

function renderViewport(ctrl) {
  const tileSize = ctrl.data.tileSize;
  const viewHeight = ctrl.data.viewHeight * tileSize;
  const viewWidth = ctrl.data.viewWidth * tileSize;

  const edgeLeft = -1 * ctrl.data.edgeOffset[0] * tileSize;
  const edgeTop = -1 * ctrl.data.edgeOffset[1] * tileSize;

  const attrs = {
    class: 'sp-viewport',
    style: {
      zIndex: -1,
      height: viewHeight,
      width: viewWidth,
      left: edgeLeft,
      top:edgeTop
    }
  };

  if (ctrl.data.edgeTween) {
    attrs.style[transformProp()] = translate(ctrl.data.edgeTween[1]);
  }

  return m('div', attrs, renderContent(ctrl));
}

function renderViewportWrap(ctrl) {
  const tileSize = ctrl.data.tileSize;
  const viewHeight = (ctrl.data.viewHeight - 2) * tileSize;
  const viewWidth = (ctrl.data.viewWidth - 2) * tileSize;

  const children = [renderViewport(ctrl)];

  const attrs = {
    class: 'sp-wrap',
    style: {
      height: viewHeight,
      width: viewWidth,
    }
 
  };

  return m('div', attrs, children);
}

function render(ctrl) {
  const children = [renderViewportWrap(ctrl)];

  return m('div', children);
}

export default render;
