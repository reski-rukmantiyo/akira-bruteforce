import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
} from '@mui/material';
import Plot from 'react-plotly.js';
import { GPUPrice, GPUType, Provider } from '../types';
import { gpuPricesAPI, gpuTypesAPI, providersAPI } from '../services/api';

const PriceGraphPage: React.FC = () => {
  const [gpuPrices, setGpuPrices] = useState<GPUPrice[]>([]);
  const [gpuTypes, setGpuTypes] = useState<GPUType[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedGPUType, setSelectedGPUType] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pricesResponse, typesResponse, providersResponse] = await Promise.all([
        gpuPricesAPI.getAll(),
        gpuTypesAPI.getAll(),
        providersAPI.getAll(),
      ]);
      setGpuPrices(pricesResponse.data);
      setGpuTypes(typesResponse.data);
      setProviders(providersResponse.data);
    } catch (error) {
      setError('Failed to load data');
    }
  };

  const filteredPrices = gpuPrices.filter(price => {
    if (selectedGPUType !== 'all' && price.gpu_type_id !== selectedGPUType) return false;
    if (selectedProvider !== 'all' && price.provider_id !== selectedProvider) return false;
    return true;
  });

  const prepareChartData = () => {
    const traces: any[] = [];
    
    // Group by GPU type and provider
    const groupedData = filteredPrices.reduce((acc, price) => {
      const key = `${price.gpu_type_name} - ${price.provider_name}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({
        date: price.date,
        price: price.price,
        currency: price.currency,
      });
      return acc;
    }, {} as Record<string, any[]>);

    // Create traces for each group
    Object.entries(groupedData).forEach(([key, data]) => {
      const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      traces.push({
        x: sortedData.map(d => d.date),
        y: sortedData.map(d => d.price),
        type: 'scatter',
        mode: 'lines+markers',
        name: key,
        hovertemplate: 
          '<b>%{fullData.name}</b><br>' +
          'Date: %{x}<br>' +
          'Price: %{y:.2f}<br>' +
          '<extra></extra>',
      });
    });

    return traces;
  };

  const chartData = prepareChartData();

  const layout = {
    title: 'GPU Price Trends',
    xaxis: {
      title: 'Date',
      type: 'date',
    },
    yaxis: {
      title: 'Price',
    },
    hovermode: 'closest',
    showlegend: true,
    legend: {
      orientation: 'h',
      y: -0.2,
    },
    height: 600,
  };

  const config = {
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Price Graph</Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>GPU Type</InputLabel>
          <Select
            value={selectedGPUType}
            label="GPU Type"
            onChange={(e) => setSelectedGPUType(e.target.value)}
          >
            <MenuItem value="all">All GPU Types</MenuItem>
            {gpuTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name} ({type.manufacturer})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Provider</InputLabel>
          <Select
            value={selectedProvider}
            label="Provider"
            onChange={(e) => setSelectedProvider(e.target.value)}
          >
            <MenuItem value="all">All Providers</MenuItem>
            {providers.map((provider) => (
              <MenuItem key={provider.id} value={provider.id}>
                {provider.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ p: 2 }}>
        {chartData.length > 0 ? (
          <Plot
            data={chartData}
            layout={layout}
            config={config}
            style={{ width: '100%' }}
          />
        ) : (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: 400,
            color: 'text.secondary'
          }}>
            <Typography variant="h6">
              No data available for the selected filters
            </Typography>
          </Box>
        )}
      </Paper>

      {filteredPrices.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Summary</Typography>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredPrices.length} price entries across {chartData.length} different GPU type/provider combinations.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PriceGraphPage;