import { motion } from "motion/react";
import type { ComponentProps } from "react";
import { useReveal } from "@/lib/useReveal";
import { cn } from "@/lib/utils";

interface ButtonProps extends ComponentProps<typeof motion.a> {
  variant?: "primary" | "secondary";
}

export default function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const { ref, onMouseMove } = useReveal<HTMLAnchorElement>();

  return (
    <motion.a
      ref={ref}
      onMouseMove={onMouseMove}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
      className={cn(
        "reveal inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-shadow duration-200",
        variant === "primary" &&
          "elevation-2 bg-accent text-accent-foreground hover:elevation-3",
        variant === "secondary" &&
          "glass elevation-1 text-foreground hover:elevation-2",
        className,
      )}
      {...props}
    />
  );
}
