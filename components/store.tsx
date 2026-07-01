"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ExtraReason,
  GameEvent,
  Player,
  REASONS,
  Standing,
  TeamSide,
} from "@/lib/types";
import { computeStandings } from "@/lib/points";
import { computeInsights, Insight } from "@/lib/insights";
import { parseRoster } from "@/lib/parse";
import { balanceTeams, BuilderSlot, toSlot } from "@/lib/balance";
import {
  buildShareMessage,
  buildShareUrl,
  decodeTeams,
  SharedTeams,
} from "@/lib/share";
import { getRepo, usingSupabase } from "@/lib/data";

export type Tab = "tabla" | "armar" | "registrar" | "historial";
export type Outcome = TeamSide | "Empate";
type Selected = { team: "w" | "b"; idx: number } | null;

const DEFAULT_INPUT =
  "Lunes 20hs\n1 nachoo\n2juanma\n3 Martin\n4 juani\n5 Fede\n6 Santi\n7 mauro\n8 mateo\n9 chiva\n10 Vale";

const USER_KEY = "flu:user";

interface AppContextValue {
  ready: boolean;
  usingSupabase: boolean;
  user: string | null;
  players: Player[];
  events: GameEvent[];
  standings: Standing[];
  insights: Insight[];
  leader: Standing | null;
  reasons: ExtraReason[];

  tab: Tab;
  go: (tab: Tab) => void;

  pick: (name: string) => void;
  createAndPick: (name: string) => Promise<void>;
  logout: () => void;
  openProfile: () => void;
  confirmRemember: (yes: boolean) => void;

  // equipos que llegan por el link compartido (vista de solo lectura)
  sharedTeams: SharedTeams | null;
  dismissShared: () => void;
  shareUrl: string;

  // builder
  builderInput: string;
  setBuilderInput: (v: string) => void;
  whites: BuilderSlot[];
  blacks: BuilderSlot[];
  selected: Selected;
  teamsReady: boolean;
  whitesPts: number;
  blacksPts: number;
  diffPoints: number;
  doParse: (shuffle: boolean) => void;
  tapPlayer: (team: "w" | "b", idx: number) => void;
  shareMsg: string;

  // register
  outcome: Outcome | null;
  setOutcome: (o: Outcome | null) => void;
  confirmResult: () => Promise<void>;

  // modals + toast
  modal: null | "extra" | "share" | "profile" | "remember";
  openExtra: () => void;
  openShare: () => void;
  closeModal: () => void;
  confirmExtra: (playerId: string, reasonId: string) => Promise<void>;
  removeEvent: (id: string) => Promise<void>;
  toast: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [tab, setTab] = useState<Tab>("tabla");

  const [builderInput, setBuilderInput] = useState(DEFAULT_INPUT);
  const [whites, setWhites] = useState<BuilderSlot[]>([]);
  const [blacks, setBlacks] = useState<BuilderSlot[]>([]);
  const [selected, setSelected] = useState<Selected>(null);

  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [modal, setModal] = useState<
    null | "extra" | "share" | "profile" | "remember"
  >(null);
  const [sharedTeams, setSharedTeams] = useState<SharedTeams | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastId = useRef(0);

  const standings = useMemo(
    () => computeStandings(players, events),
    [players, events]
  );
  const insights = useMemo(
    () => computeInsights(players, events),
    [players, events]
  );
  const leader = standings[0] ?? null;

  const refresh = useCallback(async () => {
    const repo = getRepo();
    const [ps, evs] = await Promise.all([repo.getPlayers(), repo.getEvents()]);
    setPlayers(ps);
    setEvents(evs);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await refresh();
      } catch (e) {
        console.error("Error cargando datos", e);
      }
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const t = params.get("t");
        if (t) {
          const decoded = decodeTeams(t);
          if (decoded) setSharedTeams(decoded);
        }
        const saved = window.localStorage.getItem(USER_KEY);
        if (saved) setUser(saved);
      }
      setReady(true);
    })();
  }, [refresh]);

  const doParse = useCallback(
    (shuffle: boolean) => {
      const resolved = parseRoster(builderInput, players, standings, 10);
      const slots = resolved.map(toSlot);
      const balanced = balanceTeams(slots, shuffle);
      setWhites(balanced.whites);
      setBlacks(balanced.blacks);
      setSelected(null);
      setOutcome(null);
    },
    [builderInput, players, standings]
  );

  // auto-arma una vez con el ejemplo cuando cargan los datos
  useEffect(() => {
    if (ready && players.length > 0 && whites.length === 0) {
      doParse(false);
    }
  }, [ready, players.length, whites.length, doParse]);

  const showToast = useCallback((msg: string) => {
    const id = ++toastId.current;
    setToast(msg);
    setTimeout(() => {
      if (toastId.current === id) setToast(null);
    }, 2500);
  }, []);

  const go = useCallback((t: Tab) => setTab(t), []);

  const pick = useCallback((name: string) => {
    setUser(name);
    setTab("tabla");
    setModal("remember"); // pregunta una vez si quiere quedar guardado
  }, []);

  const createAndPick = useCallback(
    async (name: string) => {
      const clean = name.trim();
      if (!clean) return;
      const repo = getRepo();
      const p = await repo.addPlayer(clean);
      await refresh();
      setUser(p.name);
      setTab("tabla");
      setModal("remember");
    },
    [refresh]
  );

  const confirmRemember = useCallback(
    (yes: boolean) => {
      if (yes && user && typeof window !== "undefined") {
        window.localStorage.setItem(USER_KEY, user);
      }
      setModal(null);
    },
    [user]
  );

  const openProfile = useCallback(() => setModal("profile"), []);

  const logout = useCallback(() => {
    setUser(null);
    setModal(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(USER_KEY);
    }
  }, []);

  const dismissShared = useCallback(() => {
    setSharedTeams(null);
    if (typeof window !== "undefined" && window.history?.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.delete("t");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const tapPlayer = useCallback(
    (team: "w" | "b", idx: number) => {
      if (!selected || selected.team === team) {
        setSelected({ team, idx });
        return;
      }
      const w = [...whites];
      const b = [...blacks];
      if (selected.team === "w") {
        const tmp = w[selected.idx];
        w[selected.idx] = b[idx];
        b[idx] = tmp;
      } else {
        const tmp = b[selected.idx];
        b[selected.idx] = w[idx];
        w[idx] = tmp;
      }
      setWhites(w);
      setBlacks(b);
      setSelected(null);
    },
    [selected, whites, blacks]
  );

  const confirmResult = useCallback(async () => {
    if (!outcome || whites.length === 0) return;
    const repo = getRepo();
    const resolve = async (slots: BuilderSlot[]) => {
      const result: { slot: BuilderSlot; id: string }[] = [];
      for (const s of slots) {
        let id = s.playerId;
        if (!id) {
          const p = await repo.addPlayer(s.name);
          id = p.id;
        }
        result.push({ slot: { ...s, playerId: id }, id });
      }
      return result;
    };
    const w = await resolve(whites);
    const b = await resolve(blacks);
    await repo.addResult({
      outcome,
      teamWhite: w.map((x) => x.id),
      teamBlack: b.map((x) => x.id),
    });
    setWhites(w.map((x) => x.slot));
    setBlacks(b.map((x) => x.slot));
    setOutcome(null);
    await refresh();
    showToast(
      outcome === "Empate"
        ? "Empate registrado · +1 a todos"
        : "Resultado guardado ✓"
    );
    setTab("historial");
  }, [outcome, whites, blacks, refresh, showToast]);

  const openExtra = useCallback(() => setModal("extra"), []);
  const openShare = useCallback(() => setModal("share"), []);
  const closeModal = useCallback(() => setModal(null), []);

  const confirmExtra = useCallback(
    async (playerId: string, reasonId: string) => {
      const r = REASONS.find((x) => x.id === reasonId);
      if (!r) return;
      const repo = getRepo();
      await repo.addExtra({
        playerId,
        reason: r.id,
        reasonLabel: r.label,
        addedBy: user || "Alguien",
        delta: r.pts,
      });
      setModal(null);
      await refresh();
      const p = players.find((x) => x.id === playerId);
      showToast(`+${r.pts} a ${p?.name ?? "jugador"} ✓`);
    },
    [user, players, refresh, showToast]
  );

  const removeEvent = useCallback(
    async (id: string) => {
      const repo = getRepo();
      await repo.removeEvent(id, user || "Alguien");
      await refresh();
      showToast("Movimiento quitado");
    },
    [refresh, showToast, user]
  );

  const whitesPts = useMemo(
    () => whites.reduce((a, s) => a + s.pts, 0),
    [whites]
  );
  const blacksPts = useMemo(
    () => blacks.reduce((a, s) => a + s.pts, 0),
    [blacks]
  );
  const shareUrl = useMemo(
    () => buildShareUrl(whites, blacks, leader),
    [whites, blacks, leader]
  );
  const shareMsg = useMemo(
    () => buildShareMessage(whites, blacks, leader, shareUrl),
    [whites, blacks, leader, shareUrl]
  );

  const value: AppContextValue = {
    ready,
    usingSupabase,
    user,
    players,
    events,
    standings,
    insights,
    leader,
    reasons: REASONS,
    tab,
    go,
    pick,
    createAndPick,
    logout,
    openProfile,
    confirmRemember,
    sharedTeams,
    dismissShared,
    shareUrl,
    builderInput,
    setBuilderInput,
    whites,
    blacks,
    selected,
    teamsReady: whites.length > 0,
    whitesPts,
    blacksPts,
    diffPoints: Math.abs(whitesPts - blacksPts),
    doParse,
    tapPlayer,
    shareMsg,
    outcome,
    setOutcome,
    confirmResult,
    modal,
    openExtra,
    openShare,
    closeModal,
    confirmExtra,
    removeEvent,
    toast,
    showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
