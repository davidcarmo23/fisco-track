import { useState } from "react";
import { Paper } from "@mui/material";

import CategoriesDatatable from '../Components/Datatables/CategoriesDatatable'
import GenericModalForm from "../Components/GenericModalForm";
import { categoryModalConfig } from "../Components/Hooks/ModalConfigurations";

function Categories() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Paper sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
      {/* DataTable */}
      <CategoriesDatatable showAddButton={true} />

      <GenericModalForm
        open={modalOpen}
        onClose={handleCloseModal}
        config={categoryModalConfig}
      />

    </Paper>
  );
}

export default Categories;
