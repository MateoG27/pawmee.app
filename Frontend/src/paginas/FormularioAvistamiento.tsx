/**
 * paginas/FormularioAvistamiento.tsx
 * ---------------------------------------
 * Crea un avistamiento nuevo. Si se llega desde el detalle de una
 * criatura (?criaturaId=...), ese campo se precarga.
 */

import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { crearAvistamiento } from "../api/avistamientosApi";
import { obtenerCriaturas } from "../api/criaturasApi";
import { AvistamientoFormulario, Criatura } from "../tipos";
import { CLASE_BOTON_PRIMARIO, CLASE_INPUT, CLASE_LABEL } from "../componentes/visual";

const FORM_VACIO: AvistamientoFormulario = {
  criatura: "",
  testigo: "",
  ubicacion: "",
  descripcion: "",
  fecha: "",
};

export function FormularioAvistamiento() {
  const [parametros] = useSearchParams();
  const navigate = useNavigate();

  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [form, setForm] = useState<AvistamientoFormulario>({
    ...FORM_VACIO,
    criatura: parametros.get("criaturaId") ?? "",
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    obtenerCriaturas()
      .then((lista) => {
        setCriaturas(lista);
        if (!form.criatura && lista.length > 0) {
          setForm((actual) => ({ ...actual, criatura: lista[0]._id }));
        }
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "No se pudieron cargar las criaturas."))
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);

    if (!form.criatura || !form.testigo.trim() || !form.ubicacion.trim() || !form.fecha) {
      setError("Criatura, testigo, ubicación y fecha son obligatorios.");
      return;
    }

    try {
      setGuardando(true);
      await crearAvistamiento(form);
      navigate("/avistamientos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el avistamiento.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <p className="text-center text-sm text-zinc-400">Cargando formulario...</p>;

  return (
    <div className="mx-auto max-w-xl">
      <Link to="/avistamientos" className="mb-8 inline-block text-sm text-zinc-400 transition hover:text-orange-300">
        ← Volver a avistamientos
      </Link>

      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-orange-400">Nuevo reporte</p>
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Registrar avistamiento</h1>
      <p className="mt-2 mb-8 text-sm text-zinc-400">Documenta el testimonio con la mayor precisión posible.</p>

      {error && (
        <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Error: {error}
        </p>
      )}

      <form
        onSubmit={manejarEnvio}
        className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-[0_0_40px_-24px_rgba(249,115,22,0.45)]"
      >
        <div>
          <label htmlFor="criatura" className={CLASE_LABEL}>
            Criatura
          </label>
          <select
            id="criatura"
            value={form.criatura}
            onChange={(e) => setForm({ ...form, criatura: e.target.value })}
            className={CLASE_INPUT}
          >
            {criaturas.map((criatura) => (
              <option key={criatura._id} value={criatura._id}>
                {criatura.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="testigo" className={CLASE_LABEL}>
              Testigo
            </label>
            <input
              id="testigo"
              type="text"
              value={form.testigo}
              onChange={(e) => setForm({ ...form, testigo: e.target.value })}
              className={CLASE_INPUT}
              placeholder="Nombre del testigo"
            />
          </div>

          <div>
            <label htmlFor="fecha" className={CLASE_LABEL}>
              Fecha
            </label>
            <input
              id="fecha"
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              className={CLASE_INPUT}
            />
          </div>
        </div>

        <div>
          <label htmlFor="ubicacion" className={CLASE_LABEL}>
            Ubicación
          </label>
          <input
            id="ubicacion"
            type="text"
            value={form.ubicacion}
            onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
            className={CLASE_INPUT}
            placeholder="Parque, calle, sector..."
          />
        </div>

        <div>
          <label htmlFor="descripcion" className={CLASE_LABEL}>
            Descripción (opcional)
          </label>
          <input
            id="descripcion"
            type="text"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className={CLASE_INPUT}
            placeholder="Qué se observó"
          />
        </div>

        <div className="pt-2">
          <button type="submit" disabled={guardando} className={`${CLASE_BOTON_PRIMARIO} w-full`}>
            {guardando ? "Guardando..." : "Registrar avistamiento"}
          </button>
        </div>
      </form>
    </div>
  );
}
