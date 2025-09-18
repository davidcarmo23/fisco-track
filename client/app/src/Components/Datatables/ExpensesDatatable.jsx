import { useCallback } from 'react';
import { useFilteredList } from '../hooks/useFilteredList';
import DataTableBase from './DatatableBase';
import { IconButton, Box, Button } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

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

function ExpensesDatatable({ showActions = false }) {
    const { items: expenses, loading, refetch } = useFilteredList(
        'expenses',
    );
    const [expenseToEdit, setExpenseToEdit] = useState(null);

    const deleteExpense = (id) => {
        api
            .delete(`api/expenses/delete/${id}`)
            .then((res) => {
                if (res.status === 204) {
                    alert("Expense deleted");
                    getExpenses();
                } else {
                    alert("Failed to delete expense");
                }
            })
            .catch((err) => alert(err));
    };

    // Callbacks estáveis para evitar re-renders
    const handleEdit = useCallback((expense) => {
        setExpenseToEdit(expense);
        setOpen(true);
    }, [refetch]);

    const handleDelete = useCallback((id) => {
        deleteExpense(id);
        refetch()
    }, [refetch]);

    const headerActions = showActions ? (
        <Button variant="contained" startIcon={<Add />}>
            Add Invoice
        </Button>
    ) : null;

    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        {
            field: 'title', headerName: 'Title', width: 250, flex: 1,
            renderCell: (params) => {
                return (
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
            }
        },
        {
            field: 'date',
            headerName: 'Date',
            width: 150,
            sortComparator: (param1, param2) => {
                const date1 = param1.api.getRow(param1.id)?.date;
                const date2 = param2.api.getRow(param2.id)?.date;

                if (!date1 && !date2) return 0;
                if (!date1) return -1;
                if (!date2) return 1;

                return new Date(date1).getTime() - new Date(date2).getTime();
            },
            renderCell: (params) => {
                if (!params.row?.date) return '-';
                return new Date(params.row.date).toLocaleDateString("pt-PT");
            }
        },
        {
            field: 'category_details',
            headerName: 'Category',
            width: 180,
            sortComparator: (param1, param2) => {
                // Sort pelo título da categoria
                const cat1 = param1.api.getRow(param1.id)?.category_details?.title || '';
                const cat2 = param2.api.getRow(param2.id)?.category_details?.title || '';
                return cat1.localeCompare(cat2);
            },
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
            type: "number",
            valueGetter: (params) => params.row?.value || 0,
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
            type: 'number',
            valueGetter: (params) => params.row?.total_received || 0,
            renderCell: (params) => {
                const totalReceived = params.row?.total_received;
                if (totalReceived == null) return '0.00 €';
                return `${parseFloat(totalReceived).toFixed(2)} €`;
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
                    expense={params.row}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )
        }
    ];

    return (
        <DataTableBase
            title={"Expenses"}
            rows={expenses}
            columns={columns}
            loading={loading}
            actions={headerActions}
        />
    );
}