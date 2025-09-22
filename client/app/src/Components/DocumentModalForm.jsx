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
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function DocumentModalForm({
    open,
    onClose,
    onSuccess,
    itemToEdit = null,
    contentType,  // 'expense', 'invoice', 'receipt'
    contentId     // The ID of the parent object
}) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        file: null
    });
    const [loading, setLoading] = useState(false);

    const isEditMode = itemToEdit !== null;

    const normalizeContentType = (type) => {
        const singular = {
            'expenses': 'expense',
            'invoices': 'invoice',
            'receipts': 'receipt'
        };
        return singular[type] || type;
    };

    useEffect(() => {
        if (isEditMode && itemToEdit) {
            setFormData({
                title: itemToEdit.file_name || '',
                description: itemToEdit.description || '',
                file: null // Can't pre-fill file input
            });
        } else {
            setFormData({
                title: '',
                description: '',
                file: null
            });
        }
    }, [isEditMode, itemToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const formPayload = new FormData();
        formPayload.append('file_name', formData.title);
        formPayload.append('description', formData.description);
        formPayload.append('content_type', normalizeContentType(contentType));
        formPayload.append('content_id', contentId);

        if (formData.file) {
            formPayload.append('file_path', formData.file);
        }

        const request = isEditMode
            ? api.put(`/api/documents/${itemToEdit.id}/`, formPayload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            : api.post('/api/documents/', formPayload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

        request
            .then((res) => {
                if (res.status === 201 || res.status === 200) {
                    alert(isEditMode ? 'Document updated' : 'Document uploaded');
                    onSuccess();
                    onClose();
                }
            })
            .catch((err) => {
                console.error(err);
                alert('Upload failed');
            })
            .finally(() => setLoading(false));
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {isEditMode ? 'Edit Document' : 'Upload Document'}
            </DialogTitle>
            <DialogContent dividers>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Title"
                            fullWidth
                            required
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        />

                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        />

                        <input
                            type="file"
                            required={!isEditMode}
                            onChange={(e) => setFormData(prev => ({ ...prev, file: e.target.files[0] }))}
                        />
                    </Stack>

                    <DialogActions sx={{ mt: 2 }}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? 'Uploading...' : (isEditMode ? 'Update' : 'Upload')}
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default DocumentModalForm;