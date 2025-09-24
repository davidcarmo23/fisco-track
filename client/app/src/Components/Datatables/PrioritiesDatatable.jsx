import { useCallback, useState } from 'react';
import { useFilteredList } from '../Hooks/FilteredList';
import DataTableBase from './DatatableBase';
import GenericModalForm from '../GenericModalForm';
import { priorityModalConfig } from '../Hooks/ModalConfigurations';
import { IconButton, Box, Button, Typography, Stack } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import api from '../../api';

const ActionButtons = ({ priority, onEdit, onDelete }) => (
    <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
            size="small"
            onClick={() => onEdit(priority)}
            aria-label="edit"
        >
            <Edit />
        </IconButton>
        <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(priority.id)}
            aria-label="delete"
        >
            <Delete />
        </IconButton>
    </Box>
);

function PrioritiesDatatable({
    showAddButton = false,
    showEditActions = true
}) {
    const { items: priorities, loading, refetch } = useFilteredList(
        'priorities',
    );

    // Estados do modal (movidos para cá)
    const [modalOpen, setModalOpen] = useState(false);
    const [priorityToEdit, setPriorityToEdit] = useState(null);

    const deletePriority = (id) => {
        if (window.confirm('Are you sure you want to delete this priority?')) {
            api.delete(`/api/priorities/${id}/`)
                .then((res) => {
                    if (res.status === 204) {
                        alert("Priority deleted");
                        refetch(); // Usa refetch em vez de getExpenses
                    } else {
                        alert("Failed to delete priority");
                    }
                })
                .catch((err) => alert(err));
        }
    };

    const handleEdit = useCallback((priority) => {
        setPriorityToEdit(priority);
        setModalOpen(true);
    }, []);

    const handleDelete = useCallback((id) => {
        deletePriority(id);
    }, []);

    const handleAddNew = () => {
        setPriorityToEdit(null); // Reset para modo CREATE
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setPriorityToEdit(null);
    };

    const handleModalSuccess = () => {
        refetch(); // Recarrega a lista após criar/editar
        handleCloseModal();
    };

    const headerActions = showAddButton ? (
        <Stack direction="row" spacing={1}>
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddNew}
            >
                Add Priority
            </Button>
        </Stack>
    ) : null;

    const columns = [
        {
            field: 'title',
            headerName: 'Title',
            width: 250,
            flex: 1,
            renderCell: (params) => (
                <Typography
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
            field: 'priority_value',
            headerName: 'Value',
            width: 180,
            flex: 1,
            type: 'number',
            renderCell: (params) => {
                <span style={{ color: params.row?.color || '#000' }}>
                </span>
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
                    priority={params.row}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )
        }] : [])
    ];

    return (
        <>
            <DataTableBase
                title={"Priorities"}
                rows={priorities}
                columns={columns}
                loading={loading}
                actions={headerActions}
            />

            {/* Modal gerido internamente */}
            <GenericModalForm
                open={modalOpen}
                onClose={handleCloseModal}
                onSuccess={refetch}
                itemToEdit={priorityToEdit}
                config={priorityModalConfig}
            />

        </>
    );
}

export default PrioritiesDatatable;