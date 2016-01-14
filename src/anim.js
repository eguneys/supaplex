const later = window.setTimeout;

function fadeToView(data, view, srcTime, dstTime) {
  data.transition.opacity = 0;
  data.transition.time = srcTime;

  later(function() {
    data.currentView = view;
    data.transition.opacity = 1;
    data.transition.time = dstTime;
  }, srcTime * 1000);
}

export {
  fadeToView
}
