import { useState } from "react";
import ExpenseModalForm from "../Components/ExpenseModalForm";
import { Paper } from "@mui/material";
import InvoicesDatatable from "../Components/Datatables/InvoicesDatatable";

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
            <ExpenseModalForm
                open={modalOpen}
                onClose={handleCloseModal}
                getInvoices={() => window.location.reload()} // implementar refetch
            />
        </Paper>
    );
}

export default Invoices;
