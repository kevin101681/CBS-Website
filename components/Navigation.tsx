import React, { useState } from 'react';
import { Home, Phone, ClipboardCheck, UserCircle, Menu, X, ExternalLink, MessageSquare } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);

  const handleNav = (target: string, view?: AppView) => {
    if (target === 'portal') {
      setIsPortalModalOpen(true);
      setIsMobileMenuOpen(false);
      return;
    }

    if (view) {
      setView(view);
    } else {
      if (currentView !== AppView.HOME) {
        setView(AppView.HOME);
        setTimeout(() => {
          const el = document.getElementById(target);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(target);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', action: () => handleNav('home', AppView.HOME), primary: false },
    { label: 'Make a Warranty Request', action: () => handleNav('warranty', AppView.VISION), primary: true },
    { label: 'My Homepage', action: () => handleNav('portal'), primary: false },
    { label: 'Media', action: () => handleNav('media'), primary: false },
    { label: 'Pricing', action: () => handleNav('pricing'), primary: false },
    { label: 'Why CBS?', action: () => handleNav('whycbs'), primary: false },
    { label: 'Contact Us', action: () => handleNav('contact'), primary: false },
  ];

  return (
    <>
      {/* Desktop Top Navbar */}
      <header className="hidden lg:flex fixed top-0 left-0 right-0 h-24 bg-white/90 backdrop-blur-md border-b border-primary-100 z-50 px-10 items-center justify-between transition-all duration-300 supports-[backdrop-filter]:bg-white/80">
        <div 
          className="flex items-center cursor-pointer group"
          onClick={() => setView(AppView.HOME)}
        >
          <img 
            src="./logo.png" 
            alt="Cascade Builder Services" 
            className="h-20 w-auto object-contain group-hover:opacity-90 transition-opacity" 
          />
        </div>

        <nav className="flex items-center gap-1">
          {navLinks.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className={`px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                item.primary 
                  ? 'bg-primary-700 text-white shadow-md hover:bg-primary-600 hover:shadow-lg transform hover:-translate-y-0.5 ml-3 rounded-full'
                  : 'text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-full'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-primary-100 z-50 px-4 flex items-center justify-between">
         <div 
          className="flex items-center"
          onClick={() => setView(AppView.HOME)}
        >
           <img 
            src="./logo.png" 
            alt="Cascade Builder Services" 
            className="h-10 w-auto object-contain" 
          />
        </div>

        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-white z-40 lg:hidden flex flex-col p-6 gap-2 animate-in slide-in-from-top-4 duration-200">
           {navLinks.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className={`w-full text-left px-6 py-4 text-base font-medium transition-all rounded-full ${
                item.primary 
                  ? 'bg-primary-700 text-white shadow-md mt-4 text-center'
                  : 'text-primary-600 hover:bg-primary-50 border-b border-primary-50 last:border-none'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Mobile Bottom Bar - M3 Style */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-primary-100 px-6 py-3 pb-safe flex justify-around items-center z-50 safe-area-bottom">
        <button
          onClick={() => setView(AppView.HOME)}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${currentView === AppView.HOME ? 'bg-primary-100 text-primary-900' : 'text-primary-500'}`}
        >
          <Home size={24} strokeWidth={currentView === AppView.HOME ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button
          onClick={() => setView(AppView.VISION)}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${currentView === AppView.VISION ? 'bg-primary-100 text-primary-900' : 'text-primary-500'}`}
        >
          <ClipboardCheck size={24} strokeWidth={currentView === AppView.VISION ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Warranty</span>
        </button>
        <button
          onClick={() => setIsPortalModalOpen(true)}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${currentView === AppView.CHAT ? 'bg-primary-100 text-primary-900' : 'text-primary-500'}`}
        >
          <UserCircle size={24} strokeWidth={currentView === AppView.CHAT ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Portal</span>
        </button>
      </nav>

      {/* Portal Modal */}
      {isPortalModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm" onClick={() => setIsPortalModalOpen(false)} />
          <div className="relative bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsPortalModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-2xl flex items-center justify-center mb-6">
                <UserCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-2">My Homepage</h3>
              <p className="text-primary-500 mb-8">Access your project details, schedule, and documents via BuilderTrend.</p>
              
              <a 
                href="https://buildertrend.net" 
                target="_blank" 
                rel="noreferrer"
                className="w-full bg-primary-700 text-white py-4 rounded-full font-bold text-lg hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-6"
              >
                Login to BuilderTrend
                <ExternalLink size={20} />
              </a>

              <p className="text-sm font-bold text-primary-400 uppercase tracking-wider mb-4">Download the App</p>
              
              <div className="grid grid-cols-2 gap-4 w-full mb-6">
                <a 
                  href="https://apps.apple.com/us/app/buildertrend/id504370616" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center bg-black text-white py-3 rounded-xl hover:opacity-80 transition-opacity"
                >
                  <span className="text-sm font-bold">App Store</span>
                </a>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.BuilderTREND.btMobileApp&hl=en_US" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center bg-black text-white py-3 rounded-xl hover:opacity-80 transition-opacity"
                >
                  <span className="text-sm font-bold">Google Play</span>
                </a>
              </div>

              <div className="w-full border-t border-primary-100 pt-6 mt-2">
                 <button 
                  onClick={() => {
                    setIsPortalModalOpen(false);
                    setView(AppView.CHAT);
                  }}
                  className="w-full py-3 text-primary-600 font-medium hover:bg-primary-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                 >
                   <MessageSquare size={18} />
                   Use Virtual Assistant
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;