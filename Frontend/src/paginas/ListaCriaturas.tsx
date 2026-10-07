/**
 * paginas/ListaCriaturas.tsx
 * ------------------------------
 * Página de solo lectura: lista todas las criaturas.
 * Maneja los 3 estados: loading, error y empty.
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerCriaturas } from "../api/criaturasApi";
import { Criatura, TipoCriatura, TIPOS_CRIATURA } from "../tipos";
import {
  AvatarCriatura,
  BadgeEstado,
  BadgeTipo,
  BarraPeligro,
  ETIQUETAS_TIPO,
  estiloTipo,
} from "../componentes/visual";
import { useGSAP } from "@gsap/react";
import { Flip, gsap, prefiereMenosMovimiento } from "../animaciones/gsapSetup";

export function ListaCriaturas() {
  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<TipoCriatura | "">("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paginaRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const animandoFiltro = useRef(false);
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const introHecha = useRef(false);

  useEffect(() => {
    setCargando(true);
    setError(null);

    obtenerCriaturas(filtroTipo || undefined)
      .then(setCriaturas)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Error al cargar las criaturas.");
      })
      .finally(() => setCargando(false));
  }, [filtroTipo]);

  useGSAP(
    () => {
      if (introHecha.current || prefiereMenosMovimiento()) return;
      const bloques = paginaRef.current?.querySelectorAll("[data-intro]");
      if (!bloques?.length) return;
      introHecha.current = true;
      gsap.from(bloques, {
        autoAlpha: 0,
        y: 14,
        duration: 0.36,
        stagger: 0.05,
        ease: "power2.out",
      });
    },
    { scope: paginaRef }
  );

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid || cargando) return;

      const cards = grid.querySelectorAll<HTMLElement>("[data-criatura-card]");
      if (!cards.length) return;

      if (prefiereMenosMovimiento()) {
        gsap.set(cards, { autoAlpha: 1, y: 0, scale: 1, filter: "none" });
        flipState.current = null;
        return;
      }

      const estadoPrevio = flipState.current;
      flipState.current = null;

      if (estadoPrevio) {
        Flip.from(estadoPrevio, {
          duration: 0.28,
          ease: "power2.out",
          nested: true,
          prune: true,
        });
      }

      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 16, scale: 0.97, filter: "brightness(1.7)" },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "brightness(1)",
          duration: 0.3,
          stagger: 0.04,
          ease: "power2.out",
          overwrite: true,
          clearProps: "transform,filter",
        }
      );
    },
    { scope: gridRef, dependencies: [criaturas, cargando] }
  );

  function cambiarFiltro(tipo: TipoCriatura | "") {
    if (tipo === filtroTipo || animandoFiltro.current) return;

    const grid = gridRef.current;
    const cards = grid?.querySelectorAll<HTMLElement>("[data-criatura-card]");
    if (!grid || !cards?.length || prefiereMenosMovimiento()) {
      setFiltroTipo(tipo);
      return;
    }

    animandoFiltro.current = true;
    flipState.current = Flip.getState(grid);

    gsap.to(cards, {
      autoAlpha: 0,
      y: 10,
      scale: 0.96,
      duration: 0.16,
      stagger: 0.012,
      ease: "power2.in",
      overwrite: true,
      onComplete: () => {
        animandoFiltro.current = false;
        setFiltroTipo(tipo);
      },
    });
  }

  const mostrarSkeletons = cargando && criaturas.length === 0;
  const mostrarGrid = !error && criaturas.length > 0;

  return (
    <div ref={paginaRef}>
      <div className="mb-10 text-center" data-intro>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-orange-400">Archivo de campo</p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Criaturas de Pawnee</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
          Catálogo de fenómenos inexplicables. Filtra por tipo como un Pokédex y abre cada ficha para investigar.
        </p>
        {!cargando && !error && (
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.28em] text-zinc-500">
            Registradas: <span className="text-orange-300">{criaturas.length}</span>
          </p>
        )}
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-center gap-3" data-intro>
        <Link
          to="/criaturas/nueva"
          className="inline-flex items-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-zinc-950 shadow-[0_0_18px_-4px_rgba(249,115,22,0.8)] transition hover:-translate-y-0.5 hover:bg-orange-400"
        >
          Registrar criatura nueva
        </Link>
        <Link
          to="/avistamientos"
          className="inline-flex items-center rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-orange-500/40 hover:text-orange-300"
        >
          Ver avistamientos
        </Link>
      </div>

      <div className="mb-8" role="group" aria-label="Filtrar por tipo" data-intro>
        <p className="mb-4 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500">
          Filtrar por tipo
        </p>
        <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => cambiarFiltro("")}
            aria-pressed={filtroTipo === ""}
            className="group flex flex-col items-center gap-2"
          >
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-full border-2 bg-zinc-900 text-xs font-bold uppercase tracking-wider transition ${
                filtroTipo === ""
                  ? "border-orange-400 text-orange-300 shadow-[0_0_18px_-2px_rgba(251,146,60,0.7)]"
                  : "border-zinc-600 text-zinc-400 group-hover:border-zinc-400"
              }`}
            >
              All
            </span>
            <span className={`text-xs ${filtroTipo === "" ? "text-orange-300" : "text-zinc-500"}`}>Todos</span>
          </button>

          {TIPOS_CRIATURA.map((tipo) => {
            const activo = filtroTipo === tipo;
            const estilo = estiloTipo(tipo);
            return (
              <button
                key={tipo}
                type="button"
                onClick={() => cambiarFiltro(tipo)}
                aria-pressed={activo}
                className="group flex flex-col items-center gap-2"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full border-2 bg-zinc-900 transition ${estilo.fondo} ${
                    activo
                      ? `${estilo.anillo} ${estilo.texto}`
                      : `border-zinc-700 text-zinc-500 opacity-60 group-hover:opacity-100 group-hover:border-zinc-500`
                  }`}
                >
                  <span className={`h-3 w-3 rounded-full ${estilo.punto}`} />
                </span>
                <span className={`text-xs ${activo ? estilo.texto : "text-zinc-500"}`}>{ETIQUETAS_TIPO[tipo]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-8 flex items-center gap-3" data-intro>
        <span className="rounded-full bg-orange-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-950">
          {filtroTipo ? ETIQUETAS_TIPO[filtroTipo] : "Todos"}
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-orange-500 to-transparent" />
      </div>

      {mostrarSkeletons && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, indice) => (
            <div
              key={indice}
              className="h-72 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900"
              aria-hidden="true"
            />
          ))}
          <p className="col-span-full text-center text-sm text-zinc-500">Cargando criaturas...</p>
        </div>
      )}

      {!cargando && error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-8 text-center">
          <p className="text-sm text-red-300">Ocurrió un error: {error}</p>
        </div>
      )}

      {!cargando && !error && criaturas.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-zinc-600 text-zinc-600">
            ?
          </div>
          <p className="text-zinc-400">Todavía no hay criaturas registradas.</p>
        </div>
      )}

      {mostrarGrid && (
        <div
          ref={gridRef}
          className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 ${cargando ? "pointer-events-none" : ""}`}
          aria-busy={cargando}
        >
          {criaturas.map((criatura) => (
            <article
              key={criatura._id}
              data-criatura-card
              className="group flex flex-col items-center rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-[0_0_0_1px_rgba(24,24,27,1)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_0_28px_-8px_rgba(249,115,22,0.45)]"
            >
              <AvatarCriatura tipo={criatura.tipo} nombre={criatura.nombre} />
              <h2 className="mt-4 text-center text-base font-semibold text-white">{criatura.nombre}</h2>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                <BadgeTipo tipo={criatura.tipo} />
                <BadgeEstado estado={criatura.estado} />
              </div>
              <div className="mt-4 w-full">
                <BarraPeligro nivel={criatura.nivelPeligro} />
              </div>
              <div className="mt-4 flex w-full items-center justify-center gap-3 border-t border-zinc-800 pt-3 text-xs">
                <Link
                  to={`/criaturas/${criatura._id}`}
                  className="font-medium text-orange-300 transition hover:text-orange-200"
                >
                  Ver
                </Link>
                <span className="text-zinc-700">|</span>
                <Link
                  to={`/criaturas/${criatura._id}/editar`}
                  className="font-medium text-zinc-400 transition hover:text-white"
                >
                  Editar
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
