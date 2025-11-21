// ------------------------------
// Floating Petals Effect
// ------------------------------

function createPetal() {
    const petal = document.createElement("div");
    petal.classList.add("petal");

    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = (5 + Math.random() * 5) + "s";
    petal.style.opacity = 0.7 + Math.random() * 0.3;
    petal.style.transform = `scale(${0.8 + Math.random() * 0.7})`;

    document.body.appendChild(petal);

    setTimeout(() => {
        petal.remove();
    }, 10000);
}

setInterval(createPetal, 400);

// ------------------------------
// Smooth Scroll for Buttons
// ------------------------------

function goToGallery() {
    document.getElementById("gallery-section").scrollIntoView({ behavior: "smooth" });
}

function goToReasons() {
    document.getElementById("reasons-section").scrollIntoView({ behavior: "smooth" });
}

function goToFinal() {
    document.getElementById("final-section").scrollIntoView({ behavior: "smooth" });
}


// ------------------------------
// Slideshow Logic
// ------------------------------

let slideIndex = 0;
let slides = document.querySelectorAll(".slide");

function showSlide(n) {
    slides.forEach((slide, i) => {
        slide.style.display = i === n ? "block" : "none";
    });
}

function nextSlide() {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
}

function prevSlide() {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    showSlide(slideIndex);
}

showSlide(slideIndex);
setInterval(nextSlide, 4500); // Auto Slide


// ------------------------------
// Reveal "Reasons You’re Special"
// ------------------------------

function revealReasons() {
    const items = document.querySelectorAll(".reason");
    let delay = 0;

    items.forEach(item => {
        setTimeout(() => {
            item.classList.add("show");
        }, delay);
        delay += 400;
    });
}


// ------------------------------
// Final RB21 Suzuka Livery Popup
// ------------------------------

function showFinalPopup() {
    const popup = document.getElementById("finalPopup");
    popup.classList.add("show-popup");

    launchConfetti();
}


// ------------------------------
// Confetti Animation
// ------------------------------

function launchConfetti() {
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            spread: 70,
            origin: { y: 0.6 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}


// ------------------------------
// Button Click Listeners
// ------------------------------

document.getElementById("galleryBtn").addEventListener("click", goToGallery);
document.getElementById("reasonsBtn").addEventListener("click", () => {
    goToReasons();
    setTimeout(revealReasons, 800);
});
document.getElementById("finalBtn").addEventListener("click", () => {
    goToFinal();
    setTimeout(showFinalPopup, 1200);
});
