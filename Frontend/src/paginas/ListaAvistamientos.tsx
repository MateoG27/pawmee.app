/**
 * paginas/ListaAvistamientos.tsx
 * -----------------------------------
 * Lista TODOS los avistamientos. Como el backend usa populate("criatura"),
 * cada avistamiento.criatura ya es el objeto completo.
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { eliminarAvistamiento, obtenerAvistamientos } from "../api/avistamientosApi";
import { Avistamiento } from "../tipos";
import { BadgeTipo, CLASE_BOTON_PELIGRO } from "../componentes/visual";
import { useGSAP } from "@gsap/react";
import { gsap, prefiereMenosMovimiento } from "../animaciones/gsapSetup";

export function ListaAvistamientos() {
  const [avistamientos, setAvistamientos] = useState<Avistamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const paginaRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  function cargar() {
    setCargando(true);
    setError(null);
    obtenerAvistamientos()
      .then(setAvistamientos)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar los avistamientos."))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargar();
  }, []);

  useGSAP(
    () => {
      if (prefiereMenosMovimiento()) return;
      const bloques = paginaRef.current?.querySelectorAll("[data-intro]");
      if (bloques?.length) {
        gsap.from(bloques, { autoAlpha: 0, y: 14, duration: 0.36, stagger: 0.05, ease: "power2.out" });
      }
    },
    { scope: paginaRef }
  );

  useGSAP(
    () => {
      if (cargando || prefiereMenosMovimiento()) return;
      const cards = gridRef.current?.querySelectorAll("article");
      if (!cards?.length) return;
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 16, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, stagger: 0.045, ease: "power2.out", clearProps: "transform" }
      );
    },
    { scope: gridRef, dependencies: [avistamientos, cargando] }
  );

  async function manejarEliminar(id: string) {
    if (!window.confirm("¿Eliminar este avistamiento?")) return;
    try {
      await eliminarAvistamiento(id);
      cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el avistamiento.");
    }
  }

  return (
    <div ref={paginaRef}>
      <div className="mb-10 text-center" data-intro>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-orange-400">Reportes de campo</p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Avistamientos registrados</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
          Cada registro vincula un testigo, un lugar y una criatura del archivo.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-center gap-3" data-intro>
        <Link
          to="/"
          className="inline-flex items-center rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-orange-500/40 hover:text-orange-300"
        >
          Volver a criaturas
        </Link>
        <Link
          to="/avistamientos/nuevo"
          className="inline-flex items-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-zinc-950 shadow-[0_0_18px_-4px_rgba(249,115,22,0.8)] transition hover:-translate-y-0.5 hover:bg-orange-400"
        >
          Registrar avistamiento nuevo
        </Link>
      </div>

      {cargando && <p className="text-center text-sm text-zinc-400">Cargando avistamientos...</p>}
      {!cargando && error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-8 text-center">
          <p className="text-sm text-red-300">Error: {error}</p>
        </div>
      )}
      {!cargando && !error && avistamientos.length === 0 && (
        <p className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-16 text-center text-zinc-400">
          Todavía no hay avistamientos registrados.
        </p>
      )}

      {!cargando && !error && avistamientos.length > 0 && (
        <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {avistamientos.map((avistamiento) => (
            <article
              key={avistamiento._id}
              className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-[0_0_24px_-10px_rgba(34,211,238,0.35)]"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                {avistamiento.fecha.slice(0, 10)}
              </p>
              <Link
                to={`/criaturas/${avistamiento.criatura._id}`}
                className="mt-2 text-lg font-semibold text-white transition hover:text-orange-300"
              >
                {avistamiento.criatura.nombre}
              </Link>
              <div className="mt-2">
                <BadgeTipo tipo={avistamiento.criatura.tipo} />
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-zinc-500">Testigo</dt>
                  <dd className="text-right text-zinc-200">{avistamiento.testigo}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-zinc-500">Ubicación</dt>
                  <dd className="text-right text-zinc-200">{avistamiento.ubicacion}</dd>
                </div>
              </dl>
              <div className="mt-5 border-t border-zinc-800 pt-4">
                <button
                  type="button"
                  onClick={() => manejarEliminar(avistamiento._id)}
                  className={`${CLASE_BOTON_PELIGRO} w-full py-2 text-xs`}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
