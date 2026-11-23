const flap = document.querySelector(".envelope-flap");
const letter = document.querySelector(".letter");
const trigger = document.querySelector(".envelope-trigger");
const seal = document.querySelector(".seal");
const messageLabel = document.querySelector(".message-label");
const confettiLayer = document.querySelector(".confetti-layer");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

gsap.set(letter, { xPercent: -50, y: 40, autoAlpha: 0 });

const openingTimeline = gsap.timeline({
    paused: true,
    onComplete: () => {
        trigger.setAttribute("aria-expanded", "true");
        trigger.setAttribute("aria-label", "Tutup surat");
    },
    onReverseComplete: () => {
        gsap.set(letter, { zIndex: 2 });
        trigger.setAttribute("aria-expanded", "false");
        trigger.setAttribute("aria-label", "Buka surat");
    }
});

openingTimeline
    .set(letter, { zIndex: 7 }, 0)
    .to(flap, { rotateX: -180, duration: 0.75, ease: "power2.inOut" }, 0)
    .to(letter, {
        y: 0,
        autoAlpha: 1,
        duration: 1,
        ease: "power3.out"
    }, 0.25)
    .to(seal, { scale: 0, autoAlpha: 0, duration: 0.2, ease: "power1.in" }, 0);

if (reducedMotion) {
    openingTimeline.timeScale(4);
}

trigger.addEventListener("click", () => {
    if (openingTimeline.progress() === 0) {
        openingTimeline.play();
        gsap.to(messageLabel, { autoAlpha: 0, duration: reducedMotion ? 0 : 0.25 });

        if (!reducedMotion) {
            createConfetti();
        }
    } else {
        openingTimeline.reverse();
        gsap.to(messageLabel, { autoAlpha: 1, duration: reducedMotion ? 0 : 0.25 });
    }
});

function createConfetti() {
    const colors = ["#ff6f61", "#e91e63", "#4caf50", "#2196f3", "#ffc107", "#9c27b0", "#f44336", "#ff9800"];

    for (let i = 0; i < 30; i += 1) {
        const particle = document.createElement("span");
        particle.className = "confetti";
        particle.setAttribute("aria-hidden", "true");
        particle.style.left = `${Math.random() * Math.max(0, window.innerWidth - 8)}px`;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confettiLayer.appendChild(particle);

        gsap.to(particle, {
            y: window.innerHeight + 30,
            rotation: Math.random() * 720,
            opacity: 0.85,
            duration: 3 + Math.random() * 2,
            delay: Math.random(),
            ease: "none",
            onComplete: () => particle.remove()
        });
    }
}
