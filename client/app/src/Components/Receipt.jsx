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

function Receipt({ receipt, onDelete, onEdit }) {
  const formattedDate = new Date(receipt.date).toLocaleDateString("pt-PT");

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
            #{receipt.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formattedDate}
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ mt: 1 }}>
          {receipt.invoice}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end" }}>
        <IconButton
          aria-label="edit"
          color="primary"
          onClick={() => onEdit(receipt.id)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="delete"
          color="error"
          onClick={() => onDelete(receipt.id)}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default Receipt;
