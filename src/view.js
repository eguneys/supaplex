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
    if (classes[i]) arr.push(i);
  }

  return arr.join(' ');
}

function portAnimation(portClass) {
  return (role, tile) => {
    return [portClass].join(' ');
  };
}

function tileAnimation(role, tile){
  const animations = {
    1: (role, tile) => {
      return tile.moving > 0 ?
             [role, 'go', tile.facing].join('-'):
             [role, tile.facing, tile.preFace].join('-');
    },
    2: (role, tile) => {
      if (tile.rolling > 0) {
        const hanged = tile.rolling === 3?'hanged ':'';
        return hanged + [role, 'roll', tile.facing].join('-');
      }
      return '';
    },
    3: (role, tile) => {
      if (tile.rolling > 0) {
        const hanged = tile.rolling === 3?'hanged ':'';
        return hanged + [role, 'roll', tile.facing].join('-');
      }
      if (tile.vanishing > 0) {
        return 'vanish';
      }
      return '';
    },
    8: (role, tile) => {
      if (tile.vanishing > 0) {
        return 'vanish';
      }
      return '';
    },
    10: (role, tile) => {
      return tile.active > 0 ? `active`:'';
    },
    12: (role, tile) => {
      if (tile.pushing > 0) {
        return [role, 'push', tile.facing].join('-');
      } else if (tile.moving > 0) {
        return [role, 'go', tile.facing].join('-');
      } else if (tile.snapping > 0) {
        return [role, 'snap', tile.facing].join('-');
      }
      return '';
    },
    13: portAnimation('port-all')
  };

  const animation = animations[tile.role];

  if (!animation) return '';

  return animation(role, tile);
}

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
  12: 'morphy',
  13: 'port'
};

function tileClass(tile) {
  if (!tile) return '';
  const role = roles[tile.role];

  const animation = tileAnimation(role, tile);

  return `tile ${role} ${animation}`;
}

function tileChildren(ctrl, tile) {
  let attrs;
  if (tile.role === 13 && tile.porting > 0) {

    attrs = {
      style: {
        zIndex: -1
      },
      class: tileClass(tile.portTile)
    };

    if (ctrl.data.tweens) {
      const tween = ctrl.data.tweens[`port${tile.key}`];

      if (tween) {
        attrs.style[transformProp()] = translate(tween[1]);
      }
    }

    const portingMurphy = m('div', attrs);

    return portingMurphy;
  }
  return [];
}

function tileSiblings(ctrl, tile, pos, tileElement) {
  if (tile.role === 12 && tile.eatingRole > 0) {
    const attrs = {
      style: {
        left: pos[0] * 32,
        top: pos[1] * 32
      },
      class: `tile ${roles[tile.eatingRole]}`
    };

    const eatenTile = m('div', attrs);

    return m('div', {}, [eatenTile, tileElement]);
  }

  return tileElement;
}

function renderTile(ctrl, tile, pos, key) {
  if (!tile || tile.role === 0) {
    return null;
  }

  const attrs = {
    key: tile.key,
    style: {
      left: pos[0] * 32,
      top: pos[1] * 32
    },
    class: tileClass(tile)
  };

  if (ctrl.data.tweens) {
    const tween = ctrl.data.tweens[key];

    if (tween) {
      attrs.style[transformProp()] = translate(tween[1]);
    }
  }

  const children = tileChildren(ctrl, tile);

  const tileElement =  m('div', attrs, children);

  const siblings = tileSiblings(ctrl, tile, pos, tileElement);

  return siblings;
}

function byKey(tile1, tile2) {
  return tile1.attrs.key - tile2.attrs.key;
}

function renderContent(ctrl) {
  const ports = [];
  const electrons = [];
  const eatables = [];

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

    if (tile.role === 12) {
      eatables.push(newTile);
    } else if (tile.role === 9 || tile.role === 1) {
      electrons.push(newTile);
    } else if (newTile)
      ports.push(newTile);
  }

  const attrs = { style: {} };

  if (ctrl.data.viewTween) {
    attrs.style[transformProp()] = translate(ctrl.data.viewTween[1]);
  }

  return m('div', attrs,
           m('div', {class: 'eatables'}, eatables.sort(byKey)),
           m('div', {class: 'electrons'}, electrons.sort(byKey)),
           m('div', {class: 'ports'}, ports.sort(byKey)));
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
