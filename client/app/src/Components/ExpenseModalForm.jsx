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

function ExpenseModalForm({ open, onClose, getExpenses }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(null);
  const [category, setCategory] = useState("");
  const [value, setValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get("/api/categories/")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const createExpense = (e) => {
    e.preventDefault();
    setLoading(true);

    api
      .post("/api/expenses/", {
        title,
        date: date ? date.toISOString().split("T")[0] : null,
        category: category,
        value,
      })
      .then((res) => {
        if (res.status === 201) {
          alert("Expense created ✅");
          getExpenses();
          onClose();
        } else {
          alert("Failed to create expense ❌");
        }
      })
      .catch((err) => alert(err))
      .finally(() => setLoading(false));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Expense</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={createExpense}>
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
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ExpenseModalForm;
