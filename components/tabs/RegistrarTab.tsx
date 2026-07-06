"use client";

import { useApp } from "../store";
import { IconPlus } from "../Icons";

export function RegistrarTab() {
  const {
    teamsReady,
    whites,
    blacks,
    outcome,
    setOutcome,
    confirmResult,
    openExtra,
    go,
    currentLineup,
    teamsEdited,
  } = useApp();

  if (!teamsReady) {
    return (
      <div className="px-5 py-16 text-center text-faint">
        <div className="text-[15px] font-bold text-ink">
          Primero armá los equipos
        </div>
        <div className="mt-1.5 text-[13px]">
          Andá a la pestaña “Armar” para cargar la lista del partido.
        </div>
        <button
          onClick={() => go("armar")}
          className="mt-4 rounded-xl bg-brand px-[22px] py-3 text-sm font-extrabold text-white"
        >
          Ir a armar equipos
        </button>
      </div>
    );
  }

  const summary =
    outcome === "Empate"
      ? { title: "Empate", detail: "+1 punto para los 10 jugadores." }
      : outcome
      ? {
          title: outcome === "Blancos" ? "Ganan Blancos" : "Ganan Negros",
          detail:
            "+3 pts y +1 partido para: " +
            (outcome === "Blancos" ? whites : blacks)
              .map((p) => p.name)
              .join(", ") +
            ".",
        }
      : null;

  const winBtn = (active: boolean, dark: boolean) =>
    active
      ? dark
        ? "bg-teamblack text-white border-2 border-teamblack"
        : "bg-brand text-white border-2 border-brand"
      : "bg-white text-ink border-2 border-line";

  return (
    <div>
      <div className="mx-0.5 mb-2.5 mt-0.5 text-[13px] font-semibold text-muted">
        ¿Quién ganó el partido de hoy?
      </div>
      {currentLineup && !teamsEdited && (
        <div className="mx-0.5 -mt-1 mb-2.5 text-[11.5px] font-semibold text-faint">
          Se registra con los equipos que confirmó{" "}
          {currentLineup.addedBy ?? "alguien"}.
        </div>
      )}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => setOutcome("Blancos")}
          className={`flex flex-col items-center gap-[7px] rounded-2xl px-2.5 py-[15px] ${winBtn(
            outcome === "Blancos",
            false
          )}`}
        >
          <span
            className="h-[26px] w-[26px] rounded-full border-2"
            style={{ background: "#fff", borderColor: "#10160F" }}
          />
          <span className="text-sm font-extrabold">Blancos</span>
        </button>
        <button
          onClick={() => setOutcome("Negros")}
          className={`flex flex-col items-center gap-[7px] rounded-2xl px-2.5 py-[15px] ${winBtn(
            outcome === "Negros",
            true
          )}`}
        >
          <span
            className="h-[26px] w-[26px] rounded-full"
            style={{
              background: "#17201A",
              boxShadow: "0 0 0 1.5px #fff inset",
            }}
          />
          <span className="text-sm font-extrabold">Negros</span>
        </button>
      </div>
      <button
        onClick={() => setOutcome("Empate")}
        className={`mt-2.5 w-full rounded-2xl py-3.5 text-sm font-extrabold ${
          outcome === "Empate"
            ? "border-2 border-brand bg-brand text-white"
            : "border-2 border-line bg-white text-ink"
        }`}
      >
        Empate
      </button>

      {summary && (
        <div className="mt-3.5 animate-up rounded-2xl border border-softborder bg-softgreen px-[15px] py-3.5">
          <div className="text-[13px] font-extrabold text-brand">
            {summary.title}
          </div>
          <div className="mt-[3px] text-[12.5px] text-[#3f7a55]">
            {summary.detail}
          </div>
        </div>
      )}

      <div className="mx-0.5 mb-[9px] mt-[18px] flex items-center justify-between">
        <span className="text-sm font-extrabold text-ink">Puntos extra</span>
        <span className="text-xs font-bold text-primary">+1 c/u</span>
      </div>
      <button
        onClick={openExtra}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-[#C4D2C4] bg-white py-3.5 text-sm font-extrabold text-brand transition hover:bg-appbg"
      >
        <IconPlus size={17} />
        Sumar punto extra a un jugador
      </button>
      <div className="mt-2 text-center text-[11.5px] leading-[1.4] text-faint">
        Gol de cabeza · gol de mitad de cancha · 5+ goles · 3 invicto
      </div>

      <button
        onClick={confirmResult}
        disabled={!outcome}
        className={`mt-4 w-full rounded-2xl py-[15px] text-[15px] font-extrabold text-white ${
          outcome ? "bg-primary" : "cursor-not-allowed bg-[#D6DCD4]"
        }`}
      >
        Confirmar resultado
      </button>
    </div>
  );
}
