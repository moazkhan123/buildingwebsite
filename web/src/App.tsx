import NeuralBackground from "@/components/ui/flow-field-background";
import { ArrowRight, Sparkles } from "lucide-react";

export default function App() {
  return (
    <div className="relative h-screen w-full">
      <NeuralBackground
        className="absolute inset-0"
        color="#818cf8" // Indigo-400
        trailOpacity={0.1} // Lower = longer trails
        speed={0.8}
      />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div className="pointer-events-auto flex flex-col items-center gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-indigo-200 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Powered by an interactive flow field
          </span>

          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Build interfaces that feel alive
          </h1>

          <p className="max-w-xl text-balance text-base text-white/60 sm:text-lg">
            A canvas-driven particle field that reacts to your cursor, wrapped
            in a shadcn/ui component ready to drop into any hero section.
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#get-started"
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#learn-more"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
