import React from 'react';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tokens from './pages/Dashboard/Tokens';
import TokensAddress from './pages/Dashboard/TokensAddress';
import Transactions from './pages/Dashboard/Transactions';
import TransactionsAddress from './pages/Dashboard/TransactionsAddress';
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
                <Route path="transactions" element={<PrivateRoute component={Transactions} />} />
                <Route path="transactions/address" element={<PrivateRoute component={TransactionsAddress} />} />
                <Route path="tokens" element={<PrivateRoute component={Tokens} />} />
                <Route path="tokens/address" element={<PrivateRoute component={TokensAddress} />} />
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