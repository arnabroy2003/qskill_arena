import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import ArenaPage from './arena';
import InterestFormPage from './InterestFormPage';

function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);

    // Intercept internal link clicks for smooth SPA navigation
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (
        anchor &&
        anchor instanceof HTMLAnchorElement &&
        anchor.origin === window.location.origin &&
        !anchor.hasAttribute('download') &&
        anchor.target !== '_blank'
      ) {
        const url = new URL(anchor.href);
        // Only intercept when navigating to a different path
        if (url.pathname !== window.location.pathname) {
          e.preventDefault();
          window.history.pushState({}, '', url.pathname + url.search + url.hash);
          setCurrentPath(url.pathname);
          window.scrollTo(0, 0);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  // Normalize path (case-insensitive, trims trailing slash)
  const normalizedPath = currentPath.toLowerCase().replace(/\/+$/, '') || '/';

  if (normalizedPath === '/interest') {
    return <InterestFormPage />;
  }

  return <ArenaPage />;
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Router />
    </React.StrictMode>
  );
}
