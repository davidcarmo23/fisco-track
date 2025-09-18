import { useEffect, useState } from "react";
import api from "../api";
import {
  TextField,
  Button,
  MenuItem,
  Stack,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function ExpenseModalForm({ open, onClose, getExpenses, expenseToEdit = null }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(null);
  const [category, setCategory] = useState("");
  const [value, setValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const isEditMode = expenseToEdit !== null;

  useEffect(() => {
    api
      .get("/api/categories/")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  // Pré-preencher form quando for edição
  useEffect(() => {
    if (isEditMode && expenseToEdit) {
      setTitle(expenseToEdit.title);
      setDate(dayjs(expenseToEdit.date));
      setCategory(expenseToEdit.category); // Assuming você tem o category ID
      setValue(expenseToEdit.value.toString());
    } else {
      // Reset form para criação
      setTitle("");
      setDate(null);
      setCategory("");
      setValue("");
    }
  }, [isEditMode, expenseToEdit]);

  const submitExpense = (e) => {
    e.preventDefault();
    setLoading(true);

    const expenseData = {
      title,
      date: date ? date.toISOString().split("T")[0] : null,
      category: category,
      value,
    };

    const request = isEditMode
      ? api.put(`/api/expenses/${expenseToEdit.id}/`, expenseData)
      : api.post("/api/expenses/", expenseData);

    request
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          alert(isEditMode ? "Expense updated ✅" : "Expense created ✅");
          getExpenses();
          onClose();
        } else {
          alert(`Failed to ${isEditMode ? 'update' : 'create'} expense ❌`);
        }
      })
      .catch((err) => alert(err))
      .finally(() => setLoading(false));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? "Edit Expense" : "Add Expense"}</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={submitExpense}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </LocalizationProvider>

            <TextField
              select
              label="Category"
              variant="outlined"
              fullWidth
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.title}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              type="number"
              label="Value (€)"
              variant="outlined"
              fullWidth
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </Stack>

          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={18} color="inherit" /> : null
              }
            >
              {loading
                ? (isEditMode ? "Updating..." : "Creating...")
                : (isEditMode ? "Update" : "Create")
              }
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ExpenseModalForm;