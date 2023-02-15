import React from 'react';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GlobalTransactions from './pages/Dashboard/Transactions/Global';
import GlobalTransactionsAddress from './pages/Dashboard/Transactions/GlobalAddress';
import EspeesTransactions from './pages/Dashboard/Transactions/Espees';
import EspeesTransactionsAddress from './pages/Dashboard/Transactions/EspeesAddress';
import GlobalDistribution from './pages/Dashboard/Distribution/Global';
import EspeesDistribution from './pages/Dashboard/Distribution/Espees';
import Macrotrends from './pages/Dashboard/Macrotrends';
import MacrotrendsAddress from './pages/Dashboard/MacrotrendsAddress';

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationsProvider>
      <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            primaryColor: 'green',
            fontFamily: 'Poppins, sans-serif',
            headings: {
              fontFamily: 'Poppins, sans-serif',
            },
          }}
        >
          <Router>
            <Routes>
              <Route index element={<Navigate to="/login" replace={true} />} />
              <Route path="/login" element={<PublicRoute component={Login} />} />

              <Route path="dashboard">
                <Route index element={<PrivateRoute component={Dashboard} />} />
                <Route path="transactions/global" element={<PrivateRoute component={GlobalTransactions} />} />
                <Route path="transactions/global/address" element={<PrivateRoute component={GlobalTransactionsAddress} />} />
                <Route path="transactions/espees" element={<PrivateRoute component={EspeesTransactions} />} />
                <Route path="transactions/espees/address" element={<PrivateRoute component={EspeesTransactionsAddress} />} />
                <Route path="distribution/global" element={<PrivateRoute component={GlobalDistribution} />} />
                <Route path="distribution/espees" element={<PrivateRoute component={EspeesDistribution} />} />
                <Route path="macrotrends" element={<PrivateRoute component={Macrotrends} />} />
                <Route path="macrotrends/address" element={<PrivateRoute component={MacrotrendsAddress} />} />
              </Route>
            </Routes>
          </Router>
        </MantineProvider>
      </NotificationsProvider>
    </QueryClientProvider>
  )
}

export default App;