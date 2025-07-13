import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';

import GPUTypesPage from './pages/GPUTypesPage';
import ProvidersPage from './pages/ProvidersPage';
import GPUPricesPage from './pages/GPUPricesPage';
import PriceGraphPage from './pages/PriceGraphPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                GPU Price Tracker
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Link component={RouterLink} to="/" color="inherit" underline="none">
                  GPU Types
                </Link>
                <Link component={RouterLink} to="/providers" color="inherit" underline="none">
                  Providers
                </Link>
                <Link component={RouterLink} to="/prices" color="inherit" underline="none">
                  Prices
                </Link>
                <Link component={RouterLink} to="/graph" color="inherit" underline="none">
                  Graph
                </Link>
              </Box>
            </Toolbar>
          </AppBar>
        </Box>
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<GPUTypesPage />} />
            <Route path="/providers" element={<ProvidersPage />} />
            <Route path="/prices" element={<GPUPricesPage />} />
            <Route path="/graph" element={<PriceGraphPage />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;