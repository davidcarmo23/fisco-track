import { useCallback } from 'react';
import { useFilteredList } from '../hooks/useFilteredList';
import DataTableBase from './DatatableBase';
import { IconButton, Box, Button } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

const ActionButtons = ({ invoice, onEdit, onDelete }) => (
    <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton size="small" onClick={() => onEdit(invoice)}>
            <Edit />
        </IconButton>
        <IconButton size="small" color="error" onClick={() => onDelete(invoice.id)}>
            <Delete />
        </IconButton>
    </Box>
);

function InvoicesDataTable({ expenseId = null, showActions = true }) {
    const { items: invoices, loading, refetch } = useFilteredList(
        'invoices',
        expenseId,
        'expense_id'
    );

    if(!expenseId){
        showActions=false;
    }
    
    const [invoiceToEdit, setInvoiceToEdit] = useState(null);

    const handleEdit = useCallback((invoice) => {
        setInvoiceToEdit(invoice);
        setOpen(true);
    }, [refetch]);

    const handleDelete = useCallback((id) => {
        deleteInvoice(id);
        refetch()
    }, [refetch]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'date', headerName: 'Date', width: 150 },
        { field: 'value', headerName: 'Amount', width: 120, align: 'right' },
        [{
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <ActionButtons
                    invoice={params.row}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )
        }]
    ];

    const headerActions = showActions ? (
        <Button variant="contained" startIcon={<Add />}>
            Add Invoice
        </Button>
    ) : null;

    return (
        <DataTableBase
            title={expenseId ? "Related Invoices" : "Invoices"}
            rows={invoices}
            columns={columns}
            loading={loading}
            actions={headerActions}
        />
    );
}

export default InvoicesDataTable;