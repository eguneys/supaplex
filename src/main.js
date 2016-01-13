import m from 'mithril';
import keyboard from './keyboard';

import ctrl from './ctrl';
import view from './view';

function requestLevels() {
  return m.request({method: "GET", url: "/build/levels.json"});
}

const update = (ctrl, element) => {
  ctrl.update();

  m.render(element, view(ctrl));
  requestAnimationFrame(update.bind(null, ctrl, element));
};

const init = (element, config) => {
  requestLevels().then(function(levels) {
    const controller = new ctrl(levels);
    m.render(element, view(controller));

    keyboard(controller);

    update(controller, element);
  });
};

export default init;
