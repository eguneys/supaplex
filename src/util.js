import * as Constants from './data';

const { MAP_HEIGHT, MAP_WIDTH } = Constants;

const padZeros = new Array(5).join('0');

function padZero(text, upto) {
  const diff = upto - (text+'').length;
  return padZeros.substr(0, diff) + text;
}

function pos2key(pos) {
  return pos[1] * MAP_WIDTH + pos[0];
}

function key2pos(key) {
  return [key % MAP_WIDTH, Math.floor(key / MAP_WIDTH)];
}

export {
  padZero,
  pos2key,
  key2pos
};
