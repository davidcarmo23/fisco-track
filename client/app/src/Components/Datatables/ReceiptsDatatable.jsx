import { useCallback, useState } from 'react';
import { useFilteredList } from '../Hooks/FilteredList';
import DataTableBase from './DatatableBase';
import GenericModalForm from '../GenericModalForm';
import GenericExcelImportModal from '../GenericExcelImportModal';
import { receiptModalConfig } from '../Hooks/ModalConfigurations';
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
    parentId = null,
    showAddButton = true,
    context = 'general'
}) {
    const { items: receipts, loading, refetch } = useFilteredList(
        'receipts',
        parentId,
        context === 'expenses' ? 'expense_id' : 'invoice_id'
    );

    // Estados do modal (movidos para cá)
    const [modalOpen, setModalOpen] = useState(false);
    const [receiptToEdit, setInvoiceToEdit] = useState(null);
    const [importModalOpen, setImportModalOpen] = useState(false);

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
            {parentId && (<Button
                variant="contained"
                color="secondary"
                startIcon={<FileUploadIcon />}
                onClick={() => setImportModalOpen(true)}
            >
                Import
            </Button>)}
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
        {
            field: 'title',
            headerName: 'Title',
            width: 200,
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
                    Receipt #{params.row.id}
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
        ...(!parentId ? [{
            field: 'invoice',
            headerName: 'Invoice',
            width: 200,
            flex: 1,
            renderCell: (params) => (
                <Typography
                    component={NavLink}
                    to={`/invoices/view/${params.row.invoice_details?.id}`}
                    sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    {params.row.invoice_details?.invoice_number}
                </Typography>
            )
        }] : []),
        ...(!parentId ? [{
            field: 'expense',
            headerName: 'Expense',
            width: 200,
            flex: 1,
            renderCell: (params) => (
                <Typography
                    component={NavLink}
                    to={`/expenses/view/${params.row.expense_details?.id}`}
                    sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    {params.row.expense_details?.expense_number}
                </Typography>
            )
        }] : []),
        {
            field: 'amount',
            headerName: 'Amount',
            width: 150,
            flex: 1,
            align: 'right',
            renderCell: (params) => {
                const value = params.row?.amount;
                if (value == null) return '0.00 €';
                return `${parseFloat(value).toFixed(2)} €`;
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
                    receipt={params.row}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )
        }
    ];

    return (
        <>
            <DataTableBase
                title={parentId ? "Related Receipts" : "Receipts"}
                rows={receipts}
                columns={columns}
                loading={loading}
                actions={headerActions}
            />

            <GenericModalForm
                open={modalOpen}
                onClose={handleCloseModal}
                onSuccess={refetch}
                itemToEdit={receiptToEdit}
                config={receiptModalConfig}
            />

            <GenericExcelImportModal
                open={importModalOpen}
                onClose={() => setImportModalOpen(false)}
                onSuccess={(entityType) => {
                    refetch();
                    console.log(`${entityType} import completed`);
                }}
                defaultEntityType="receipt"
            />
        </>
    );
}

export default ReceiptsDatatable;