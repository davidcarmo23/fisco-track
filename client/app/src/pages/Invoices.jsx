import { useState } from "react";
import { Paper } from "@mui/material";
import InvoicesDatatable from "../Components/Datatables/InvoicesDatatable";
import GenericModalForm from "../Components/GenericModalForm";
import { invoiceModalConfig } from "../Components/Hooks/ModalConfigurations";
import api from "../api";
function Invoices() {
    const [modalOpen, setModalOpen] = useState(false);

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <Paper sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
            {/* DataTable */}
            <InvoicesDatatable showAddButton={true} />

            {/* Modal separado para criar da página principal */}
            <GenericModalForm 
                open={modalOpen}
                onClose={handleCloseModal}
                config={invoiceModalConfig}
            />
        </Paper>
    );
}

export default Invoices;
