import { ReactNode, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { NavLink, useLocation } from "react-router-dom";
import { gsap, prefiereMenosMovimiento } from "../animaciones/gsapSetup";

function LogoPawnee() {
  return (
    <NavLink to="/" className="group flex items-center gap-3">
      <span className="relative flex h-9 w-9 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-orange-500/80 shadow-[0_0_16px_rgba(249,115,22,0.55)] transition group-hover:shadow-[0_0_22px_rgba(249,115,22,0.8)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
      </span>
      <span className="leading-tight">
        <span className="block text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
          Departamento
        </span>
        <span className="block text-lg font-semibold tracking-[0.18em] text-white">PAWNEE</span>
      </span>
    </NavLink>
  );
}

const enlaceNav =
  "relative px-3 py-2 text-sm font-medium tracking-wide text-zinc-400 transition hover:text-white";

const enlaceActivo =
  "text-white after:absolute after:inset-x-3 after:-bottom-px after:h-px after:bg-orange-500 after:shadow-[0_0_8px_rgba(249,115,22,0.9)]";

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const headerAnimado = useRef(false);

  useGSAP(
    () => {
      const header = headerRef.current;
      const main = mainRef.current;
      if (!header || !main) return;

      if (prefiereMenosMovimiento()) {
        gsap.set([header, main], { autoAlpha: 1, y: 0 });
        return;
      }

      if (!headerAnimado.current) {
        headerAnimado.current = true;
        gsap.from(header, {
          y: -40,
          autoAlpha: 0,
          duration: 0.42,
          ease: "power3.out",
        });
        const enlaces = header.querySelectorAll("nav a");
        if (enlaces.length) {
          gsap.from(enlaces, {
            y: -10,
            autoAlpha: 0,
            duration: 0.26,
            stagger: 0.045,
            delay: 0.12,
            ease: "power2.out",
          });
        }
      }

      gsap.fromTo(
        main,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.32, ease: "power2.out", overwrite: "auto" }
      );
    },
    { scope: rootRef, dependencies: [location.pathname] }
  );

  return (
    <div ref={rootRef} className="relative min-h-screen bg-zinc-950 font-sans text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-orange-500/20 bg-zinc-950/80 shadow-[0_1px_24px_-12px_rgba(249,115,22,0.55)] backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <LogoPawnee />

          <nav className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <NavLink to="/" end className={({ isActive }) => `${enlaceNav} ${isActive ? enlaceActivo : ""}`}>
              Criaturas
            </NavLink>
            <NavLink
              to="/avistamientos"
              className={({ isActive }) => `${enlaceNav} ${isActive ? enlaceActivo : ""}`}
            >
              Avistamientos
            </NavLink>
            <NavLink
              to="/criaturas/nueva"
              className="ml-2 inline-flex items-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-sm font-medium text-orange-300 transition hover:border-orange-400/60 hover:bg-orange-500/20 hover:text-orange-200"
            >
              <span className="text-base leading-none">+</span>
              Registrar
            </NavLink>
          </nav>
        </div>
      </header>

      <main ref={mainRef} className="relative z-10 mx-auto w-full max-w-6xl px-4 py-10">
        {children}
      </main>
    </div>
  );
}
