document.getElementById('year').textContent = new Date().getFullYear();

const root = document.documentElement;
const panels = [...document.querySelectorAll('.story-panel')];
const imageA = document.querySelector('.reveal-image-a');
const imageB = document.querySelector('.reveal-image-b');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const artifacts = [
  "aevora-reveal-hero.png",
  "https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/a4b03679-fb9e-4a69-80ae-2a8be733fc05/Photorealistic_cinematic_archaeological_landscape_in_warm_pa.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiYTZmYzFhYWYyZjEwZDdiYyIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc4NzYzNTc1OX0.udtHmcSN52ElpjRwY0bOBsXGVVCgTAF-q2HF53Pf_hE",
  "https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/75bafa7b-0194-438f-8353-4f8863bd5cb4/Photorealistic_cinematic_archaeological_landscape_in_warm_pa.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiMzg4MDUzYTk1YzM4ZTMyOCIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc4NzU2OTMyMX0.-qluQxVHkQwBuI_GUn2b6IZBm_n2YDshMld167zzjgA",
  "https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/6eb8a147-4c50-4072-8e7f-7221eb2b5913/Photorealistic_cinematic_archaeological_landscape_in_warm_pa.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiMDRlYWRlMDc1MGYxZjg3NCIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc4NzYwNTEyN30.8OJ_1rbMxDBWANiR2R9iJ6ThUl_OkH91D6tgVTvDnYg",
  "https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/32a159be-b0e0-4d35-83af-a238c8c9b996/Photorealistic_cinematic_archaeological_landscape_in_warm_pa.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiOWIzNzVlMWZlZGZjNmE4OSIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc4NzYxNzA1NX0.2yIAKnLxmvmjZVal7Ph9KApBddyMWESLwLY-rdKtkIE"
];

let visibleLayer = imageA;
let hiddenLayer = imageB;
let currentArtifact = -1;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function setArtifact(index) {
  if (!visibleLayer || !hiddenLayer || index === currentArtifact) return;
  const safeIndex = clamp(index, 0, artifacts.length - 1);
  hiddenLayer.style.backgroundImage = `url("${artifacts[safeIndex]}")`;
  hiddenLayer.classList.add('is-visible');
  visibleLayer.classList.remove('is-visible');
  const oldVisible = visibleLayer;
  visibleLayer = hiddenLayer;
  hiddenLayer = oldVisible;
  currentArtifact = safeIndex;
}

if (imageA) {
  imageA.style.backgroundImage = `url("${artifacts[0]}")`;
  imageA.classList.add('is-visible');
  currentArtifact = 0;
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
  if (!closest) return;

  setArtifact(Number(closest.dataset.artifact || 0));
  if (reduced) return;

  const rect = closest.getBoundingClientRect();
  const local = clamp((viewport - rect.top) / (viewport + rect.height), 0, 1);
  const wave = Math.sin(local * Math.PI);
  const target = Number(closest.dataset.reveal || 0.85);

  const imageOpacity = clamp(0.24 + target * wave, 0.24, 0.98);
  const coverOpacity = clamp(1.06 - wave * 0.92, 0.12, 1);
  const coverY = 26 - wave * 55;
  const scale = 1.02 + wave * 0.035;

  root.style.setProperty('--reveal-opacity', imageOpacity.toFixed(3));
  root.style.setProperty('--cover-opacity', coverOpacity.toFixed(3));
  root.style.setProperty('--cover-y', `${coverY.toFixed(1)}%`);
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
