document.getElementById('year').textContent = new Date().getFullYear();

const panels = [...document.querySelectorAll('.story-panel')];
const coverVideo = document.getElementById('cover-video');
const revealVideo = document.getElementById('reveal-video');
const menu = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let activeIndex = 0;
let visibleVideo = coverVideo;
let currentScene = 'revealed';
let frame = 0;

menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
nav.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
});

function transitionTo(scene) {
  if (reducedMotion || scene === currentScene) return;
  currentScene = scene;
  const next = scene === 'revealed' ? revealVideo : coverVideo;

  next.pause();
  next.currentTime = 0;
  next.classList.add('is-visible');
  if (next !== visibleVideo) {
    visibleVideo.classList.remove('is-visible');
    visibleVideo.pause();
  }
  visibleVideo = next;

  const play = next.play();
  if (play) play.catch(() => {});
}

function render() {
  const focus = innerHeight * .5;
  let nearest = Infinity;
  let nextIndex = activeIndex;

  panels.forEach((panel, index) => {
    const rect = panel.getBoundingClientRect();
    const distance = Math.abs(rect.top + rect.height * .5 - focus);
    if (distance < nearest) {
      nearest = distance;
      nextIndex = index;
    }
  });

  panels.forEach((panel, index) => panel.classList.toggle('is-active', index === nextIndex));

  if (nextIndex !== activeIndex) {
    activeIndex = nextIndex;
    transitionTo(activeIndex % 2 === 0 ? 'revealed' : 'covered');
  }
  frame = 0;
}

function requestRender() {
  if (!frame) frame = requestAnimationFrame(render);
}

[coverVideo, revealVideo].forEach(video => {
  video.pause();
  video.addEventListener('ended', () => video.pause());
});

const warmRevealVideo = () => {
  revealVideo.preload = 'auto';
  revealVideo.load();
};
if ('requestIdleCallback' in window) {
  requestIdleCallback(warmRevealVideo, { timeout: 2500 });
} else {
  setTimeout(warmRevealVideo, 1200);
}

addEventListener('scroll', requestRender, { passive: true });
addEventListener('resize', requestRender, { passive: true });
render();
