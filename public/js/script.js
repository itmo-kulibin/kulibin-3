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
});