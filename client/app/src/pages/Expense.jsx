import { Card, CardHeader, CardContent, CardActions, Typography, Chip, IconButton, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import DynamicTab from "../Components/Global_Layout/DynamicTab";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import api from '../api';

function ExpenseView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/api/expenses/${id}/`)
        .then(res => {
          setExpense(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          navigate('/expenses'); // Redireciona se não encontrar
        });
    }
  }, [id, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!expense) return <div>Expense not found</div>;

  return (
    <>
      <Card
        key={expense.id}
        sx={{
          mb: 2,
          borderRadius: 3,
          boxShadow: 2,
          bgcolor: "#fff",
          "&:hover": { boxShadow: 4 },
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {/* Left side */}
            <Box>
              <Typography variant="h6" color="primary">
                Expense #{expense.id}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: `${expense.category.color}` }}>{expense.category.title}</Typography>
              <Typography color="text.primary">{expense.title}</Typography>
            </Box>

            {/* Right side */}
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2" color="text.primary">
                {expense.date}
              </Typography>
              <IconButton color="primary" onClick={() => onEdit(expense.id)}>
                <Edit />
              </IconButton>
              <IconButton color="error" onClick={() => onDelete(expense.id)}>
                <Delete />
              </IconButton>
            </Box>
          </Box>

          {/* Associated items container */}
          <Box mt={2}>
            {/* Tabs */}
            <Box>
              <DynamicTab currEl={"Expenses"} />
            </Box>
            <Box>
              {/* Content */}
            </Box>
          </Box>
        </CardContent>
      </Card>
        
    </>
  );
}

export default ExpenseView;
