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
  const runtimeLogs = [];
  const pushLog = function (kind, value) {
    const detail = value && value.stack ? value.stack : String(value);
    runtimeLogs.push(kind + ': ' + detail);
    if (runtimeLogs.length > 14) runtimeLogs.shift();
    if (!diagnostic.hidden) diagnostic.textContent += '\n\n' + kind + ': ' + detail;
  };
  const probe = document.createElement('canvas');
  let webgl = 'unavailable';
  try { webgl = probe.getContext('webgl2') ? 'WebGL 2 available' : (probe.getContext('webgl') ? 'WebGL 1 only' : 'no WebGL context'); } catch (e) { webgl = 'WebGL probe failed: ' + e; }
  const environment = '\n\nBrowser: ' + navigator.userAgent + '\nCross origin isolated: ' + String(window.crossOriginIsolated) + '\nSharedArrayBuffer: ' + typeof SharedArrayBuffer + '\nWebAssembly: ' + typeof WebAssembly + '\nGraphics: ' + webgl;
  for (const level of ['log', 'warn', 'error']) {
    const original = console[level].bind(console);
    console[level] = function () {
      const message = Array.from(arguments).map(value => value && value.stack ? value.stack : String(value)).join(' ');
      pushLog('console.' + level, message);
      original.apply(console, arguments);
    };
  }
  window.addEventListener('error', function (event) { pushLog('window error', event.error || event.message); });
  window.addEventListener('unhandledrejection', function (event) { pushLog('unhandled rejection', event.reason); });
  window.alert = function (message) {
    diagnostic.textContent = 'PLAYER STARTUP ERROR\n\n' + String(message) + environment + (runtimeLogs.length ? '\n\nRUNTIME LOG\n' + runtimeLogs.join('\n') : '\n\nNo console errors captured.');
    diagnostic.hidden = false;
    statusText.textContent = 'STARTUP ERROR';
  };
  window.onerror = function (message, source, line, column, error) {
    pushLog('browser error', error || (String(message) + ' at ' + source + ':' + line + ':' + column));
    return true;
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
    if (window.Player) window.Player.start('celua-machine-v2.0.2-web4.love');
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