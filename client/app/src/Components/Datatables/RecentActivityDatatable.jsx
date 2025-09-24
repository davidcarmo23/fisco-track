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

function RecentActivityDatatable({}) {
    const { items, loading, refetch } = useFilteredList('recent_activities');

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
            field: 'Title',
            headerName: 'Title',
            width: 200,
            flex: 1,
            renderCell: (params) => (
                <Typography
                    component={NavLink}
                    to={`/${params.row.type}s/view/${params.row.id}`}
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
                        {category || 'No title'}
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