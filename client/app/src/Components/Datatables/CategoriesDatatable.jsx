import { useCallback, useState } from 'react';
import { useFilteredList } from '../Hooks/FilteredList';
import DataTableBase from './DatatableBase';
import GenericModalForm from '../GenericModalForm';
import { categoryModalConfig } from '../Hooks/ModalConfigurations';
import { IconButton, Box, Button, Typography, Stack } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import api from '../../api';

const ActionButtons = ({ category, onEdit, onDelete }) => (
    <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
            size="small"
            onClick={() => onEdit(category)}
            aria-label="edit"
        >
            <Edit />
        </IconButton>
        <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(category.id)}
            aria-label="delete"
        >
            <Delete />
        </IconButton>
    </Box>
);

function CategoriesDatatable({
    showAddButton = false,
    showEditActions = true
}) {
    const { items: categories, loading, refetch } = useFilteredList(
        'categories',
    );

    // Estados do modal (movidos para cá)
    const [modalOpen, setModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);

    const deleteCategory = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            api.delete(`/api/categories/${id}/`)
                .then((res) => {
                    if (res.status === 204) {
                        alert("Category deleted");
                        refetch(); // Usa refetch em vez de getExpenses
                    } else {
                        alert("Failed to delete category");
                    }
                })
                .catch((err) => alert(err));
        }
    };

    const handleEdit = useCallback((category) => {
        setCategoryToEdit(category);
        setModalOpen(true);
    }, []);

    const handleDelete = useCallback((id) => {
        deleteCategory(id);
    }, []);

    const handleAddNew = () => {
        setCategoryToEdit(null); // Reset para modo CREATE
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCategoryToEdit(null);
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
                Add Category
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
            field: 'color',
            headerName: 'Color',
            width: 180,
            flex: 1,
            sortable: false,
            renderCell: (params) => {
                const color = params.row?.color;
                if (!color) return '-';
                return (
                    <span style={{ color: color || '#000' }}>
                        {params.row.color || 'No title'}
                    </span>
                );
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
                    category={params.row}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )
        }] : [])
    ];

    return (
        <>
            <DataTableBase
                title={"Categories"}
                rows={categories}
                columns={columns}
                loading={loading}
                actions={headerActions}
            />

            {/* Modal gerido internamente */}
            <GenericModalForm
                open={modalOpen}
                onClose={handleCloseModal}
                onSuccess={refetch}
                itemToEdit={categoryToEdit}
                config={categoryModalConfig}
            />

        </>
    );
}

export default CategoriesDatatable;