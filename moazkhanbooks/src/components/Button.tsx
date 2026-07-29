import { motion } from "motion/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ComponentProps<typeof motion.a> {
  variant?: "primary" | "secondary";
}

export default function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <motion.a
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
      className={cn(
        "inline-flex items-center gap-2 rounded-sm px-5 py-2.5 text-sm font-medium transition-colors duration-200",
        variant === "primary" &&
          "bg-accent text-accent-foreground hover:opacity-90",
        variant === "secondary" &&
          "border border-border text-foreground hover:bg-card",
        className,
      )}
      {...props}
    />
  );
}
