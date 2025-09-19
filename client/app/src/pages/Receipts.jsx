import { useState } from "react";
import GenericModalForm from '../Components/GenericModalForm'
import { receiptModalConfig } from '../Components/Hooks/ModalConfigurations';
import { Paper } from "@mui/material";
import ReceiptsDatatable from "../Components/Datatables/ReceiptsDatatable";

function Receipts() {
    const [modalOpen, setModalOpen] = useState(false);

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <Paper sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
            {/* DataTable */}
            <ReceiptsDatatable showAddButton={true} />

            <GenericModalForm
                open={modalOpen}
                onClose={handleCloseModal}
                config={receiptModalConfig}
            />
        </Paper>
    );
}

export default Receipts;
