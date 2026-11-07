(function () {
  const stage = document.getElementById('stage');
  const canvas = document.getElementById('canvas');
  const spinner = document.getElementById('spinner');
  const statusText = document.getElementById('status-text');
  const restart = document.getElementById('restart');
  const fullscreen = document.getElementById('fullscreen');

  const diagnostic = document.createElement('pre');
  diagnostic.id = 'runtime-diagnostic';
  diagnostic.hidden = true;
  document.body.appendChild(diagnostic);
  const nativeAlert = window.alert.bind(window);
  window.alert = function (message) {
    diagnostic.textContent = 'PLAYER STARTUP ERROR\n\n' + String(message) + '\n\nBrowser: ' + navigator.userAgent + '\nCross origin isolated: ' + String(window.crossOriginIsolated) + '\nSharedArrayBuffer: ' + typeof SharedArrayBuffer;
    diagnostic.hidden = false;
    statusText.textContent = 'STARTUP ERROR';
  };
  const oldError = window.onerror;
  window.onerror = function (message, source, line, column, error) {
    diagnostic.textContent = 'BROWSER ERROR\n\n' + String(message) + '\n' + String(source) + ':' + line + ':' + column + (error && error.stack ? '\n\n' + error.stack : '');
    diagnostic.hidden = false;
    return oldError ? oldError.apply(this, arguments) : false;
  };

  function syncStatus() {
    const state = spinner.className;
    if (state.includes('error')) {
      statusText.textContent = 'CHECK CONNECTION';
      spinner.querySelector('.loading-label').textContent = 'The game could not load. Check your connection, then restart the page.';
    } else if (state.includes('loading') || state.includes('pending')) {
      statusText.textContent = 'LOADING';
    } else {
      statusText.textContent = 'ENGINE READY';
    }
  }

  new MutationObserver(syncStatus).observe(spinner, { attributes: true, attributeFilter: ['class'] });
  syncStatus();

  restart.addEventListener('click', function () {
    statusText.textContent = 'RESTARTING';
    if (window.Player) window.Player.start('celua-machine-v2.0.2-web2.love');
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