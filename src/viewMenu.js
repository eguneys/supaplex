import m from 'mithril';
import * as menu from './menu';

function renderAbsolute(name, top, left, child) {
  const attrs = {
    class: name,
    style: {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`
    }
  };

  return {
    tag: 'div',
    attrs: attrs,
    children: [child]
  };
}

function renderText(text, color) {
  const attrs = {
    class: `sp-text-menu sp-${color}`
  };

  return {
    tag: 'div',
    attrs: attrs,
    children: [text]
  };
};

function renderMessageLine(ctrl) {
  const textLine = renderText(m.trust(ctrl.vm.messageLine),
                              'green');
  return renderAbsolute('sp-msg-line', 240, 336, textLine);
}

function holdit(action) {
  const start = 250;
  const delay = 12;

  let t, s = start, d = delay;
  const repeat = function(data) {
    action(data);
    t = window.setTimeout(repeat.bind(null, data), s);
    if (d < 0) {
      s = start / 8;
    } else if (d < delay / 2) {
      s = start / 4;
    }
    d--;
  };

  const stop = function() {
    s = start;
    d = delay;
    window.clearTimeout(t);
  };

  return {
    mousedown: function(data) {
      repeat(data);
    },
    mouseup: function() {
      stop();
    }
  };
}

function renderButton(ctrl, classes, holdAction) {
  const attrs = {
    class: `sp-button ${classes}`
  };

  if (holdAction) {
    attrs.onmousedown = holdAction.mousedown.bind(null, ctrl.data);
    attrs.onmouseup = holdAction.mouseup;
  }

  return {
    tag: 'div',
    attrs: attrs
  };
}

function renderOk(ctrl) {
  return {
    tag: 'div',
    attrs: {
      onclick: ctrl.levelSelect,
      style: {
        height: 48,
        width: 48
      }
    }
  };
}

const levelUpHold = holdit(menu.levelListUp);
const levelDownHold = holdit(menu.levelListDown);

function renderLevelList(ctrl) {

  const level1 = renderText(ctrl.vm.levelLine0, 'blue');
  const level2 = renderText(ctrl.vm.levelLine1, 'yellow');
  const level3 = renderText(ctrl.vm.levelLine2, 'red');

  const buttonUp = renderButton(ctrl, 'sp-level-button up', levelUpHold);
  const buttonDown = renderButton(ctrl, 'sp-level-button down', levelDownHold);

  const buttonOk = renderOk(ctrl);

  const left = 288;
  const top = 296;
  const height = 18;

  return [renderAbsolute('sp-level-line1', top, left, level1),
          renderAbsolute('sp-level-line2', top + height, left, level2),
          renderAbsolute('sp-level-line3', top + height * 2, left, level3),
          renderAbsolute('sp-level-buttonu', 284, 284, buttonUp),
          renderAbsolute('sp-level-buttond', 362, 284, buttonDown),
          renderAbsolute('sp-ok-button', 280, 186, buttonOk)
         ];
}

export default function renderMenu(ctrl) {
  const viewHeight = ctrl.data.viewHeight;
  const viewWidth = ctrl.data.viewWidth;


  const children = [renderMessageLine(ctrl),
                    renderLevelList(ctrl)];

  const attrs = {
    class: 'sp-menu',
    style: {
      backgroundSize: `${viewWidth}px ${viewHeight}px`,
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
