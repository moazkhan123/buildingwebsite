import { motion } from "motion/react";

const GOLD = "#c9a35a";

export default function Logo() {
  return (
    <motion.a
      href="#"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="flex items-center gap-3"
    >
      <svg
        width="34"
        height="38"
        viewBox="0 0 34 38"
        fill="none"
        className="shrink-0 text-foreground"
      >
        <path
          d="M17 1 L31 6 V18 C31 27.5 25 33.5 17 37 C9 33.5 3 27.5 3 18 V6 Z"
          fill="currentColor"
        />
        <line x1="9" y1="12.5" x2="25" y2="12.5" stroke={GOLD} strokeWidth="0.75" />
        <text
          x="17"
          y="24"
          textAnchor="middle"
          fontFamily="ui-serif, Georgia, serif"
          fontSize="13"
          fill={GOLD}
        >
          M
          <tspan dx="1" fill={GOLD} opacity={0.5}>
            |
          </tspan>
          <tspan dx="1">K</tspan>
        </text>
      </svg>

      <span className="leading-none">
        <span className="block font-serif text-base font-semibold tracking-tight text-foreground">
          Moaz Khan
        </span>
        <span
          className="block text-[10px] font-medium uppercase tracking-[0.3em]"
          style={{ color: GOLD }}
        >
          Books
        </span>
      </span>
    </motion.a>
  );
}
