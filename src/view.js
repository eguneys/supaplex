import m from 'mithril';

import renderGame from './viewGame';
import renderMenu from './viewMenu';

function renderTransition(ctrl) {
  const opacity = ctrl.data.transition.opacity;
  const time = ctrl.data.transition.time;

  const attrs = {
    class: 'sp-transition',
    style: {
      opacity: opacity,
      transition: `opacity ${time}s`
    }
  };

  const children = [];
  if (ctrl.data.currentView === 'GAME') {
    children.push(renderGame(ctrl));
  } else {
    children.push(renderMenu(ctrl));
  }

  return {
    tag: 'div',
    attrs: attrs,
    children: children
  };
}

function render(ctrl) {
  const viewHeight = ctrl.data.viewHeight;
  const viewWidth = ctrl.data.viewWidth;

  const attrs = {
    class: 'sp-transition-wrap',
    style: {
      height: viewHeight,
      width: viewWidth
    }
  };

  return {
    tag: 'div',
    attrs: attrs,
    children: [renderTransition(ctrl)]
  };
}

export default render;
