document.addEventListener("DOMContentLoaded", function() {
    const pressableText = document.querySelector(".pressable-text");
    pressableText.addEventListener("click", function() {
        window.location.href = "first_section.html"; // Укажите здесь путь к вашей новой странице
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const leftText = document.querySelector(".date-left");
    const rightText = document.querySelector(".date-right");
    const highSliderTitle = document.querySelector(".high-slider-title");

    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
        const highSliderTitleRect = highSliderTitle.getBoundingClientRect();
        const isAboveTitle = highSliderTitleRect.top < 0;

        if (isAboveTitle) {
            let scrollDirection = window.scrollY > lastScrollY ? "down" : "up";
            lastScrollY = window.scrollY;

            if (scrollDirection === "down" || scrollDirection === "up") {
                leftText.style.transform = "translateX(100%)";
                rightText.style.transform = "translateX(-100%)";
            }
        } else {
            leftText.style.transform = "translateX(0%)";
            rightText.style.transform = "translateX(0%)";
        }
    });

   // Automatic slider functionality
   const rotator = document.querySelector(".rotator");
   let currentIndex = 0;
   const slides = rotator.children;
   const totalSlides = slides.length;
   let sliderInterval;

   function rotateSlides() {
      currentIndex++;
      if (currentIndex >= totalSlides - 1) {
         currentIndex = 0;
         rotator.style.transition = "none"; // Disable transition for instant reset
         rotator.style.transform = `translateX(-${currentIndex * 50}%)`;
         setTimeout(rotateSlides, 0); // Immediately call rotateSlides to continue the loop
      } else {
         rotator.style.transition = "transform 0.5s ease-in-out"; // Smooth transition for slide change
         rotator.style.transform = `translateX(-${currentIndex * 50}%)`;
         sliderInterval = setTimeout(rotateSlides, 4000); // Wait 4 seconds before rotating to the next slide
      }
   }

   // sliderInterval = setTimeout(rotateSlides, 4000); // Start the automatic slider after 4 seconds

   window.onload = function() {
      const popup = document.getElementById('ai-popup');
      const popupContent = popup.querySelector('.ai-popup-content');

      // Check if the user has already seen the popup
      if (localStorage.getItem('popupSeen') === 'true') {
          sliderInterval = setTimeout(rotateSlides, 3000); // Restart the slider
          return;
      }

      // Показываем pop-up
      popup.style.display = 'block';

      // Запускаем анимацию "выезда" через 0.25с
      setTimeout(() => {
          popupContent.style.animationName = 'slideIn';
      }, 250);

      // Останавливаем слайдер
      clearTimeout(sliderInterval);

      // Через 4с - "уезд"
      const slideOutTimeout = setTimeout(() => {
          popupContent.style.animationName = 'slideOut';
      }, 4500);

      // Ещё через 1.05с (4.8с всего) - скрываем и перезапускаем слайдер
      const hidePopupTimeout = setTimeout(() => {
          popup.style.display = 'none';
          localStorage.setItem('popupSeen', 'true'); // Mark the popup as seen
          sliderInterval = setTimeout(rotateSlides, 1500); // Restart the slider
      }, 4800);

      // Add click event to close the popup earlier
      popup.addEventListener('click', () => {
          clearTimeout(slideOutTimeout);
          clearTimeout(hidePopupTimeout);
          popupContent.style.animationName = 'slideOut';
          setTimeout(() => {
              popup.style.display = 'none';
              localStorage.setItem('popupSeen', 'true'); // Mark the popup as seen
              sliderInterval = setTimeout(rotateSlides, 1500); // Restart the slider
          }, 500); // Adjust the timeout to match the slideOut animation duration
      });
   };

   // Adjust decor-image position dynamically
   const captions = document.querySelectorAll('.caption');
   const decorImageContainer = document.getElementById('decor-image-container');
   if (captions.length > 0) {
     let maxBottom = 0;
     captions.forEach(caption => {
       const captionBottom = caption.getBoundingClientRect().bottom + window.scrollY;
       if (captionBottom > maxBottom) {
         maxBottom = captionBottom;
       }
     });
     const containerTop = decorImageContainer.getBoundingClientRect().top + window.scrollY;
     const offset = maxBottom - containerTop + 20; // Add some space
     decorImageContainer.style.marginTop = `${offset}px`;
   }
});