document.addEventListener("DOMContentLoaded", function() {
    const pressableText = document.querySelector(".pressable-text");
    pressableText.addEventListener("click", function() {
        window.location.href = "first_section.html"; // Укажите здесь путь к вашей новой странице
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const leftText = document.querySelector(".date-left");
    const rightText = document.querySelector(".date-right");

    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
        let scrollDirection = window.scrollY > lastScrollY ? "down" : "up";
        lastScrollY = window.scrollY;

        if (scrollDirection === "down" || scrollDirection === "up") {
            leftText.style.transform = "translateX(100%)";
            rightText.style.transform = "translateX(-100%)";
        }
    });

   // Automatic slider functionality
   const rotator = document.querySelector(".rotator");
   let currentIndex = 0;
   const slides = rotator.children;
   const totalSlides = slides.length;
   function rotateSlides() {
      currentIndex++;
      if (currentIndex == totalSlides - 1) {
         currentIndex = 0;
         rotator.style.transition = "none"; // Disable transition for instant reset
         rotator.style.transform = `translateX(-${currentIndex * 50}%)`;
         setTimeout(rotateSlides, 0); // Immediately call rotateSlides to continue the loop
      } else {
         rotator.style.transition = "transform 0.5s ease-in-out"; // Smooth transition for slide change
         rotator.style.transform = `translateX(-${currentIndex * 50}%)`;
         setTimeout(rotateSlides, 2500); // Wait 2.5 seconds before rotating to the next slide
      }
   }

   setTimeout(rotateSlides, 2500); // Start the automatic slider after 2.5 seconds
});