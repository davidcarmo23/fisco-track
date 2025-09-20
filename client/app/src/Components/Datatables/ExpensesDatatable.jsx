import { useCallback, useState } from 'react';
import { useFilteredList } from '../Hooks/FilteredList';
import DataTableBase from './DatatableBase';
import GenericModalForm from '../GenericModalForm';
import GenericExcelImportModal from '../GenericExcelImportModal';
import { expenseModalConfig } from '../Hooks/ModalConfigurations';
import api from '../../api';

import { IconButton, Box, Button, Typography, Stack } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { NavLink } from 'react-router-dom';


const ActionButtons = ({ expense, onEdit, onDelete }) => (
    <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
            size="small"
            onClick={() => onEdit(expense)}
            aria-label="edit"
        >
            <Edit />
        </IconButton>
        <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(expense.id)}
            aria-label="delete"
        >
            <Delete />
        </IconButton>
    </Box>
);

function ExpensesDatatable({
    showAddButton = false,
    showEditActions = true
}) {
    const { items: expenses, loading, refetch } = useFilteredList('expenses');

    // Estados do modal (movidos para cá)
    const [modalOpen, setModalOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const [importModalOpen, setImportModalOpen] = useState(false);

    const deleteExpense = (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            api.delete(`/api/expenses/${id}/`)
                .then((res) => {
                    if (res.status === 204) {
                        alert("Expense deleted");
                        refetch(); // Usa refetch em vez de getExpenses
                    } else {
                        alert("Failed to delete expense");
                    }
                })
                .catch((err) => alert(err));
        }
    };

    const handleEdit = useCallback((expense) => {
        setExpenseToEdit(expense);
        setModalOpen(true);
    }, []);

    const handleDelete = useCallback((id) => {
        deleteExpense(id);
    }, []);

    const handleAddNew = () => {
        setExpenseToEdit(null); // Reset para modo CREATE
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setExpenseToEdit(null);
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
                Add Expense
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
                    to={`/expenses/view/${params.row.id}`}
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
                    expense={params.row}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )
        }] : [])
    ];

    return (
        <>
            <DataTableBase
                title={"Expenses"}
                rows={expenses}
                columns={columns}
                loading={loading}
                actions={headerActions}
            />

            <GenericModalForm
                open={modalOpen}
                onClose={handleCloseModal}
                onSuccess={refetch}
                itemToEdit={expenseToEdit}
                config={expenseModalConfig}
            />

            <GenericExcelImportModal
                open={importModalOpen}
                onClose={() => setImportModalOpen(false)}
                onSuccess={(entityType) => {
                    refetch();
                    console.log(`${entityType} import completed`);
                }}
                defaultEntityType="expense"
            />
        </>
    );
}

export default ExpensesDatatable;