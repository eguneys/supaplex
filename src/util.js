const padZeros = new Array(5).join('0');

function padZero(text, upto) {
  const diff = upto - (text+'').length;
  return padZeros.substr(0, diff) + text;
}

export {
  padZero
};
