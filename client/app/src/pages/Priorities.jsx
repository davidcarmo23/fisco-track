import { useState } from "react";
import { Paper } from "@mui/material";

import PrioritiesDatatable from '../Components/Datatables/PrioritiesDatatable'
import GenericModalForm from "../Components/GenericModalForm";
import { priorityModalConfig } from "../Components/Hooks/ModalConfigurations";

function Priorities() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Paper sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
      {/* DataTable */}
      <PrioritiesDatatable showAddButton={true} />

      <GenericModalForm
        open={modalOpen}
        onClose={handleCloseModal}
        config={priorityModalConfig}
      />

    </Paper>
  );
}

export default Priorities;
