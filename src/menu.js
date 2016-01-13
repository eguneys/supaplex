function levelListUp(data) {
  data.selectedLevel = Math.max(1, data.selectedLevel - 1);
}

function levelListDown(data) {
  data.selectedLevel = Math.min(111, data.selectedLevel + 1);
}


export {
  levelListUp,
  levelListDown
}
