import { useCallback, useState } from 'react';
import { useFilteredList } from '../Hooks/FilteredList';
import DataTableBase from './DatatableBase';
import GenericModalForm from '../GenericModalForm';
import { documentModalConfig } from '../Hooks/ModalConfigurations';
import api from '../../api';

import { IconButton, Box, Button, Typography, Stack, Dialog } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { NavLink } from 'react-router-dom';
import FileViewer from '../FileViewer';
import DocumentModalForm from '../DocumentModalForm';
import { normalizeFile } from '../Hooks/FilePathNormalizer';

const ActionButtons = ({ document, onDownload, onEdit, onDelete }) => (
    <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
            size="small"
            onClick={() => onDownload(document)}
            aria-label="view"
        >
            <DownloadIcon />
        </IconButton>
        <IconButton
            size="small"
            onClick={() => onEdit(document)}
            aria-label="edit"
        >
            <Edit />
        </IconButton>
        <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(document.id)}
            aria-label="delete"
        >
            <Delete />
        </IconButton>
    </Box>
);

function DocumentsDatatable({
    contentType = null,    // 'expense', 'invoice', 'receipt'  
    contentId = null,
    showAddButton = true,
}) {
    const { items: documents, loading, refetch } = useFilteredList(
        'documents',
        contentId,
        contentType ? `content_type=${contentType}&content_id` : null
    );

    // Estados do modal (movidos para cá)
    const [modalOpen, setModalOpen] = useState(false);
    const [fileOpen, setFileOpen] = useState(false);
    const [documentToEdit, setDocumentToEdit] = useState(null);
    const [documentToView, setDocumentToView] = useState(null);

    const deleteDocument = (id) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            api.delete(`/api/documents/${id}/`)
                .then((res) => {
                    if (res.status === 204) {
                        alert("Document deleted");
                        refetch(); // Usa refetch em vez de getDocuments
                    } else {
                        alert("Failed to delete document");
                    }
                })
                .catch((err) => alert(err));
        }
    };

    const handleDownload = (document) => {
        if (!document || !document.file_path_local) {
            console.error("Invalid document for download:", document);
            alert("This document is not available for download.");
            return;
        }

        const url = normalizeFile({ file_path: document.file_path_local });

        const link = window.document.createElement("a");
        link.href = url;
        link.download = document.file_name || "download";
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
    };



    const handleView = useCallback((document) => {
        setDocumentToView(document);
        setFileOpen(true);
    }, []);

    const handleCloseView = () => {
        setFileOpen(false);
        setDocumentToView(null);
    };


    const handleEdit = useCallback((document) => {
        setDocumentToEdit(document);
        setModalOpen(true);
    }, []);

    const handleDelete = useCallback((id) => {
        deleteDocument(id);
    }, []);

    const handleAddNew = () => {
        setDocumentToEdit(null); // Reset para modo CREATE
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setDocumentToEdit(null);
    };

    const headerActions = showAddButton ? (
        <Stack direction="row" spacing={1}>
            <Button
                variant="contained"
                color="secondary"
                startIcon={<FileUploadIcon />}
                onClick={() => setImportModalOpen(true)}
            >
                Import
            </Button>
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddNew}
            >
                Add Document
            </Button>
        </Stack>
    ) : null;

    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        {
            field: 'file_name',
            headerName: 'File Name',
            width: 250,
            flex: 1,
            renderCell: (params) => (
                <Typography
                    sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                    onClick={() => handleView(params.row)}
                >
                    {params.row.file_name}
                </Typography>
            )
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 150,
            renderCell: (params) => {
                <Typography
                    sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    {params.row.description}
                </Typography>
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <ActionButtons
                    document={params.row}
                    onDownload={handleDownload}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )
        }
    ];

    return (
        <>
            <DataTableBase
                title={"Documents"}
                rows={documents}
                columns={columns}
                loading={loading}
                actions={headerActions}
            />

            <DocumentModalForm
                open={modalOpen}
                onClose={handleCloseModal}
                onSuccess={refetch}
                itemToEdit={documentToEdit}
                config={documentModalConfig}
                contentId={contentId}
                contentType={contentType}
            />

            <Dialog open={fileOpen} onClose={handleCloseView}>
                {documentToView && <FileViewer document={documentToView} />}
            </Dialog>


        </>
    );
}

export default DocumentsDatatable;