import { useEffect, useState } from "react";
import api from "../api";
import {
    TextField,
    Button,
    MenuItem,
    Stack,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    FormControlLabel,
    FormLabel,
    RadioGroup,
    Radio
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import InputFileUpload from "./FileUploadButton";

function GenericModalForm({
    open,
    onClose,
    onSuccess,
    itemToEdit = null,
    config
}) {
    const [formData, setFormData] = useState({});
    const [dropdownData, setDropdownData] = useState({});
    const [loading, setLoading] = useState(false);

    const isEditMode = itemToEdit !== null;

    // Load dropdown data
    useEffect(() => {
        if (config.dropdowns) {
            config.dropdowns.forEach(dropdown => {
                api.get(dropdown.endpoint)
                    .then(res => {
                        setDropdownData(prev => ({
                            ...prev,
                            [dropdown.key]: res.data
                        }));
                    })
                    .catch(() => {
                        setDropdownData(prev => ({
                            ...prev,
                            [dropdown.key]: []
                        }));
                    });
            });
        }
    }, [config.dropdowns]);

    // Pre-fill form when editing
    useEffect(() => {
        if (isEditMode && itemToEdit) {
            const initialData = {};
            config.fields.forEach(field => {
                if (field.type === 'date') {
                    initialData[field.key] = itemToEdit[field.key] ? dayjs(itemToEdit[field.key]) : null;
                } else if (field.type === 'number') {
                    initialData[field.key] = itemToEdit[field.key]?.toString() || "";
                } else {
                    initialData[field.key] = itemToEdit[field.key] || "";
                }
            });
            setFormData(initialData);
        } else {
            // Reset form for creation
            const resetData = {};
            config.fields.forEach(field => {
                resetData[field.key] = field.type === 'date' ? null : "";
            });
            setFormData(resetData);
        }
    }, [isEditMode, itemToEdit, config.fields]);

    const handleFieldChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Transform data for API
        const apiData = {};
        config.fields.forEach(field => {
            if (field.type === 'date') {
                apiData[field.key] = formData[field.key]
                    ? formData[field.key].toISOString().split("T")[0]
                    : null;
            } else {
                apiData[field.key] = formData[field.key];
            }
        });

        const request = isEditMode
            ? api.put(`${config.endpoint}${itemToEdit.id}/`, apiData)
            : api.post(config.endpoint, apiData);

        request
            .then((res) => {
                if (res.status === 201 || res.status === 200) {
                    alert(isEditMode ? `${config.entityName} updated ✅` : `${config.entityName} created ✅`);
                    onSuccess();
                    onClose();
                } else {
                    alert(`Failed to ${isEditMode ? 'update' : 'create'} ${config.entityName.toLowerCase()} ❌`);
                }
            })
            .catch((err) => alert(err))
            .finally(() => setLoading(false));
    };

    const renderField = (field) => {
        const value = formData[field.key] || "";

        switch (field.type) {
            case 'text':
            case 'number':
                return (
                    <TextField
                        key={field.key}
                        type={field.type}
                        label={field.label}
                        variant="outlined"
                        fullWidth
                        required={field.required}
                        value={value}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    />
                );

            case 'date':
                return (
                    <LocalizationProvider key={field.key} dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label={field.label}
                            format="DD/MM/YYYY"
                            value={dayjs(value)}
                            onChange={(newValue) => handleFieldChange(field.key, newValue)}
                            slotProps={{ textField: { fullWidth: true, required: field.required } }}
                        />
                    </LocalizationProvider>
                );

            case 'radio':
                return (
                    <FormControl key={field.key} component="fieldset" required={field.required}>
                        <FormLabel component="legend">{field.label}</FormLabel>
                        <RadioGroup
                        row
                            value={value}
                            onChange={(e) => {
                                handleFieldChange(field.key, e.target.value);
                                // Clear dependent fields when radio changes
                                if (field.key === 'receiptType') {
                                    handleFieldChange('invoice', '');
                                    handleFieldChange('expense', '');
                                }
                            }}
                        >
                            {field.options.map((option) => (
                                <FormControlLabel
                                    key={option.value}
                                    value={option.value}
                                    control={<Radio />}
                                    label={option.label}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                );

            case 'select':
                // Conditional rendering for select fields
                if (field.conditionalOn) {
                    const conditionValue = formData[field.conditionalOn.field];
                    if (conditionValue !== field.conditionalOn.value) {
                        return null; // Don't render if condition not met
                    }
                }

                const options = dropdownData[field.optionsKey] || [];
                return (
                    <TextField
                        key={field.key}
                        select
                        label={field.label}
                        variant="outlined"
                        fullWidth
                        required={field.required}
                        value={value}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    >
                        {options.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option[field.displayField || 'title']}
                            </MenuItem>
                        ))}
                    </TextField>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {isEditMode ? `Edit ${config.entityName}` : `Add ${config.entityName}`}
            </DialogTitle>
            <DialogContent dividers>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {config.fields.map(renderField)}
                    </Stack>

                    <DialogActions sx={{ mt: 2 }}>
                        <Button onClick={onClose} color="secondary">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            startIcon={
                                loading ? <CircularProgress size={18} color="inherit" /> : null
                            }
                        >
                            {loading
                                ? (isEditMode ? "Updating..." : "Creating...")
                                : (isEditMode ? "Update" : "Create")
                            }
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default GenericModalForm;