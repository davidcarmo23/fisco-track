import { useState, useEffect, useCallback } from "react";
import api from "../api";
import ExpenseModalForm from "../Components/ExpenseModalForm";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton,
  Box, Typography, Button, Stack
} from "@mui/material";
import ExpensesDatatable from '../Components/Datatables/ExpensesDatatable'
import { Edit, Delete, Add, FileUpload } from "@mui/icons-material";
import { NavLink } from "react-router-dom";

function Expenses() {

  const [expenses, setExpenses] = useState([]);
  const [open, setOpen] = useState(false);

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
      <ExpensesDatatable />

      <ExpenseModalForm open={open} onClose={handleCloseModal} getExpenses={getExpenses} expenseToEdit={expenseToEdit} />
    </Paper>
  );
}

export default Expenses;
