/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { BottomNav } from './components/layout/BottomNav';
import { SearchModal } from './components/search/SearchModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { LearnView } from './components/learn/LearnView';
import { PsychologyView } from './components/psychology/PsychologyView';
import { GamesHubView } from './components/games/GamesHubView';
import { SimulatorsHubView } from './components/simulators/SimulatorsHubView';
import { NegotiationView } from './components/negotiation/NegotiationView';
import { TermSheetAnalyzerView } from './components/termsheet/TermSheetAnalyzerView';
import { FinalExamView } from './components/exam/FinalExamView';
import { ProfileView } from './components/profile/ProfileView';
import { MindfulnessSanctuaryView } from './components/mindfulness/MindfulnessSanctuaryView';
import { ArtisticOpeningPortal } from './components/opening/ArtisticOpeningPortal';
import { OverlappingStackShowcase } from './components/common/OverlappingStackShowcase';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    isOpeningPortalOpen,
    setIsOpeningPortalOpen,
    isCardStackModalOpen,
    setIsCardStackModalOpen,
    language,
  } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-bg-main dark:bg-[#0C0E17] text-text-primary dark:text-stone-100 flex font-sans antialiased selection:bg-amber-500/25 selection:text-amber-300 overflow-x-hidden">
      {/* High-Luminance Artistic Ambient Glows & Chromatic Light Meshes */}
      <div className="fixed top-0 right-1/4 w-[45rem] h-[45rem] bg-gradient-to-br from-amber-400/20 via-purple-600/18 to-transparent rounded-full blur-[110px] pointer-events-none -z-10 animate-aurora" />
      <div className="fixed bottom-0 left-1/4 w-[42rem] h-[42rem] bg-gradient-to-tr from-emerald-500/18 via-teal-500/16 to-indigo-600/18 rounded-full blur-[110px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-radial from-amber-500/10 via-purple-500/5 to-transparent rounded-full blur-[90px] pointer-events-none -z-10" />

      {/* Desktop Sidebar (hidden on mobile) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen w-full relative">
        {/* Sticky Mobile/Desktop Top Bar */}
        <TopBar onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* View Container with mobile bottom safe space and fluid font scaling */}
        <main className="flex-1 content-container-responsive py-3.5 sm:py-6 max-w-full overflow-x-hidden fluid-body">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'learn' && <LearnView />}
          {activeTab === 'psychology' && <PsychologyView />}
          {activeTab === 'mindfulness' && <MindfulnessSanctuaryView />}
          {activeTab === 'games' && <GamesHubView />}
          {activeTab === 'simulators' && <SimulatorsHubView />}
          {activeTab === 'negotiation' && <NegotiationView />}
          {activeTab === 'termsheet' && <TermSheetAnalyzerView />}
          {activeTab === 'exam' && <FinalExamView />}
          {activeTab === 'profile' && <ProfileView />}
        </main>

        {/* Mobile Floating Bottom Navigation */}
        <BottomNav />
      </div>

      {/* Global Trilingual Search Modal */}
      <SearchModal />

      {/* Multi-Domain Overlapping Stack Modal */}
      {isCardStackModalOpen && (
        <OverlappingStackShowcase
          isModal={true}
          onClose={() => setIsCardStackModalOpen(false)}
        />
      )}

      {/* Immersive Knockout Opening Cover Portal */}
      <ArtisticOpeningPortal
        isOpen={isOpeningPortalOpen}
        onEnterApp={() => setIsOpeningPortalOpen(false)}
        language={language}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
