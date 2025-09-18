import { useState } from "react";
import ExpenseModalForm from "../Components/ExpenseModalForm";
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

            {/* Modal separado para criar da página principal */}
            <ExpenseModalForm
                open={modalOpen}
                onClose={handleCloseModal}
                getReceipts={() => window.location.reload()} // implementar refetch
            />
        </Paper>
    );
}

export default Receipts;
