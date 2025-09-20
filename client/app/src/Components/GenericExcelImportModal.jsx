import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { CloudUpload, Download, Check, Error } from '@mui/icons-material';
import api from '../api';

const ENTITY_TYPES = {
  expense: { label: 'Expenses', color: 'primary' },
  invoice: { label: 'Invoices', color: 'secondary' },
  receipt: { label: 'Receipts', color: 'success' }
};

function GenericExcelImportModal({ open, onClose, onSuccess, defaultEntityType = 'expense' }) {
  const [activeStep, setActiveStep] = useState(0);
  const [entityType, setEntityType] = useState(defaultEntityType);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [columnMapping, setColumnMapping] = useState({});
  const [loading, setLoading] = useState(false);
  const [importResults, setImportResults] = useState(null);

  const steps = ['Select File & Type', 'Map Columns', 'Review & Import'];

  const handleEntityTypeChange = (event) => {
    setEntityType(event.target.value);
    // Reset file and preview when changing entity type
    setSelectedFile(null);
    setPreviewData(null);
    setColumnMapping({});
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      previewFile(file);
    }
  };

  const previewFile = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entity_type', entityType);

    try {
      const response = await api.post('/api/import/preview/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setPreviewData(response.data);
      setActiveStep(1);
    } catch (error) {
      alert('Error reading file: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleColumnMap = (field, column) => {
    setColumnMapping(prev => ({
      ...prev,
      [field]: column
    }));
  };

  const canProceedToImport = () => {
    if (!previewData) return false;
    return previewData.required_fields.every(field => columnMapping[field]);
  };

  const handleImport = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('entity_type', entityType);
    formData.append('column_mapping', JSON.stringify(columnMapping));

    try {
      const response = await api.post('/api/import/execute/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setImportResults(response.data);
      setActiveStep(2);
      
      if (response.data.success && response.data.created_count > 0) {
        onSuccess(entityType);
      }
    } catch (error) {
      alert('Import failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await api.get(`/api/import/template/?entity_type=${entityType}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${entityType}_import_template.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Error downloading template');
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setSelectedFile(null);
    setPreviewData(null);
    setColumnMapping({});
    setImportResults(null);
    onClose();
  };

  const getFieldLabel = (field) => {
    return field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Import {ENTITY_TYPES[entityType].label} from Excel
          </Typography>
          <Button
            onClick={downloadTemplate}
            startIcon={<Download />}
            size="small"
            variant="outlined"
          >
            Download Template
          </Button>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 0: File Upload & Entity Type Selection */}
        {activeStep === 0 && (
          <Box>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Import Type</InputLabel>
              <Select
                value={entityType}
                onChange={handleEntityTypeChange}
                label="Import Type"
              >
                {Object.entries(ENTITY_TYPES).map(([key, config]) => (
                  <MenuItem key={key} value={key}>
                    <Chip
                      label={config.label}
                      color={config.color}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {config.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box textAlign="center" py={4}>
              <input
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
                id="excel-file-upload"
                type="file"
                onChange={handleFileSelect}
              />
              <label htmlFor="excel-file-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUpload />}
                  size="large"
                  disabled={loading}
                  color={ENTITY_TYPES[entityType].color}
                >
                  {loading ? <CircularProgress size={24} /> : 'Select Excel File'}
                </Button>
              </label>
              
              <Typography variant="body2" color="text.secondary" mt={2}>
                Supported formats: .xlsx, .xls
              </Typography>
              
              {selectedFile && (
                <Typography variant="body1" mt={2}>
                  Selected: {selectedFile.name}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Step 1: Column Mapping */}
        {activeStep === 1 && previewData && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Map Excel Columns to {ENTITY_TYPES[entityType].label} Fields
            </Typography>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              File contains {previewData.total_rows} rows. Map the Excel columns to the required fields.
            </Alert>

            {/* Required Fields */}
            <Typography variant="subtitle1" color="error" gutterBottom>
              Required Fields
            </Typography>
            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={2} mb={3}>
              {previewData.required_fields.map((field) => (
                <TextField
                  key={field}
                  select
                  label={getFieldLabel(field)}
                  value={columnMapping[field] || ''}
                  onChange={(e) => handleColumnMap(field, e.target.value)}
                  required
                  fullWidth
                  error={!columnMapping[field]}
                >
                  <MenuItem value="">Select Column</MenuItem>
                  {previewData.columns.map((column) => (
                    <MenuItem key={column} value={column}>
                      {column}
                    </MenuItem>
                  ))}
                </TextField>
              ))}
            </Box>

            {/* Optional Fields */}
            {previewData.optional_fields && previewData.optional_fields.length > 0 && (
              <>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Optional Fields
                </Typography>
                <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={2} mb={3}>
                  {previewData.optional_fields.map((field) => (
                    <TextField
                      key={field}
                      select
                      label={getFieldLabel(field)}
                      value={columnMapping[field] || ''}
                      onChange={(e) => handleColumnMap(field, e.target.value)}
                      fullWidth
                    >
                      <MenuItem value="">Select Column (Optional)</MenuItem>
                      {previewData.columns.map((column) => (
                        <MenuItem key={column} value={column}>
                          {column}
                        </MenuItem>
                      ))}
                    </TextField>
                  ))}
                </Box>
              </>
            )}

            {/* Preview Table */}
            <Typography variant="h6" gutterBottom>
              Data Preview (First 10 rows)
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {previewData.columns.map((column) => (
                      <TableCell key={column}>{column}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewData.preview_data.map((row, index) => (
                    <TableRow key={index}>
                      {previewData.columns.map((column) => (
                        <TableCell key={column}>
                          {String(row[column] || '')}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Step 2: Import Results */}
        {activeStep === 2 && importResults && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Import Results - {ENTITY_TYPES[entityType].label}
            </Typography>
            
            <Box display="flex" gap={2} mb={3}>
              <Chip
                icon={<Check />}
                label={`${importResults.created_count} Created`}
                color="success"
              />
              {importResults.error_count > 0 && (
                <Chip
                  icon={<Error />}
                  label={`${importResults.error_count} Errors`}
                  color="error"
                />
              )}
            </Box>

            {importResults.errors && importResults.errors.length > 0 && (
              <>
                <Typography variant="h6" color="error" gutterBottom>
                  Errors Found
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 300, mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Row</TableCell>
                        <TableCell>Error</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {importResults.errors.map((error, index) => (
                        <TableRow key={index}>
                          <TableCell>{error.row}</TableCell>
                          <TableCell>
                            {typeof error.errors === 'string' 
                              ? error.errors 
                              : JSON.stringify(error.errors)
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {importResults.created_items && importResults.created_items.length > 0 && (
              <>
                <Typography variant="h6" color="success.main" gutterBottom>
                  Successfully Created {ENTITY_TYPES[entityType].label}
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Data</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {importResults.created_items.slice(0, 10).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>
                            <pre style={{ fontSize: '12px', margin: 0 }}>
                              {JSON.stringify(item.data, null, 1)}
                            </pre>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {importResults.created_items.length > 10 && (
                  <Typography variant="caption" color="text.secondary">
                    Showing first 10 of {importResults.created_items.length} created items
                  </Typography>
                )}
              </>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          {activeStep === 2 ? 'Close' : 'Cancel'}
        </Button>
        
        {activeStep === 1 && (
          <Button
            onClick={handleImport}
            variant="contained"
            disabled={!canProceedToImport() || loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
            color={ENTITY_TYPES[entityType].color}
          >
            {loading ? 'Importing...' : `Import ${ENTITY_TYPES[entityType].label}`}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default GenericExcelImportModal;