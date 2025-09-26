/**
 * Main App component with routing
 * Updated to use new clean architecture with TypeScript
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CreateUrlPage } from './features/create-url';
import { UrlListPage } from './features/url-list';
import { RedirectPage } from './features/redirect';
import { VersionInfo } from './components/VersionInfo';
import { ROUTES } from './core/constants/config';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<CreateUrlPage />} />
        <Route path={ROUTES.LIST} element={<UrlListPage />} />
        <Route path={ROUTES.REDIRECT} element={<RedirectPage />} />
      </Routes>
      <VersionInfo />
    </Router>
  );
};

export default App;