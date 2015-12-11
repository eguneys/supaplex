import m from 'mithril';

function renderTile(ctrl, tile) {
  return [
    m('div', { class: 'square scissors scissors-left'})
  ];
}

function renderContent(ctrl) {
  const children = [];

  const tiles = ctrl.data.tiles;

  for (var i = 0; i<tiles.length; i++) {
    children.push(renderTile(ctrl, tiles[i]));
  }

  return children;
}

function renderViewport(ctrl) {
  const config = function(el, isUpdate, context) {
    if (isUpdate) return;
    ctrl.data.render = function() {
      m.render(el, renderContent(ctrl));
    };
    ctrl.data.renderRAF = function() {
      requestAnimationFrame(ctrl.data.render);
    };
    ctrl.data.render();
  };
  return m('div',
           {class: 'sp-viewport', config: config});
}

function render(ctrl) {
  return m('div',
           {class: 'sp-viewport-wrap'},
           renderViewport(ctrl));
}

export default render;
