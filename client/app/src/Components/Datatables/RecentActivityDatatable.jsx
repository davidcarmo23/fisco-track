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

function RecentActivityDatatable({
    parentId = null,
    showAddButton = true,
    context = 'general'
}) {
    const { items, loading, refetch } = useFilteredList('recent-activities');

    const deleteItem = (parentId) => {
        let parentType = parentId.contentType
        if (window.confirm(`Are you sure you want to delete this ${parentType}?`)) {
            api.delete(`/api/${parentType}s/${id}/`)
                .then((res) => {
                    if (res.status === 204) {
                        alert("Record deleted");
                        refetch(); // Usa refetch em vez de getExpenses
                    } else {
                        alert("Failed to delete record");
                    }
                })
                .catch((err) => alert(err));
        }
    };

    const columns = [
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
            field: 'type',
            headerName: 'Type',
            width: 200,
            flex: 1,
            renderCell: (params) => (
                <Typography
                    component={NavLink}
                    to={`/all_items/view/${params.row.id}`}
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
            field: 'category',
            headerName: 'Category',
            width: 180,
            flex: 1,
            renderCell: (params) => {
                const category = params.row?.category;
                if (!category) return '-';
                return (
                    <span style={{ color: category.color || '#000' }}>
                        {category.title || 'No title'}
                    </span>
                );
            }
        },
    ];

    return (
        <>
            <DataTableBase
                title={"Recent Activity"}
                rows={items}
                columns={columns}
                loading={loading}
                actions={null}
            />

        </>
    );
}

export default RecentActivityDatatable;