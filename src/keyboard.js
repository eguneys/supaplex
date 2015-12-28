import k from 'mousetrap';

function preventing(f) {
  return function(e) {
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      // internet explorer
      e.returnValue = false;
    }
    f();
  };
}


export default function init(ctrl) {
  k.bind('left', preventing(() => {
    ctrl.move('left');
  }), 'keydown');
  k.bind('right', preventing(() => {
    ctrl.move('right');
  }), 'keydown');
  k.bind('up', preventing(() => {
    ctrl.move('up');
  }), 'keydown');
  k.bind('down', preventing(() => {
    ctrl.move('down');
  }), 'keydown');

  k.bind('left', preventing(() => {
    ctrl.clearMove('left');
  }), 'keyup');

  k.bind('right', preventing(() => {
    ctrl.clearMove('right');
  }), 'keyup');

  k.bind('down', preventing(() => {
    ctrl.clearMove('down');
  }), 'keyup');

  k.bind('up', preventing(() => {
    ctrl.clearMove('up');
  }), 'keyup');

};
