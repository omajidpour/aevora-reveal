document.getElementById('year').textContent = new Date().getFullYear();

const video = document.getElementById('reveal-video');
const panels = [...document.querySelectorAll('.story-panel')];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const VIDEO_URL = 'https://dnznrvs05pmza.cloudfront.net/veo3.1/projects/vertex-ai-claude-431722/locations/us-central1/publishers/google/models/veo-3.1-generate-001/operations/197621e3-8a1f-4250-8976-e78a7f492f7b/Preserve_the_exact_composition__lighting__colour__archaeolog.mp4?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiOTIwYjQ4NGFjNzQ5NTgyNyIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc4NzYxMTMzOH0.FnzYJBZtX19zUcu2fF8vQzPVmzwcuskuwWKxiM2X3rk';
video.src = VIDEO_URL;
video.pause();

function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

function pageProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  return max > 0 ? clamp(scrollY / max, 0, 1) : 0;
}

function triangularReveal(progress) {
  const cycles = Math.max(1, panels.length - 1);
  const phase = (progress * cycles + 0.62) % 1;
  return 1 - Math.abs(phase * 2 - 1);
}

let desiredTime = 0;
let raf = 0;

function updatePanels() {
  const mid = innerHeight / 2;
  let closest = panels[0];
  let distance = Infinity;
  panels.forEach(panel => {
    const r = panel.getBoundingClientRect();
    const d = Math.abs(r.top + r.height / 2 - mid);
    if (d < distance) { distance = d; closest = panel; }
  });
  panels.forEach(panel => panel.classList.toggle('is-active', panel === closest));
}

function seekVideo() {
  if (!video.duration || reduced) return;
  const reveal = triangularReveal(pageProgress());
  desiredTime = reveal * Math.max(0, video.duration - 0.05);
  if (Math.abs(video.currentTime - desiredTime) > 0.025) video.currentTime = desiredTime;
}

function update() {
  updatePanels();
  seekVideo();
  raf = 0;
}

function requestUpdate() {
  if (!raf) raf = requestAnimationFrame(update);
}

video.addEventListener('loadedmetadata', () => {
  video.pause();
  requestUpdate();
});
video.addEventListener('canplay', requestUpdate);
window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', requestUpdate);
requestUpdate();