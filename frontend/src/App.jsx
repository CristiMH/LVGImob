import { useState } from 'react';
import { CookiesProvider } from 'react-cookie';
import loadingContext from './contexts/loadingContext';
import scrollContext from './contexts/scrollContext';
import { HelmetProvider } from 'react-helmet-async';

export default function App({ children, helmetContext = {} }) {
  const [loading, setLoading] = useState(false);

  const enableScroll = () => {
    const body = document.body;
    body.style.overflow = '';
    body.style.height = '';
  };

  const disableScroll = () => {
    const body = document.body;
    body.style.overflow = 'hidden';
    body.style.height = '100vh';
  };

  return (
    <HelmetProvider context={helmetContext}>
      <scrollContext.Provider value={{ enableScroll, disableScroll }}>
        <loadingContext.Provider value={{ loading, setLoading }}>
          <CookiesProvider>
            {children}
          </CookiesProvider>
        </loadingContext.Provider>
      </scrollContext.Provider>
    </HelmetProvider>
  );
}