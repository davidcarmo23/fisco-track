import { DataGrid } from '@mui/x-data-grid';
import { Paper, Box, Typography } from '@mui/material';

function DataTableBase({
    title,
    rows,
    columns,
    loading = false,
    actions = null // Botões do header
}) {
    const paginationModel = { page: 0, pageSize: 10 };

    return (
        <Paper sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
            {/* Header Bar */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    py: 1.5,
                    bgcolor: "#ffff",
                    borderBottom: "1px solid",
                    borderColor: "grey.300",
                }}
            >
                <Typography variant="h6" fontWeight="bold">
                    {title}
                </Typography>
                {actions}
            </Box>

            {/* DataGrid */}
            <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10, 15, 20]}
                disableRowSelectionOnClick
                sx={{ border: 0 }}
            />
        </Paper>
    );
}

export default DataTableBase;