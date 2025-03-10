document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.getElementById('backButton');
  const nextButton = document.getElementById('nextButton');

  function createSplashes(buttonElem) {
    if (buttonElem.dataset.animating === "true") return;
    buttonElem.dataset.animating = "true";

    const numSplashes = Math.floor(Math.random() * 2) + 2;
    const splashDelay = 300;
    const usedPositions = [];

    function makeSplash(i) {
      const splash = document.createElement('div');
      splash.classList.add('ink-splash');

      const rect = buttonElem.getBoundingClientRect();
      const btnWidth  = rect.width;
      const btnHeight = rect.height;

      document.body.appendChild(splash);
      const splashSize = parseFloat(getComputedStyle(splash).width);
      document.body.removeChild(splash);

      let offsetX, offsetY;
      let attempts = 0;
      do {
        if (Math.random() < 0.5) {
          offsetX = Math.random() * (0.15 * btnWidth);
        } else {
          offsetX = btnWidth - splashSize - Math.random() * (0.15 * btnWidth);
        }
        offsetY = 0.1 * btnHeight + Math.random() * (btnHeight - splashSize - 0.3 * btnHeight);
        attempts++;
      } while (usedPositions.some(pos => Math.abs(pos.x - offsetX) < splashSize && Math.abs(pos.y - offsetY) < splashSize) && attempts < 10);

      usedPositions.push({ x: offsetX, y: offsetY });

      splash.style.left = offsetX + 'px';
      splash.style.top  = offsetY + 'px';

      buttonElem.appendChild(splash);

      const audio = new Audio("img/buttom/klycsasound.mp3");
      audio.play().catch(err => console.log(err));

      if (i === numSplashes - 1) {
        setTimeout(() => {
          buttonElem.querySelectorAll('.ink-splash').forEach(s => s.remove());
          buttonElem.dataset.animating = "false";
        }, 1500);
      }
    }

    for (let i = 0; i < numSplashes; i++) {
      setTimeout(() => {
        makeSplash(i);
      }, i * splashDelay);
    }
  }

//   backButton.addEventListener('click', () => {
//     createSplashes(backButton);
//     setTimeout(() => {
//       window.history.back();
//     }, 1000);
//   });

//   nextButton.addEventListener('click', () => {
//     createSplashes(nextButton);
//     setTimeout(() => {
//       alert("Переходим дальше...");
//     }, 1000);
//   });

  window.addEventListener('resize', () => {
    document.querySelectorAll('.ink-splash').forEach(splash => splash.remove());
    backButton.dataset.animating = "false";
    nextButton.dataset.animating = "false";
  });

  // Make createSplashes available globally
  window.createSplashes = createSplashes;
});
