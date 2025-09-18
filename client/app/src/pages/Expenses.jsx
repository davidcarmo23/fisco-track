import { useState, useEffect } from "react";
import api from "../api";
import ExpenseModalForm from "../Components/ExpenseModalForm";
import Expense from "../Components/Expense";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton,
  Box, Typography, Button, Stack
} from "@mui/material";
import { Edit, Delete, Add, FileUpload } from "@mui/icons-material";

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
        console.log(data);
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

  const editExpense = (id) => {
    // future edit handler
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

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell align="right">Paid</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.id}</TableCell>
                <TableCell>{expense.title}</TableCell>
                <TableCell>
                  {new Date(expense.date).toLocaleDateString("pt-PT")}
                </TableCell>
                <TableCell sx={{ color: `${expense.category_details.color}` }}>{expense.category_details.title}</TableCell>
                <TableCell align="right">
                  {expense.value.toFixed(2)} €
                </TableCell>
                <TableCell align="right">
                  {expense.total_received.toFixed(2)} €
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => editExpense(expense.id)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => deleteExpense(expense.id)}
                    size="small"
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <ExpenseModalForm open={open} onClose={() => setOpen(false)} getExpenses={getExpenses} />
    </Paper>
  );
}

export default Expenses;
