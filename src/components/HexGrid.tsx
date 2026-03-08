import { useEffect, useRef } from "react";

const HexGrid = ({ opacity = 0.08, color = "hsl(28, 30%, 15%)" }: { opacity?: number; color?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const size = 40;
      const h = size * Math.sqrt(3);

      ctx.strokeStyle = color;
      ctx.globalAlpha = opacity;
      ctx.lineWidth = 0.5;

      for (let row = -1; row < canvas.height / h + 1; row++) {
        for (let col = -1; col < canvas.width / (size * 1.5) + 1; col++) {
          const x = col * size * 1.5;
          const y = row * h + (col % 2 === 1 ? h / 2 : 0);
          drawHex(ctx, x, y, size);
        }
      }
    };

    const drawHex = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const hx = x + size * Math.cos(angle);
        const hy = y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [opacity, color]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};

export default HexGrid;
