import { useCallback } from 'react';
import { useFilteredList } from '../hooks/useFilteredList';
import DataTableBase from './DatatableBase';
import { IconButton, Box, Button } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

const ActionButtons = ({ receipt, onEdit, onDelete }) => (
    <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton size="small" onClick={() => onEdit(receipt)}>
            <Edit />
        </IconButton>
        <IconButton size="small" color="error" onClick={() => onDelete(receipt.id)}>
            <Delete />
        </IconButton>
    </Box>
);

function ReceiptsDataTable({ invoiceId = null, showActions = true }) {
    const { items: receipts, loading, refetch } = useFilteredList(
        'receipts',
        invoiceId,
        'invoice_id'
    );

    if (!invoiceId) {
        showActions = false;
    }

    const [receiptToEdit, setReceiptToEdit] = useState(null);

    const handleEdit = useCallback((receipt) => {
        setReceiptToEdit(receipt);
        setOpen(true);
    }, [refetch]);

    const handleDelete = useCallback((id) => {
        deleteReceipt(id);
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
                    receipt={params.row}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )
        }]
    ];

    const headerActions = showActions ? (
        <Button variant="contained" startIcon={<Add />}>
            Add Receipt
        </Button>
    ) : null;

    return (
        <DataTableBase
            title={invoiceId ? "Related Receipts" : "Receipts"}
            rows={receipts}
            columns={columns}
            loading={loading}
            actions={headerActions}
        />
    );
}

export default ReceiptsDataTable;