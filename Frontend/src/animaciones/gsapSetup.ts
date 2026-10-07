import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

gsap.defaults({
  ease: "power2.out",
  duration: 0.32,
});

export { gsap, Flip };

export function prefiereMenosMovimiento(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
