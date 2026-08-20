(() => {
  const gameCanvas = document.getElementById('game');
  const wrap = document.querySelector('.game-wrap');
  const start = document.getElementById('startBtn');
  if (!gameCanvas || !wrap || !start) return;

  const reticle = document.createElement('div');
  reticle.id = 'lockedReticle';
  Object.assign(reticle.style, {
    position: 'absolute', width: '28px', height: '28px',
    border: '2px solid rgba(255,255,255,.95)', borderRadius: '50%',
    boxShadow: '0 0 8px #55f7ff, 0 0 18px #ff4ed8',
    pointerEvents: 'none', zIndex: '14', transform: 'translate(-50%,-50%)', display: 'none'
  });
  reticle.innerHTML = '<span style="position:absolute;left:50%;top:3px;width:2px;height:20px;background:#fff;transform:translateX(-50%);opacity:.75"></span><span style="position:absolute;top:50%;left:3px;height:2px;width:20px;background:#fff;transform:translateY(-50%);opacity:.75"></span>';
  wrap.appendChild(reticle);

  const gate = document.createElement('div');
  gate.id = 'mouseCaptureGate';
  Object.assign(gate.style, {
    position: 'absolute', inset: '0', zIndex: '19', display: 'none',
    alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
    background: 'rgba(1,2,8,.58)', backdropFilter: 'blur(2px)', cursor: 'pointer',
    color: '#fff', fontFamily: 'system-ui,sans-serif', textAlign: 'center'
  });
  gate.innerHTML = '<div style="font-size:28px;font-weight:900;letter-spacing:.08em;text-shadow:0 0 18px #55f7ff">CLICK TO LOCK AIM</div><div style="margin-top:8px;font-size:13px;color:#c8d3ff">Mouse stays inside the game. ESC releases it.</div>';
  wrap.appendChild(gate);

  function placeReticle() {
    const r = gameCanvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    reticle.style.left = ((mouse.x / r.width) * 100) + '%';
    reticle.style.top = ((mouse.y / r.height) * 100) + '%';
  }

  function requestLockDirect() {
    if (document.pointerLockElement === gameCanvas) return;
    try {
      const result = gameCanvas.requestPointerLock();
      if (result && typeof result.catch === 'function') {
        result.catch(() => { gate.style.display = 'flex'; });
      }
    } catch (_) {
      gate.style.display = 'flex';
    }
  }

  function showGateSoon() {
    setTimeout(() => {
      if (typeof running !== 'undefined' && running && document.pointerLockElement !== gameCanvas) {
        gate.style.display = 'flex';
      }
    }, 80);
  }

  // Start the game first, then require a direct click inside the arena.
  // This is more reliable than trying to lock from the start button itself.
  start.addEventListener('click', showGateSoon);

  gate.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    requestLockDirect();
  });

  // If the player presses ESC or the browser releases lock, the next click in the arena relocks it.
  gameCanvas.addEventListener('click', () => {
    if (typeof running !== 'undefined' && running && document.pointerLockElement !== gameCanvas) requestLockDirect();
  });

  document.addEventListener('pointerlockchange', () => {
    const locked = document.pointerLockElement === gameCanvas;
    reticle.style.display = locked ? 'block' : 'none';
    gate.style.display = locked ? 'none' : ((typeof running !== 'undefined' && running) ? 'flex' : 'none');
    gameCanvas.style.cursor = locked ? 'none' : 'crosshair';
    if (locked) {
      const r = gameCanvas.getBoundingClientRect();
      mouse.x = r.width / 2;
      mouse.y = r.height / 2;
      placeReticle();
    }
  });

  document.addEventListener('pointerlockerror', () => {
    gate.style.display = 'flex';
  });

  document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement !== gameCanvas) return;
    const r = gameCanvas.getBoundingClientRect();
    mouse.x = Math.max(4, Math.min(r.width - 4, mouse.x + e.movementX));
    mouse.y = Math.max(4, Math.min(r.height - 4, mouse.y + e.movementY));
    placeReticle();
  });
})();