import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import GloboStyles from './styles/globalStyles';
import AppProvider from './Hooks/index';
import Routes from './routes';


const App: React.FC = () => (
  <BrowserRouter>
    <AppProvider>
      <Routes />
    </AppProvider>
    <GloboStyles />
  </BrowserRouter>
);

export default App;
