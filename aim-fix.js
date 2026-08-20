(() => {
  const c = document.getElementById('game');
  if (!c) return;

  function updateAbsoluteAim(e) {
    // While pointer lock is active, mouse-lock.js owns aim using movementX/movementY.
    // Do not overwrite that relative aim with the browser's fixed clientX/clientY values.
    if (document.pointerLockElement === c) return;

    const r = c.getBoundingClientRect();
    if (!r.width || !r.height) return;

    mouse.x = Math.max(0, Math.min(W, (e.clientX - r.left) * (W / r.width)));
    mouse.y = Math.max(0, Math.min(H, (e.clientY - r.top) * (H / r.height)));
  }

  c.addEventListener('pointermove', updateAbsoluteAim);
})();