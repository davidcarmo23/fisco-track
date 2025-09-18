import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function Invoice({ invoice, onDelete, onEdit }) {
  const formattedDate = new Date(invoice.date).toLocaleDateString("pt-PT");

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: 3,
        "&:hover": { boxShadow: 6 },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            #{invoice.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formattedDate}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {invoice.value}
          </Typography>
        </Box>

        <Typography variant="h6" color sx={{ mt: 1 }}>
          {invoice.expense}
        </Typography>
        
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end" }}>
        <IconButton
          aria-label="edit"
          color="primary"
          onClick={() => onEdit(invoice.id)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="delete"
          color="error"
          onClick={() => onDelete(invoice.id)}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default Invoice;
