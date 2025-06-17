import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import AppRoutes from './AppRoutes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ScrollButton from './components/ScrollButton';
import './index.css';

hydrateRoot(
  document.getElementById('root'),
  <HelmetProvider>
    <BrowserRouter>
      <App>
        <ScrollToTop />
        <Navbar />
        <AppRoutes />
        <Footer />
        <ScrollButton />
      </App>
    </BrowserRouter>
  </HelmetProvider>
);
