import React, { useState } from 'react';
import Navigation from './components/Navigation';
import ChatView from './components/ChatView';
import VisionView from './components/VisionView';
import WebsiteView from './components/WebsiteView';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);

  return (
    <div className="flex flex-col h-screen w-full bg-surface-variant overflow-hidden font-sans text-primary-900">
      
      {/* Navigation (Modal logic only, visual toolbar removed) */}
      <Navigation currentView={currentView} setView={setCurrentView} />

      {/* Main Content Area */}
      <main className="flex-1 h-full relative overflow-hidden flex flex-col">
        {/* Removed pt-16 md:pt-20 since header is gone */}
        
        {currentView === AppView.HOME && (
          <div className="h-full w-full absolute inset-0 animate-in fade-in duration-500">
             <WebsiteView />
          </div>
        )}

        {currentView === AppView.CHAT && (
          <div className="h-full w-full absolute inset-0 animate-in fade-in zoom-in-95 duration-300">
             <ChatView />
          </div>
        )}

        {currentView === AppView.VISION && (
          <div className="h-full w-full absolute inset-0 animate-in fade-in zoom-in-95 duration-300">
            <VisionView />
          </div>
        )}
      </main>

    </div>
  );
};

export default App;