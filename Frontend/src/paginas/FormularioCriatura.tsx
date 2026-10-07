/**
 * paginas/FormularioCriatura.tsx
 * ----------------------------------
 * Un solo componente para CREAR y EDITAR, según la ruta.
 */

import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { crearCriatura, actualizarCriatura, obtenerCriaturaPorId } from "../api/criaturasApi";
import { CriaturaFormulario, TIPOS_CRIATURA, ESTADOS_INVESTIGACION } from "../tipos";
import {
  CLASE_BOTON_PRIMARIO,
  CLASE_INPUT,
  CLASE_LABEL,
  ETIQUETAS_ESTADO,
  ETIQUETAS_TIPO,
} from "../componentes/visual";

const FORM_VACIO: CriaturaFormulario = {
  nombre: "",
  tipo: "mitica",
  habilidades: [],
  nivelPeligro: 5,
  estado: "activa",
};

export function FormularioCriatura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [form, setForm] = useState<CriaturaFormulario>(FORM_VACIO);
  const [habilidadesTexto, setHabilidadesTexto] = useState("");
  const [cargando, setCargando] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    obtenerCriaturaPorId(id)
      .then((criatura) => {
        setForm({
          nombre: criatura.nombre,
          tipo: criatura.tipo,
          habilidades: criatura.habilidades,
          nivelPeligro: criatura.nivelPeligro,
          estado: criatura.estado,
        });
        setHabilidadesTexto(criatura.habilidades.join(", "));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "No se pudo cargar la criatura."))
      .finally(() => setCargando(false));
  }, [id]);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);

    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    const datosAEnviar: CriaturaFormulario = {
      ...form,
      habilidades: habilidadesTexto
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h.length > 0),
    };

    try {
      setGuardando(true);
      if (esEdicion && id) {
        await actualizarCriatura(id, datosAEnviar);
      } else {
        await crearCriatura(datosAEnviar);
      }
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la criatura.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <p className="text-center text-sm text-zinc-400">Cargando datos de la criatura...</p>;

  return (
    <div className="mx-auto max-w-xl">
      <Link to="/" className="mb-8 inline-block text-sm text-zinc-400 transition hover:text-orange-300">
        ← Volver a la lista
      </Link>

      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-orange-400">
        {esEdicion ? "Actualizar ficha" : "Nueva entrada"}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {esEdicion ? "Editar criatura" : "Registrar criatura nueva"}
      </h1>
      <p className="mt-2 mb-8 text-sm text-zinc-400">
        Completa los datos de campo. El tipo determina cómo se cataloga en el archivo.
      </p>

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
          <label htmlFor="nombre" className={CLASE_LABEL}>
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className={CLASE_INPUT}
            placeholder="Ej. Wendigo del parque"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="tipo" className={CLASE_LABEL}>
              Tipo
            </label>
            <select
              id="tipo"
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value as CriaturaFormulario["tipo"] })}
              className={CLASE_INPUT}
            >
              {TIPOS_CRIATURA.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {ETIQUETAS_TIPO[tipo]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="estado" className={CLASE_LABEL}>
              Estado
            </label>
            <select
              id="estado"
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value as CriaturaFormulario["estado"] })}
              className={CLASE_INPUT}
            >
              {ESTADOS_INVESTIGACION.map((estado) => (
                <option key={estado} value={estado}>
                  {ETIQUETAS_ESTADO[estado]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="habilidades" className={CLASE_LABEL}>
            Habilidades (separadas por comas)
          </label>
          <input
            id="habilidades"
            type="text"
            value={habilidadesTexto}
            onChange={(e) => setHabilidadesTexto(e.target.value)}
            className={CLASE_INPUT}
            placeholder="invisibilidad, vuelo, grito sónico"
          />
        </div>

        <div>
          <label htmlFor="nivelPeligro" className={CLASE_LABEL}>
            Nivel de peligro (1-10)
          </label>
          <input
            id="nivelPeligro"
            type="number"
            min={1}
            max={10}
            value={form.nivelPeligro}
            onChange={(e) => setForm({ ...form, nivelPeligro: Number(e.target.value) })}
            className={CLASE_INPUT}
          />
        </div>

        <div className="pt-2">
          <button type="submit" disabled={guardando} className={`${CLASE_BOTON_PRIMARIO} w-full`}>
            {guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear criatura"}
          </button>
        </div>
      </form>
    </div>
  );
}
