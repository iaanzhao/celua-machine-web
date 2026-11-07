(function () {
  const stage = document.getElementById('stage');
  const canvas = document.getElementById('canvas');
  const spinner = document.getElementById('spinner');
  const statusText = document.getElementById('status-text');
  const restart = document.getElementById('restart');
  const fullscreen = document.getElementById('fullscreen');

  function syncStatus() {
    const state = spinner.className;
    if (state.includes('error')) {
      statusText.textContent = 'CHECK CONNECTION';
      spinner.querySelector('.loading-label').textContent = 'The game could not load. Check your connection, then restart the page.';
    } else if (state.includes('loading') || state.includes('pending')) {
      statusText.textContent = 'LOADING';
    } else {
      statusText.textContent = 'RUNNING';
    }
  }

  new MutationObserver(syncStatus).observe(spinner, { attributes: true, attributeFilter: ['class'] });
  syncStatus();

  restart.addEventListener('click', function () {
    statusText.textContent = 'RESTARTING';
    if (window.Player) window.Player.start('celua-machine-v2.0.2.love');
    else window.location.reload();
  });

  fullscreen.addEventListener('click', function () {
    const target = stage.requestFullscreen ? stage : canvas;
    if (target.requestFullscreen) target.requestFullscreen();
  });

  document.addEventListener('fullscreenchange', function () {
    fullscreen.innerHTML = document.fullscreenElement ? 'Exit full screen <span aria-hidden="true">⤢</span>' : 'Full screen <span aria-hidden="true">⤢</span>';
  });
})();