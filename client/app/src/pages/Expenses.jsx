import { useState, useEffect, useCallback } from "react";
import api from "../api";
import ExpenseModalForm from "../Components/ExpenseModalForm";
import Expense from "../Components/Expense";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton,
  Box, Typography, Button, Stack
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete, Add, FileUpload } from "@mui/icons-material";


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

function Expenses() {

  const [expenses, setExpenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null)
  const paginationModel = { page: 0, pageSize: 10 };

  // Callbacks estáveis para evitar re-renders
  const handleEdit = useCallback((expense) => {
    setExpenseToEdit(expense);
    setOpen(true);
  }, []);

  const handleDelete = useCallback((id) => {
    deleteExpense(id);
    getExpenses()
  }, []);


  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'title', headerName: 'Title', width: 250, flex: 1 },
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

  useEffect(() => {
    getExpenses();
  }, []);


  const getExpenses = () => {
    api
      .get("/api/expenses/")
      .then((res) => res.data)
      .then((data) => {
        setExpenses(data);
      })
      .catch((err) => alert(err));
  };

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

  const handleCloseModal = () => {
    setOpen(false);
    setExpenseToEdit(null); // Reset quando fechar
  };

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
          bgcolor: "grey.100",
          borderBottom: "1px solid",
          borderColor: "grey.300",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Expenses List
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
          >
            Add Expense
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<FileUpload />}
          >
            Import
          </Button>
        </Stack>
      </Box>

      {/* DataTable */}
      <DataGrid
        rows={expenses}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 15, 20]}
        disableRowSelectionOnClick
        sx={{ border: 0 }}
      />

      <ExpenseModalForm open={open} onClose={handleCloseModal} getExpenses={getExpenses} expenseToEdit={expenseToEdit} />
    </Paper>
  );
}

export default Expenses;
