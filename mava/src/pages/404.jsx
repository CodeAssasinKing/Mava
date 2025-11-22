import React, { useEffect, useRef } from "react";
import style from "./404.module.css";

function Error_404() {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const cometTailsRef = useRef([]);
    const starsRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Star system
        class Star {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.brightnessFactor = Math.random();
                this.speed = Math.random() * 0.05;
                this.angle = Math.random() * Math.PI * 2;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(248, 250, 252, ${
                    0.3 + this.brightnessFactor * 0.7
                })`;
                ctx.fill();

                if (this.size > 1.5) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(248, 250, 252, ${0.1 * this.brightnessFactor})`;
                    ctx.fill();
                }
            }

            update() {
                this.brightnessFactor += Math.sin(this.angle) * this.speed;
                this.brightnessFactor = Math.max(
                    0,
                    Math.min(1, this.brightnessFactor)
                );
                this.angle += 0.02;
            }
        }

        const stars = Array.from({ length: 200 }, () => new Star());
        starsRef.current = stars;

        // Animation loop
        const animate = () => {
            ctx.fillStyle = "rgba(10, 15, 28, 0.1)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const starsArr = starsRef.current;

            // Draw & update stars
            starsArr.forEach((star) => {
                star.update();
                star.draw();
            });

            // Draw connections
            ctx.strokeStyle = "rgba(125, 211, 252, 0.1)";
            ctx.lineWidth = 0.5;

            for (let i = 0; i < starsArr.length; i++) {
                for (let j = i + 1; j < starsArr.length; j++) {
                    const dx = starsArr[i].x - starsArr[j].x;
                    const dy = starsArr[i].y - starsArr[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(starsArr[i].x, starsArr[i].y);
                        ctx.lineTo(starsArr[j].x, starsArr[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw comet tails
            const tails = cometTailsRef.current;
            for (let i = tails.length - 1; i >= 0; i--) {
                const tail = tails[i];
                tail.life -= 0.02;

                if (tail.life <= 0) {
                    tails.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                const gradient = ctx.createRadialGradient(
                    tail.x,
                    tail.y,
                    0,
                    tail.x,
                    tail.y,
                    20
                );
                gradient.addColorStop(0, `rgba(125, 211, 252, ${tail.life})`);
                gradient.addColorStop(1, "transparent");
                ctx.fillStyle = gradient;
                ctx.arc(tail.x, tail.y, 20, 0, Math.PI * 2);
                ctx.fill();
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Mouse interaction
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            if (Math.random() > 0.8) {
                cometTailsRef.current.push({
                    x: mouseX,
                    y: mouseY,
                    life: 1,
                });
            }
        };

        canvas.addEventListener("mousemove", handleMouseMove);

        // Shooting stars
        const createShootingStar = () => {
            const star = document.createElement("div");
            star.className = "shooting-star";
            const angle = Math.random() * 20 - 10;
            const top = Math.random() * (window.innerHeight / 2);

            star.style.cssText = `
                position: fixed;
                top: ${top}px;
                left: -100px;
                --angle: ${angle}deg;
            `;

            document.body.appendChild(star);

            setTimeout(() => star.remove(), 3000);
        };

        const intervalId = setInterval(createShootingStar, 4000);

        // Cleanup
        return () => {
            window.removeEventListener("resize", resizeCanvas);
            canvas.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationRef.current);
            clearInterval(intervalId);
        };
    }, []);

    // Hover эффект для 404
    const handleErrorMouseEnter = (e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.filter =
            "drop-shadow(0 0 50px rgba(125, 211, 252, 0.5))";
    };

    const handleErrorMouseLeave = (e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.filter =
            "drop-shadow(0 0 30px rgba(125, 211, 252, 0.3))";
    };

    return (
        <>
            <canvas ref={canvasRef} className={style.constellation}></canvas>
            <div className={style.container}>
                <h1
                    className={style.errorCode}
                    onMouseEnter={handleErrorMouseEnter}
                    onMouseLeave={handleErrorMouseLeave}
                >
                    404
                </h1>
                <p className={style.message}>Lost in the infinite expanse of space</p>
                <a href="/" className={style.btnHome}>
                    Navigate Home
                </a>
            </div>
        </>
    );
}

export default Error_404;
