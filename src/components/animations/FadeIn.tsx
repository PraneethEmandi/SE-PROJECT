import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: "100" | "200" | "300" | "400" | "500" | string;
  direction?: "up" | "down" | "left" | "right" | "scale";
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  className,
  delay = "0",
  direction = "up",
}) => {
  const getAnimationClass = () => {
    switch (direction) {
      case "up":
        return "animate-fade-in";
      case "left":
      case "right":
        return "animate-slide-in";
      case "scale":
        return "animate-scale-in";
      default:
        return "animate-fade-in";
    }
  };

  return (
    <div
      className={cn(
        "opacity-0",
        getAnimationClass(),
        `animation-delay-${delay}`,
        className
      )}
    >
      {children}
    </div>
  );
};