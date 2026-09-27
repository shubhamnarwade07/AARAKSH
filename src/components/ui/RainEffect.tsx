import { useEffect, useRef } from 'react';

interface RainEffectProps {
  intensity?: 'light' | 'moderate' | 'heavy';
  className?: string;
}

export function RainEffect({ intensity = 'moderate', className = '' }: RainEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const count = intensity === 'light' ? 60 : intensity === 'heavy' ? 140 : 95;

    // Drop properties
    interface Drop {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      width: number;
    }

    interface Splash {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
    }

    const drops: Drop[] = [];
    const splashes: Splash[] = [];

    // Initialize drops
    for (let i = 0; i < count; i++) {
      drops.push({
        x: Math.random() * (width + 100) - 50,
        y: Math.random() * height,
        length: Math.random() * 22 + 14,
        speed: Math.random() * 12 + 16,
        opacity: Math.random() * 0.45 + 0.2,
        width: Math.random() * 1 + 0.8,
      });
    }

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const windAngle = 0.12; // Slight diagonal mountain wind

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw and update raindrops
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];

        ctx.beginPath();
        const grad = ctx.createLinearGradient(
          d.x,
          d.y,
          d.x + d.length * windAngle,
          d.y + d.length
        );
        grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        grad.addColorStop(0.6, `rgba(56, 189, 248, ${d.opacity * 0.8})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${d.opacity})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = d.width;
        ctx.lineCap = 'round';
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.length * windAngle, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;
        d.x += d.speed * windAngle;

        // Reset if past bottom
        if (d.y > height) {
          // Add splash occasionally
          if (Math.random() < 0.25) {
            splashes.push({
              x: d.x,
              y: height - Math.random() * 8,
              radius: 1,
              maxRadius: Math.random() * 7 + 4,
              opacity: 0.5,
            });
          }

          d.y = -d.length;
          d.x = Math.random() * (width + 100) - 50;
        }
      }

      // Draw and update splashes
      for (let s = splashes.length - 1; s >= 0; s--) {
        const sp = splashes[s];
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${sp.opacity})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        sp.radius += 0.8;
        sp.opacity -= 0.035;

        if (sp.opacity <= 0 || sp.radius >= sp.maxRadius) {
          splashes.splice(s, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-10 ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
