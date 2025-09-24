import { useCallback, useState } from 'react';
import { useFilteredList } from '../Hooks/FilteredList';
import DataTableBase from './DatatableBase';
import GenericModalForm from '../GenericModalForm';
import GenericExcelImportModal from '../GenericExcelImportModal';
import { invoiceModalConfig } from '../Hooks/ModalConfigurations';
import { IconButton, Box, Button, Typography, Stack } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { NavLink } from 'react-router-dom';
import api from '../../api';

const ActionButtons = ({ invoice, onEdit, onDelete }) => (
    <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
            size="small"
            onClick={() => onEdit(invoice)}
            aria-label="edit"
        >
            <Edit />
        </IconButton>
        <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(invoice.id)}
            aria-label="delete"
        >
            <Delete />
        </IconButton>
    </Box>
);

function InvoicesDatatable({
    expenseId = null,
    showAddButton = false,
    showEditActions = true
}) {
    const { items: invoices, loading, refetch } = useFilteredList(
        'invoices',
    );

    // Estados do modal (movidos para cá)
    const [modalOpen, setModalOpen] = useState(false);
    const [invoiceToEdit, setInvoiceToEdit] = useState(null);
    const [importModalOpen, setImportModalOpen] = useState(false);

    const deleteInvoice = (id) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            api.delete(`/api/invoices/${id}/`)
                .then((res) => {
                    if (res.status === 204) {
                        alert("Invoice deleted");
                        refetch(); // Usa refetch em vez de getExpenses
                    } else {
                        alert("Failed to delete invoice");
                    }
                })
                .catch((err) => alert(err));
        }
    };

    const handleEdit = useCallback((invoice) => {
        setInvoiceToEdit(invoice);
        setModalOpen(true);
    }, []);

    const handleDelete = useCallback((id) => {
        deleteInvoice(id);
    }, []);

    const handleAddNew = () => {
        setInvoiceToEdit(null); // Reset para modo CREATE
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setInvoiceToEdit(null);
    };

    const handleModalSuccess = () => {
        refetch(); // Recarrega a lista após criar/editar
        handleCloseModal();
    };

    const headerActions = showAddButton ? (
        <Stack direction="row" spacing={1}>
            {!expenseId && (
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<FileUploadIcon />}
                    onClick={() => setImportModalOpen(true)}
                >
                    Import
                </Button>
            )}

            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddNew}
            >
                Add Invoice
            </Button>
        </Stack>
    ) : null;

    const columns = [
        {
            field: 'id',
            headerName: 'Title',
            width: 250,
            flex: 1,
            renderCell: (params) => (
                <Typography
                    component={NavLink}
                    to={`/invoices/view/${params.row.id}`}
                    sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    {params.row.invoice_number}
                </Typography>
            )
        },
        {
            field: 'date',
            headerName: 'Date',
            width: 150,
            flex: 1,
            renderCell: (params) => {
                if (!params.row?.date) return '-';
                return new Date(params.row.date).toLocaleDateString("pt-PT");
            }
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 180,
            flex: 1,
            renderCell: (params) => {
                const category = params.row?.category_details;
                if (!category) return '-';
                return (
                    <span style={{ color: category.color || '#000' }}>
                        {category.title || 'No title'}
                    </span>
                );
            }
        },
        {
            field: 'amount',
            headerName: 'Amount',
            width: 150,
            flex: 1,
            align: 'right',
            type: 'number',
            renderCell: (params) => {
                const value = params.row?.amount;
                if (value == null) return '0.00 €';
                return `${parseFloat(value).toFixed(2)} €`;
            }
        },
        ...(showEditActions ? [{
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <ActionButtons
                    invoice={params.row}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )
        }] : [])
    ];

    return (
        <>
            <DataTableBase
                title={expenseId ? "Related Invoices" : "Invoices"}
                rows={invoices}
                columns={columns}
                loading={loading}
                actions={headerActions}
            />

            {/* Modal gerido internamente */}
            <GenericModalForm
                open={modalOpen}
                onClose={handleCloseModal}
                onSuccess={refetch}
                itemToEdit={invoiceToEdit}
                config={invoiceModalConfig}
            />

            <GenericExcelImportModal
                open={importModalOpen}
                onClose={() => setImportModalOpen(false)}
                onSuccess={(entityType) => {
                    refetch()
                    console.log(`${entityType} import completed`);
                }}
                defaultEntityType="invoice"
            />
        </>
    );
}

export default InvoicesDatatable;