document.getElementById('year').textContent = new Date().getFullYear();

const root = document.documentElement;
const panels = [...document.querySelectorAll('.story-panel')];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function updateReveal() {
  const viewport = window.innerHeight;
  let closest = null;
  let closestDistance = Infinity;

  panels.forEach((panel) => {
    const rect = panel.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const distance = Math.abs(center - viewport / 2);
    if (distance < closestDistance) {
      closestDistance = distance;
      closest = panel;
    }
  });

  panels.forEach((panel) => panel.classList.toggle('is-active', panel === closest));

  if (!closest || reduced) return;

  const rect = closest.getBoundingClientRect();
  const local = clamp((viewport - rect.top) / (viewport + rect.height), 0, 1);
  const wave = Math.sin(local * Math.PI);
  const target = Number(closest.dataset.reveal || 0.65);
  const opacity = clamp(0.12 + target * wave, 0.12, 0.95);
  const sand = (local - 0.5) * 170;
  const scale = 1.025 + wave * 0.045;

  root.style.setProperty('--reveal-opacity', opacity.toFixed(3));
  root.style.setProperty('--sand-shift', `${sand.toFixed(1)}px`);
  root.style.setProperty('--image-scale', scale.toFixed(4));
}

let ticking = false;
function requestUpdate() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateReveal();
    ticking = false;
  });
}

updateReveal();
window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', requestUpdate);
