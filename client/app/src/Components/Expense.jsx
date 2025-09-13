import { Card, CardHeader, CardContent, CardActions, Typography, Chip, IconButton, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

function ExpenseCard({ expense, onEdit, onDelete }) {
  const formattedDate = new Date(expense.date).toLocaleDateString("pt-PT");
  const paid = expense.paid_value || 0;
  const progress = (paid / expense.value) * 100;

  return (
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
              <Typography variant="subtitle2" sx={{color: `${expense.category.color}`}}>{expense.category.title}</Typography>
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

          {/* Payment info */}
          <Box mt={2}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" color="secondary" sx={{ whiteSpace: "nowrap" }}>
                Paid: {paid} / {expense.value}
              </Typography>
              <Box
                className="progress-bar"
                sx={{
                  flexGrow: 1, // takes remaining space
                  height: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  backgroundColor: "#f0f0f0",
                  overflow: "hidden",
                }}
              >
                <Box
                  className="progress-fill"
                  sx={{
                    width: `${progress}%`,
                    minWidth: "2px",
                    height: "100%",
                    backgroundColor: progress > 0 ? "green" : "transparent",
                    transition: "width 0.3s ease",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

  );
}

export default ExpenseCard;
