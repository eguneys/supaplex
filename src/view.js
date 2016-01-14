import m from 'mithril';

import renderGame from './viewGame';
import renderMenu from './viewMenu';

function render(ctrl) {
  const children = [];
  if (ctrl.data.currentView === 'GAME') {
    children.push(renderGame(ctrl));
  } else {
    children.push(renderMenu(ctrl));
  }

  return {
    tag: 'div',
    children: children
  };
}

export default render;
