import m from 'mithril';
import * as Constants from './data';
import * as util from './roles';

import renderHUD from './viewHUD';

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
  const animation = animations[tile.role];

  if (!animation) return '';

  return animation(role, tile);
}

const animations = {
  SNIKSNAK: (role, tile) => {
    return tile.moving > 0 ?
      [role, 'go', tile.facing].join('-'):
      [role, tile.facing, tile.preFace].join('-');
  },
  ZONK: (role, tile) => {
    if (tile.rolling > 0) {
      const hanged = tile.rolling === 3?'hanged ':'';
      return hanged + [role, 'roll', tile.facing].join('-');
    }
    return '';
  },
  INFOTRON: (role, tile) => {
    if (tile.rolling > 0) {
      const hanged = tile.rolling === 3?'hanged ':'';
      return hanged + [role, 'roll', tile.facing].join('-');
    }
    if (tile.vanishing > 0) {
      return 'vanish';
    }
    return '';
  },
  BASE: (role, tile) => {
    if (tile.vanishing > 0) {
      return 'vanish';
    }
    return '';
  },
  BUG: (role, tile) => {
    return tile.active > 0 ? `active`:'';
  },
  MURPHY: (role, tile) => {
    if (tile.pushing > 0) {
      return [role, 'push', tile.facing].join('-');
    } else if (tile.moving > 0) {
      return [role, 'go', tile.facingHorizontal].join('-');
    } else if (tile.snapping > 0) {
      return [role, 'snap', tile.facing].join('-');
    }
    return '';
  },
  PORT_ALL: portAnimation('port-all')
};

const roles = {
  EMPTY: 'empty',
  SNIKSNAK: 'scissors',
  ZONK: 'zonks',
  INFOTRON: 'infotron',
  EXPLOSION: 'explosion',
  FLOPPY_RED: 'reddisk',
  TERMINAL_RED: 'redterminal',
  TERMINAL_GREEN: 'greenterminal',
  BASE: 'base',
  ELECTRON: 'electron',
  BUG: 'base',
  MURPHY: 'morphy',
  PORT_ALL: 'port'
};

function tileClass(tile) {
  if (!tile) return '';
  const role = roles[tile.role];

  const animation = tileAnimation(role, tile);

  return `tile ${role} ${animation}`;
}

function tileChildren(ctrl, tile) {
  let attrs;
  if (tile.role === 'PORT_ALL' && tile.porting > 0) {

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

    const portingMurphy = { tag: 'div',
                            attrs: attrs,
                            children: []
                          };

    return portingMurphy;
  }
  return [];
}

function tileSiblings(ctrl, tile, pos, tileElement) {
  if (tile.role === 'MURPHY' && tile.eatingRole !== '') {
    const attrs = {
      style: {
        left: pos[0] * 32,
        top: pos[1] * 32
      },
      class: `tile ${roles[tile.eatingRole]}`
    };

    const eatenTile = { tag: 'div',
                        attrs: attrs,
                        children: []
                      };

    return { tag: 'div',
             attrs: {},
             children: [eatenTile, tileElement]
           };
  }

  return tileElement;
}

function renderTile(ctrl, tile, pos, key) {
  if (!tile || tile.role === 'EMPTY') {
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

  const tileElement =  { tag: 'div',
                         attrs: attrs,
                         children: children
                       };

  const siblings = tileSiblings(ctrl, tile, pos, tileElement);

  return siblings;
}

function byKey(tile1, tile2) {
  return tile1.attrs.key - tile2.attrs.key;
}

const allPos = (function(width, height) {
  const ps = [];
  for (var y = 0; y<height; y++) {
    for (var x = 0; x<width; x++) {
      ps.push([x, y]);
    }
  }
  return ps;
})(Constants.RENDER_WIDTH, Constants.RENDER_HEIGHT);


function renderContent(ctrl) {
  const bases = [];
  const zonks = [];
  const electrons = [];
  const eatables = [];

  const positions = allPos;

  const viewOffset = ctrl.data.viewOffset;

  for (var i = 0; i < positions.length; i++) {
    const pos = positions[i];
    //const key = (viewOffset[1] + pos[1]) * 60 + pos[0] + viewOffset[0];
    const key = util.pos2key([pos[0]+viewOffset[0],
                               pos[1] + viewOffset[1]]);
    const tile = ctrl.data.tiles[key];

    const newTile = renderTile(ctrl, tile, pos, key);

    if (tile.role === 'MURPHY') {
      eatables.push(newTile);
    } else if (tile.role === 'ELECTRON' || tile.role === 'SNIKSNAK') {
      electrons.push(newTile);
    } else if (tile.role ==='BASE') {
      bases.push(newTile);
    } else if (newTile) {
      zonks.push(newTile);
    }
  }

  const attrs = { style: {} };

  if (ctrl.data.viewTween) {
    attrs.style[transformProp()] = translate(ctrl.data.viewTween[1]);
  }

  return {
    tag: 'div',
    attrs: attrs,
    children: [
      { tag: 'div',
        attrs: {class: 'eatables'},
        children: eatables.sort(byKey)
      },
      { tag: 'div',
        attrs: {class: 'electrons'},
        children: electrons.sort(byKey)
      },
      { tag: 'div',
        attrs: {class: 'bases'},
        children: bases.sort(byKey)
      },
      { tag: 'div',
        attrs: {class: 'zonks'},
        children: zonks.sort(byKey)
      }
    ]};
}

function renderViewport(ctrl, viewHeight) {
  const tileSize = ctrl.data.tileSize;
  const renderHeight = Constants.RENDER_HEIGHT * tileSize;
  const renderWidth = Constants.RENDER_WIDTH * tileSize;

  const edgeOffset = ctrl.data.edgeOffset;

  const attrs = {
    class: 'sp-viewport',
    style: {
      height: renderHeight,
      width: renderWidth,
      left: edgeOffset[0],
      top:edgeOffset[1]
    }
  };

  if (ctrl.data.edgeTween) {
    attrs.style[transformProp()] = translate(ctrl.data.edgeTween[1]);
  }

  return {
    tag: 'div',
    attrs: attrs,
    children: [renderContent(ctrl)]
  };
}

function renderViewportWrap(ctrl) {
  const tileSize = ctrl.data.tileSize;
  const viewHeight = ctrl.data.viewHeight;
  const viewWidth = ctrl.data.viewWidth;

  const children = [renderViewport(ctrl, viewHeight),
                    renderHUD(ctrl)];

  const attrs = {
    class: 'sp-wrap',
    style: {
      height: viewHeight,
      width: viewWidth
    }

  };

  return {
    tag: 'div',
    attrs: attrs,
    children: children
  };
}

function render(ctrl) {
  const children = [renderViewportWrap(ctrl)];

  return {
    tag: 'div',
    children: children
  };
}

export default render;
