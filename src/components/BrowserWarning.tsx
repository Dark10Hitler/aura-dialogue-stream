import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, AlertTriangle } from 'lucide-react';

const isInAppBrowser = (): boolean => {
  const ua = navigator.userAgent || navigator.vendor || '';
  return /FBAN|FBAV|Instagram|TikTok|Musical|BytedanceWebview|Snapchat/i.test(ua);
};

export const BrowserWarning = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('browser_warning_dismissed');
    if (!dismissed && isInAppBrowser()) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('browser_warning_dismissed', 'true');
  };

  const handleOpenExternal = () => {
    // Try to open in external browser
    const currentUrl = window.location.href;
    window.open(currentUrl, '_system');
  };

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md"
        >
          <div className="browser-warning-banner rounded-2xl p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  In-App Browser Detected
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  Payment features require an external browser. Tap below to open in Safari/Chrome.
                </p>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenExternal}
                    className="flex-1 py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open in Browser
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="py-2 px-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 text-muted-foreground text-xs font-medium transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="p-1 rounded-lg hover:bg-secondary/50 transition-colors shrink-0"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
