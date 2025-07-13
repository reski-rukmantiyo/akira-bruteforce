import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { GPUPrice, CreateGPUPriceRequest, GPUType, Provider } from '../types';
import { gpuPricesAPI, gpuTypesAPI, providersAPI } from '../services/api';

const GPUPricesPage: React.FC = () => {
  const [gpuPrices, setGpuPrices] = useState<GPUPrice[]>([]);
  const [gpuTypes, setGpuTypes] = useState<GPUType[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [open, setOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<GPUPrice | null>(null);
  const [formData, setFormData] = useState<CreateGPUPriceRequest>({
    gpu_type_id: '',
    provider_id: '',
    price: 0,
    currency: 'USD',
    date: new Date().toISOString().split('T')[0],
    in_stock: true,
    url: '',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

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
      showSnackbar('Failed to load data', 'error');
    }
  };

  const handleOpen = (price?: GPUPrice) => {
    if (price) {
      setEditingPrice(price);
      setFormData({
        gpu_type_id: price.gpu_type_id,
        provider_id: price.provider_id,
        price: price.price,
        currency: price.currency,
        date: price.date,
        in_stock: price.in_stock,
        url: price.url,
      });
    } else {
      setEditingPrice(null);
      setFormData({
        gpu_type_id: '',
        provider_id: '',
        price: 0,
        currency: 'USD',
        date: new Date().toISOString().split('T')[0],
        in_stock: true,
        url: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPrice(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingPrice) {
        await gpuPricesAPI.update(editingPrice.id, formData);
        showSnackbar('GPU price updated successfully', 'success');
      } else {
        await gpuPricesAPI.create(formData);
        showSnackbar('GPU price created successfully', 'success');
      }
      handleClose();
      loadData();
    } catch (error) {
      showSnackbar('Failed to save GPU price', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this GPU price?')) {
      try {
        await gpuPricesAPI.delete(id);
        showSnackbar('GPU price deleted successfully', 'success');
        loadData();
      } catch (error) {
        showSnackbar('Failed to delete GPU price', 'error');
      }
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">GPU Prices</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add GPU Price
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>GPU Type</TableCell>
              <TableCell>Provider</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>In Stock</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gpuPrices.map((price) => (
              <TableRow key={price.id}>
                <TableCell>{price.gpu_type_name}</TableCell>
                <TableCell>{price.provider_name}</TableCell>
                <TableCell>{price.currency} {price.price.toFixed(2)}</TableCell>
                <TableCell>{new Date(price.date).toLocaleDateString()}</TableCell>
                <TableCell>{price.in_stock ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  {price.url && (
                    <a href={price.url} target="_blank" rel="noopener noreferrer">
                      Link
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(price)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(price.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingPrice ? 'Edit GPU Price' : 'Add GPU Price'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>GPU Type</InputLabel>
              <Select
                value={formData.gpu_type_id}
                label="GPU Type"
                onChange={(e) => setFormData({ ...formData, gpu_type_id: e.target.value })}
              >
                {gpuTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name} ({type.manufacturer})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Provider</InputLabel>
              <Select
                value={formData.provider_id}
                label="Provider"
                onChange={(e) => setFormData({ ...formData, provider_id: e.target.value })}
              >
                {providers.map((provider) => (
                  <MenuItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            />

            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select
                value={formData.currency}
                label="Currency"
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="GBP">GBP</MenuItem>
                <MenuItem value="CAD">CAD</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.in_stock}
                  onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                />
              }
              label="In Stock"
            />

            <TextField
              label="URL"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              sx={{ gridColumn: '1 / -1' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPrice ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GPUPricesPage;