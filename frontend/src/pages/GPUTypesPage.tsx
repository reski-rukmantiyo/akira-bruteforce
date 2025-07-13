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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { GPUType, CreateGPUTypeRequest } from '../types';
import { gpuTypesAPI } from '../services/api';

const GPUTypesPage: React.FC = () => {
  const [gpuTypes, setGpuTypes] = useState<GPUType[]>([]);
  const [open, setOpen] = useState(false);
  const [editingGPU, setEditingGPU] = useState<GPUType | null>(null);
  const [formData, setFormData] = useState<CreateGPUTypeRequest>({
    name: '',
    manufacturer: '',
    memory: '',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    loadGPUTypes();
  }, []);

  const loadGPUTypes = async () => {
    try {
      const response = await gpuTypesAPI.getAll();
      setGpuTypes(response.data);
    } catch (error) {
      showSnackbar('Failed to load GPU types', 'error');
    }
  };

  const handleOpen = (gpu?: GPUType) => {
    if (gpu) {
      setEditingGPU(gpu);
      setFormData({
        name: gpu.name,
        manufacturer: gpu.manufacturer,
        memory: gpu.memory,
      });
    } else {
      setEditingGPU(null);
      setFormData({ name: '', manufacturer: '', memory: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingGPU(null);
    setFormData({ name: '', manufacturer: '', memory: '' });
  };

  const handleSubmit = async () => {
    try {
      if (editingGPU) {
        await gpuTypesAPI.update(editingGPU.id, formData);
        showSnackbar('GPU type updated successfully', 'success');
      } else {
        await gpuTypesAPI.create(formData);
        showSnackbar('GPU type created successfully', 'success');
      }
      handleClose();
      loadGPUTypes();
    } catch (error) {
      showSnackbar('Failed to save GPU type', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this GPU type?')) {
      try {
        await gpuTypesAPI.delete(id);
        showSnackbar('GPU type deleted successfully', 'success');
        loadGPUTypes();
      } catch (error) {
        showSnackbar('Failed to delete GPU type', 'error');
      }
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">GPU Types</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add GPU Type
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Manufacturer</TableCell>
              <TableCell>Memory</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gpuTypes.map((gpu) => (
              <TableRow key={gpu.id}>
                <TableCell>{gpu.name}</TableCell>
                <TableCell>{gpu.manufacturer}</TableCell>
                <TableCell>{gpu.memory}</TableCell>
                <TableCell>{new Date(gpu.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(gpu)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(gpu.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingGPU ? 'Edit GPU Type' : 'Add GPU Type'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Manufacturer"
            fullWidth
            value={formData.manufacturer}
            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Memory"
            fullWidth
            value={formData.memory}
            onChange={(e) => setFormData({ ...formData, memory: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingGPU ? 'Update' : 'Create'}
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

export default GPUTypesPage;