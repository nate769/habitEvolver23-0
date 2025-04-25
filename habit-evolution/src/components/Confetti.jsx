import React, { useEffect, useState } from 'react';
import './Confetti.css';

export default function Confetti({ x, y }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6'];
    const particleCount = 30;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: x,
        y: y,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: (Math.random() * 360),
        velocity: 3 + Math.random() * 3,
        rotation: Math.random() * 360,
        rotationSpeed: -4 + Math.random() * 8
      });
    }

    setParticles(newParticles);

    const cleanup = setTimeout(() => {
      setParticles([]);
    }, 2000);

    return () => clearTimeout(cleanup);
  }, [x, y]);

  return (
    <div className="confetti-container">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="confetti-particle"
          style={{
            backgroundColor: particle.color,
            left: particle.x + 'px',
            top: particle.y + 'px',
            transform: `rotate(${particle.rotation}deg)`,
            '--angle': particle.angle + 'deg',
            '--velocity': particle.velocity,
            '--rotation-speed': particle.rotationSpeed + 'deg'
          }}
        />
      ))}
    </div>
  );
}