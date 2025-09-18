import { useState } from "react";
import { Paper} from "@mui/material";

import ExpenseModalForm from "../Components/ExpenseModalForm";
import ExpensesDatatable from '../Components/Datatables/ExpensesDatatable'

function Expenses() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Paper sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
      {/* DataTable */}
      <ExpensesDatatable showAddButton={true} />

      {/* Modal separado para criar da página principal */}
      <ExpenseModalForm
        open={modalOpen}
        onClose={handleCloseModal}
        getExpenses={() => window.location.reload()} // implementar refetch
      />
    </Paper>
  );
}

export default Expenses;
