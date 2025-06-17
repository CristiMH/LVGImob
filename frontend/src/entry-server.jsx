import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import AppRoutes from './AppRoutes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ScrollButton from './components/ScrollButton';

export function render(url) {
  const { pathname } = new URL(url, 'http://localhost');
  const helmetContext = {};

  const html = renderToString(
    <StaticRouter location={pathname}>
      <App helmetContext={helmetContext}>
        <ScrollToTop />
        <Navbar />
        <AppRoutes />
        <Footer />
        <ScrollButton />
      </App>
    </StaticRouter>
  );

  const { helmet } = helmetContext;

  return {
    html,
    head: `
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
    `,
  };
}