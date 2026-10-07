/**
 * paginas/DetalleCriatura.tsx
 * -------------------------------
 * Muestra una criatura completa y la lista de sus avistamientos, usando
 * la ruta anidada del backend. También permite eliminar la criatura.
 */

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { eliminarCriatura, obtenerCriaturaPorId } from "../api/criaturasApi";
import { obtenerAvistamientosDeCriatura } from "../api/avistamientosApi";
import { Criatura } from "../tipos";
import {
  AvatarCriatura,
  BadgeEstado,
  BadgeTipo,
  BarraPeligro,
  CLASE_BOTON_PELIGRO,
  CLASE_BOTON_SECUNDARIO,
} from "../componentes/visual";
import { useGSAP } from "@gsap/react";
import { gsap, prefiereMenosMovimiento } from "../animaciones/gsapSetup";

// El backend anida los avistamientos bajo /criaturas/:id/avistamientos
// SIN populate (ver criaturas.controller.ts de la Semana 6) — por eso aquí
// el campo `criatura` es un string, no un objeto.
interface AvistamientoSinPopular {
  _id: string;
  testigo: string;
  ubicacion: string;
  descripcion?: string;
  fecha: string;
}

export function DetalleCriatura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [criatura, setCriatura] = useState<Criatura | null>(null);
  const [avistamientos, setAvistamientos] = useState<AvistamientoSinPopular[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const paginaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    Promise.all([obtenerCriaturaPorId(id), obtenerAvistamientosDeCriatura(id)])
      .then(([criaturaCargada, avistamientosCargados]) => {
        setCriatura(criaturaCargada);
        setAvistamientos(avistamientosCargados as unknown as AvistamientoSinPopular[]);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar la criatura."))
      .finally(() => setCargando(false));
  }, [id]);

  useGSAP(
    () => {
      if (!criatura || prefiereMenosMovimiento()) return;
      const bloques = paginaRef.current?.children;
      if (!bloques?.length) return;
      gsap.from(bloques, { autoAlpha: 0, y: 14, duration: 0.32, stagger: 0.06, ease: "power2.out" });
    },
    { scope: paginaRef, dependencies: [criatura] }
  );

  async function manejarEliminar() {
    if (!id) return;
    if (!window.confirm("¿Seguro que quieres eliminar esta criatura?")) return;

    try {
      await eliminarCriatura(id);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la criatura.");
    }
  }

  if (cargando) {
    return (
      <p className="text-center text-sm text-zinc-400">Cargando...</p>
    );
  }
  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-8 text-center">
        <p className="text-sm text-red-300">Error: {error}</p>
      </div>
    );
  }
  if (!criatura) {
    return <p className="text-center text-sm text-zinc-400">No se encontró la criatura.</p>;
  }

  return (
    <div ref={paginaRef}>
      <p className="mb-8">
        <Link to="/" className="text-sm text-zinc-400 transition hover:text-orange-300">
          ← Volver a la lista
        </Link>
      </p>

      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="h-1.5 bg-gradient-to-r from-orange-500 via-orange-400 to-cyan-400" />
        <div className="flex flex-col items-center gap-8 px-6 py-10 sm:flex-row sm:items-start">
          <AvatarCriatura tipo={criatura.tipo} nombre={criatura.nombre} tamano="lg" />

          <div className="flex-1 text-center sm:text-left">
            <div className="mb-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <BadgeTipo tipo={criatura.tipo} />
              <BadgeEstado estado={criatura.estado} />
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{criatura.nombre}</h1>
            <div className="mt-6 max-w-sm">
              <BarraPeligro nivel={criatura.nivelPeligro} />
            </div>
            <div className="mt-6">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">Habilidades</p>
              {criatura.habilidades.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                  {criatura.habilidades.map((habilidad) => (
                    <span
                      key={habilidad}
                      className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-300"
                    >
                      {habilidad}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">(ninguna registrada)</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to={`/criaturas/${criatura._id}/editar`} className={CLASE_BOTON_SECUNDARIO}>
          Editar
        </Link>
        <button type="button" onClick={manejarEliminar} className={CLASE_BOTON_PELIGRO}>
          Eliminar
        </button>
      </div>

      <section className="mt-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-400">Bitácora</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">Avistamientos registrados</h2>
          </div>
          <Link
            to={`/avistamientos/nuevo?criaturaId=${criatura._id}`}
            className="text-sm font-medium text-orange-300 transition hover:text-orange-200"
          >
            Registrar un avistamiento de esta criatura →
          </Link>
        </div>

        {avistamientos.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-10 text-center text-sm text-zinc-400">
            Todavía no hay avistamientos registrados para esta criatura.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {avistamientos.map((avistamiento) => (
              <li
                key={avistamiento._id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:-translate-y-1 hover:border-cyan-500/30"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                  {avistamiento.fecha.slice(0, 10)}
                </p>
                <p className="mt-2 text-sm text-zinc-200">
                  <span className="font-medium text-white">{avistamiento.testigo}</span>
                  <span className="text-zinc-500"> en </span>
                  {avistamiento.ubicacion}
                </p>
                {avistamiento.descripcion ? (
                  <p className="mt-2 text-sm text-zinc-400">{avistamiento.descripcion}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
