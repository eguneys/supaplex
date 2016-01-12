import m from 'mithril';
import { padZero } from './util';

function renderText(text, color) {
  const attrs = {
    class: `sp-text sp-${color}`
  };

  return {
    tag: 'div',
    attrs: attrs,
    children: [text]
  };
}

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

function renderClock(hour, minute, second) {
  const hourText = renderText(hour, 'red');
  const minuteText = renderText(minute, 'red');
  const secondText = renderText(second, 'red');

  return [renderAbsolute('sp-hud-hour', -9, 322, hourText),
          renderAbsolute('sp-hud-minute', -9, 370, minuteText),
          renderAbsolute('sp-hud-second', -9, 418, secondText)];
}

function renderPlayerName(name) {
  const textLine = renderText(m.trust(name), 'red');
  return renderAbsolute('sp-hud-player-name', -9, 146, textLine);
}

function renderLevelNo(level) {
  const textLine = renderText(level, 'blue');
  return renderAbsolute('sp-hud-level', 14, 34, textLine);
}

function renderLevelName(name) {
  const textLine = renderText(name, 'blue');
  return renderAbsolute('sp-hud-level-name', 14, 130, textLine);
}

function renderInfotronCount(count) {
  const textLine = renderText(count, 'blue');
  return renderAbsolute('sp-hud-infotrons', 14, 546, textLine);
}

export default function renderHUD(ctrl) {
  if (!ctrl.data.showHUD) {
    return '';
  }

  const tileSize = ctrl.data.tileSize;
  const width = ctrl.data.viewWidth;
  const height = tileSize * 3 / 2;

  const children = [renderLevelNo(ctrl.vm.levelNo),
                    renderLevelName(ctrl.vm.levelTitle),
                    renderInfotronCount(ctrl.vm.infotronsNeeded),
                    renderPlayerName('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;KJH'),
                    renderClock('00', '00', '11')
                   ];

  const attrs = {
    class: 'sp-hud',
    style: {
      backgroundSize: `${width}px ${height}px`,
      height: height,
      width: width
    }
  };
  return {
    tag: 'div',
    attrs: attrs,
    children: children
  };
}
