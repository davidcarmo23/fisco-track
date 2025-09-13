import { useState, useEffect, useRef } from "react";
import api from "../api";
import ExpenseModalForm from "../Components/ExpenseModalForm";
import Expense from "../Components/Expense"
import {
  Typography,
  Button,
  Grid,
  Dialog,
  DialogContent,
  Stack,
} from "@mui/material";
import { Add } from "@mui/icons-material";

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
    <div>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3, marginX: 5 }}
      >
        <Typography variant="h4" fontWeight="bold">
          Expenses
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Create Expense
        </Button>
      </Stack>

      {/* Expenses Grid */}
      <Grid container spacing={2}>
        {expenses.map((expense) => (
          <Grid size={{ xs: 12, sm: 6}} key={expense.id}>
            <Expense
              expense={expense}
              onDelete={deleteExpense}
              onEdit={editExpense}
            />
          </Grid>
        ))}
      </Grid>

      {/* Create Expense Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogContent>
          <ExpenseModalForm
            route={"/api/expenses/"}
            toggleDialog={() => setOpen(false)}
            getExpenses={getExpenses}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Expenses;
