document.getElementById('year').textContent = new Date().getFullYear();

const video = document.getElementById('reveal-video');
const panels = [...document.querySelectorAll('.story-panel')];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const VIDEO_URL = 'https://dnznrvs05pmza.cloudfront.net/veo3.1/projects/vertex-ai-claude-431722/locations/us-central1/publishers/google/models/veo-3.1-generate-001/operations/7845b534-088d-4627-b103-d424542cb8a2/The_supplied_start_and_end_frames_define_the_exact_same_arch.mp4?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiODVjZGMwZDY5ZGZiMTc5NyIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc4NzYyNTE3NH0.IGxLoVC633odBJ9RlGqzd4SzUb3mLjahwcGtYCyTmkE';
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

let raf = 0;
let targetTime = 0;
let lastSeekAt = 0;

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

function seekVideo(now) {
  if (!video.duration || reduced) return;
  const reveal = triangularReveal(pageProgress());
  targetTime = reveal * Math.max(0, video.duration - 0.04);
  const difference = targetTime - video.currentTime;
  if (Math.abs(difference) < 0.035) return;
  if (now - lastSeekAt < 45) return;
  const nextTime = video.currentTime + difference * 0.34;
  try {
    video.currentTime = clamp(nextTime, 0, video.duration - 0.02);
  } catch (_) {}
  lastSeekAt = now;
}

function update(now) {
  updatePanels();
  seekVideo(now || performance.now());
  raf = 0;
}

function requestUpdate() {
  if (!raf) raf = requestAnimationFrame(update);
}

video.addEventListener('loadedmetadata', () => {
  video.pause();
  video.currentTime = Math.min(video.duration * 0.58, video.duration - 0.02);
  requestUpdate();
});
video.addEventListener('canplay', requestUpdate);
window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', requestUpdate);
requestUpdate();