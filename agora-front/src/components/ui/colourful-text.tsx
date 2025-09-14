"use client";
import { motion } from "motion/react";
import React from "react";

export default function ColourfulText({ text }: { text: string }) {
  const colors = [
    "rgb(252, 209, 22)", // Amarillo principal
    "rgb(255, 223, 61)", // Amarillo claro
    "rgb(249, 195, 0)", // Amarillo oscuro
    "rgb(255, 235, 102)", // Amarillo suave
    "rgb(0, 56, 147)", // Azul principal
    "rgb(30, 81, 168)", // Azul claro
    "rgb(0, 45, 120)", // Azul oscuro
    "rgb(206, 17, 38)", // Rojo principal
    "rgb(230, 45, 65)", // Rojo claro
    "rgb(180, 12, 30)", // Rojo oscuro
  ];

  const [currentColors, setCurrentColors] = React.useState(colors);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const shuffled = [...colors].sort(() => Math.random() - 0.5);
      setCurrentColors(shuffled);
      setCount((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return text.split("").map((char, index) => (
    <motion.span
      key={`${char}-${count}-${index}`}
      initial={{
        y: 0,
      }}
      animate={{
        color: currentColors[index % currentColors.length],
        y: [0, -3, 0],
        scale: [1, 1.01, 1],
        filter: ["blur(0px)", `blur(5px)`, "blur(0px)"],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
      }}
      className="inline-block whitespace-pre font-sans tracking-tight"
    >
      {char}
    </motion.span>
  ));
}
