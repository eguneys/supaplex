import m from 'mithril';
import keyboard from './keyboard';

import ctrl from './ctrl';
import view from './view';

const init = (element, config) => {
  const controller = new ctrl(config);
  m.render(element, view(controller));

  keyboard(controller);

  const update = () => {
    const now = Date.now();
    const rest = 1 - (now - controller.data.lastUpdateTime) /
    controller.data.updateDuration;

    if (rest <= 0) {
      controller.data.lastUpdateTime = now;
      controller.update();
    }

    controller.updateTweens();
    m.render(element, view(controller));
    requestAnimationFrame(update);
  };

  controller.data.lastUpdateTime = Date.now();
  update();
};

export default init;
