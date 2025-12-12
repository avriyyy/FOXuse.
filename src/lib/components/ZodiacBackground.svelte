<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let animationId: number;
  let mouseX = 0;
  let mouseY = 0;

  interface Star {
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
    connections: number[];
  }

  let stars: Star[] = [];
  const numStars = 80;
  const connectionDistance = 150;

  function init() {
    if (!canvas) return;
    ctx = canvas.getContext("2d")!;
    resize();
    createStars();
    animate();
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 0.3 + 0.1,
        connections: [],
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw stars
    stars.forEach((star, i) => {
      // Float animation
      star.y -= star.speed;
      if (star.y < -10) {
        star.y = canvas.height + 10;
        star.x = Math.random() * canvas.width;
      }

      // Mouse interaction - stars move away slightly
      const dx = mouseX - star.x;
      const dy = mouseY - star.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        const force = (100 - distance) / 100;
        star.x -= (dx / distance) * force * 2;
        star.y -= (dy / distance) * force * 2;
      }

      // Draw star with glow
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 44, 143, ${star.opacity})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#F52C8F";
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw connections (constellation effect)
      stars.forEach((otherStar, j) => {
        if (i >= j) return;
        const distX = star.x - otherStar.x;
        const distY = star.y - otherStar.y;
        const dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.3;
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(otherStar.x, otherStar.y);
          ctx.strokeStyle = `rgba(245, 44, 143, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      // Mouse cursor connection
      if (distance < 200) {
        const opacity = (1 - distance / 200) * 0.5;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = `rgba(156, 81, 182, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });

    animationId = requestAnimationFrame(animate);
  }

  function handleMouseMove(e: MouseEvent) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function handleResize() {
    resize();
    createStars();
  }

  onMount(() => {
    init();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
  });

  onDestroy(() => {
    if (animationId) cancelAnimationFrame(animationId);
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    }
  });
</script>

<canvas bind:this={canvas} class="fixed inset-0 z-0 pointer-events-none"
></canvas>

<style>
  canvas {
    background: transparent;
  }
</style>
