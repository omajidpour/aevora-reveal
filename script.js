document.getElementById('year').textContent = new Date().getFullYear();

const hero = document.querySelector('.hero');
const image = document.querySelector('.hero-image');

if (hero && image && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  hero.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 4;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;
    image.style.setProperty('--pointer-x', `${x}px`);
    image.style.setProperty('--pointer-y', `${y}px`);
  });
}
