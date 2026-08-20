(() => {
  const gameCanvas = document.getElementById('game');
  const wrap = document.querySelector('.game-wrap');
  const start = document.getElementById('startBtn');
  if (!gameCanvas || !wrap || !start) return;

  const reticle = document.createElement('div');
  reticle.id = 'lockedReticle';
  Object.assign(reticle.style, {
    position: 'absolute',
    width: '28px',
    height: '28px',
    border: '2px solid rgba(255,255,255,.95)',
    borderRadius: '50%',
    boxShadow: '0 0 8px #55f7ff, 0 0 18px #ff4ed8',
    pointerEvents: 'none',
    zIndex: '14',
    transform: 'translate(-50%,-50%)',
    display: 'none'
  });
  reticle.innerHTML = '<span style="position:absolute;left:50%;top:3px;width:2px;height:20px;background:#fff;transform:translateX(-50%);opacity:.75"></span><span style="position:absolute;top:50%;left:3px;height:2px;width:20px;background:#fff;transform:translateY(-50%);opacity:.75"></span>';
  wrap.appendChild(reticle);

  function placeReticle() {
    const r = gameCanvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    reticle.style.left = ((mouse.x / r.width) * 100) + '%';
    reticle.style.top = ((mouse.y / r.height) * 100) + '%';
  }

  function requestLock() {
    if (document.pointerLockElement === gameCanvas) return;
    try {
      const result = gameCanvas.requestPointerLock();
      if (result && typeof result.catch === 'function') result.catch(() => {});
    } catch (_) {}
  }

  // Pointer lock must be requested directly from a user gesture.
  start.addEventListener('click', requestLock, true);
  gameCanvas.addEventListener('mousedown', () => {
    if (typeof running !== 'undefined' && running && document.pointerLockElement !== gameCanvas) requestLock();
  }, true);

  document.addEventListener('pointerlockchange', () => {
    const locked = document.pointerLockElement === gameCanvas;
    reticle.style.display = locked ? 'block' : 'none';
    gameCanvas.style.cursor = locked ? 'none' : 'crosshair';
    if (locked) {
      const r = gameCanvas.getBoundingClientRect();
      mouse.x = Math.max(0, Math.min(r.width, mouse.x || r.width / 2));
      mouse.y = Math.max(0, Math.min(r.height, mouse.y || r.height / 2));
      placeReticle();
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement !== gameCanvas) return;
    const r = gameCanvas.getBoundingClientRect();
    mouse.x = Math.max(3, Math.min(r.width - 3, mouse.x + e.movementX));
    mouse.y = Math.max(3, Math.min(r.height - 3, mouse.y + e.movementY));
    placeReticle();
  });

  window.addEventListener('blur', () => {
    if (document.pointerLockElement === gameCanvas) document.exitPointerLock();
  });
})();
