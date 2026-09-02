document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('main-year').textContent = new Date().getFullYear();

const panels = [...document.querySelectorAll('.story-panel')];
const backgroundVideo = document.getElementById('background-video');
const menu = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');
const projectsDropdown = document.querySelector('.nav-dropdown');
const projectsButton = document.querySelector('.projects-link');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

let frame = 0;

backgroundVideo.muted = true;
backgroundVideo.defaultMuted = true;
backgroundVideo.setAttribute('muted', '');
backgroundVideo.setAttribute('playsinline', '');
backgroundVideo.setAttribute('webkit-playsinline', '');

menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? 'Close' : 'Menu';
  nav.classList.toggle('is-open', open);
});

projectsButton.addEventListener('click', (event) => {
  event.stopPropagation();
  const open = projectsButton.getAttribute('aria-expanded') !== 'true';
  projectsButton.setAttribute('aria-expanded', String(open));
  projectsDropdown.classList.toggle('is-open', open);
});

document.addEventListener('click', (event) => {
  if (!projectsDropdown.contains(event.target)) {
    projectsButton.setAttribute('aria-expanded', 'false');
    projectsDropdown.classList.remove('is-open');
  }
});

nav.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  menu.setAttribute('aria-expanded', 'false');
  menu.textContent = 'Menu';
  nav.classList.remove('is-open');
  projectsButton.setAttribute('aria-expanded', 'false');
  projectsDropdown.classList.remove('is-open');
});

function playBackground() {
  if (reducedMotion) {
    backgroundVideo.pause();
    return;
  }

  const playback = backgroundVideo.play();
  if (playback) playback.catch(() => {});
}

function resumeBackground() {
  if (backgroundVideo.paused) playBackground();
}

function render() {
  const focus = innerHeight * .5;
  let nearest = Infinity;
  let nextActiveIndex = 0;

  panels.forEach((panel, index) => {
    const rect = panel.getBoundingClientRect();
    const distance = Math.abs(rect.top + rect.height * .5 - focus);
    if (distance < nearest) {
      nearest = distance;
      nextActiveIndex = index;
    }
  });

  panels.forEach((panel, index) => panel.classList.toggle('is-active', index === nextActiveIndex));

  frame = 0;
}

function requestRender() {
  if (!frame) frame = requestAnimationFrame(render);
}

backgroundVideo.addEventListener('canplay', playBackground, { once: true });
backgroundVideo.addEventListener('loadedmetadata', playBackground, { once: true });
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) playBackground();
});

['click', 'scroll'].forEach((eventName) => {
  addEventListener(eventName, resumeBackground, { passive: true });
});

addEventListener('scroll', requestRender, { passive: true });
addEventListener('resize', requestRender, { passive: true });
playBackground();
render();
