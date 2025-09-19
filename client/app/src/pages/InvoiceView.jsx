import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import api from '../api';

import DynamicTab from "../Components/Global_Layout/DynamicTab";
import { Card, CardHeader, CardContent, CardActions, Typography, Chip, IconButton, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import GenericModalForm from "../Components/GenericModalForm";
import { invoiceModalConfig } from "../Components/Hooks/ModalConfigurations";

function InvoiceView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            api.get(`/api/invoices/${id}/`)
                .then(res => {
                    setInvoice(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    navigate('/invoices'); // Redireciona se não encontrar
                });
        }
    }, [id, navigate]);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const getInvoice = (id) => {
        api.get(`api/invoice/${id}`)
            .then(res => {
                setInvoice(res.data)
            })
            .catch(res => {
                alert("Error retrieving invoice!")
            })
    }


    if (loading) return <div>Loading...</div>;
    if (!invoice) return <div>Invoice not found</div>;

    return (
        <>
            <Card
                key={invoice.id}
                sx={{
                    mb: 2,
                    borderRadius: 3,
                    boxShadow: 2,
                    bgcolor: "#fff",
                    "&:hover": { boxShadow: 4 },
                }}
            >
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        {/* Left side */}
                        <Box>
                            <Typography variant="h6" color="primary">
                                Invoice #{invoice.id}
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: `${invoice.category_details.color}` }}>{invoice.category_details.title}</Typography>
                        </Box>

                        {/* Right side */}
                        <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="body2" color="text.primary">
                                {invoice.date}
                            </Typography>
                            <IconButton color="primary" onClick={() => handleOpenModal(invoice.id)}>
                                <Edit />
                            </IconButton>
                            <IconButton color="error" onClick={() => onDelete(invoice.id)}>
                                <Delete />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box mt={2}>
                        <DynamicTab
                            currEl="Invoices"
                            parentId={invoice?.id}
                        />
                    </Box>

                </CardContent>
            </Card>

            <GenericModalForm
                open={modalOpen}
                onClose={handleCloseModal}
                onSuccess={getInvoice}
                itemToEdit={invoice}
                config={invoiceModalConfig}
            />

        </>
    );
}

export default InvoiceView;
