function run(data) {
  delayedInput(data);
}

const delayedInput = withDelay(handleInput);

function withDelay(f) {
  let delay = 0;
  return function() {
    if (delay === 0) {
      f.apply(this, arguments);
      delay = 10;
    } else {
      delay--;
    }
  };
}

function handleInput(data) {

  if (data.inputs['LEVEL_UP']) {
    data.selectedLevel--;
  } else if (data.inputs['LEVEL_DOWN']) {
    data.selectedLevel++;
  } else {
    return false;
  }
  return true;
}

export {
  run
};
