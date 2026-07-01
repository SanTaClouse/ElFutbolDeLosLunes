"use client";

import { AppProvider, useApp } from "@/components/store";
import { Onboarding } from "@/components/Onboarding";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { Toast } from "@/components/Toast";
import { ExtraPointsSheet } from "@/components/ExtraPointsSheet";
import { ShareSheet } from "@/components/ShareSheet";
import { ProfileSheet } from "@/components/ProfileSheet";
import { RememberSheet } from "@/components/RememberSheet";
import { SharedTeamsView } from "@/components/SharedTeamsView";
import { TablaTab } from "@/components/tabs/TablaTab";
import { ArmarTab } from "@/components/tabs/ArmarTab";
import { RegistrarTab } from "@/components/tabs/RegistrarTab";
import { HistorialTab } from "@/components/tabs/HistorialTab";

function Shell() {
  const { ready, user, tab, modal, sharedTeams } = useApp();

  return (
    <div className="flex min-h-[100dvh] justify-center bg-[radial-gradient(120%_100%_at_50%_0%,#EEF2EC_0%,#DFE6DC_60%,#D3DCCF_100%)] sm:py-6">
      <div className="relative flex h-[100dvh] w-full max-w-[440px] flex-col overflow-hidden bg-appbg sm:h-[860px] sm:max-h-[92dvh] sm:rounded-[36px] sm:border sm:border-line sm:shadow-[0_40px_80px_-30px_rgba(20,40,20,.45)]">
        {!ready ? (
          <div className="flex flex-1 items-center justify-center text-sm font-semibold text-faint">
            Cargando…
          </div>
        ) : sharedTeams ? (
          <SharedTeamsView />
        ) : !user ? (
          <Onboarding />
        ) : (
          <>
            <AppHeader />
            <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-6">
              {tab === "tabla" && <TablaTab />}
              {tab === "armar" && <ArmarTab />}
              {tab === "registrar" && <RegistrarTab />}
              {tab === "historial" && <HistorialTab />}
            </div>
            <BottomNav />
            {modal === "extra" && <ExtraPointsSheet />}
            {modal === "share" && <ShareSheet />}
            {modal === "profile" && <ProfileSheet />}
            {modal === "remember" && <RememberSheet />}
            <Toast />
          </>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
