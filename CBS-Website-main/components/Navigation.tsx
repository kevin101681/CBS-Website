import React, { useState } from 'react';
import { X, ExternalLink, MessageSquare, UserCircle } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);

  // Note: Since the toolbar is removed, this function is currently not triggered by nav buttons.
  // It is kept here in case we wire up buttons from WebsiteView later.
  const handleNav = (target: string, view?: AppView) => {
    if (target === 'portal') {
      setIsPortalModalOpen(true);
      return;
    }
    if (view) {
      setView(view);
    }
  };

  return (
    <>
      {/* 
         Toolbar removed as per request. 
         Previously contained Desktop Header, Mobile Header, and Mobile Menu.
      */}

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