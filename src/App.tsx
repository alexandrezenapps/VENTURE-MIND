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

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-bg-main dark:bg-stone-950 text-text-primary dark:text-stone-100 flex font-sans antialiased selection:bg-amber-500/20 selection:text-amber-800 overflow-x-hidden">
      {/* Artistic Ambient Background Glows */}
      <div className="fixed top-0 right-1/4 w-[40rem] h-[40rem] bg-gradient-to-br from-purple-600/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-aurora" />
      <div className="fixed bottom-0 left-1/3 w-[35rem] h-[35rem] bg-gradient-to-tr from-emerald-600/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

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
