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
    9: 'electron'
  };

  if (!tile) return '';
  const role = roles[tile.role];

  const animation = tile.moving > 0 ?
                    [role, 'go', tile.facing].join('-'):
                    [role, tile.facing, tile.preFace].join('-');

  return `tile ${role} ${animation}`;
}

function renderTile(ctrl, pos) {
  const key = pos[1] * 8 + pos[0];
  const tile = ctrl.data.tiles[key];

  if (!tile || tile.role === 0) return;

  const attrs = {
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

  const allPos = (function() {
    const ps = [];
    for (var y = 0; y<8; y++) {
      for (var x = 0; x<8; x++) {
        ps.push([x, y]);
      }
    }
    return ps;
  })();

  const positions = allPos;

  for (var i = 0; i < positions.length; i++) {
    const newTile = renderTile(ctrl, positions[i])
      if (newTile)
      children.push(newTile);
  }

  return children;
}

function renderViewport(ctrl) {
  return m('div', {class: 'sp-viewport' }, renderContent(ctrl));
}

function renderBorderTop(ctrl) {
  return m('div', {});
}

function render(ctrl) {
  const children = [renderBorderTop(ctrl), renderViewport(ctrl)];

  return m('div',
           {class: 'sp-wrap'},
           children);
}

export default render;
