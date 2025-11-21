// CONFETTI
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confetti = [];

function createConfetti() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 2,
        d: Math.random() * 0.9 + 0.3,
        color: `hsl(${Math.random() * 360}, 80%, 70%)`
    };
}

for (let i = 0; i < 150; i++) confetti.push(createConfetti());

function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        p.y += p.d;
        if (p.y > canvas.height) {
            p.x = Math.random() * canvas.width;
            p.y = -10;
        }
    });

    requestAnimationFrame(drawConfetti);
}

drawConfetti();

// SURPRISE BUTTON
document.getElementById("surpriseBtn").onclick = () => {
    alert("Palak, you're truly special 💖\nHappiest Birthday once again! 🎀🎉");
};
