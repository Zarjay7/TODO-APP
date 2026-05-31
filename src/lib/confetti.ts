export function burstConfetti(count = 80) {
  const colors = ['#5c6b7a', '#8a6f47', '#4a704f', '#7a5a7a'];
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.style.position = 'absolute';
    piece.style.width = '8px';
    piece.style.height = '8px';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.top = '-10px';
    piece.style.opacity = (Math.random() * 0.7 + 0.5).toString();
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;

    const duration = Math.random() * 2800 + 2200;
    const xDrift = (Math.random() - 0.5) * 180;

    piece.animate(
      [
        {
          transform: `translateY(0) rotate(0deg)`,
          opacity: piece.style.opacity,
        },
        {
          transform: `translateY(${window.innerHeight + 100}px) translateX(${xDrift}px) rotate(${Math.random() * 720 - 360}deg)`,
          opacity: 0,
        },
      ],
      {
        duration,
        easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      }
    ).onfinish = () => piece.remove();

    container.appendChild(piece);
  }

  setTimeout(() => {
    container.remove();
  }, 4500);
}
