import { useState } from "react";
import { Paper } from "@mui/material";

import ExpensesDatatable from '../Components/Datatables/ExpensesDatatable'
import GenericModalForm from "../Components/GenericModalForm";
import GenericExcelImportModal from "../Components/GenericExcelImportModal";
import { expenseModalConfig } from "../Components/Hooks/ModalConfigurations";

function Expenses() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Paper sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
      {/* DataTable */}
      <ExpensesDatatable showAddButton={true} />

      <GenericModalForm
        open={modalOpen}
        onClose={handleCloseModal}
        config={expenseModalConfig}
      />

      <GenericExcelImportModal defaultEntityType="expense" />
    </Paper>
  );
}

export default Expenses;
