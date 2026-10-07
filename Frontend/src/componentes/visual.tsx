import { EstadoInvestigacion, TipoCriatura } from "../tipos";

export const ETIQUETAS_TIPO: Record<TipoCriatura, string> = {
  mitica: "Mítica",
  elemental: "Elemental",
  mecanica: "Mecánica",
  espectral: "Espectral",
};

export const ETIQUETAS_ESTADO: Record<EstadoInvestigacion, string> = {
  activa: "Activa",
  en_investigacion: "En investigación",
  descartada: "Descartada",
};

export const CLASE_INPUT =
  "w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3.5 py-2.5 text-sm text-zinc-100 shadow-inner outline-none transition placeholder:text-zinc-600 hover:border-zinc-700 focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/30 disabled:opacity-50";

export const CLASE_LABEL =
  "mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-zinc-400";

export const CLASE_BOTON_PRIMARIO =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 shadow-[0_0_20px_-4px_rgba(249,115,22,0.75)] transition hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-[0_0_28px_-2px_rgba(249,115,22,0.9)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0";

export const CLASE_BOTON_SECUNDARIO =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-orange-500/50 hover:text-orange-300";

export const CLASE_BOTON_PELIGRO =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:border-red-400/60 hover:bg-red-500/20";

const ESTILO_TIPO: Record<
  TipoCriatura,
  { badge: string; anillo: string; fondo: string; texto: string; punto: string }
> = {
  mitica: {
    badge: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/40",
    anillo: "border-violet-400 shadow-[0_0_18px_-2px_rgba(167,139,250,0.55)]",
    fondo: "bg-violet-500/15",
    texto: "text-violet-300",
    punto: "bg-violet-400",
  },
  elemental: {
    badge: "bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/40",
    anillo: "border-orange-400 shadow-[0_0_18px_-2px_rgba(251,146,60,0.55)]",
    fondo: "bg-orange-500/15",
    texto: "text-orange-300",
    punto: "bg-orange-400",
  },
  mecanica: {
    badge: "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/40",
    anillo: "border-cyan-400 shadow-[0_0_18px_-2px_rgba(34,211,238,0.5)]",
    fondo: "bg-cyan-500/15",
    texto: "text-cyan-300",
    punto: "bg-cyan-400",
  },
  espectral: {
    badge: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40",
    anillo: "border-emerald-400 shadow-[0_0_18px_-2px_rgba(52,211,153,0.5)]",
    fondo: "bg-emerald-500/15",
    texto: "text-emerald-300",
    punto: "bg-emerald-400",
  },
};

const ESTILO_ESTADO: Record<EstadoInvestigacion, string> = {
  activa: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30",
  en_investigacion: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30",
  descartada: "bg-zinc-500/15 text-zinc-400 ring-1 ring-zinc-500/30",
};

export function estiloTipo(tipo: TipoCriatura) {
  return ESTILO_TIPO[tipo];
}

export function BadgeTipo({ tipo }: { tipo: TipoCriatura }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${ESTILO_TIPO[tipo].badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${ESTILO_TIPO[tipo].punto}`} />
      {ETIQUETAS_TIPO[tipo]}
    </span>
  );
}

export function BadgeEstado({ estado }: { estado: EstadoInvestigacion }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${ESTILO_ESTADO[estado]}`}>
      {ETIQUETAS_ESTADO[estado]}
    </span>
  );
}

export function clasePeligro(nivel: number): string {
  if (nivel >= 7) return "text-red-400";
  if (nivel >= 4) return "text-amber-400";
  return "text-emerald-400";
}

export function IconoTipo({ tipo, className = "h-8 w-8" }: { tipo: TipoCriatura; className?: string }) {
  const comunes = `${className} ${ESTILO_TIPO[tipo].texto}`;

  if (tipo === "mitica") {
    return (
      <svg className={comunes} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M18 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z" fill="currentColor" />
      </svg>
    );
  }

  if (tipo === "elemental") {
    return (
      <svg className={comunes} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3c2 3.5 6 6.2 6 11a6 6 0 11-12 0c0-2.4 1.2-4.6 3-6.5C10.2 9.8 11 11.5 11 13c0 1.1.9 2 2 2 1.4 0 2.2-1.5 1.7-2.8C13.8 9.2 12.5 6.2 12 3z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (tipo === "mecanica") {
    return (
      <svg className={comunes} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 4v2.2M12 17.8V20M4 12h2.2M17.8 12H20M6.3 6.3l1.6 1.6M16.1 16.1l1.6 1.6M17.7 6.3l-1.6 1.6M7.9 16.1l-1.6 1.6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg className={comunes} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20c4.4 0 7-2.7 7-6.2 0-2.6-1.5-4.3-3.2-5.6.3 1.3 0 2.8-1 3.6C14 9.2 12.7 6 10.5 4c.2 2.4-.6 4.3-2.3 5.6C6.6 10.8 5 12.8 5 15.2 5 18 8 20 12 20z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AvatarCriatura({
  tipo,
  nombre,
  tamano = "md",
}: {
  tipo: TipoCriatura;
  nombre: string;
  tamano?: "sm" | "md" | "lg";
}) {
  const medidas = {
    sm: "h-14 w-14",
    md: "h-24 w-24",
    lg: "h-36 w-36",
  }[tamano];
  const icono = { sm: "h-6 w-6", md: "h-10 w-10", lg: "h-14 w-14" }[tamano];

  return (
    <div
      className={`relative flex ${medidas} items-center justify-center rounded-full border-2 bg-zinc-950 ${ESTILO_TIPO[tipo].anillo} ${ESTILO_TIPO[tipo].fondo}`}
      role="img"
      aria-label={nombre}
    >
      <IconoTipo tipo={tipo} className={icono} />
    </div>
  );
}

export function BarraPeligro({ nivel }: { nivel: number }) {
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-wider text-zinc-500">
        <span>Peligro</span>
        <span className={`font-semibold ${clasePeligro(nivel)}`}>{nivel}/10</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full ${nivel >= 7 ? "bg-red-500" : nivel >= 4 ? "bg-amber-400" : "bg-emerald-400"}`}
          style={{ width: `${Math.min(Math.max(nivel, 0), 10) * 10}%` }}
        />
      </div>
    </div>
  );
}
