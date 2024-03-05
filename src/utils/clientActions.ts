"use client";

import confetti from "canvas-confetti";

export const triggerConfetti = (confettiColors: string[]) => {
  confetti({
    particleCount: 100,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: confettiColors,
  });
  confetti({
    particleCount: 100,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: confettiColors,
  });
};
