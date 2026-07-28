import { useRef, type MouseEvent } from "react";

/**
 * Drives the `.reveal` pointer-highlight via CSS custom properties set
 * directly on the DOM node, so the effect never triggers a React re-render.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const onMouseMove = (e: MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--reveal-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--reveal-y", `${e.clientY - rect.top}px`);
  };

  return { ref, onMouseMove };
}
