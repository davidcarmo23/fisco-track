import { useCallback, useState } from 'react';
import { useFilteredList } from '../Hooks/FilteredList';
import DataTableBase from './DatatableBase';
import ExpenseModalForm from '../ExpenseModalForm';
import { IconButton, Box, Button, Typography, Stack } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { NavLink } from 'react-router-dom';
import api from '../../api';

const ActionButtons = ({ receipt, onEdit, onDelete }) => (
    <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
            size="small"
            onClick={() => onEdit(receipt)}
            aria-label="edit"
        >
            <Edit />
        </IconButton>
        <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(receipt.id)}
            aria-label="delete"
        >
            <Delete />
        </IconButton>
    </Box>
);

function ReceiptsDatatable({
    invoiceId = null,
    showAddButton = false,
    showEditActions = true
}) {
    const { items: receipts, loading, refetch } = useFilteredList(
        'receipts',
        invoiceId,
        'invoice_id'
    );

    // Estados do modal (movidos para cá)
    const [modalOpen, setModalOpen] = useState(false);
    const [receiptToEdit, setInvoiceToEdit] = useState(null);

    const deleteInvoice = (id) => {
        if (window.confirm('Are you sure you want to delete this receipt?')) {
            api.delete(`/api/receipts/${id}/`)
                .then((res) => {
                    if (res.status === 204) {
                        alert("Invoice deleted");
                        refetch(); // Usa refetch em vez de getExpenses
                    } else {
                        alert("Failed to delete receipt");
                    }
                })
                .catch((err) => alert(err));
        }
    };

    const handleEdit = useCallback((receipt) => {
        setInvoiceToEdit(receipt);
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
            <Button
                variant="contained"
                color="secondary"
                startIcon={<FileUploadIcon />}
            >
                Import
            </Button>
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddNew}
            >
                Add Receipt
            </Button>
        </Stack>
    ) : null;

    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        {
            field: 'title',
            headerName: 'Title',
            width: 250,
            flex: 1,
            renderCell: (params) => (
                <Typography
                    component={NavLink}
                    to={`/receipts/view/${params.row.id}`}
                    sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    {params.row.title}
                </Typography>
            )
        },
        {
            field: 'date',
            headerName: 'Date',
            width: 150,
            renderCell: (params) => {
                if (!params.row?.date) return '-';
                return new Date(params.row.date).toLocaleDateString("pt-PT");
            }
        },
        {
            field: 'category_details',
            headerName: 'Category',
            width: 180,
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
            field: 'value',
            headerName: 'Value',
            width: 150,
            align: 'right',
            renderCell: (params) => {
                const value = params.row?.value;
                if (value == null) return '0.00 €';
                return `${parseFloat(value).toFixed(2)} €`;
            }
        },
        {
            field: 'total_received',
            headerName: 'Paid',
            width: 150,
            align: 'right',
            renderCell: (params) => {
                const totalReceived = params.row?.total_received;
                if (totalReceived == null) return '0.00 €';
                return `${parseFloat(totalReceived).toFixed(2)} €`;
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
                    receipt={params.row}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )
        }] : [])
    ];

    return (
        <>
            <DataTableBase
                title={invoiceId ? "Related Receipts" : "Receipts"}
                rows={receipts}
                columns={columns}
                loading={loading}
                actions={headerActions}
            />

            {/* Modal gerido internamente */}
            <ExpenseModalForm
                open={modalOpen}
                onClose={handleCloseModal}
                getExpenses={handleModalSuccess}
                receiptToEdit={receiptToEdit}
            />
        </>
    );
}

export default ReceiptsDatatable;