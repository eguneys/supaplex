import m from 'mithril';

import ctrl from './ctrl';
import view from './view';

const init = (element, config) => {
  const controller = new ctrl(config);
  m.render(element, view(controller));
};

export default init;
