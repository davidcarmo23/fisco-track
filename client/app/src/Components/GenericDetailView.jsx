import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import api from '../api';

import DynamicTab from "../Components/Global_Layout/DynamicTab";
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Box,
    Chip,
    Grid,
    Divider,
    LinearProgress
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import GenericModalForm from "../Components/GenericModalForm";

function GenericDetailView({ config }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            api.get(`${config.endpoint}${id}/`)
                .then(res => {
                    setItem(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    navigate(config.redirectOnError);
                });
        }
    }, [id, navigate, config.endpoint, config.redirectOnError]);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const refetchItem = () => {
        api.get(`${config.endpoint}${id}/`)
            .then(res => {
                setItem(res.data);
            })
            .catch(res => {
                alert(`Error retrieving ${config.entityName.toLowerCase()}!`);
            });
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete this ${config.entityName.toLowerCase()}?`)) {
            api.delete(`${config.endpoint}${id}/`)
                .then(() => {
                    navigate(config.redirectOnError);
                })
                .catch(() => {
                    alert(`Failed to delete ${config.entityName.toLowerCase()}`);
                });
        }
    };

    // Calculate financial values using config functions
    const totalValue = item ? (config.calculations.totalValue(item) || 0) : 0;
    const receivedValue = item ? (config.calculations.receivedValue(item) || 0) : 0;
    const remainingValue = item ? (config.calculations.remainingValue(item) || 0) : 0;
    const paymentProgress = totalValue > 0 ? (receivedValue / totalValue) * 100 : 0;
    const isPaid = item ? config.calculations.isPaid(item) : false;

    if (loading) return <div>Loading...</div>;
    if (!item) return <div>{config.entityName} not found</div>;

    return (
        <>
            <Card
                sx={{
                    mb: 2,
                    borderRadius: 3,
                    boxShadow: 2,
                    bgcolor: "#fff",
                    "&:hover": { boxShadow: 4 },
                }}
            >
                <CardContent>
                    {/* Header Section */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                        <Box flex={1}>
                            <Box display="flex" alignItems="center" gap={2} mb={1}>
                                <Typography variant="h4" color="primary" fontWeight="bold">
                                    {config.header.title(item)}
                                </Typography>
                                <Chip
                                    label={isPaid ? "PAID" : "PENDING"}
                                    color={isPaid ? "success" : "warning"}
                                    size="small"
                                />
                            </Box>

                            <Typography variant="h6" color="text.primary" mb={1}>
                                {config.header.subtitle(item)}
                            </Typography>

                            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                {config.header.chips.map((chipConfig, index) => {
                                    const chipData = chipConfig.getData(item);
                                    return chipData ? (
                                        <Chip
                                            key={index}
                                            label={chipData.label}
                                            sx={{
                                                bgcolor: chipData.color ? chipData.color + '20' : 'grey.100',
                                                color: chipData.color || 'text.primary',
                                                fontWeight: 'medium'
                                            }}
                                            size="small"
                                        />
                                    ) : null;
                                })}
                                <Typography variant="body2" color="text.secondary">
                                    • {new Date(item.date).toLocaleDateString('pt-PT')}
                                </Typography>
                            </Box>

                            {/* Associated items info */}
                            {config.associations && (
                                <Box mt={2}>
                                    {config.associations.map((assocConfig, index) => {
                                        const assocData = assocConfig.getData(item);
                                        return assocData ? (
                                            <Typography key={index} variant="body2" color="text.secondary">
                                                {assocConfig.label}: <strong>{assocData}</strong>
                                            </Typography>
                                        ) : null;
                                    })}
                                </Box>
                            )}
                        </Box>

                        {/* Actions */}
                        <Box display="flex" gap={1}>
                            <IconButton
                                color="primary"
                                onClick={handleOpenModal}
                                sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                            >
                                <Edit />
                            </IconButton>
                            <IconButton
                                color="error"
                                onClick={handleDelete}
                                sx={{ bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                            >
                                <Delete />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Financial Summary */}
                    <Grid container spacing={3} mb={3}>
                        <Grid item xs={12} md={4}>
                            <Box textAlign="center" p={2} bgcolor="grey.50" borderRadius={2}>
                                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                    {config.financials.totalLabel || "TOTAL VALUE"}
                                </Typography>
                                <Typography variant="h5" color="text.primary" fontWeight="bold">
                                    {totalValue.toFixed(2)} €
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box textAlign="center" p={2} bgcolor="success.light" borderRadius={2} sx={{ bgcolor: 'success.main', color: 'white' }}>
                                <Typography variant="body2" fontWeight="medium" sx={{ opacity: 0.9 }}>
                                    {config.financials.receivedLabel || "RECEIVED"}
                                </Typography>
                                <Typography variant="h5" fontWeight="bold">
                                    {receivedValue.toFixed(2)} €
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box textAlign="center" p={2} bgcolor="warning.light" borderRadius={2} sx={{ bgcolor: remainingValue > 0 ? 'warning.main' : 'success.main', color: 'white' }}>
                                <Typography variant="body2" fontWeight="medium" sx={{ opacity: 0.9 }}>
                                    {config.financials.remainingLabel || "REMAINING"}
                                </Typography>
                                <Typography variant="h5" fontWeight="bold">
                                    {remainingValue.toFixed(2)} €
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Payment Progress */}
                    {config.showProgress && (
                        <Box mb={3}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="body2" fontWeight="medium" color="text.secondary">
                                    Payment Progress
                                </Typography>
                                <Typography variant="body2" fontWeight="bold" color="text.primary">
                                    {paymentProgress.toFixed(1)}%
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={Math.min(paymentProgress, 100)}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: 'grey.200',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: paymentProgress >= 100 ? 'success.main' : 'primary.main'
                                    }
                                }}
                            />
                        </Box>
                    )}

                    <Divider sx={{ mb: 3 }} />

                    {/* Tabs Section */}
                    {config.tabs && (
                        <Box>
                            <DynamicTab
                                currEl={config.tabs.currEl}
                                parentId={item?.id}
                            />
                        </Box>
                    )}

                </CardContent>
            </Card>

            <GenericModalForm
                open={modalOpen}
                onClose={handleCloseModal}
                onSuccess={refetchItem}
                itemToEdit={item}
                config={config.modalConfig}
            />
        </>
    );
}

export default GenericDetailView;