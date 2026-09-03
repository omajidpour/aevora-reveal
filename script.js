document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('main-year').textContent = new Date().getFullYear();

const panels = [...document.querySelectorAll('.story-panel')];
const backgroundVideo = document.getElementById('background-video');
const revealStage = document.querySelector('.reveal-stage');
const menu = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');
const siteHeader = document.querySelector('.site-header');
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

document.addEventListener('click', (event) => {
  if (!projectsDropdown.contains(event.target)) {
    projectsDropdown.classList.remove('is-open');
  }
});

nav.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  menu.setAttribute('aria-expanded', 'false');
  menu.textContent = 'Menu';
  nav.classList.remove('is-open');
  projectsDropdown.classList.remove('is-open');
});

function playBackground() {
  if (reducedMotion) {
    backgroundVideo.pause();
    revealStage.classList.remove('video-ready');
    return;
  }

  const playback = backgroundVideo.play();
  if (playback) {
    playback.catch(() => {
      revealStage.classList.remove('video-ready');
    });
  }
}

function resumeBackground() {
  if (backgroundVideo.paused) playBackground();
}

function render() {
  const focus = innerHeight * .5;
  const mobileHeaderEdge = innerWidth <= 850
    ? siteHeader.getBoundingClientRect().bottom + 8
    : 0;
  let nearest = Infinity;
  let nextActiveIndex = 0;

  panels.forEach((panel, index) => {
    const rect = panel.getBoundingClientRect();
    const copy = panel.querySelector('.story-copy');
    if (copy) {
      if (mobileHeaderEdge) {
        const copyRect = copy.getBoundingClientRect();
        const clippedTop = Math.max(0, Math.min(copyRect.height, mobileHeaderEdge - copyRect.top));
        const clip = `inset(${clippedTop}px 0 0 0)`;
        copy.style.clipPath = clip;
        copy.style.webkitClipPath = clip;
      } else {
        copy.style.clipPath = '';
        copy.style.webkitClipPath = '';
      }
    }
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
backgroundVideo.addEventListener('playing', () => {
  revealStage.classList.add('video-ready');
});
backgroundVideo.addEventListener('pause', () => {
  if (!backgroundVideo.ended) revealStage.classList.remove('video-ready');
});
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
