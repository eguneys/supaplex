import k from 'mousetrap';

function preventing(f) {
  return function(e, keys) {
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      // internet explorer
      e.returnValue = false;
    }
    f(keys);
  };
}


export default function init(ctrl) {
  const keys = ['left', 'right', 'up', 'down', 'space', 'enter', 'escape'];

  keys.map((dir) => {
    k.bind(dir, preventing(() => {
      ctrl.move(dir);
    }), 'keydown');
    k.bind([dir], preventing(() => {
      ctrl.clearMove(dir);
    }), 'keyup');
  });
};
