import { useEffect, useState } from "react";

export default function Confetti() {
  const [confettiParticles, setConfettiParticles] = useState<
    {
      id: number;
      color: string;
      left: string;
      delay: string;
      dx: string;
      dy: string;
      rotate: string;
    }[]
  >([]);

  useEffect(() => {
    let timeoutId = setTimeout(() => {});

    const triggerCelebrationParticles = () => {
      const colors = ["#10b981", "#f59e0b", "#3b82f6", "#ec4899", "#8b5cf6"];
      const particles = Array.from({ length: 36 }).map((_, i) => ({
        id: i,
        color: colors[i % colors.length],
        left: `${15 + Math.random() * 70}%`,
        delay: `${Math.random() * 0.25}s`,
        dx: `${(Math.random() - 0.5) * 220}px`,
        dy: `${-120 - Math.random() * 160}px`,
        rotate: `${Math.random() * 360}deg`,
      }));
      setConfettiParticles(particles);
      timeoutId = setTimeout(() => setConfettiParticles([]), 2200);
    };

    triggerCelebrationParticles();

    return () => clearTimeout(timeoutId);
  }, []);

  return confettiParticles.map((p) => (
    <span
      key={p.id}
      className="confetti-piece"
      style={{
        backgroundColor: p.color,
        left: p.left,
        animationDelay: p.delay,
        // @ts-expect-error no necessary
        "--dx": p.dx,
        "--dy": p.dy,
        "--rot": p.rotate,
      }}
    />
  ));
}
